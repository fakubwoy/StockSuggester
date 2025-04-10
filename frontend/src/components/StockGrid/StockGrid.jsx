import StockCard from '../StockCard/StockCard';
import styles from './StockGrid.module.css';

const StockGrid = ({ stocks, title, darkMode }) => {
  return (
    <div className={styles.gridContainer}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {stocks.map((stock, index) => (
          <StockCard 
            key={index} 
            stock={stock} 
            darkMode={darkMode} 
          />
        ))}
      </div>
    </div>
  );
};

export default StockGrid;