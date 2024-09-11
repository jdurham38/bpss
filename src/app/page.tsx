'use client';

import React from 'react';
import CareersButton from '../components/CareersButton/CareersButton';
import RedirectButton from '@/components/OrderButton/page';
import Contact from '@/components/Contact/contact';
import Description from '@/components/Hero/Description/Description';
import Slideshow from '@/components/Hero/Slideshow/Slideshow';
import styles from './Home.module.css'; // Import CSS module for styling

export default function Home() {
  return (
    <div className={styles.container}>


      <div className={styles.descriptionSlideshow}>
        <Description />
        <Slideshow />
      </div>

      <div className={styles.centeredButtons}>
        <CareersButton />
      </div>

      <div className={styles.contactSection}>
        <Contact />
      </div>
    </div>
  );
}
