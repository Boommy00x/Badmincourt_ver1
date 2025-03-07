"use client";

import React, { useState, useEffect } from 'react';
import CourtManagement from '@/components/court-management/CourtManagePage';
import BadmintonLoader from '@/components/loader/badmintonLoader'; // Import BadmintonLoader

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the delay as needed

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BadmintonLoader /> {/* Show the loader while loading */}
      </div>
      
    );
  }

  return <CourtManagement />;
}
