document.addEventListener('DOMContentLoaded', function() {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        fetch('https://api.thingspeak.com/channels/2676491/feeds.json?apikey=xxx&results=10&timezone=Europe/Helsinki')
        .then(response => response.json())
        .then(APIdata => {
            const feeds = APIdata.feeds;
            const data = [['Time', 'Liter']];

            feeds.forEach(feed => {
                const time = new Date(feed.created_at);
                const liter = parseFloat(feed.field1);
                data.push([time, liter]);
            });

            const dataTable = google.visualization.arrayToDataTable(data);
            const options = {
                title: "Kohomittari",
                hAxis: { title: 'Time', format: 'HH:mm:ss' },
                vAxis: { title: 'Liter'},
                legend: 'none'
            };
            const chart = new google.visualization.LineChart(document.getElementById('chart_div'));
            chart.draw(dataTable, options);
        })
        .catch(error => console.error('error fetching data:', error));
    }
});