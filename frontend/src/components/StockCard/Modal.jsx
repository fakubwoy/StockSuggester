import styles from './Modal.module.css';

export function Modal({ children, onClose, darkMode }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${darkMode ? styles.dark : ''}`}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}