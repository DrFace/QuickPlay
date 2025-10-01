import AppLayout from "@/Layouts/AppLayout";
import { Head, usePage } from "@inertiajs/react";
import { Job, User } from "@/types";
import { useEffect, useState } from "react";
import JobPost from "./Partials/JobPost";
import Proposals from "./Partials/Proposals";
import HireProposals from "./Partials/HireProposals";

export default function ClientJobView({
    job,
    filters,
    user,
    proposals,
    hireProposals,
    chatProposals,
}: {
    job: Job;
    filters: any;
    user: User;
    proposals: any;
    hireProposals: any;
    chatProposals: any;
}) {
    const [selected, setSelected] = useState(1);

    useEffect(() => {
        const getParams = () => {
            const params = new URLSearchParams(window.location.search);
            if (params.has('proposal')) {
                setSelected(2);
            }
            else if (params.has('hire')) {
                setSelected(3);
            }
            else {
                setSelected(1);
            }
        }
        getParams();
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <AppLayout isClientHeader={true}  isHeader={false} isFooter={true} >
                <Head title="Job view" />
                <section className="flex justify-center min-h-screen px-4 py-20 mt-20 bg-white sm:px-6 lg:px-8 ">
                    <div className="container flex flex-col gap-4 mx-auto mt-8 text-center ">
                        <h1 className="text-2xl font-medium first-letter:capitalize text-start font-Inter ">{job?.data?.title}</h1>
                        {/* panel */}
                        <nav aria-label="Progress">
                            <ol role="list" className="border-2 border-gray-300 divide-y divide-gray-300 rounded-2xl md:flex md:divide-y-0">
                                <div className="relative md:flex md:flex-1">
                                    <button
                                        className={`flex items-center rounded-t-2xl sm:rounded-l-2xl w-full group ${selected === 1 ? 'bg-primary' : 'bg-white'} `}
                                        onClick={() => setSelected(1)}
                                    >
                                        <span className={"flex  w-full justify-center items-center px-6 py-6  text-sm font-medium"}>
                                            <span className={`text-sm font-medium   ${selected === 1 ? 'text-white' : 'text-gray-900'}`}>View Job Post</span>
                                        </span>
                                        {selected === 2 ? (
                                            <div aria-hidden="true" className="top-0 right-0 hidden w-4 h-full md:block">
                                                <img src="/assets/Icons/job/panel2.png" alt="Panel Icon" className="w-16 h-[68px]" />
                                            </div>
                                        ) : (
                                            <div aria-hidden="true" className="top-0 right-0 hidden w-4 h-full md:block">
                                                <img src="/assets/Icons/job/panel.png" alt="Panel Icon" className="w-16 h-[68px]" />
                                            </div>
                                        )
                                        }
                                    </button>
                                    <button className={`flex items-center  w-full group ${selected === 2 ? 'bg-primary' : 'bg-white'} `}
                                        onClick={() => setSelected(2)}
                                    >
                                        <span className={"flex  w-full justify-center items-center px-6 py-6  text-sm font-medium"}>
                                            <span className={`text-sm font-medium   ${selected === 2 ? 'text-white' : 'text-gray-900'}`}>Review Proposals ({proposals?.data?.length})</span>
                                        </span>
                                        {selected === 3 ? (
                                            <div aria-hidden="true" className="top-0 right-0 hidden w-4 h-full md:block">
                                                <img src="/assets/Icons/job/panel2.png" alt="Panel Icon" className="w-16 h-[68px]" />
                                            </div>
                                        ) : (
                                            <div aria-hidden="true" className="top-0 right-0 hidden w-4 h-full md:block">
                                                <img src="/assets/Icons/job/panel.png" alt="Panel Icon" className="w-16 h-[68px]" />
                                            </div>
                                        )
                                        }
                                    </button>
                                    <button className={`flex items-center rounded-b-2xl lg:rounded-bl-none  sm:rounded-r-2xl w-full group ${selected === 3 ? 'bg-primary' : 'bg-white'} `}
                                        onClick={() => setSelected(3)}
                                    >
                                        <span className={"flex  w-full justify-center items-center px-6 py-6  text-sm font-medium"}>
                                            <span className={`text-sm font-medium   ${selected === 3 ? 'text-white' : 'text-gray-900'}`}>Hire ({hireProposals?.data?.length})</span>
                                        </span>
                                    </button>
                                </div>
                            </ol>
                        </nav>

                        {/* view job post */}
                        {selected === 1 &&
                            <JobPost job={job?.data} user={user}/>
                        }

                        {/* review proposals */}
                        {selected === 2 &&
                            <Proposals filters={filters} proposals={proposals} job={job} chatProposals={chatProposals} />
                        }

                        {/* hire */}
                        {selected === 3 &&
                            <HireProposals filters={filters} proposals={hireProposals} job={job} />
                        }
                    </div>
                </section>
            </AppLayout>
        </>
    );
}
