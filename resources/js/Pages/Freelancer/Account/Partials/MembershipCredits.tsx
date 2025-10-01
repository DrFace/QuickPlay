import { Link } from '@inertiajs/react'
import React, { useState } from 'react'
import ViewCreditHistoryModal from './ViewCreditHistoryModal';
import { User } from '@/types';

export default function MembershipCredits({ user, credits }: { user: User, credits: any }) {
    const [ShowViewCreditHistoryModal, setShowViewCreditHistoryModal] = useState(false);
    return (
        <div className="w-full h-auto bg-white border border-gray-300 rounded-3xl">
            <div className="flex flex-col w-full h-auto gap-4 p-4 sm:p-5 rounded-2xl">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold text-black sm:text-2xl">Credits Balance</h2>
                    <p className="text-base font-medium text-gray-600">{user.available_connects}</p>
                    <p className="text-base font-medium text-gray-600">
                        Learn more about how to earn and use <span className="font-bold text-blue-800">Credits</span>
                    </p>
                    <div className="flex flex-col gap-6 text-center sm:flex-row">
                        <Link href={route('freelancer.credits')} className="w-full h-10 px-8 py-1.5 text-lg font-semibold text-white bg-blue-800 rounded-full sm:w-40">
                            Buy Credits
                        </Link>
                        <button className="text-lg font-semibold text-blue-800"
                            onClick={() => setShowViewCreditHistoryModal(true)}
                        >
                            View Credits History
                        </button>
                    </div>
                    <ViewCreditHistoryModal
                        show={ShowViewCreditHistoryModal}
                        onClose={() => setShowViewCreditHistoryModal(false)}
                        credits={credits}
                    />
                </div>
            </div>
        </div>
    )
}
