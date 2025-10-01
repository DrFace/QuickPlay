import SwitchButton from "@/Components/elements/buttons/SwitchButton";
import React, { useState } from "react";
import TwoFactorModal from "../../../../Components/shared/partials/TwoFactorModal";
import { User } from "@/types";
import PasswordChangeModal from "@/Components/shared/partials/PasswordChangeModal";

export default function PasswordAndSecurity({ user }: { user: User }) {


    const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
    const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
    const [isActive, setIsActive] = useState(user?.two_factor_authentication || false);



    const handleToggle = () => {
        setIsActive((prevState: boolean) => !prevState);
        setShowTwoFactorModal(true);
    };

    return (
        <div className="w-full h-auto bg-white rounded-3xl">
            <div className="p-6 space-y-4 border border-gray-300 rounded-lg shadow-sm">
                <div className="text-lg font-semibold text-gray-900">
                    Authentication options
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900 text-m">Password</div>
                        <div className="relative w-6 h-6">
                            <div className="absolute w-6 h-6 bg-white border border-blue-700 rounded-full"></div>
                            <button
                                className="absolute flex items-center justify-center w-4 h-4 left-1 top-1"
                                onClick={() => setShowPasswordChangeModal(true)}
                            >
                                <img
                                    className="w-4 h-4"
                                    src="/assets/Icons/freelancer/account/Union.png"
                                    alt="edit icon"
                                />
                            </button>
                        </div>

                    </div>


                    <div className="flex items-center space-x-2">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            stroke="black"
                            strokeWidth="1.5"
                            className="w-4 h-4"
                        >
                            <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="font-semibold text-gray-900 text-m">
                            Password has been set
                        </p>
                    </div>

                    <p className="text-sm text-gray-500 px-7">
                        Choose a strong, unique password that's at least 8 characters long.
                    </p>
                </div>
            </div>



            <div className="p-6 mt-6 space-y-4 border border-gray-300 rounded-lg shadow-sm">
                <div className="text-lg font-semibold text-gray-900">
                    Two-step verification options
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                        Add an extra layer of security to block unauthorized access and protect your account.
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center sm:flex-row">
                            <div className="flex items-center space-x-2">
                                <p className="font-semibold text-gray-900 text-m">
                                    Authenticator app code
                                </p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                    stroke="blue"
                                    strokeWidth="1.5"
                                    className="w-4 h-4 ml-2 "
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <p className="flex text-sm font-medium text-green-500 sm:px-4 ">
                                (Recommended)
                            </p>
                        </div>
                        <div className="flex items-center">

                            <SwitchButton onChange={handleToggle} isChecked={isActive} className="" />

                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        Enter a code generated by our authenticator app to confirm it’s you.
                    </p>

                </div>
            </div>
            <PasswordChangeModal
                user={user}
                show={showPasswordChangeModal}
                onClose={() => setShowPasswordChangeModal(false)}
            />
            <TwoFactorModal
                user={user}
                show={showTwoFactorModal}
                onClose={() => setShowTwoFactorModal(false)}
            />
        </div>
    );
}
