// src/components/ReturnButton/ReturnButton.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ReturnButton: React.FC = () => {


  return (
    <Link href="/">
    <button style={{ padding: '10px', marginTop: '20px', cursor: 'pointer' }}>
      Return to Home
    </button>
    </Link>
  );
};

export default ReturnButton;
