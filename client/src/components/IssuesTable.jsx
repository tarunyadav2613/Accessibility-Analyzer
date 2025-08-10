import React from "react";

const IssuesTable = ({ issues }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Detailed Issues</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-3">Type</th>
            <th className="border-b p-3">Message</th>
            <th className="border-b p-3">Impact</th>
            <th className="border-b p-3">Help</th>
          </tr>
        </thead>
        <tbody>
          {issues.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No issues found
              </td>
            </tr>
          ) : (
            issues.map((issue, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3">{issue.type}</td>
                <td className="p-3">{issue.message}</td>
                <td className="p-3 capitalize">{issue.impact}</td>
                <td className="p-3 text-blue-500">{issue.help}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IssuesTable;
