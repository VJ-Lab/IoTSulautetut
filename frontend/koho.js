document.addEventListener("DOMContentLoaded", function () {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    fetch("https://kohoankka2.azurewebsites.net/litrat")
      .then((response) => response.json())
      .then((APIdata) => {
        console.log("API Data:", APIdata);
        if (!APIdata || !APIdata.length) {
          console.error("No data");
          return;
        }
        const data = [["CreatedAt", "Litra"]];
        const latestFeeds = APIdata.slice(-20);

        latestFeeds.forEach((feed) => {
          const dbtime = new Date(feed.CreatedAt);
          const liter = parseFloat(feed.Litra);
          data.push([dbtime, liter]);
        });

        const dataTable = google.visualization.arrayToDataTable(data);
        const options = {
          title: "Kohomittari",
          hAxis: { title: "Time", format: "EEE HH:mm:ss" },
          vAxis: { title: "Liter" },
          legend: "none",
        };
        const chart = new google.visualization.LineChart(
          document.getElementById("chart_div")
        );
        chart.draw(dataTable, options);
      })
      .catch((error) => console.error("error fetching data:", error));
  }
});
