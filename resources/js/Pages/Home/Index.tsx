import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import HeroSection from "./Partials/HeroSection";
import MiddleSection from "./Partials/MiddleSection";
import CookieConsent from 'react-cookie-consent';


export default function Home({
    homeHero,
}: {

    homeHero: any;
}) {

    const handleAccept = () => {
       // console.log("Cookies accepted");
        // Add any logic you want to execute after acceptance, like initializing analytics
    };

    const handleDecline = () => {
      //  console.log("Cookies declined");
    }

    return (
        <>
            <AppLayout>
                <Head title="Home" />
                <div className="px-10 pt-20 bg-white sm:px-0">
                    <HeroSection />
                    <MiddleSection />
                </div>
                <CookieConsent
                    location="bottom"
                    buttonText="Accept all cookies"
                    declineButtonText="Decline"
                    enableDeclineButton
                    cookieName="cookieConsent"
                    style={{ background: "#151c2e" , color: "#dde1eb", fontSize: "15px", fontFamily: "Arial, sans-serif" ,height: "auto", padding: "20px 20px" }}
                    buttonStyle={{ color: "#dde1eb", fontSize: "13px", fontWeight: "bold", fontFamily: "Arial, sans-serif", background: "#072469", padding: "10px 20px", borderRadius: "10px" }}
                    declineButtonStyle={{ color: "#dde1eb", fontSize: "13px", fontWeight: "bold", fontFamily: "Arial, sans-serif", background: "#f44336", padding: "10px 20px", borderRadius: "10px" }}
                    expires={150}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                >
                    By clicking “Accept all cookies”, you agree ai-geeks can store cookies on your device and disclose information in accordance with our <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/privacy-policy" className="text-blue-600 underline">
                        Privacy Policy
                    </a>.
                </CookieConsent>
            </AppLayout>

        </>
    );
}
