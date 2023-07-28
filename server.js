const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const path = require('path');

const LiteWallet = require('./zingolib-wrapper/litewallet');
const { TxBuilder } = require('./zingolib-wrapper/utils/utils');

const app = express();
const port = 8081;

// Set faucet payout in decimal ZEC
const payout = 0.0005;
const memo = "Thanks for using ZecFaucet.com"

// Queue for the faucet payout
let queue = [];
const waitlist = [];
const waittime = 15; // Wait 15 minuts before next claim

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()) // to convert the request into JSON
app.use(cors()) // to allow cross origin requests
app.set("trust proxy", true);

// Serve static files from the 'dist' directory
// app.use(express.static(path.join(__dirname, 'dist')));

// Setup lib
const zingo = new LiteWallet("https://mainnet.lightwalletd.com:9067/");
let syncing = true;

// Initialize zingolib
zingo.init().then(() => {    
    syncing = false; // Wallet is sync'ed
    // Send payments every 45 seconds
    setInterval(() => {
        // console.log(queue);
    }, 45 * 1000);    
});

// Serve the Vue.js app
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

app.get ('/payout', async (req, res) =>{
    res.send(`${payout}`);
});

app.get('/balance', async (req, res) =>{
    // If syncing, return balance of 0.0
    if(syncing) res.send('0.0');
    else {
        // Fetch total balance and return        
        const bal = await zingo.fetchTotalBalance();        
        res.send(`${bal.total}`);
    }
});

app.post('/add', async (req, res) => {
    if(syncing) res.send('syncing');
    else {
        // CHeck if it is a valid address
        const addr = req.body.address;
        const validAddr = zingo.parseAddress(addr);    
        if(validAddr) {
            // First, check if user can claim faucet
            const userIp = req.ip;
            const timeStamp = new Date();
            const user = waitlist.filter(el => el.ip === userIp);
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

            // Construct transaction
            const tx = new TxBuilder()
                .setRecipient(addr)
                .setAmount(payout)
                .setMemo(memo);
            
            // Get sendJson
            const sendJson = tx.getSendJSON();
            
            // Add user IP to the wait list
            waitlist.push({
                ip: userIp,
                timestamp: timeStamp
            });

            // Add tx to the queue
            queue.push(sendJson[0]);

            res.send('success');
        }
        else res.send('invalid');        
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});