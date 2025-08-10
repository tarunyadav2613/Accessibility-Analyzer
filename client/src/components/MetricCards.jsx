import React from "react";

const MetricCards = ({ result }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 p-4 rounded-lg shadow">
        <h3 className="text-sm">Total Issues</h3>
        <p className="text-2xl font-bold">{result?.issues?.length || 0}</p>
      </div>
      <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 p-4 rounded-lg shadow">
        <h3 className="text-sm">Score</h3>
        <p className="text-2xl font-bold">{result?.score || 0}</p>
      </div>
    </div>
  );
};

export default MetricCards;
