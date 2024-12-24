import React from "react";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const state = location.state || {}; // Default to an empty object if state is null or undefined

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Location State Values:</h2>
      {Object.keys(state).length > 0 ? (
        <ul>
          {Object.entries(state).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {JSON.stringify(value)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No state values passed via location.</p>
      )}
    </div>
  );
}

export default Dashboard;
