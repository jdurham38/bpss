'use client';

import React from 'react';
import Link from 'next/link';
import styles from './ReturnButton.module.css'; // Import custom CSS for styling

const ReturnButton: React.FC = () => {
  return (
    <Link href="/">
      <button className={styles.returnButton}>
        Return to Home
      </button>
    </Link>
  );
};

export default ReturnButton;
