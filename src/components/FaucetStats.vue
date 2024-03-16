<template>
    <div class="row">
        <h2>Faucet Satistics:</h2>
        <div class="stats">
            <span><b>Total ZEC sent</b></span>
            <span><h2>{{ stats.sent }}</h2></span>
        </div>
        <div class="stats">
            <span class="stats-title"><b>Total claims</b></span>
            <span class="stats-vlue"><h2>{{ stats.claims }}</h2></span>
        </div>
        
    </div>
</template>
  
<script>
import '@/components/FaucetStatsStyles.css'
export default {
name: 'FaucetStats',
props: {
    stats: Object,
}
}
</script>


