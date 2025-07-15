import { useEffect, useState, useRef } from 'react';
import { getDiskTotalStats } from '../services/api';

function TotalDiskStats() {
  const [stats, setStats] = useState<{ total: number; used: number; free: number } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);

  const refreshInterval = 300000; // 5 dakika
  const intervalRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  const toTB = (bytes: number) => (bytes / (1024 ** 4)).toFixed(2);

  const fetchStats = () => {
    getDiskTotalStats()
      .then(data => {
        setStats(data);
        setLastUpdated(new Date().toLocaleTimeString());
        setCountdown(Math.floor(refreshInterval / 1000));
      })
      .catch(err => console.error('Disk total fetch error:', err));
  };

  const startPolling = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    fetchStats();

    intervalRef.current = setInterval(fetchStats, refreshInterval);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  };

  useEffect(() => {
    startPolling();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  if (!stats) return <div>Loading total disk info...</div>;

  const usedPercent = (stats.used / stats.total) * 100;

  return (
    <div className="cust-core-status-box">
      <p className='core-lead'>💾 - Disk Usage</p>
      <p className='disk-area'> <span>Used: </span>{toTB(stats.used)} TB / Total: {toTB(stats.total)} TB</p>
      
      <div className="disk-usage-bar">
        <div className="used-bar" style={{ width: `${usedPercent}%` }}></div>
        <div className="free-bar" style={{ width: `${100 - usedPercent}%` }}></div>
      </div>

     {/* <p className="core-lead">🕒 Last updated: {lastUpdated}</p>
      <p className="core-lead">⏳ Next refresh: {Math.floor(countdown / 60)}m {countdown % 60}s</p>
        */}
      <button className="cust-button" onClick={startPolling}>Refresh Now</button>
    </div>
  );
}

export default TotalDiskStats;
