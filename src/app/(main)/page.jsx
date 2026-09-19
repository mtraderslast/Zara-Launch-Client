import CategorySection from '@/components/CategorySection'
import CustomerReviews from '@/components/CustomerReviews'
import FeaturedProducts from '@/components/FeaturedProducts'
import HeroBanner from '@/components/HeroBanner'
import HomeComboSection from '@/components/HomeComboSection'
import React from 'react'

function Home() {
    return (
        <>
            <HeroBanner />
            <FeaturedProducts />
            <HomeComboSection />
            <CustomerReviews />
        </>
    )
}

export default Home