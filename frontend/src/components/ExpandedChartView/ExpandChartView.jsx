import { useEffect, useState } from 'react';
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
import styles from './ExpandChartView.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ExpandedChartView({ stock, onClose, darkMode }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('1mo');
  const [error, setError] = useState(null);

  const periods = [
    { label: '1D', value: '1d' },
    { label: '1W', value: '1wk' },
    { label: '1M', value: '1mo' },
    { label: '1Y', value: '1y' },
    { label: 'Max', value: 'max' }
  ];

  const isIndianStock = stock?.info?.symbol?.endsWith('.NS') || false;

  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'N/A';
    return isIndianStock ? 
      `₹${price.toFixed(2)}` : 
      `$${price.toFixed(2)}`;
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap === undefined || marketCap === null) return 'N/A';
    if (isIndianStock) {
      if (marketCap >= 10000000) {
        return `₹${(marketCap / 10000000).toFixed(2)} Cr`;
      }
      return `₹${marketCap.toLocaleString()}`;
    }
    return `$${(marketCap / 1000000000).toFixed(2)}B`;
  };

  const formatTooltipValue = (value) => {
    return isIndianStock ? `₹${value.toFixed(2)}` : `$${value.toFixed(2)}`;
  };

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8000/stock-history/${stock.info.symbol}?period=${period}`
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
  }, [stock.info.symbol, period]);

  const data = {
    labels: chartData?.dates || [],
    datasets: [
      {
        label: `${stock.info.symbol} Price`,
        data: chartData?.prices || [],
        borderColor: darkMode ? '#a777e3' : '#6e8efb',
        backgroundColor: darkMode ? 'rgba(167, 119, 227, 0.1)' : 'rgba(110, 142, 251, 0.1)',
        tension: 0.1,
        fill: true,
        pointRadius: chartData?.isIntraday ? 2 : 3,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#e6e6e6' : '#333',
          font: {
            size: 16
          }
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${formatTooltipValue(value)}`;
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
          maxTicksLimit: chartData?.isIntraday ? 24 : 10,
          font: {
            size: 14
          }
        },
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#e6e6e6' : '#333',
          callback: (value) => isIndianStock ? `₹${value}` : `$${value}`,
          font: {
            size: 14
          }
        },
      },
    },
  };

  return (
    <div className={styles.expandedView}>
      <div className={styles.header}>
        <h2>
          {stock.info.shortName || stock.info.symbol} ({stock.info.symbol})
          <span className={styles.price}>
            {formatPrice(stock.info.currentPrice)}
          </span>
        </h2>
        <button onClick={onClose} className={styles.closeButton}>
          Close Fullscreen
        </button>
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

      <div className={styles.chartContainer}>
        {loading ? (
          <div className={styles.loading}>Loading chart data...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>

      <div className={styles.stockInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Market Cap:</span>
          <span>
            {formatMarketCap(stock.info.marketCap)}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Change:</span>
          <span className={stock.info.changePercent >= 0 ? styles.positive : styles.negative}>
            {stock.info.changePercent?.toFixed(2) || 'N/A'}%
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Sector:</span>
          <span>{stock.info.sector || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}