import { useState } from 'react';
import { User } from '@/types';
import EmailModal from '@/Components/shared/partials/EmailModal';
import LocationInfoModal from '@/Components/shared/partials/LocationInfoModal';
import NameModal from '@/Components/shared/partials/NameModal';

export default function ContactInfo(
    {
        user,
        countryMap,
        timeZoneOptions,
    }: {
        user: User,
        countryMap: { label: string; value: string }[],
        timeZoneOptions: { label: string; value: string }[],
    }) {
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showNameModal, setShowNameModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

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
                <div className="flex flex-col items-start justify-start w-full gap-6 border border-gray-300 p-7 rounded-3xl">
                    <div className="flex items-center justify-between w-full">
                        <div className="text-2xl font-semibold font-Inter">Account</div>
                    </div>
                    <div className="flex flex-row items-start w-full gap-6">
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
                                <div className=''>
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
                            <span className="text-base font-normal text-gray-500 font-Inter">{user?.country || 'The country is not updated yet'}</span>
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-500 font-Inter">Time Zone<br /></span>
                            <span className="text-base font-normal text-gray-500 font-Inter">{user?.time_zone || 'The time zone is not updated yet'}</span>
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
                            <span className="text-base font-normal text-gray-500 font-Inter">{user?.meta_data?.phone || 'The phone number is not updated yet'}</span>
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
