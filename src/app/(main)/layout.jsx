import CartDrawer from '@/components/CartDrawer'
import Footer from '@/share/Footer'
import Navbar from '@/share/Navbar'
import React from 'react'

function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="grow">
                {children}
                <CartDrawer />
            </main>
            <Footer />
        </>
    )
}

export default MainLayout