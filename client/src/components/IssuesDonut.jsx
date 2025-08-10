import React from "react";

const IssuesDonut = ({ issues }) => {
  const seriousCount = issues.filter(i => i.impact === "serious").length;
  const moderateCount = issues.filter(i => i.impact === "moderate").length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-6">Issue Severity</h2>
      <div className="flex justify-around">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: "#f44336" }}>
            {seriousCount}
          </div>
          <span className="mt-2 text-sm">Serious</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: "#ffb400" }}>
            {moderateCount}
          </div>
          <span className="mt-2 text-sm">Moderate</span>
        </div>
      </div>
    </div>
  );
};

export default IssuesDonut;
