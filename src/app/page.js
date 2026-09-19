import Navbar from '@/share/Navbar'
import React from 'react'

function Home() {
    return (
        <div className="">

            <Navbar />

            {/* English Title (উচ্চারণ বা ব্র্যান্ড নেম) */}
            <h3 className="font-english text-lg font-bold text-gray-900">
                CeraVe Foaming Facial Cleanser
            </h3>

            {/* Bangla Title */}
            <h4 className="text-base font-semibold text-gray-700 mt-1">
                সেরাভি ফোমিং ফেসিয়াল ক্লিনজার
            </h4>

            {/* Price (Bangla) */}
            <p className="text-rose-600 font-bold text-lg my-2">
                মূল্য: ৳ ১,৪৫০
            </p>

            {/* Bangla Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
                তৈলাক্ত ও সংবেদনশীল ত্বকের জন্য অত্যন্ত কার্যকরী। এটি ত্বক শুষ্ক না করে অতিরিক্ত তেল এবং ময়লা দূর করে।
            </p>
        </div>
    )
}

export default Home