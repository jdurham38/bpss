// src/app/page.tsx or wherever your Home component is
'use client'; // Required if this component uses any client-side hooks

import React from 'react';
import CareersButton from '../components/CareersButton/CareersButton'; 
import RedirectButton from '@/components/OrderButton/page';
import Contact from '@/components/Contact/contact';

export default function Home() {
  return (
    <div>
      <RedirectButton url="https://www.example.com" label="Order Now" />
      <CareersButton />
      <Contact />
    </div>
  );
}
