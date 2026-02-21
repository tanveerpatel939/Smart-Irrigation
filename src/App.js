import React, { useEffect, useState } from "react";
import "./App.css";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

/* 🔥 YOUR FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyAU7oW1V1_DTHO_sSRGPTRVyi8VwMjxU50",
  authDomain: "esp8266led-fabdc.firebaseapp.com",
  databaseURL: "https://esp8266led-fabdc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp8266led-fabdc",
  storageBucket: "esp8266led-fabdc.firebasestorage.app",
  messagingSenderId: "606563626891",
  appId: "1:606563626891:web:c11e89330018ad149cc98e"
};

/* INIT FIREBASE */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
  const [led, setLed] = useState(false);
  const [buzzer, setBuzzer] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);

  /* 🔄 READ FROM FIREBASE */
  useEffect(() => {
    const ledRef = ref(db, "LED");
    const buzzerRef = ref(db, "Buzzer");
    const dhtRef = ref(db, "DHT11");

    onValue(ledRef, (snapshot) => setLed(snapshot.val() === 1));
    onValue(buzzerRef, (snapshot) => setBuzzer(snapshot.val() === 1));
    onValue(dhtRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTemperature(data.temperature);
        setHumidity(data.humidity);
      }
    });
  }, []);

  /* 🎛 TOGGLE LED & BUZZER */
  const toggleLed = () => set(ref(db, "LED"), led ? 0 : 1);
  const toggleBuzzer = () => set(ref(db, "Buzzer"), buzzer ? 0 : 1);

  return (
    <div className="container">
      <h1 className="title">Smart Dashboard</h1>

      <div className="grid">

        {/* LED CONTROL */}
        <div className="card">
          <h2>LED Control</h2>
          <label className="switch">
            <input type="checkbox" checked={led} onChange={toggleLed} />
            <span className="slider"></span>
          </label>
          <p className={led ? "on" : "off"}>{led ? "LED ON" : "LED OFF"}</p>
        </div>

        {/* BUZZER CONTROL */}
        <div className="card">
          <h2>Buzzer Control</h2>
          <label className="switch">
            <input type="checkbox" checked={buzzer} onChange={toggleBuzzer} />
            <span className="slider"></span>
          </label>
          <p className={buzzer ? "on" : "off"}>{buzzer ? "BUZZER ON" : "BUZZER OFF"}</p>
        </div>

        {/* DHT11 SENSOR */}
        <div className="card">
          <h2>DHT11 Sensor</h2>
          <p>Temperature: {temperature} °C</p>
          <p>Humidity: {humidity} %</p>
        </div>

        {/* STATS */}
        <div className="card">
          <h2>Statistics</h2>
          <div className="stats">
            <div>
              <h3>Power</h3>
              <p>{led ? "20W" : "0W"}</p>
            </div>
            <div>
              <h3>Status</h3>
              <p>{led ? "LED Active" : "Idle"}</p>
            </div>
            <div>
              <h3>Buzzer</h3>
              <p>{buzzer ? "ON" : "OFF"}</p>
            </div>
            <div>
              <h3>Cloud</h3>
              <p>Connected</p>
            </div>
          </div>
        </div>

        {/* LOGS */}
        <div className="card logs">
          <h2>Activity Logs</h2>
          <ul>
            <li>System Online</li>
            <li>Firebase Connected</li>
            <li>{led ? "LED Turned ON" : "LED Turned OFF"}</li>
            <li>{buzzer ? "Buzzer Turned ON" : "Buzzer Turned OFF"}</li>
            <li>Temp: {temperature} °C</li>
            <li>Humidity: {humidity} %</li>
          </ul>
        </div>

        {/* DEVICE INFO */}
        <div className="card">
          <h2>Device Info</h2>
          <p>Board: ESP8266</p>
          <p>Database: Realtime</p>
          <p>Location: Cloud</p>
          <p>Status: Online</p>
        </div>

      </div>
    </div>
  );
}