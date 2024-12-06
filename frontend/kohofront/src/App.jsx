import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import Header from "/Header";
import Footer from "/Footer";

function App() {
  const [chartData, setChartData] = useState([["Date", "Liters"]]);
  const [temperature, setTemperature] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [status, setStatus] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://kohoankka2.azurewebsites.net/litrat"
      );
      const latestData = await response.json();
      const transformedData = [
        ["CreatedAt", "Litra"],
        ...latestData.map((item) => [new Date(item.CreatedAt), item.Litra]),
      ];

      setChartData(transformedData);
    } catch (error) {
      console.error("Virhe datan haussa:", error);
    }
  };

  const fetchTemperature = async () => {
    try {
      const response = await fetch("https://kohoankka2.azurewebsites.net/temp");
      if (!response.ok) {
        throw new Error(`Virhe palvelimen vastauksessa: ${response.status}`);
      }
      const data = await response.json();

      if (data.length > 0 && data[0].Temperature !== undefined) {
        const roundedTemperature = parseFloat(data[0].Temperature).toFixed(2);
        const createdAt = parseCreatedAt(data[0].CreatedAt);
        const now = new Date();
        const diffMinutes = (now - createdAt) / (1000 * 60);

        if (diffMinutes > 15) {
          setTemperature(null);
          setStatus("Anturi offline");
        } else {
          setTemperature(roundedTemperature);
          setLastUpdated(createdAt);
          setStatus("");
        }
      } else {
        console.error("Data ei sisältänyt odotettua Temperature-arvoa");
        setTemperature(null);
        setStatus("Anturi offline");
      }
    } catch (error) {
      console.error("Virhe haettaessa lämpötilaa:", error);
      setTemperature(null);
      setStatus("Anturi offline");
    }
  };

  const parseCreatedAt = (createdAt) => {
    let date = new Date(createdAt);
    if (isNaN(date)) {
      const [datePart, timePart] = createdAt.split(" ");
      const [day, month, year] = datePart.split(".");
      const isoString = `${year}-${month}-${day}T${timePart}Z`;
      date = new Date(isoString);
    }
    return date;
  };

  useEffect(() => {
    fetchData();
    const dataInterval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => {
      clearInterval(dataInterval);
    };
  }, []);

  const [liters, setLiters] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      setLiters(value);
      setError("");
    } else {
      setError("Syötä desimaaliluku!");
    }
  };

  const handleSubmit = async () => {
    if (!liters || isNaN(parseFloat(liters))) {
      setError("Syötä desimaaliluku!");
      return;
    }

    const data = { maxLiters: parseFloat(liters) };

    try {
      const response = await fetch(
        "https://kohoankka2.azurewebsites.net/post_max",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      console.log("Palvelimen vastaus:", result);
    } catch (error) {
      console.error("Virhe lähetyksessä:", error);
    }
  };

  const options = {
    title: "",
    curveType: "function",
    legend: { position: "bottom" },
    hAxis: {
      title: "Päivä ja aika",
      format: "EEE HH:mm:ss",
      gridlines: { count: 5 },
    },
    vAxis: {
      title: "Määrä litroissa",
    },
  };

  return (
    <>
      <Header />
      <main>
        <div className="main">
          <div className="chart">
            <Chart
              chartType="LineChart"
              width="800px"
              height="400px"
              data={chartData}
              options={options}
            />
            <div className="napit">
              <div className="lämpötila-osio">
                {status && <div>{status}</div>}
                {temperature !== null && (
                  <div className="lämpö-display">{temperature} °C</div>
                )}
                <button onClick={fetchTemperature}>Hae lämpötila</button>
              </div>
              <div className="litrat">
                <div className="inputti">
                  <input
                    type="number"
                    step="0.1"
                    id="litersInput"
                    placeholder="Aseta max. litramäärä"
                    value={liters}
                    onChange={handleInputChange}
                  />
                </div>
                <button onClick={handleSubmit}>Lähetä</button>{" "}
                {error && <div style={{ color: "red" }}>{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
