import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import "./App.css";

/* 🔥 Firebase Configuration */
const firebaseConfig = {
  apiKey: "AIzaSyAU7oW1V1_DTHO_sSRGPTRVyi8VwMjxU50",
  authDomain: "esp8266led-fabdc.firebaseapp.com",
  databaseURL:
    "https://esp8266led-fabdc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp8266led-fabdc",
  storageBucket: "esp8266led-fabdc.appspot.com",
  messagingSenderId: "606563626891",
  appId: "1:606563626891:web:c11e89330018ad149cc98e"
};

// Initialize Firebase ONCE
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function App() {
  const [fireStatus, setFireStatus] = useState(false);
  const [gasLevel, setGasLevel] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fireRef = ref(database, "fireData");

    const unsubscribe = onValue(fireRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      setFireStatus(!!data.fireStatus);
      setGasLevel(Number(data.gasLevel) || 0);

      if (data.fireStatus && data.alertTime) {
        setHistory((prev) => [
          data.alertTime,
          ...prev.slice(0, 4)
        ]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={`main ${fireStatus ? "alert-bg" : ""}`}>
      <h1>🔥 IoT Fire Alert Dashboard</h1>

      <div className="container">
        {/* Fire Status */}
        <div className="card">
          <h2>🔥 Fire Status</h2>
          <div className={`status-light ${fireStatus ? "fire" : "safe"}`} />
          <p className={fireStatus ? "danger-text" : "safe-text"}>
            {fireStatus ? "FIRE DETECTED" : "SAFE"}
          </p>
        </div>

        {/* Gas Level */}
        <div className="card">
          <h2>💨 Gas Level</h2>
          <p>{gasLevel}</p>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${Math.min(gasLevel, 100)}%` }}
            />
          </div>
        </div>

        {/* Alert History */}
        <div className="card">
          <h2>📜 Alert History</h2>
          <ul className="history">
            {history.length === 0 && <li>No alerts yet</li>}
            {history.map((time, i) => (
              <li key={i}>🔥 Alert at: {time}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;