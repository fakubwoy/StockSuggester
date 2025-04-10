import styles from './Header.module.css';

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>
          <span className={styles.logo}>📈</span>
          Stock Suggester
        </h1>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className={styles.themeToggle}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </header>
  );
}