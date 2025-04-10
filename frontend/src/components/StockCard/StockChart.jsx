import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './StockChart.module.css';
import { Modal } from './Modal'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StockChart({ ticker, darkMode }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('1mo');
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const periods = [
    { label: '1D', value: '1d' },
    { label: '1W', value: '1wk' },
    { label: '1M', value: '1mo' },
    { label: '1Y', value: '1y' },
    { label: 'Max', value: 'max' }
  ];

  useEffect(() => {
    if (!ticker) return;
    
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8000/stock-history/${ticker}?period=${period}`
        );
        setChartData(response.data);
      } catch (err) {
        setError('Failed to load chart data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [ticker, period]);

  if (!ticker) return null;

  const data = {
    labels: chartData?.dates || [],
    datasets: [
      {
        label: `${ticker} Price`,
        data: chartData?.prices || [],
        borderColor: darkMode ? '#a777e3' : '#6e8efb',
        backgroundColor: darkMode ? 'rgba(167, 119, 227, 0.1)' : 'rgba(110, 142, 251, 0.1)',
        tension: 0.1,
        fill: true,
        pointRadius: chartData?.isIntraday ? 2 : 3, 
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    onClick: () => setIsExpanded(true), 
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#e6e6e6' : '#333',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#e6e6e6' : '#333',
          maxRotation: chartData?.isIntraday ? 45 : 0,
          autoSkip: true,
          maxTicksLimit: chartData?.isIntraday ? 12 : 10,
        },
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#e6e6e6' : '#333',
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  if (loading) return <div className={styles.loading}>Loading chart...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <>
      <div className={`${styles.chartContainer} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.periodSelector}>
          {periods.map((p) => (
            <button
              key={p.value}
              className={`${styles.periodButton} ${
                period === p.value ? styles.active : ''
              }`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className={styles.chartWrapper}>
          <Line data={data} options={options} />
        </div>
      </div>

      {isExpanded && (
        <Modal onClose={() => setIsExpanded(false)} darkMode={darkMode}>
          <div className={styles.expandedChart}>
            <h3>{ticker} - {periods.find(p => p.value === period)?.label} View</h3>
            <div className={styles.expandedChartWrapper}>
              <Line 
                data={data} 
                options={{
                  ...options,
                  responsive: true,
                  maintainAspectRatio: false
                }} 
                height={400}
              />
            </div>
            <div className={styles.periodSelector}>
              {periods.map((p) => (
                <button
                  key={p.value}
                  className={`${styles.periodButton} ${
                    period === p.value ? styles.active : ''
                  }`}
                  onClick={() => setPeriod(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}