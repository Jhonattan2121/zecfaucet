const { workerData } = require('worker_threads')
const LiteWallet = require('./zingolib-wrapper/litewallet');

const zingo = new LiteWallet(workerData.server);

// Somehow it works, don't ask :P
zingo.sendTransaction(workerData.send).then((txid)=>{
    console.log(txid);        
}).catch((err) => {console.log(err)});
