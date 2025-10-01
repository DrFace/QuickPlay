import { Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { User } from '@/types';

import LocationInfoModal from '@/Components/shared/partials/LocationInfoModal';
import { PencilIcon } from '@heroicons/react/24/outline';
import AddProfileImageModal from '@/Components/shared/partials/AddProfileImageModal';
import NameModal from '@/Components/shared/partials/NameModal';
import EmailModal from '@/Components/shared/partials/EmailModal';



export default function MyInfo({
    user,
    countryMap,
    timeZoneOptions,

}: {
    user: User
    countryMap: { label: string; value: string }[];
    timeZoneOptions: { label: string; value: string }[];

}) {


    const [showNameModal, setShowNameModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);


    const maskName = (firstName: string, lastName: string) => {
        const fullName = `${firstName} ${lastName}`;
        if (fullName.replace(" ", "").length <= 5) return fullName;
        if (lastName.length <= 3) return `${firstName.charAt(0)}*** ***${lastName}`;
        return `${firstName.charAt(0)}*** ***${lastName.slice(-3)}`;
    };

    const maskEmail = (email: string) => {
        const [localPart, domain] = email.split('@');
        if (!localPart || !domain) return 'N/A';
        return `${localPart.charAt(0)}***@${domain}`;
    };


    return (
        <div className="w-full h-auto bg-white">
            <div className="flex flex-col items-start justify-start w-full gap-8">

                <div className="flex flex-col items-start justify-start w-full gap-6 p-4 border border-gray-300 sm:p-7 rounded-3xl">
                    <div className="flex items-center justify-between w-full">
                        <div className="text-2xl font-semibold font-Inter">Account</div>
                    </div>

                    <div className="flex flex-row items-start w-full sm:gap-6">
                        <div className="relative items-start w-20 gap-4 mr-2 sm:mr-5 ">
                            <div className={`absolute w-3 h-3  rounded-full left-1 top-1 ring-2 ring-white ${user?.active_status ? "bg-green-500" : "bg-red-500"}`}></div>
                            <img
                                className="sm:w-[70px] sm:h-[70px] rounded-full"
                                src={user?.avatar}
                                alt="avatar"
                            />
                            <button
                                onClick={() => setIsProfileImageModalOpen(true)}
                                className="absolute flex items-center justify-center w-5 h-5 p-1 text-center bg-white rounded-full ring-primary ring-2 right-1 bottom-1">
                                <PencilIcon className="w-4 h-4 text-primary" />
                            </button>
                            {isProfileImageModalOpen && <AddProfileImageModal onClose={() => setIsProfileImageModalOpen(false)} />}
                        </div>
                        <div className="flex flex-col items-start justify-start w-full gap-4 ">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-row gap-2">
                                    <span className="text-base font-bold font-Inter">
                                        Name :
                                    </span>
                                    <span className="text-base font-bold text-gray-400 font-Inter">
                                        {maskName(user?.first_name || '', user?.last_name || '')}
                                    </span>
                                </div>
                                <button
                                    className="flex items-center justify-center w-6 h-6 bg-white border border-blue-700 rounded-full"
                                    onClick={() => setShowNameModal(true)}
                                >
                                    <img
                                        className="w-4 h-4"
                                        src="/assets/Icons/freelancer/account/Union.png"
                                        alt="edit icon"
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-row gap-2">
                                    <span className="text-base font-bold font-Inter">
                                        Email :
                                    </span>
                                    <span className="text-base font-bold text-gray-400 font-Inter">
                                        {maskEmail(user.email || '')}
                                    </span>
                                </div>
                                <button
                                    className="flex items-center justify-center w-6 h-6 bg-white border border-blue-700 rounded-full"
                                    onClick={() => setShowEmailModal(true)}
                                >
                                    <img
                                        className="w-4 h-4"
                                        src="/assets/Icons/freelancer/account/Union.png"
                                        alt="edit icon"
                                    />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>


                <div className="flex flex-col items-start justify-start w-full gap-6 border border-gray-300 p-7 rounded-3xl">
                    <div className="flex items-center justify-between w-full">
                        <div className="text-2xl font-semibold font-Inter">Location</div>
                        <div className="relative w-6 h-6">
                            <div className="absolute w-6 h-6 bg-white border border-blue-700 rounded-full"></div>
                            <button
                                className="absolute flex items-center justify-center w-4 h-4 left-1 top-1"
                                onClick={() => setShowLocationModal(true)}
                            >
                                <img
                                    className="w-4 h-4"
                                    src="/assets/Icons/freelancer/account/Union.png"
                                    alt="edit icon"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div>
                            <span className="text-base font-bold text-gray-500 font-Inter">Country<br /></span>
                            <span className="text-base font-normal text-gray-500 font-Inter">{user.country || 'The country is not updated yet'}</span>
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-500 font-Inter">Time Zone<br /></span>
                            <span className="text-base font-normal text-gray-500 font-Inter">{user.time_zone || 'The time zone is not updated yet'}</span>
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-500 font-Inter">Address<br /></span>
                            {user?.meta_data?.address_line1 ?
                                <p className="text-base font-normal text-gray-500 font-Inter">
                                    {user?.meta_data?.address_line1}
                                    <br />
                                    {user?.meta_data?.address_line2}
                                    <br />
                                    {user?.meta_data?.address_line3}
                                </p>
                                :
                                <p className="text-base font-normal text-gray-500 font-Inter">
                                    The address is not updated yet
                                </p>
                            }

                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-500 font-Inter">Phone<br /></span>
                            <span className="text-base font-normal text-gray-500 font-Inter">{user.meta_data.phone || 'Phone'}</span>
                        </div>
                    </div>
                </div>

            </div>
            <NameModal
                user={user}
                show={showNameModal}
                onClose={() => setShowNameModal(false)}
            />
            <EmailModal
                user={user}
                show={showEmailModal}
                onClose={() => setShowEmailModal(false)}
            />
            <LocationInfoModal
                countryMap={countryMap}
                user={user}
                show={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                timeZoneOptions={timeZoneOptions}
            />
        </div>
    );
}
