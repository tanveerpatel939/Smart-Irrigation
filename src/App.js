import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import "./App.css";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAU7oW1V1_DTHO_sSRGPTRVyi8VwMjxU50",
  authDomain: "esp8266led-fabdc.firebaseapp.com",
  databaseURL: "https://esp8266led-fabdc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp8266led-fabdc",
  storageBucket: "esp8266led-fabdc.firebasestorage.app",
  messagingSenderId: "606563626891",
  appId: "1:606563626891:web:c11e89330018ad149cc98e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function App() {

  const [data, setData] = useState({
    temperature: "--",
    humidity: "--",
    soilMoisture: "--",
    waterLevel: "--"
  });

  useEffect(() => {
    const sensorsRef = ref(database, "sensors");

    onValue(sensorsRef, (snapshot) => {
      const sensorData = snapshot.val();

      if (sensorData) {
        setData({
          temperature: sensorData.temperature || "--",
          humidity: sensorData.humidity || "--",
          soilMoisture: sensorData.soilMoisture || "--",
          waterLevel: sensorData.waterLevel || "--"
        });
      }
    });

  }, []);

  return (
    <div className="main">
      <h1>🌱 Smart Irrigation Dashboard</h1>

      <div className="container">

        <div className="card">
          <h2>🌡 Temperature</h2>
          <p>{data.temperature} °C</p>
        </div>

        <div className="card">
          <h2>💧 Humidity</h2>
          <p>{data.humidity} %</p>
        </div>

        <div className="card">
          <h2>🌱 Soil Moisture</h2>
          <p>{data.soilMoisture}</p>
        </div>

        <div className="card">
          <h2>💦 Water Level</h2>
          <p>{data.waterLevel}</p>
        </div>

      </div>
    </div>
  );
}

export default App;