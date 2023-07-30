<template>
    <div class="row">
        
        <h2>Faucet balance:</h2>
        <span class="faucet-balance"> {{ balance }} ZEC</span>        
        
        <h4 class="donate">Donate to ZecFaucet.com:</h4>
        <!-- <textarea class="donation-address" v-model="donate" disabled></textarea> -->
        <span class="donation-address">{{ donate }}</span>
        
    </div>
</template>
  
<script>
export default {
name: 'FaucetBalance',
props: {
    balance: Number,
    donate: String
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.faucet-balance {
    display: inline-block;
    width:200px;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid goldenrod;
    background-color: gold;
    font-weight: bold;
    color: black;
}

.donate {
    margin-top: 32px;
}
.donation-address {
    background-color: lightgrey;
    display: block;
    /* width: 480px; */
    /* height: 180px; */
    padding: 16px;
    overflow-wrap: break-word;
    margin-bottom: 32px
}
</style>
