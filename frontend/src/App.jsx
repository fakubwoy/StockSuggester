import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import StockCard from './components/StockCard/StockCard';
import ExpandedChartView from './components/ExpandedChartView/ExpandChartView'; 
import Loader from './components/Loader/Loader';
import styles from './App.module.css';
import BASE_URL from './api';

function App() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedChart, setExpandedChart] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}/hot-stocks`)
      .then(res => {
        setStocks(res.data);
        setLoading(false);
      });
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;
    
    setLoading(true);
    try {
      const [stockRes, newsRes] = await Promise.all([
        axios.get(`${BASE_URL}/search-stock/${search}`),
        axios.get(`${BASE_URL}/stock-news/${search}`)
      ]);
      
      if (stockRes.data?.info || stockRes.data?.quote) {
        setSelected(stockRes.data);
      } else {
        console.error("Unexpected stock data structure:", stockRes.data);
        setSelected(null);
      }
      
      if (Array.isArray(newsRes.data)) {
        setNews(newsRes.data);
      } else {
        console.error("Unexpected news data structure:", newsRes.data);
        setNews([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSelected(null);
      setNews([]);
    }
    setLoading(false);
  };

  return (
    <div className={`${styles.app} ${darkMode ? styles.dark : ''}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className={styles.main}>
        {expandedChart ? (
          <ExpandedChartView 
            stock={expandedChart} 
            onClose={() => setExpandedChart(null)} 
            darkMode={darkMode}
          />
        ) : (
          <>
            <SearchBar 
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
              darkMode={darkMode}
            />

            {loading ? (
              <Loader />
            ) : (
              <>
                {selected && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.selectedStock}
                  >
                    <StockCard 
                      stock={selected} 
                      news={news} 
                      darkMode={darkMode}
                      onExpandChart={() => setExpandedChart(selected)}
                    />
                  </motion.div>
                )}

                <h2 className={styles.subTitle}>🔥 Hot Stocks</h2>
                
                <div className={styles.stocksGrid}>
                  {stocks.map((stock, index) => (
                    <motion.div 
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ y: -5 }}
                    >
                      <StockCard 
                        stock={stock} 
                        darkMode={darkMode}
                        onExpandChart={() => setExpandedChart(stock)}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;