import { useState } from 'react';
import styles from './StockCard.module.css';
import StockChart from './StockChart';

export default function StockCard({ stock, news = [], darkMode, onExpandChart }) {
  const [showChart, setShowChart] = useState(false);
  const stockInfo = stock?.info || {};
  const quoteData = stock?.quote || {};
  const isIndianStock = stockInfo.isIndianStock;
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
  return (
    <div className={`${styles.card} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.stockName}>
            {stockInfo.shortName || stockInfo.symbol || 'N/A'}
            <span className={styles.stockSymbol}>
              ({stockInfo.symbol || 'N/A'})
            </span>
          </h3>
          <div className={styles.stockSector}>
            {stockInfo.sector || 'N/A'} • {stockInfo.industry || 'N/A'}
          </div>
        </div>
        <div className={styles.priceContainer}>
          <span className={styles.currentPrice}>
            {formatPrice(quoteData.price || stockInfo.currentPrice)}
          </span>
          <span className={`${styles.priceChange} ${
            (quoteData.changePercent || 0) >= 0 ? styles.positive : styles.negative
          }`}>
            {quoteData.changePercent?.toFixed(2) || stockInfo.changePercent?.toFixed(2) || 'N/A'}%
          </span>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Market Cap:</span>
            <span>{formatMarketCap(stockInfo.marketCap)}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Employees:</span>
            <span>{stockInfo.fullTimeEmployees?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Website:</span>
            <a href={stockInfo.website} target="_blank" rel="noopener noreferrer">
              {stockInfo.website ? 'Visit Site' : 'N/A'}
            </a>
          </div>
        </div>
        
        {news.length > 0 && (
          <div className={styles.newsSection}>
            <h4 className={styles.newsTitle}>Latest News</h4>
            <div className={styles.newsList}>
              {news.map((item, index) => (
                <div key={index} className={styles.newsItem}>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                  <div className={styles.newsMeta}>
                    <span className={styles.newsSource}>{item.source}</span>
                    {item.publishedAt && (
                      <span className={styles.newsDate}>
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add this footer section for the expand button */}
      <div className={styles.cardFooter}>
        <button 
          onClick={() => onExpandChart?.(stock)}
          className={styles.chartButton}
        >
          View Full Chart
        </button>
      </div>
    </div>
  );
}