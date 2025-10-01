import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import DescriptionWidget from "@/Components/shared/partials/DescriptionWidget";
import MilestoneTable from "./Partials/MilestoneTable";



export default function offerCreate({
    offer,
}: {
    offer: any;
}) {

    //console.log("offer", offer);
    return (
        <>
            <AppLayout isClientHeader={true} isHeader={false} isFooter={true} >
                <Head title="Offer View" />
                <section className="flex justify-center min-h-screen px-4 py-20 mt-20 sm:px-6 lg:px-8 ">
                    <div className="container flex flex-col gap-4 mx-auto item-center ">
                        <div className="mt-10 mb-8 text-3xl font-semibold text-black font-Inter">
                            <h1>Offer View</h1>
                        </div>

                        <div className="flex flex-col gap-6 lg:flex-row">
                            <div className="w-full bg-white lg:w-3/4">
                                <h2 className="mb-4 text-2xl font-semibold text-gray-800">Contract Terms</h2>

                                <div className="mb-6">

                                    <p className="text-xl font-semibold text-gray-900">Project Price: <span className="font-medium">$ {offer?.offer_price}</span></p>
                                    <p className="text-sm text-gray-500">This is the price you and {offer?.proposal?.freelancer?.first_name} have agreed upon</p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800">Contract Title</h3>
                                    <p className="mt-2 text-base font-semibold text-gray-700 font-Inter">{offer?.contract_title ?? 'Add a title for this contract'}</p>
                                </div>

                                <div className="mb-6">
                                    <DescriptionWidget
                                        description={offer?.contract_description}
                                        title="Description of the work"
                                        id={offer?.id}
                                        attachments={offer?.attachments}
                                    />
                                </div>
                                {offer?.payment_type === 'Milestone' && (
                                    <div className="flex flex-col gap-2 ">
                                        <div className="text-xl font-semibold text-black">Milestones</div>
                                        <MilestoneTable milestones={offer?.milestones}  status={true}  />
                                    </div>
                                )}

                                <div className="flex w-full px-4 py-10 mt-4 border-t-2">
                                    {offer && offer?.status === 'pending' && (
                                        <div className="flex flex-col items-center w-full gap-4 p-4 text-center bg-green-300 border-2 rounded-2xl">
                                            <span className="text-lg">Your offer has been sent to the freelancer, please wait for their response</span>
                                        </div>
                                    )}
                                    {offer && (offer?.status === 'accepted' || offer?.status === 'completed') && (
                                        <div className="flex flex-row justify-end w-full gap-4">
                                            <div className="">
                                                <Link
                                                    href={route('client.contracts.show', offer?.id)}
                                                    className="flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-white border border-transparent rounded-3xl bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                                >
                                                    View Contract
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                    {offer && offer?.status === 'rejected' && (
                                        <div className="flex flex-col items-center w-full gap-4 p-4 text-center bg-red-300 border-2 rounded-2xl">
                                            <span className="text-lg">Sorry, your offer has been rejected by the freelancer, Payment has been refunded to your stripe account and will be available in 5-7 days</span>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </AppLayout>
        </>
    );
}
