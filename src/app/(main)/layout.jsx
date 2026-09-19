import Footer from '@/share/Footer'
import Navbar from '@/share/Navbar'
import React from 'react'

function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="grow">
                {children}
            </main>
            <Footer />
        </>
    )
}

export default MainLayout