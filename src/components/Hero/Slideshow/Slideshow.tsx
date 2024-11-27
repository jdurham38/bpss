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
import image7 from '../../../../public/images/Image7.jpg';

function Slideshow() {
  return (
    <div className={styles.carouselContainer}>
      <Carousel controls={true} indicators={true} interval={4000} pause={'hover'}>
      <Carousel.Item>
          <div className={styles.carouselContainer}>
            <Image
              className={styles.carouselImage}
              src={image7}
              alt="Seventh slide"
              width={800}
              height={500}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className={styles.carouselContainer}>
            <Image
              className={styles.carouselImage}
              src={image1}
              alt="First slide"
              width={800}
              height={500}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className={styles.carouselContainer}>
            <Image
              className={styles.carouselImage}
              src={image2}
              alt="Seventh slide"
              width={800}
              height={500}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className={styles.carouselContainer}>
            <Image
              className={styles.carouselImage}
              src={image3}
              alt="Seventh slide"
              width={800}
              height={500}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className={styles.carouselContainer}>
            <Image
              className={styles.carouselImage}
              src={image4}
              alt="Seventh slide"
              width={800}
              height={500}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className={styles.carouselContainer}>
            <Image
              className={styles.carouselImage}
              src={image5}
              alt="Seventh slide"
              width={800}
              height={500}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className={styles.carouselContainer}>
            <Image
              className={styles.carouselImage}
              src={image6}
              alt="Seventh slide"
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
