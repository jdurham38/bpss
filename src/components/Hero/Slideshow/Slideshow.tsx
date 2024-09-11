import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import styles from './styles.module.css';
import Image from 'next/image';

import image1 from '../../../../public/images/Image1.jpg';
import image2 from '../../../../public/images/Image2.jpg';
import image3 from '../../../../public/images/Image3.jpg';
import image4 from '../../../../public/images/Image4.jpg';
import image5 from '../../../../public/images/Image5.jpg';
import image6 from '../../../../public/images/Image6.jpg';

function Slideshow() {
  return (
    <div className={styles.carouselContainer}>
      <Carousel controls={true} indicators={true} interval={4000} pause={'hover'}>
        <Carousel.Item>
          <div style={{ width: '100%', height: '100%' }}> {/* Wrapper div to ensure consistent image sizing */}
            <Image
              className={styles.carouselImage}
              src={image1}
              alt="First slide"
              width={800}
              height={500}
              style={{ objectFit: 'cover' }}
              priority // Preload the first image for faster display
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div style={{ width: '100%', height: '100%' }}>
            <Image
              className={styles.carouselImage}
              src={image2}
              alt="Second slide"
              width={800}
              height={500}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div style={{ width: '100%', height: '100%' }}>
            <Image
              className={styles.carouselImage}
              src={image3}
              alt="Third slide"
              width={800}
              height={500}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div style={{ width: '100%', height: '100%' }}>
            <Image
              className={styles.carouselImage}
              src={image4}
              alt="Fourth slide"
              width={800}
              height={500}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div style={{ width: '100%', height: '100%' }}>
            <Image
              className={styles.carouselImage}
              src={image5}
              alt="Fifth slide"
              width={800}
              height={500}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div style={{ width: '100%', height: '100%' }}>
            <Image
              className={styles.carouselImage}
              src={image6}
              alt="Sixth slide"
              width={800}
              height={500}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default Slideshow;
