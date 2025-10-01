import { Link } from '@inertiajs/react'
import React from 'react'

export default function BillingPayments() {
  return (
    <>
    
    <div className="w-full h-auto p-4 sm:p-5 bg-white rounded-3xl border border-gray-300">
        <h2 className="text-xl sm:text-2xl font-Inter font-semibold mb-4">Manage Billing Methods</h2>
        <p className="text-gray-600 font-Inter mb-6 font-medium">Add, update, or remove your billing methods.</p>
        <h2 className="text-xl sm:text-2xl font-Inter font-semibold mb-2">Primary</h2>
        <p className="text-gray-600 font-Inter mb-6 font-medium">Your primary billing method is used for all recurring payments.</p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10">
                        <img
                            src="/assets/Icons/freelancer/account/Visa.png"
                            alt="Visa"
                            className="w-8 h-6"
                        />
                    </div>
                    <p className="text-lg font-semibold font-Inter ml-4">Visa ending in 2036</p>
                </div>
                <p className="text-lg font-semibold font-Inter mt-2 sm:mt-0 sm:ml-12">GBP</p>
            </div>


            <div className="flex gap-4 mt-4 sm:mt-0">
                <Link href={("")} className="text-blue-800 font-Inter font-semibold">Edit</Link>
                <button className="text-red-800 font-Inter font-semibold">Remove</button>
            </div>
        </div>
        <button className="text-blue-800 font-Inter mb-4 font-semibold">+ Add a billing method</button>
    </div>
</>
  )
}
