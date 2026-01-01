import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import DealsSection from '@/components/home/DealsSection';
import StoresSection from '@/components/home/StoresSection';

const Index: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>DealFinder - Best Deals Near You</title>
        <meta name="description" content="Discover amazing deals and offers from stores near you. Fast delivery and live tracking." />
      </Helmet>
      
      <HeroSection />
      <DealsSection />
      <StoresSection />
    </Layout>
  );
};

export default Index;