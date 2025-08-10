import React from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const GaugeScore = ({ score }) => {
  const percentage = score || 0;
  const getColor = (value) => {
    if (value >= 90) return "#4caf50"; 
    if (value >= 70) return "#ffb400"; 
    return "#f44336"; 
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">Accessibility Score</h2>
      <div style={{ width: 180, height: 180 }}>
        <CircularProgressbarWithChildren
          value={percentage}
          strokeWidth={10}
          styles={buildStyles({
            pathColor: getColor(percentage),
            trailColor: "#e6e6e6",
            textColor: "#333",
          })}
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{percentage}</span>
            <span className="text-sm text-gray-500">/ 100</span>
          </div>
        </CircularProgressbarWithChildren>
      </div>
    </div>
  );
};

export default GaugeScore;
