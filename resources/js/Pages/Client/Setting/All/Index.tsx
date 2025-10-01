import AppLayout from "@/Layouts/AppLayout";
import { User } from "@/types";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import MyInfo from "./Partials/MyInfo";
import PasswordAndSecurity from "./Partials/Password&Security";
import IdentityVerification from "./Partials/IdentityVerification";


export default function Settings(
    {   user,
        status,
        rejectReason,
        selectedTab,
        countryMap,
        timeZoneOptions,
    }: {
        user: User;
        status: string;
        rejectReason: string;
        selectedTab: string;
        countryMap: { label: string; value: string }[];
        timeZoneOptions: { label: string; value: string }[];
    },

) {
    const [selectedMainTab, setSelectedMainTab] = useState("Settings");
    const [selectedSubTab, setSelectedSubTab] = useState(selectedTab);

    const renderContent = () => {
        switch (selectedSubTab) {

            case "My Info":
                return (
                    <>
                       <div className="mt-10 mb-8 text-3xl font-semibold text-black sm:mt-20 sm:text-4xl">
                            {selectedSubTab}
                        </div>
                        <MyInfo user={user} countryMap={countryMap} timeZoneOptions={timeZoneOptions}/>
                    </>
                );

                case "Password & Security":
                    return (
                        <>
                            <div className="mt-10 mb-8 text-3xl font-semibold text-black sm:mt-20 sm:text-4xl">
                            {selectedSubTab}
                        </div>
                        <PasswordAndSecurity user={{
                            ...user,

                        }} />
                        </>
                    );

                case "Identity Verification":
                return (
                    <>
                        <div className="mt-10 mb-8 text-3xl font-semibold text-black sm:mt-20 sm:text-4xl">
                            {selectedSubTab}
                        </div>
                        <IdentityVerification user={user} status={status} rejectReason={rejectReason}/>
                    </>
                );

            case "Notification Settings":
                return (
                    <>
                        <div className="mt-10 mb-8 text-3xl font-semibold text-black sm:mt-20 sm:text-4xl">
                            {selectedSubTab}
                        </div>
                    </>
                );

            default:
                return <div>Select a tab to view details.</div>;
        }
    };

    const mainTabs = [
        {
            title: "",
            subTabs: [
                "My Info",
                "Password & Security",
                "Identity Verification",
            ],
        },
    ];

    return (
        <AppLayout isClientHeader={true} isHeader={false}>
            <Head title="Settings" />
            <div className="relative min-h-screen p-4 mx-auto mt-20 space-y-8 bg-white sm:p-8 sm:mt-20 max-w-7xl">
                <div className="flex flex-col sm:flex-row">
                    {/* Left Side (Main Tabs and Sub-Tabs) */}
                    <div className="w-full sm:w-1/4">
                        <div className="mt-20 mb-4 text-3xl font-semibold text-black sm:text-4xl sm:mb-8 font-Inter">
                            Settings
                        </div>
                        <ul className="ml-10 space-y-1 sm:ml-5">
                            {mainTabs.map((mainTab) => (
                                <li key={mainTab.title}>
                                    <div
                                        className={`cursor-pointer text-xl font-medium ${
                                            selectedMainTab === mainTab.title ? "text-black" : "text-gray-500"
                                        }`}
                                        onClick={() => {
                                            setSelectedMainTab(mainTab.title);
                                            setSelectedSubTab(mainTab.subTabs[0]); // Automatically select the first sub-tab
                                        }}
                                    >
                                        {mainTab.title}
                                    </div>
                                    <ul className="mt-2">
                                        {mainTab.subTabs.map((subTab) => (
                                            <li
                                                key={subTab}
                                                className={`cursor-pointer text-lg pl-4 border-l-2 ${
                                                    selectedSubTab === subTab
                                                        ? "text-blue-800 border-blue-800"
                                                        : "text-gray-500 border-gray-300"
                                                }`}
                                                onClick={() => {
                                                    setSelectedMainTab(mainTab.title);
                                                    setSelectedSubTab(subTab);
                                                }}
                                            >
                                                {subTab}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Side (Content) */}
                    <div className="w-full mt-8 sm:w-3/4 sm:mt-0">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
