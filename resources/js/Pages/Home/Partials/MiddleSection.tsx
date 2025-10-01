import React from "react";
import { Link } from "@inertiajs/react";

const MiddleSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto space-y-20">
                <div className="flex flex-col gap-5 lg:flex-row sm:justify-center">
                    {/* Left section */}
                    {/* <div className="w-auto">
                        <img src="/assets/home/cart2.jpg" alt="Business illustration" className="h-auto rounded-md shadow-lg " />
                    </div> */}
                    {/* Right section */}
                    <div className="flex-1 space-y-6">
                        {/* <h2 className="text-3xl font-normal text-black font-Kanit lg:text-4xl">Enhance Your Business Effortlessly</h2>
                        <ul className="space-y-4 text-gray-700 text-md font-Inter">
                            <li className="flex items-start">
                                <img src="/assets/Icons/home/join.png" alt="Join for Free" className="w-6 h-6 mt-1 mr-2" />
                                <div>
                                    <span className="text-lg font-semibold text-black">Join for Free</span><br />
                                    Sign up to connect with professionals, explore projects, and book consultations—all without any cost.
                                </div>
                            </li>
                            <li className="flex items-start">
                                <img src="/assets/Icons/home/find.png" alt="Post Jobs and Hire Elite Talent" className="w-6 h-6 mt-1 mr-2" />
                                <div>
                                    <span className="text-lg font-semibold text-black">Post Jobs and Hire Elite Talent</span><br />
                                    Simplify the hiring process. Post a job or let us help you find the perfect match for your needs.
                                </div>
                            </li>
                            <li className="flex items-start">
                                <img src="/assets/Icons/home/best.png" alt="Top Quality at Affordable Rates" className="w-6 h-6 mt-1 mr-2" />
                                <div>
                                    <span className="text-lg font-semibold text-black">Top Quality at Affordable Rates</span><br />
                                    Collaborate with top-tier talent without straining your budget. Benefit from our low transaction fees and boost your productivity.
                                </div>
                            </li>
                        </ul> */}
                        <div className="flex flex-col items-center justify-end w-full gap-4 md:flex-row lg:justify-start">
                            {/* <Link href="/register" className="px-8 py-3 text-white rounded-full font-Inter bg-primaryBtnColor hover:bg-primaryBtnColorHover">Sign up for free</Link> */}
                            {/* <Link href="/learn-more" className="px-8 py-3 bg-transparent border rounded-full text-primaryBtnColor border-primaryBtnColor font-Inter">Learn how to hire</Link> */}
                        </div>
                    </div>

                </div>

                {/* <div className="flex flex-col mt-16 lg:flex-row ">
                    <div className="w-full lg:w-1/2">
                        <img src="/assets/home/cart1.jpg" alt="Talent" className="object-cover w-full h-full shadow-lg lg:rounded-s-xl" />
                    </div>

                    <div className="flex flex-col justify-between w-full h-auto p-8 text-white shadow-xl lg:w-1/2 bg-cardColor lg:rounded-e-xl">
                        <div className="flex-col space-y-4 2xl:space-y-7 items-left">
                            <span className="text-2xl font-semibold font-Inter">For talent</span><br />
                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-Kanit ">Discover Exciting Opportunities</h1>
                            <p className="text-lg font-normal text-borderColor font-Inter">Connect with clients who inspire you and elevate your career or business to new heights.</p>
                        </div>
                        <div className="mt-8 2xl:space-y-8 ">
                            <div className="flex flex-row gap-6 pt-5 text-sm border-t sm:text-lg border-borderColor">
                                <p className="w-1/3 ">Find opportunities for every stage of your career</p>
                                <p className="w-1/3 ">Flexibility in how, when, and where you work</p>
                                <p className="w-1/3 ">Explore various ways to earn</p>
                            </div>
                            <div className="flex w-full ">
                                <Link href={route("freelancer.dashboard")} className="px-6 py-2 mt-4 bg-white rounded-full text-primary ">Find opportunities</Link>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="flex flex-col gap-5 lg:flex-row sm:justify-center">
                    {/* Left section */}
                    {/* <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-normal text-black font-Kanit lg:text-6xl">Why Businesses Choose AI Geeks</h2>
                        <ul className="space-y-4 text-gray-700 text-md font-Inter">
                            <li className="flex items-start">
                                <img src="/assets/Icons/home/quality.png" alt="Join for Free" className="w-6 h-6 mt-1 mr-2" />
                                <div>
                                    <span className="text-lg font-semibold text-black">Verified Quality</span><br />
                                    Review professional work samples, client feedback, and identity verification to ensure top-notch talent.
                                </div>
                            </li>
                            <li className="flex items-start">
                                <img src="/assets/Icons/home/hire.png" alt="Post Jobs and Hire Elite Talent" className="w-6 h-6 mt-1 mr-2" />
                                <div>
                                    <span className="text-lg font-semibold text-black">Confident Hiring</span><br />
                                    Conduct interviews, discuss rates, and pay only for the work you approve.
                                </div>
                            </li>
                            <li className="flex items-start">
                                <img src="/assets/Icons/home/lock.png" alt="Top Quality at Affordable Rates" className="w-6 h-6 mt-1 mr-2" />
                                <div>
                                    <span className="text-lg font-semibold text-black">Secure and Reliable</span><br />
                                    Trust us to safeguard your data and privacy. Our 24/7 support ensures peace of mind.
                                </div>
                            </li>
                        </ul>

                    </div> */}
                    {/* Right section */}
                    <div className="w-auto">
                        {/* <img src="/assets/home/cart3.jpg" alt="Business illustration" className="h-auto rounded-md shadow-lg " /> */}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MiddleSection;
