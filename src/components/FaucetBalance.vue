<template>
    <div class="balance">
        <h2>Faucet balance:</h2>
        <span class="faucet-balance"> {{ balance }} ZEC</span>
        <h4>Donate to ZecFaucet.com:</h4>
        <textarea class="donation-address" disabled>u1qrq2wy40zsfu3gxcfftrt8mrpmw75up3r89v8l4afyggs6jkypyxu8lg7p6y8mfyj56xpj9gv76xpenfm6a0c35f3cfhahq3ftsc7tpf08e0dyec8h0uk0ekj56qtvm0vnag6h3ntn8qj7q44vrsjgzhxake8hvplkd6al8a5z7nw0mezlcu8kfthtsw48g605peqgxl4qen2qlz0pc</textarea>
    </div>
</template>
  
<script>
export default {
name: 'FaucetBalance',
props: {
    balance: Number,
    donate: Number
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

.donation-address {
    width: 480px;
    height: 80px;
    padding: 16px;
}
</style>
