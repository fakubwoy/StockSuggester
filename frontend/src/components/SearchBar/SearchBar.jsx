import styles from './SearchBar.module.css';

export default function SearchBar({ search, setSearch, handleSearch, darkMode }) {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search for a stock (e.g. TSLA, AAPL)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        className={`${styles.searchInput} ${darkMode ? styles.dark : ''}`}
      />
      <button 
        onClick={handleSearch} 
        className={`${styles.searchButton} ${darkMode ? styles.dark : ''}`}
        disabled={!search.trim()}
      >
        Search
      </button>
    </div>
  );
}