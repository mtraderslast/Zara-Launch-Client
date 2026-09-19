import CategorySection from '@/components/CategorySection'
import FeaturedProducts from '@/components/FeaturedProducts'
import HeroBanner from '@/components/HeroBanner'
import React from 'react'

function Home() {
    return (
        <>
            <HeroBanner />
            <CategorySection />
            <FeaturedProducts />
        </>
    )
}

export default Home