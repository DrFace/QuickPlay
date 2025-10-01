


import React, { FormEventHandler, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Checkbox from "@/Components/elements/inputs/Checkbox";


export default function FinanceManage(
    {
        inProgressProject,
        inProgressMilestone,

        inReviewProject,
        inReviewMilestone,

        pendingProjectPayment,
        pendingMilestonePayment,

        availablePayment,
        userPaymentMethods,
    }: {
        inProgressProject: any;
        inProgressMilestone: any;

        inReviewProject: any;
        inReviewMilestone: any;

        pendingProjectPayment: any;
        pendingMilestonePayment: any;

        availablePayment: any;
        userPaymentMethods: any;
    }) {

    const [activeSection, setActiveSection] = useState<string>("workInProgress");
    const [selectedDataArray, setSelectedDataArray] = useState<any[]>(inProgressProject);
    const [selectedType, setSelectedType] = useState<string>("fixed");

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { data, setData, post, errors, progress, reset } = useForm({
        selected_array: selectedIds,
        selected_bank: selectedBankId,
    });

   // console.log("userPaymentMethods", userPaymentMethods);

    const handleSelectType = (type: string) => {
        setSelectedType(type);
        if (activeSection === "workInProgress") {
            if (type === "milestone") {
                setSelectedDataArray(inProgressMilestone)
            }
            if (type === "fixed") {
                setSelectedDataArray(inProgressProject)
            }
        } else if (activeSection === "inReview") {
            if (type === "milestone") {
                setSelectedDataArray(inReviewMilestone)
            }
            if (type === "fixed") {
                setSelectedDataArray(inReviewProject)
            }
        } else if (activeSection === "pending") {
            if (type === "milestone") {
                setSelectedDataArray(pendingMilestonePayment)
            }
            if (type === "fixed") {
                setSelectedDataArray(pendingProjectPayment)
            }
        } else if (activeSection === "available") {
            if (type === "milestone") {
                setSelectedDataArray([])
            }
            if (type === "fixed") {
                setSelectedDataArray([])
            }
        }
    };


    const progressPriceCount = () => {
        let count = 0;
        inProgressProject.forEach((data: any) => {
            count += Number(data?.offer_price) || 0;
        });
        inProgressMilestone.forEach((data: any) => {
            count += Number(data?.offer?.offer_price) || 0;
        });
        return count?.toFixed(2);
    };

    const inReviewPriceCount = () => {
        let count = 0;
        inReviewProject?.forEach((data: any) => {
            count += Number(data?.amount) || 0;
        });
        inReviewMilestone?.forEach((data: any) => {
            count += Number(data?.amount) || 0;
        });
        return count?.toFixed(2);
    }


    const pendingPriceCount = () => {
        let count = 0;
        pendingProjectPayment?.forEach((data: any) => {
            count += Number(data?.amount) || 0;
        });
        pendingMilestonePayment?.forEach((data: any) => {
            count += Number(data?.amount) || 0;
        });
        return count?.toFixed(2);
    }

    const availablePriceCount = () => {
        let count = 0;
        availablePayment?.forEach((data: any) => {
            count += Number(data?.amount) || 0;
        });
        return count?.toFixed(2);
    }
    const availableReceivePriceCount = () => {
        let count = 0;
        availablePayment?.forEach((data: any) => {
            count += Number(data?.received_amount) || 0;
        });
        return count?.toFixed(2);
    }


    const sections = [
        {
            label: 'Work in progress',
            value: `$${progressPriceCount()}`,
            key: 'workInProgress'
        },
        {
            label: 'In review',
            value: `$${inReviewPriceCount()}`,
            key: 'inReview'
        },
        {
            label: 'Pending',
            value: `$${pendingPriceCount()}`,
            key: 'pending'
        },
        {
            label: 'Available',
            value: `$${availablePriceCount()}`,
            key: 'available'
        },
    ];

    const handleSectionClick = (section: string) => {
        setActiveSection(section);
          setSelectedType("fixed");

        if (section === "workInProgress") {
                setSelectedDataArray(inProgressProject)
            }
        else if (section === "inReview") {
                setSelectedDataArray(inReviewProject)
        }
        else if (section === "pending") {
                setSelectedDataArray(pendingProjectPayment)
        }


    };


    const [selectedIndex, setSelectedIndex] = useState(0);


    const handleNext = () => {
        if (selectedIndex < sections.length - 1) {
            const newIndex = selectedIndex + 1;
            setSelectedIndex(newIndex);
            handleSectionClick(sections[newIndex].key);
        }
    };

    const handlePrevious = () => {
        if (selectedIndex > 0) {
            const newIndex = selectedIndex - 1;
            setSelectedIndex(newIndex);
            handleSectionClick(sections[newIndex].key);
        }
    };

    const handleBankSelect = (id: number) => {
        if (selectedBankId === id) {
            setSelectedBankId(null);
        }
        else {
            setSelectedBankId(id);
        }
        setIsModalOpen(false); // Close the modal after selection
        setData({
            selected_array: selectedIds,
            selected_bank: id,
        });
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    const handleCheckboxChange = (id: number, amount: number, isChecked: boolean) => {
        if (isChecked) {
            setSelectedIds((prev) => [...prev, id]);
            setTotalAmount((prev) => prev + amount);
            setData({
                selected_array: [...selectedIds, id],
                selected_bank: selectedBankId,
            });
        } else {
            setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
            setTotalAmount((prev) => prev - amount);
            setData({
                selected_array: selectedIds.filter((selectedId) => selectedId !== id),
                selected_bank: selectedBankId,
            });
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (selectedIds?.length === 0) {
            setErrorMessage("You must select at least one transaction to proceed");
            return;
        }
        if (!selectedBankId) {
            setErrorMessage("You must select a bank to proceed");
            return;
        }

        post(route('freelancer.requestPayment'),
            {
                preserveScroll: true,
                onSuccess: () => {

                },
                onError: (e) => {

                },
            }
        )
    }


   // console.log('inProgressProject', inProgressProject);
   // console.log('inProgressMilestone', inProgressMilestone);

 //   console.log('inReviewProject', inReviewProject);
   // console.log('inReviewMilestone', inReviewMilestone);

    return (
        <AppLayout isFreelancerHeader={true} isHeader={false}>
            <Head title="Financial Overview" />
            <div className="relative min-h-screen p-4 mx-auto mt-20 space-y-8 bg-white sm:p-8 max-w-7xl">
                <div className="mt-20 mb-4 text-3xl font-semibold text-black sm:text-4xl sm:mb-8">Overview</div>
                <div className="border-b border-gray-400">
                    <div className="flex-col items-center justify-between hidden w-full gap-4 pt-3 sm:flex sm:flex-row lg:w-2/3">
                        {sections?.map((section, index) => (
                            <div key={index} className="relative flex flex-col items-start justify-start w-full space-y-1 ">
                                <div className={`flex flex-col w-full py-4  border-b-2  cursor-pointer ${activeSection === section.key ? 'border-acivationColor' : 'border-transparent'}`}>
                                    <div
                                        className={`text-base text-nowrap font-semibold cursor-pointer ${activeSection === section.key ? 'text-acivationColor' : 'text-OverviewborderColor'}`}
                                        onClick={() => handleSectionClick(section.key)}
                                    >
                                        {section.label}
                                    </div>
                                    <div className="text-xl font-medium text-black">{section.value}</div>
                                </div>

                            </div>
                        ))}
                    </div>
                    <div className="w-full pt-3 sm:hidden lg:w-2/3">
                        <div className="flex items-center justify-between mb-2">
                            <button
                                onClick={handlePrevious}
                                disabled={selectedIndex === 0}
                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                            >
                                <ChevronLeftIcon className="w-6 h-6" />
                            </button>
                            <div className="px-4 py-2 text-center rounded">
                                <div className="text-base font-semibold text-black">
                                    {sections[selectedIndex].label}
                                </div>
                                <div className="text-xl font-medium text-black">
                                    {sections[selectedIndex].value}
                                </div>
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={selectedIndex === sections.length - 1}
                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                            >
                                <ChevronRightIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                </div>

                <div className="space-y-3">
                    {activeSection !== "available" && (
                        <div className="flex items-center space-x-3">
                            <button type="button"
                                onClick={() => handleSelectType("fixed")}
                                className={`font-medium flex flex-col sm:text-xl ${selectedType === "fixed" ? "text-acivationColor" : "text-OverviewborderColor"}`}>
                                <span>Fixed price</span>
                                {/* <div className="text-xl font-medium text-black">$0.00</div> */}

                            </button>
                            <div className="w-5 h-[1px] bg-OverviewborderColor rotate-90"></div>
                            <button type="button"
                                onClick={() => handleSelectType("milestone")}
                                className={`font-medium flex flex-col sm:text-xl ${selectedType === "milestone" ? "text-acivationColor" : "text-OverviewborderColor"}`}>
                                <span>Milestone</span>
                                {/* <div className="text-xl font-medium text-black">$0.00</div> */}
                            </button>
                        </div>
                    )}
                    {activeSection !== "available" && (
                        <div className="space-y-3 overflow-y-auto">

                            {activeSection === "workInProgress" && (
                                <div className="overflow-x-auto">
                                    {selectedDataArray?.length === 0 ?
                                        <div className="flex py-10 text-black items-center w-full justify-center text-base font-medium font-['Inter']">
                                            <span>
                                                {selectedType === "fixed" ? "No fixed price projects in progress" : "No milestone projects in progress"}
                                            </span>
                                        </div>
                                        :
                                        <table className="w-full" style={{ borderSpacing: "0 20px", borderCollapse: "separate" }}>
                                            <tbody>
                                                <tr>
                                                    <td className="px-4 text-base font-bold ">Assigned</td>
                                                    <td className="px-4 text-base font-bold ">Offer</td>
                                                    <td className="px-4 text-base font-bold ">Amount</td>
                                                </tr>
                                                {selectedDataArray?.map((data, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 pb-4 text-sm border-b border-gray-300 sm:text-base text-nowrap text-OverviewborderColor">{selectedType === "fixed" ? data?.due_date_formatted : data?.due_date_human}</td>
                                                        <td className="px-4 pb-4 text-sm font-semibold underline border-b border-gray-300 sm:text-base text-acivationColor">{selectedType === "fixed" ? data?.contract_title : data?.offer?.contract_title}</td>
                                                        <td className="px-4 pb-4 text-sm font-medium text-black border-b border-gray-300 sm:text-base">$ {selectedType === "fixed" ? data?.offer_price : data?.offer?.offer_price}</td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table>
                                    }



                                </div>
                            )}
                            {activeSection === "inReview" && (
                                <div className="overflow-x-auto">
                                    {selectedDataArray.length === 0 ?
                                        <div className="flex py-10 text-black items-center w-full justify-center text-base font-medium font-['Inter']">
                                            <span>
                                                {selectedType === "fixed" ? "No fixed price projects in Review" : "No milestone projects in Review"}
                                            </span>
                                        </div>
                                        :
                                        <table className="w-full" style={{ borderSpacing: "0 20px", borderCollapse: "separate" }}>
                                            <tbody>
                                                <tr>
                                                    <td className="px-4 text-base font-bold ">Assigned</td>
                                                    <td className="px-4 text-base font-bold ">Offer</td>
                                                    <td className="px-4 text-base font-bold ">Amount</td>
                                                </tr>
                                                {selectedDataArray.map((data, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 pb-4 text-sm border-b border-gray-300 sm:text-base text-nowrap text-OverviewborderColor">{selectedType === "fixed" ? data?.due_date_formatted : data?.due_date_human}</td>
                                                        <td className="px-4 pb-4 text-sm font-semibold underline border-b border-gray-300 sm:text-base text-acivationColor">{selectedType === "fixed" ? data?.contract_title : data?.offer?.contract_title}</td>
                                                        <td className="px-4 pb-4 text-sm font-medium text-black border-b border-gray-300 sm:text-base">$ {selectedType === "fixed" ? data?.offer_price : data?.offer?.offer_price}</td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table>
                                    }

                                </div>
                            )}
                            {activeSection === "pending" && (
                                <div className="overflow-x-auto">
                                    {selectedDataArray.length === 0 ?
                                        <div className="flex py-10 text-black items-center w-full justify-center text-base font-medium font-['Inter']">
                                            <span>
                                                {selectedType === "fixed" ? "No fixed price projects in progress" : "No milestone projects in progress"}
                                            </span>
                                        </div>
                                        :
                                        <table className="w-full" style={{ borderSpacing: "0 20px", borderCollapse: "separate" }}>
                                            <tbody>
                                                <tr>
                                                    <td className="px-4 text-base font-bold ">Created At</td>
                                                    <td className="px-4 text-base font-bold ">Offer</td>
                                                    <td className="px-4 text-base font-bold ">Amount</td>
                                                </tr>
                                                {selectedDataArray.map((data, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 pb-4 text-sm border-b border-gray-300 sm:text-base text-nowrap text-OverviewborderColor">{data?.created_at_human}</td>
                                                        <td className="px-4 pb-4 text-sm font-semibold underline border-b border-gray-300 sm:text-base text-acivationColor">{data?.offer?.contract_title}</td>
                                                        <td className="px-4 pb-4 text-sm font-medium text-black border-b border-gray-300 sm:text-base">$ {data?.amount}</td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table>
                                    }


                                </div>
                            )}
                        </div>
                    )}


                    {activeSection === "available" && (
                        <div className="flex flex-col">
                            <form onSubmit={submit} className="w-full h-auto px-4 md:px-7 py-6 md:py-8 bg-white rounded-lg border-2 border-[#e9e9e8] flex flex-col gap-8">
                                <div className="flex flex-col gap-3 w-full border-b-2 py-6 border-[#e9e9e8] text-black text-base font-semibold font-['Inter'] leading-none">
                                    <span>Available total Balance : ${availablePriceCount()}</span>
                                    <span>Available received amount : ${availableReceivePriceCount()}</span>
                                    {/* <span className="text-sm text-gray-400">The amount available for withdrawal</span> */}
                                </div>
                                <div className="w-full  text-black text-xl font-medium font-['Inter']">Available Transactions</div>

                                <div className="overflow-x-auto">
                                    {availablePayment.length === 0 ?
                                        <div className="flex py-10 text-black items-center w-full justify-center text-base font-medium font-['Inter']">
                                            <span>
                                                No available transactions
                                            </span>
                                        </div>
                                        :
                                        <table className="w-full" style={{ borderSpacing: "0 20px", borderCollapse: "separate" }}>
                                            <tbody>
                                                <tr>
                                                    <td className="px-4 text-sm font-bold sm:text-base "></td>
                                                    <td className="px-4 text-sm font-bold text-nowrap sm:text-base ">Create At</td>
                                                    <td className="px-4 text-sm font-bold sm:text-base ">Type</td>
                                                    <td className="px-4 text-sm font-bold sm:text-base ">Description</td>
                                                    <td className="px-4 text-sm font-bold sm:text-base ">Amount</td>
                                                    <td className="px-4 text-sm font-bold sm:text-base ">Received</td>
                                                </tr>

                                                {availablePayment.map((data: any, index: number) => (
                                                    <tr key={index}>
                                                        <td className="px-4 pb-4 ">
                                                            <Checkbox
                                                                onChange={(e) => handleCheckboxChange(data?.id, Number(data?.received_amount), e.target.checked)}
                                                            />
                                                        </td>
                                                        <td className="px-4 pb-4 text-sm border-b border-gray-300 sm:text-base text-OverviewborderColor">{data?.created_at_human}</td>
                                                        <td className="px-4 pb-4 text-sm font-semibold border-b border-gray-300 first-letter:capitalize sm:text-base">{data?.type}</td>
                                                        <td className="px-4 pb-4 text-sm font-medium border-b border-gray-300 sm:text-base">{data?.description}</td>
                                                        <td className="px-4 pb-4 text-sm font-medium text-black border-b border-gray-300 sm:text-base">$ {data?.amount}</td>
                                                        <td className="px-4 pb-4 text-sm font-medium text-black border-b border-gray-300 sm:text-base ">$ {data?.received_amount}</td>
                                                    </tr>
                                                ))}


                                                <tr>
                                                    <td className="px-4 text-sm font-bold sm:text-base "></td>
                                                    <td className="px-4 text-sm font-bold sm:text-base "></td>
                                                    <td className="px-4 text-sm font-bold sm:text-base "></td>
                                                    <td className="px-4 text-sm font-bold sm:text-base "></td>
                                                    <td className="px-4 text-sm font-bold sm:text-base ">Total Received</td>
                                                    <td className="px-4 text-sm font-bold sm:text-base ">$ {totalAmount?.toFixed(2)}</td>
                                                </tr>

                                            </tbody>

                                        </table>
                                    }
                                </div>


                                {availablePayment.length != 0 && (
                                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                                        {userPaymentMethods?.length === 0 ? (
                                            <Link
                                                href={route('freelancer.account')}
                                                className="flex items-center justify-center px-10 py-2 text-sm font-medium bg-transparent border rounded-full sm:text-base font-Inter border-acivationColor text-primaryBtnColor hover:text-white hover:bg-primaryBtnColorHover">
                                                Add Bank
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleOpenModal}
                                                className="flex items-center justify-center px-10 py-2 text-sm font-medium bg-transparent border rounded-full sm:text-base font-Inter border-acivationColor text-primaryBtnColor hover:text-white hover:bg-primaryBtnColorHover">
                                                {selectedBankId != null ? "Change Bank" : "Select Bank"}
                                            </button>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={selectedIds?.length === 0}
                                            className={`flex items-center justify-center px-6 py-2 rounded-full  ${selectedIds?.length === 0 ? 'bg-skillCardColor text-gray-400' : 'bg-primaryBtnColor text-white'}`}>
                                            <span className=" text-sm sm:text-base font-medium font-['Inter']">Get Paid Now</span>
                                        </button>
                                    </div>
                                )}

                                {errorMessage && (
                                    <div className="text-red-500">{errorMessage}</div>
                                )}


                            </form>



                            <Link
                                type="button"
                                href={route('freelancer.financial.history')}
                                className="text-acivationColor text-base font-semibold font-['Inter'] underline mt-4 text-right">
                                View transactions history
                            </Link>
                        </div>
                    )}
                </div>


            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md p-6 space-y-4 bg-white rounded-lg">
                        <div className="flex justify-between">
                            <h2 className="flex justify-center text-xl font-bold">Select a Bank</h2>
                            <button
                                type='button'
                                onClick={handleCloseModal}
                                className="text-lg text-gray-500 hover:text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {userPaymentMethods?.map((bank: any) => (
                                <div
                                    key={bank.id}
                                    className={`p-4 border rounded-md cursor-pointer ${selectedBankId === bank.id ? 'border-acivationColor bg-blue-100' : 'border-gray-300'}`}
                                    onClick={() => handleBankSelect(bank?.id)}
                                >
                                    <p className="font-medium">{bank.bank_name}</p>
                                    <p className="text-sm text-gray-600 text-wrap">Account Holder: {bank.account_holder_name}</p>
                                    <p className="text-sm text-gray-600">Account Number: {bank.account_number}</p>
                                    <p className="text-sm text-gray-600">Country: {bank.country}</p>
                                    <p className="text-sm text-gray-600">Address: {bank.bank_address}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 mt-4 text-white bg-gray-600 rounded "
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

