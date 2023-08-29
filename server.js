const { Worker } = require('worker_threads');

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const https = require('https');
const fs = require('fs');

const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const {verify} = require('hcaptcha');
const hc_secret = process.env.HCAPTCHA_SECRET;

const useHttps = false;

const LiteWallet = require('./zingolib-wrapper/litewallet');
const { TxBuilder } = require('./zingolib-wrapper/utils/utils');

const app = express();
const port = 2653;

// Set faucet payout in decimal ZEC
const u_payout = 0.0005;
const z_payout = 0.0004;
const t_payout = 0.0003;
const memo = "Thanks for using ZecFaucet.com"

// Queue for the faucet payout
let queue = [];
const waitlist = [];
const waittime = 45; // Time in minuts before next claim

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()) // to convert the request into JSON
app.use(cors()) // to allow cross origin requests
app.set("trust proxy", true);

// Serve static files from the 'dist' directory
// app.use(express.static(path.join(__dirname, 'dist')));

// Setup lib
const lwd = "https://mainnet.lightwalletd.com:9067/";
const zingo = new LiteWallet(lwd, "main");
let syncing = true;
let count = 0;

// Initialize zingolib
zingo.init().then(async () => {    
    syncing = false; // Wallet is sync'ed

    // Send payments every 3 minutes
    setInterval(async() => {
        const sendProgress = await zingo.getSendProgress();
        const notes = await zingo.fetchNotes();
        let pending = notes.pending_orchard_notes.length > 0 || notes.pending_sapling_notes.length > 0 || notes.pending_utxos.length > 0;
        if(count > 2) {
            pending = false;
            count = 0;
        }
        count ++;
        console.log(`Queue: ${queue.length} | Sending: ${sendProgress.sending} | Pending: ${pending}`);
        if(queue.length > 0 && !sendProgress.sending && !pending) {
            const tmpQueue = queue.slice();
            // Sending tx blocks the node event loop, so run in another thread
            const worker = new Worker(path.join(__dirname, 'send.js'), { workerData: {server: lwd, send: queue} });
            worker.on('message', (txid) => { 
                if(!txid.toLowerCase().startsWith("error")) {                    
                    console.log(`Transaction ID: ${txid}`);
                    // clear the queue
                    tmpQueue.forEach((el) => {
                        queue.splice(queue.indexOf(el), 1);
                    });
                }
            });
            // queue = [];
        }
        // Clear waitlist for users that waited more than waittime
        const timeStamp = new Date();
        waitlist.forEach((el) => {
            const oldTimeStamp = el.timestamp;
            const nextClaim = waittime - ((timeStamp - oldTimeStamp) / (1000*60));
            if(nextClaim < 0) {
                waitlist.splice(waitlist.indexOf(el), 1);
            }
        });
        console.log(`Waitlist length: ${waitlist.length}`); 
    }, 3 * 60 * 1000);
});

// Serve the Vue.js app
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

app.get ('/payout', (req, res) =>{
    res.json({
        u_pay: u_payout,
        z_pay: z_payout,
        t_pay: t_payout
    });
});

app.get('/donate', async (req, res) => {    
    const addr = await zingo.fetchAllAddresses();
    res.send(addr[0].address);
});

app.get('/balance', async (req, res) =>{
    // If syncing, return balance of 0.0
    if(syncing) res.send('0.0');
    else {
        // Fetch total balance and return        
        const bal = await zingo.fetchTotalBalance();        
        res.send(`${bal.total.toFixed(8)}`);
    }
});

app.post('/add', async (req, res) => {
    if(syncing) res.send('syncing');
    else {
        // CHeck if it is a valid address
        const addr = req.body.address;
        const validAddr = awaitzingo.parseAddress(addr);    
        const token = req.body.token;
        const validToken = await verify(hc_secret, token);
        if(!validToken.success) {
            res.send("invalid-token");
            return;
        }
        else if(validAddr) {
            // First, check if user can claim faucet
            const userIp = req.ip;
            const userFp = req.body.fingerprint;
            const timeStamp = new Date();
            const user = waitlist.filter(el => (el.ip === userIp || el.fp === userFp));
            if(user.length > 0) {
                const oldTimeStamp = user[0].timestamp;
                const nextClaim = waittime - ((timeStamp - oldTimeStamp) / (1000*60));
                if(nextClaim < 0) {
                    waitlist.splice(waitlist.indexOf(user[0]), 1);
                } 
                else {
                    res.send(`greedy ${ Math.ceil(nextClaim) }`);                
                    return;
                }   
            }

            const pay = validAddr.address_kind === 'unified' ? u_payout.toFixed(4) : validAddr.address_kind === 'sapling' ? z_payout.toFixed(4) : 0;
            // Reject if it's transparent address
            if(pay == 0) {
                res.send("transparent");
                return;
            }
            
            // Construct transaction
            const tx = new TxBuilder()
                .setRecipient(addr)
                .setAmount(pay)
                .setMemo(memo);
            
            // Get sendJson
            const sendJson = tx.getSendJSON();

            // Check if faucet has enough bals
            const bal = zingo.fetchTotalBalance();
            const fee = zingo.getDefaultFee();
            const queueSum = queue.map((el) => el.amount).reduce((acc, curr) => acc + curr, fee);
            
            if(queueSum + sendJson[0].amount > (bal.total * 10**8)) {
                res.send('faucet-dry');
                return;
            }            
            
            // Add tx to the queue
            queue.push(sendJson[0]);
            console.log("New address added to the queue");
            
            // Add user IP and browser firgerprint to the wait list
            waitlist.push({
                ip: userIp,
                fp: userFp,
                timestamp: timeStamp
            });

            res.json({
                success: 'success',
                amount: pay
            });
        }
        else res.send('invalid');        
    }
});

if(useHttps) {
    const options = {
        key: fs.readFileSync('path_to_key.pem'),
        cert: fs.readFileSync('path_to_cert.pem')
    };
    https.createServer(options, app).listen(port);
    console.log(`App listening at https://localhost:${port}`)
}
else {
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`)
    });
}

process.on('SIGINT', async () => {
    console.log("Safely shutdown zingolib");

    await zingo.deinitialize();
    process.exit();
});