import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect } from "react";

export default function ClientDashboard({ user }: { user: any }) {

    useEffect(() => {
        // Redirect to the Home page when this page loads
        router.visit(route("home")); // Assuming you have a route named 'home'
    }, []);

    return (
        <AppLayout isClientHeader={false} isHeader={true} isFooter={false}>
            <Head title="Client" />
            {/* <section className="flex items-center justify-center min-h-screen px-4 py-20 mt-20 bg-white sm:px-6 lg:px-8 bg-client-home-pattern">
                <div className="container flex flex-col items-center gap-10 mx-auto text-center lg:flex-row lg:items-start lg:justify-between">
                    <div className="relative space-y-4 text-left lg:w-1/2">
                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primaryBgColor">
                            <img src="/assets/Icons/client/logoIcon.png" alt="Hero Icon" className="w-24 h-24" />
                        </div>
                        <div className="space-y-4">
                            <p className="text-5xl font-normal text-black md:text-5xl font-Kanit lg:text-5xl xl:text-6xl 2xl:text-6xl">
                                Welcome, <span className="font-semibold">{user?.first_name}</span>! <br />
                                Let’s start with your <br /> first job post.
                            </p>
                            <p className="font-semibold sm:text-xl font-Inter text-textSecondary">
                                It’s the fastest way to meet top talent.<br />
                                Get help from AI and be done in no time
                            </p>
                            <Link href={route("client.job.create")} className="inline-block px-8 py-3 font-medium text-white rounded-full text-md bg-primaryBtnColor font-Inter hover:bg-primaryBtnColorHover">
                                Get started
                            </Link>
                        </div>
                    </div>
                    <div className="items-center justify-center hidden mt-5 lg:flex lg:mt-0 lg:w-1/2">
                        <img src="/assets/home/client_hero.png" alt="Hero" className="w-full h-auto max-h-[478px] max-w-[501px] mx-auto" />
                    </div>
                </div>
            </section> */}
        </AppLayout>
    );
}
