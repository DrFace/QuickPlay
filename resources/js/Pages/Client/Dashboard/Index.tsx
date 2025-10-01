import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";


export default function ClientDashboard({

}: {

    }) {

    return (
        <>
            <AppLayout isClientHeader={false} isHeader={true} isFooter={false} >
                <Head title="Client" />
                <div className="px-10 bg-white sm:px-0">
                    {/* <HeroSection />
                    <MiddleSection/> */}
                    <div className="container justify-center min-h-screen mx-auto mt-20 text-center text-black bg-white ">
                            hi hi
                    </div>
                </div>
            </AppLayout>


        </>
    );
}
