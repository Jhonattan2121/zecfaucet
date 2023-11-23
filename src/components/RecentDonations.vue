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
export default {
    name: 'RecentDonations',
    props: {
        donations: Object
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.donations {
    margin-top: 8px;
}
.donation-list {
    border: 1px solid lightgray;
    border-radius: 6px;
    margin-bottom: 32px;
    padding: 16px;
}
table {
  border: 0px;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
  table-layout: fixed;
}
</style>
