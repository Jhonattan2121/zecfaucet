<template>
  <div>
    <img alt="Vue logo" src="./assets/zecfaucet.png"> 
    <h1>Welcome to ZecFaucet.com</h1>  

    <ReceiveZec v-bind:payout="payout"/>

    <FaucetBalance v-bind:balance="balance"/>
    
    <h2>Zcash price:</h2>
    <center>
      <coingecko-coin-ticker-widget coin-id="zcash" currency="usd" locale="en" width="500"></coingecko-coin-ticker-widget>    
    </center>
    <hr/>
    <p>ZecFaucet.com is not afiliated with ECC or Zcash Foundation.</p>
  </div>
</template>

<script>
import FaucetBalance from './components/FaucetBalance.vue'
import ReceiveZec from './components/ReceiveZec.vue'
import http from './http-common';

export default {
  name: 'App',
  components: {    
    FaucetBalance,
    ReceiveZec
  },
  mounted: function() {
    this.getFaucetPayout();
    this.updateFaucetBalance();
  },
  data: () => ({
    balance: 0,
    payout: 0.0
  }),
  methods: {
    getFaucetPayout() {
      http.get('/payout').then((res) => {
        this.payout = res.data;
      });
    },
    getFaucetBalance() {
      http.get('/balance').then((res)=>{
        this.balance = res.data;
      });
    },
    updateFaucetBalance() {
      this.getFaucetBalance();
      setInterval(() => {
        this.getFaucetBalance();
      }, 75 * 1000);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
