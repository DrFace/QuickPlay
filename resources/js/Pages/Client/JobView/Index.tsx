import AppLayout from "@/Layouts/AppLayout";
import { Head, usePage } from "@inertiajs/react";
import { Job, User } from "@/types";
import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";

const fillColorArray = [
    "#f16a45",
    "#f17a45",
    "#f19745",
    "#f19745",
    "#f1a545",
    "#f1a545",
    "#f1b345",
    "#f1b345",
    "#f1d045",
    "#f1d045",
];


export default function JobView({
    user,
    job,
}: {
    user: User;
    job: Job;
}) {
    const [copied, setCopied] = React.useState(false);
    const jobUrl = job?.public_url;

    React.useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (copied) {
            timeout = setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
        return () => {
            clearTimeout(timeout);
        };
    },
        [copied]
    );

    return (
        <>
            <AppLayout isClientHeader={true} isHeader={false} isFooter={true} >
                <Head title="Job view" />
                <section className="flex justify-center min-h-screen px-4 py-20 mt-20 bg-white sm:px-6 lg:px-8 ">
                    <div className="container flex flex-col gap-4 mx-auto mt-8 text-center ">
                        <h1 className="text-2xl font-medium first-letter:capitalize text-start font-Inter ">{job.title}</h1>

                        <div className="flex flex-col w-full border border-gray-400 sm:flex-row rounded-2xl">
                            <div className="p-6 sm:w-3/4">
                                <div className="py-8 text-textSecondary">
                                    <h2 className="text-base font-normal text-start font-Inter ">Posted {job?.created_at_human_ago}</h2>
                                </div>
                                <div className="py-8 border-y border-borderColor">
                                    <p className="text-sm font-normal sm:text-base text-start font-Inter ">
                                        {job?.description}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-6 py-8 sm:flex-row">
                                    <div className="flex flex-row gap-3 sm:w-1/3 ">
                                        <div className="flex flex-row w-8">
                                            <img src="/assets/Icons/job/calendar.png" alt="attachment" className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-base font-medium text-start font-Inter ">{job.scope_duration}</p>
                                            <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Project Length</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-3 sm:w-1/3 ">
                                        <div className="flex flex-row w-8">
                                            <img src="/assets/Icons/job/cash.png" alt="attachment" className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-base font-medium text-start font-Inter ">{job?.scope_experience}</p>
                                            <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Looking for substantial experience in this field</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-3 sm:w-1/3 ">
                                        <div className="flex flex-row w-8">
                                            <img src="/assets/Icons/job/cash1.png" alt="attachment" className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-base font-medium text-start font-Inter">£ {parseFloat(job.budget).toFixed(2)}</p>
                                            <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Fixed price</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-8 text-textSecondary border-y border-borderColor">
                                    <h2 className="text-base font-normal text-start font-Inter "><span className="text-black">Project type:</span> Ongoing project</h2>
                                </div>
                                <div className="py-8 space-y-3 text-black border-b border-borderColor">
                                    <h2 className="text-xl font-semibold text-start font-Inter ">Skills and Expertise</h2>
                                    <div className="flex flex-row gap-3">
                                        {Array.isArray(job?.skills) ? (
                                            job.skills.map((skill: string, index: number) => (
                                                <p key={index} className="px-3 py-2 text-sm font-medium capitalize bg-gray-300 text-textSecondary rounded-3xl text-start font-Inter">
                                                    {skill}
                                                </p>
                                            ))
                                        ) : (
                                            <p>No skills available</p>
                                        )}
                                    </div>

                                </div>
                                <div className="py-8 space-y-3 text-black ">
                                    <h2 className="text-xl font-semibold text-start font-Inter ">Activity on this job</h2>
                                    <div className="flex flex-col gap-3">
                                        <p className="text-sm font-medium text-textSecondary text-start font-Inter">Proposals : {job.proposal_count}</p>
                                        <p className="text-sm font-medium text-textSecondary text-start font-Inter">Interviewing : 1</p>
                                    </div>
                                </div>
                            </div>
                            <div className="gap-16 px-6 py-8 sm:w-1/4 sm:border-l" >

                                <div>
                                    <div className="flex flex-col gap-3 py-8">
                                        <h2 className="text-xl font-semibold text-start font-Inter ">About the client</h2>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-row gap-1">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.00264 1.50049C4.41779 1.50049 1.50122 4.41706 1.50122 8.0019C1.50122 11.5867 4.41779 14.5033 8.00264 14.5033C11.5875 14.5033 14.5041 11.5867 14.5041 8.0019C14.5041 4.41706 11.5875 1.50049 8.00264 1.50049ZM11.3862 5.82299L7.18527 10.8241C7.13919 10.879 7.08185 10.9233 7.01714 10.9541C6.95242 10.9849 6.88185 11.0014 6.81019 11.0026H6.80175C6.73165 11.0025 6.66234 10.9878 6.59832 10.9592C6.53429 10.9307 6.47698 10.889 6.43011 10.8369L4.62971 8.83646C4.58399 8.78797 4.54842 8.73082 4.5251 8.66838C4.50178 8.60594 4.49117 8.53947 4.49391 8.47288C4.49664 8.40628 4.51266 8.3409 4.54102 8.28058C4.56938 8.22027 4.60951 8.16623 4.65906 8.12164C4.7086 8.07706 4.76656 8.04282 4.82952 8.02096C4.89248 7.99909 4.95918 7.99003 5.0257 7.99431C5.09221 7.99859 5.1572 8.01612 5.21684 8.04587C5.27648 8.07562 5.32958 8.117 5.373 8.16757L6.78862 9.74041L10.6204 5.17973C10.7063 5.08036 10.8279 5.0188 10.9589 5.00836C11.0899 4.99793 11.2197 5.03945 11.3203 5.12395C11.4209 5.20846 11.4842 5.32916 11.4965 5.45997C11.5089 5.59078 11.4692 5.72118 11.3862 5.82299Z" fill="#004AAD" />
                                                </svg>
                                                <p className="text-xs font-medium text-textSecondary text-start font-Inter ">Payment verified</p>
                                            </div>
                                            <div className="flex flex-row items-center justify-start gap-1 ">
                                                <Rating
                                                    initialValue={4.5}
                                                    readonly
                                                    transition
                                                    allowFraction
                                                    fillColorArray={fillColorArray}
                                                    iconsCount={5}
                                                    size={20}
                                                    emptyStyle={{ display: "flex" }}
                                                    fillStyle={{
                                                        display: "-webkit-inline-box",
                                                    }}
                                                />
                                                <span className="mt-1.5 text-xs font-medium text-textSecondary text-start font-Inter ">
                                                    4.5
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-textSecondary text-start font-Inter ">4.5 of 33 reviews</p>
                                            </div>

                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-semibold text-textSecondary text-start font-Inter ">United Kingdom</p>
                                            <p className="text-xs font-normal text-textSecondary text-start font-Inter ">London 10:09 AM</p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-semibold text-textSecondary text-start font-Inter ">52 jobs posted</p>
                                            <p className="text-xs font-normal text-textSecondary text-start font-Inter ">85% hire rate, 1 open job</p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-semibold text-textSecondary text-start font-Inter ">$2.1k total spent</p>
                                            <p className="text-xs font-normal text-textSecondary text-start font-Inter ">48 hires, 2 active</p>
                                        </div>
                                        <div className="flex flex-row gap-1">
                                            <p className="text-xs font-normal text-textSecondary text-start font-Inter ">Member since {job?.client.created_at_human}</p>
                                        </div>

                                    </div>
                                    <div className="flex flex-col gap-3 py-8">
                                        <h2 className="text-xl font-semibold text-start font-Inter ">Job Link</h2>
                                        <div className="flex flex-row gap-1 px-4 py-3 bg-gray-200 rounded-3xl">
                                            <p className="w-full overflow-hidden text-base font-normal text-textSecondary text-start font-Inter">{jobUrl}</p>
                                        </div>
                                        <button className="flex flex-row items-center w-auto gap-2 font-bold cursor-pointer text-primary text-start font-Inter hover:underline"
                                            onClick={() => navigator.clipboard.writeText(jobUrl)
                                                .then(() => setCopied(true))}>
                                            {copied ? (
                                                <p>Copied</p>
                                            ) : (
                                                <p>Copy Link</p>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </AppLayout>
        </>
    );
}
