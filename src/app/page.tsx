// src/app/page.tsx or wherever your Home component is
'use client'; // Required if this component uses any client-side hooks

import React from 'react';
import CareersButton from '../components/CareersButton/CareersButton'; 
import RedirectButton from '@/components/OrderButton/page';
import Contact from '@/components/Contact/contact';

export default function Home() {
  return (
    <div>
      <RedirectButton url="https://big-pops-sandwich-shop.square.site/?fbclid=IwY2xjawFMQHBleHRuA2FlbQIxMAABHXp9Zlb6LqxdDOAL08rDQAm_8MIFLRo8IzbFSSMcN0GxUp4yQv0T8VCi2g_aem_4kcO-S8Ma9VyNU5jX31hEw" label="Order Now" />
      <CareersButton />
      <Contact />
    </div>
  );
}
