import { usePage } from "@inertiajs/react";
import Header from "../Components/shared/Header";
import NewsLetter from "../Components/shared/NewsLetter";
import Footer from "../Components/shared/Footer";
import FlashAlerts from "../Components/elements/alerts/FlashAlerts";
import HeaderNew from "@/Components/shared/HeaderNew";
import FreelancerHeader from "@/Components/shared/FreelancerHeader";
// import ClientHeader from "@/Components/shared/ClientHeader";
import { PageProps } from "@/types";

export default function AppLayout(
    {
        children,
        isFooter = false,
        isHeader = true,
        isCustomHeader = false,
        isFreelancerHeader = false,
        isClientHeader = false,

    }: {
        children: React.ReactNode,
        isFooter?: boolean,
        isHeader?: boolean,
        isCustomHeader?: boolean,
        isFreelancerHeader?: boolean,
        isClientHeader?: boolean,
    }) {
    const appName = import.meta.env.VITE_APP_NAME || "Ai-geeks";
    const { flash, auth } = usePage<PageProps>().props;

    return (
        <div className="bg-white">
            {/* Client Header */}
            <Header appName={appName} />

            {/* Hero section */}
            <main className="-mt-30">{children}</main>

            {/* Footer */}
            {isFooter && <Footer />}

            {/* Flash messages */}
            <FlashAlerts flash={flash} />
        </div>
    );
}
