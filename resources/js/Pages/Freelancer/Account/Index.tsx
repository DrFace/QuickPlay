import AppLayout from "@/Layouts/AppLayout";
import { User } from "@/types";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import MembershipCredits from "./Partials/MembershipCredits";
import ContactInfo from "./Partials/ContactInfo";
import ProfileSettings from "./Partials/ProfileSettings";
import GetPaid from "./Partials/GetPaid";
import PasswordAndSecurity from "./Partials/Password&Security";

export default function AccountSettings({
    user,
    countryMap,
    skillsOptions,
    timeZoneOptions,
    jobCategories,
    credits,
    jobSkills,
    bankNames,
    bankAddress,
    paymentMethod
}: {
    user: User;
    countryMap: { label: string; value: string }[];
    skillsOptions: { label: string; value: string }[];
    jobCategories: { label: string; value: string }[];
    timeZoneOptions: { label: string; value: string }[];
    credits: any;
    jobSkills: any;
    bankNames: { label: string; value: string }[];
    bankAddress: { label: string; value: string }[];
    paymentMethod: any;
}) {
    const [selectedMainTab, setSelectedMainTab] = useState("User Settings");
    const [selectedSubTab, setSelectedSubTab] = useState("Membership & Credits");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const storedTab = localStorage.getItem("selectedSubTab");

        if (storedTab) {
            setSelectedSubTab(storedTab);
        } else if (params.has("subTab")) {
            setSelectedSubTab(params.get("subTab") || "Membership & Credits");
        } else {
            setSelectedSubTab("Membership & Credits");
        }

        window.scrollTo(0, 0);
    }, []);

    // Handle sub-tab changes and store the selected tab in localStorage
    const handleSubTabChange = (subTab: string) => {
        setSelectedSubTab(subTab);
        localStorage.setItem("selectedSubTab", subTab); // Store the selected tab in localStorage

        // Update the URL query parameter without a full page reload
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("subTab", subTab);
        window.history.pushState({}, "", currentUrl.toString());
    };

    const renderContent = () => {
        switch (selectedSubTab) {
            case "Membership & Credits":
                return (
                    <>
                        <div className="mt-10 mb-8 text-3xl font-semibold text-black sm:mt-20 sm:text-4xl">
                            {selectedSubTab}
                        </div>
                        <MembershipCredits user={user} credits={credits} />
                    </>
                );
            case "Contact Info":
                return (
                    <>
                        <div className="mt-10 mb-8 text-3xl font-semibold text-black sm:mt-20 sm:text-4xl">
                            {selectedSubTab}
                        </div>
                        <ContactInfo user={user} countryMap={countryMap} timeZoneOptions={timeZoneOptions} />
                    </>
                );
            case "Profile Settings":
                return (
                    <>
                        <div className="mt-10 mb-8 text-3xl font-semibold text-black sm:mt-20 sm:text-4xl">
                            {selectedSubTab}
                        </div>
                        <ProfileSettings user={user} jobCategories={jobCategories} skillsOptions={skillsOptions} jobSkills={jobSkills} />
                    </>
                );
            case "Get Paid":
                return (
                    <>
                        <div className="mt-10 mb-8 text-3xl font-semibold text-black sm:mt-20 sm:text-4xl">
                            {selectedSubTab}
                        </div>
                        <GetPaid bankNames={bankNames} countryMap={countryMap} bankAddress={bankAddress} paymentMethod={paymentMethod} />
                    </>
                );
            case "Password & Security":
                return (
                    <>
                        <div className="mt-10 mb-8 text-3xl font-semibold text-black sm:mt-20 sm:text-4xl">
                            {selectedSubTab}
                        </div>
                        <PasswordAndSecurity user={user} />
                    </>
                );
            default:
                return <div>Select a tab to view details.</div>;
        }
    };

    const mainTabs = [
        {
            title: "User Settings",
            subTabs: [
                "Membership & Credits",
                "Contact Info",
                "Profile Settings",
                "Get Paid",
                "Password & Security",
            ],
        },
    ];

    return (
        <AppLayout isFreelancerHeader={true} isHeader={false}>
            <Head title="Settings" />
            <div className="relative min-h-screen p-4 mx-auto mt-20 space-y-8 bg-white sm:p-8 max-w-7xl">
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full mt-0 sm:mt-8 md:w-1/2 lg:w-1/4">
                        <div className="mt-20 mb-4 text-3xl font-semibold text-black sm:text-4xl sm:mb-8 font-Inter">
                            Settings
                        </div>
                        <ul className="ml-10 space-y-1 sm:ml-5">
                            {mainTabs.map((mainTab) => (
                                <li key={mainTab.title}>
                                    <div
                                        className={`cursor-pointer text-xl font-medium ${selectedMainTab === mainTab.title ? "text-black" : "text-gray-500"
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
                                                className={`cursor-pointer text-lg sm:text-base pl-4 border-l-2 ${selectedSubTab === subTab
                                                        ? "text-blue-800 border-blue-800"
                                                        : "text-gray-500 border-gray-300"
                                                    }`}
                                                onClick={() => handleSubTabChange(subTab)}
                                            >
                                                {subTab}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-full sm:mt-8 lg:w-3/4">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
