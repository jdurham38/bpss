// src/components/CareersButton/CareersButton.tsx
'use client';

import React from 'react';
import Link from 'next/link';

const CareersButton: React.FC = () => {
  return (
    <Link href="/careers">
      <button>
        Go to Careers
      </button>
    </Link>
  );
};

export default CareersButton;
