<template>
    <div class="row">     
        <h4 class="donations">Recent donations:</h4>
        <div class="donation-list">
            <table>
                <thead>
                    <tr>
                        <th>Donation Amount</th>
                        <th>Datetime</th>
                        <th>Memo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(donation, i) in donations" :key="i">
                        <td>{{donation.txDetails[0].amount}} ZEC</td>
                        <td>{{ new Date(donation.time * 1000).toLocaleDateString() }} {{ new Date(donation.time * 1000).toLocaleTimeString() }}</td>
                        <td>{{ donation.txDetails[0].memos ? donation.txDetails[0].memos[0] : "No memo avaiable" }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        
    </div>
</template>
  
<script>
import '@/components/RecentDonationsStyles.css'
export default {
    name: 'RecentDonations',
    props: {
        donations: Object
    }
}
</script>


