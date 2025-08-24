import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';

const VoiceAnalytics: React.FC = () => {
  const [summary, setSummary] = useState(analyticsService.getAnalyticsSummary());

  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(analyticsService.getAnalyticsSummary());
    }, 2000); // Refresh every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = () => {
    analyticsService.clearLogs();
    setSummary(analyticsService.getAnalyticsSummary());
  };

  return (
    <div className="mt-4 p-4 border-t">
      <h3 className="text-lg font-semibold mb-2">Voice Command Analytics</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p>Total Commands:</p>
          <p className="text-2xl font-bold">{summary.totalCommands}</p>
        </div>
        <div>
          <p>Success Rate:</p>
          <p className="text-2xl font-bold">{summary.successRate}%</p>
        </div>
        <div>
          <p>Avg. Processing Time:</p>
          <p className="text-2xl font-bold">{summary.averageProcessingTime}ms</p>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold">Command Usage:</h4>
        {Object.keys(summary.commandUsage).length > 0 ? (
          <ul className="list-disc list-inside">
            {Object.entries(summary.commandUsage).map(([command, count]) => (
              <li key={command}>{`${command}: ${count}`}</li>
            ))}
          </ul>
        ) : (
          <p>No commands logged yet.</p>
        )}
      </div>
      <div className="mt-4">
        <button 
          onClick={handleClearLogs}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Analytics Data
        </button>
      </div>
    </div>
  );
};

export default VoiceAnalytics;