<template>    
    <div class="row">
        <h3>Enter you Zcash address to receive {{ payout }} ZEC:</h3>
        <p>Don't have a Zcash wallet? Find the best wallet <a href="https://z.cash/wallets">here</a>.</p>
        <input class="user-address" type="text" v-model="address">
        <button class="receive-zec" @click="claim" v-bind:disabled="disable_btn">Send</button>
        <div class="invalid-address" v-if="syncing">It looks like the backend wallet is not synchronized! Please wait a few minutes and try again.</div>
        <div class="invalid-address" v-if="invalid">Invalid address! Please verify if you entered your Zcash address corectly and try again.</div>
        <div class="success" v-if="success">Success! Your address has been added to the payout queue. In a few minutes you will receive {{ payout }} ZEC.</div>
        <div class="greedy" v-if="greedy">Please wait {{ waitfor}} minutes before claiming again.</div>
    </div>    
    
</template>
  
<script>
import http from '../http-common';
export default {
    name: 'ReceiveZec',
    props: {
        payout: Number
    },
    data: () =>({
        address: "",
        syncing: false,
        success: false,
        invalid: false,
        greedy: false,
        waitfor: 0,
        disable_btn: false
    }),
    methods: {
        claim() {
            // Disable claim button
            this.disable_btn = true;     
            
            http.post("/add", {address: this.address}).then((res) => {                
                if(res.data === 'syncing') this.syncing = true;
                else if(res.data === 'success') this.success = true;
                else if(res.data === 'invalid') this.invalid = true;
                else if(res.data.startsWith('greedy')) {
                    this.waitfor = res.data.split(" ")[1];
                    this.greedy = true;
                }
                
                // Re-enable button and clear messages after 15 seconds
                setTimeout(()=> {
                    this.disable_btn = false;
                    this.syncing = false;
                    this.invalid = false;
                    this.success = false;
                    this.greedy = false;
                }, 15*1000);
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user-address {    
    padding: 16px;
    width: 75%;
}

.receive-zec {    
    font-size: 16px;    
}
.invalid-address {
    background-color:coral;
    color: black;
    font-weight: bold;
    width: 500px;
    margin-top: 16px;
    margin-left: auto;
    margin-right: auto;
    padding: 8px;
}

.success {
    background-color:yellowgreen;
    color: black;
    font-weight: bold;
    width: 500px;
    margin-top: 16px;
    margin-left: auto;
    margin-right: auto;
    padding: 8px;
}
.greedy {
    background-color:aquamarine;
    color: black;
    font-weight: bold;
    width: 500px;
    margin-top: 16px;
    margin-left: auto;
    margin-right: auto;
    padding: 8px;
}
</style>
