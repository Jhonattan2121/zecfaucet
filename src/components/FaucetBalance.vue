<template>
    <div class="row">
        
        <h2>Faucet balance:</h2>
        <span class="faucet-balance"> {{ balance }} ZEC</span>        
        
        <h4 class="donate">Donate to ZecFaucet.com:</h4>
        <!-- <textarea class="donation-address" v-model="donate" disabled></textarea> -->
        <div class="donation-qr">
            <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&color=231f20&data=${donate}`">
            <span class="donation-address">{{ donate }}</span>
        </div>
        
        
    </div>
</template>
  
<script>
import '@/components/FaucetBalanceStyles.css'
export default {
name: 'FaucetBalance',
props: {
    balance: Number,
    donate: String
}
}
</script>


