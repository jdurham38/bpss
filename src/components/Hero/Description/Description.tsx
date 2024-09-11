import React from 'react';
import styles from './Description.module.css'; // Import the CSS module
import RedirectButton from '@/components/OrderButton/page';

const Description: React.FC = () => {
  return (
    <div className={styles.descriptionBox}>
      <h2>Big Pops Sandwich Shop</h2>
      <p>
        Big Pops is a 1968 Airstream that has been converted into a Sandwich Shop, arguably making some of the best sandwiches in Manchester, VT. 
        We pride ourselves on coming up with delicious, creative sandwiches and subs.
      </p>
      <p>
        Located at{' '}
        <a 
          href="https://www.google.com/maps/search/?api=1&query=4367+Main+Street+Manchester+VT" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.locationLink}
        >
          4367 Main Street, Manchester, VT
        </a>.
      </p>
      <div className={styles.buttonWrapper}>
        <RedirectButton 
          url="https://big-pops-sandwich-shop.square.site/?fbclid=IwY2xjawFMQHBleHRuA2FlbQIxMAABHXp9Zlb6LqxdDOAL08rDQAm_8MIFLRo8IzbFSSMcN0GxUp4yQv0T8VCi2g_aem_4kcO-S8Ma9VyNU5jX31hEw" 
          label="Order Now" 
        />
      </div>
    </div>
  );
};

export default Description;
