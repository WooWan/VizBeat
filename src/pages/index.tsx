import React from 'react';
import { About, Explore, GetStarted, Hero, WhatsNew } from '@/components/sections';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StarsCanvas from '@/canvas/StarsCanvas';

export default function Home() {
  return (
    <div className="overflow-hidden bg-primary-black">
      <Navbar />
      <Hero />
      <StarsCanvas />
      <div className="relative">
        <About />
        <div className="gradient-03 z-0" />
        <Explore />
      </div>
      <div className="relative">
        <GetStarted />
        <div className="gradient-04 z-0" />
        <WhatsNew />
      </div>
      <Footer />
    </div>
  );
}
