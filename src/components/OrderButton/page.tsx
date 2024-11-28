import React from 'react';
import styles from './RedirectButton.module.css'; 

interface RedirectButtonProps {
  url: string;
  label: string;
}

const RedirectButton: React.FC<RedirectButtonProps> = ({ url, label }) => {
  const handleClick = () => {
    window.location.href = url;
  };

  return (
    <button className={styles.redirectButton} onClick={handleClick}>
      {label}
    </button>
  );
};

export default RedirectButton;
