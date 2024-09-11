'use client';

import React from 'react';
import Link from 'next/link';
import styles from './CareersButton.module.css'; // Import the CSS module

const CareersButton: React.FC = () => {
  return (
    <div className={styles.careersContainer}>
      <h2>Looking to join our team?</h2>

      <Link href="/careers">
        <button className={styles.careersButton}>
          Go to Careers
        </button>
      </Link>
    </div>
  );
};

export default CareersButton;
