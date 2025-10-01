import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import TextInput from "@/Components/elements/inputs/TextInput";
import useState from "react-usestateref";
import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { router } from "@inertiajs/react";

export default function FinanceHistory(
    {
        filters,
        paymentHistory,
    }: {
        filters: any,
        paymentHistory: any;
    }) {

    const [sortBy, setSortBy, sortByRef] = useState(filters?.sortBy ?? "created_at");
    const [sortDirection, setSortDirection, sortDirectionRef] = useState(filters?.sortDirection ?? "desc");
    const [date, setDate, dateRef] = useState(filters?.date ?? "");




    const initialRender = useRef(true);
    const url = window.location.pathname;

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        revisitPage();
    }
        , [sortBy, sortDirection, date]);


    function revisitPage() {
        router.get(
            url,
            {
                sortBy: sortBy,
                sortDirection: sortDirection,
                date: date,
            },
            {
                replace: true,
                preserveState: true,
                preserveScroll: true,
            }
        );
    }


   // console.log(paymentHistory);
    return (
        <AppLayout isFreelancerHeader={true} isHeader={false}>
            <Head title="Transaction History" />
            <div className="relative min-h-screen p-4 mx-auto mt-20 space-y-8 bg-white sm:p-8 max-w-7xl">
                <div className="mt-20 mb-4 text-3xl font-semibold text-black sm:text-4xl sm:mb-8 sm:mt-20">
                    <span className="block sm:inline">Transaction History</span>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="flex flex-col w-full md:w-auto">
                        <InputLabel htmlFor="statement-period" className="mb-1">Statement Period</InputLabel>
                        <TextInput
                            type="date"
                            onKeyDown={(e) => e.preventDefault()}
                            id="statement-period"
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="mmm/dd/yyyy"
                            className="block w-full h-10 px-6 rounded-2xl placeholder:text-sm font-Inter"
                        />
                    </div>

                    <div className="flex flex-col w-full sm:w-auto">
                        <a

                            href={route('freelancer.transactions.export')}
                            className="w-full px-6 py-2 transition-colors border lg:mt-6 border-primaryBtnColor hover:bg-primaryBtnColor hover:text-white text-primaryBtnColor rounded-3xl">
                            Download CSV
                        </a>
                    </div>
                </div>


                <div className="overflow-x-auto">
                    {paymentHistory?.data?.length === 0 ?
                        <div className="flex py-10 text-black items-center w-full justify-center text-base font-medium font-['Inter']">
                            <span>
                                No available transactions
                            </span>
                        </div>
                        :
                        <table className="w-full" style={{ borderSpacing: "0 20px", borderCollapse: "separate" }}>
                            <tbody>
                                <tr>
                                    <td className="px-4 text-sm font-bold text-nowrap sm:text-base ">Date</td>
                                    <td className="px-4 text-sm font-bold sm:text-base ">Status</td>
                                    <td className="px-4 text-sm font-bold sm:text-base ">Payment Method</td>
                                    <td className="px-4 text-sm font-bold sm:text-base ">Amount</td>
                                    <td className="px-4 text-sm font-bold sm:text-base ">Received</td>
                                    <td className="px-4 text-sm font-bold sm:text-base ">Invoice</td>
                                </tr>

                                {paymentHistory?.data?.map((data: any, index: number) => (
                                    <tr key={index}>

                                        <td className="px-4 pb-4 text-sm border-b border-gray-300 text-nowrap sm:text-base text-OverviewborderColor">{data?.created_at_human}</td>
                                        <td className="px-4 pb-4 text-sm font-semibold border-b border-gray-300 first-letter:capitalize sm:text-base">{data?.status}</td>
                                        <td className="flex flex-col px-4 pb-4 text-sm font-medium border-b border-gray-300 sm:text-base">
                                            <span>{data?.payment_method?.bank_name}</span>
                                            <span className="text-sm text-gray-500">
                                                {data?.payment_method?.account_number
                                                    ? `${data.payment_method.account_number.slice(0, 2)}
                                                    ${data.payment_method.account_number.slice(2, -2).replace(/\d/g, '*')}
                                                    ${data.payment_method.account_number.slice(-2)}`
                                                    : ''}
                                            </span>
                                        </td>
                                        <td className="px-4 pb-4 text-sm font-medium text-black border-b border-gray-300 text-nowrap sm:text-base">$ {data?.amount}</td>
                                        <td className="px-4 pb-4 text-sm font-medium text-black border-b border-gray-300 text-nowrap sm:text-base ">$ {data?.received_amount}</td>
                                        <td className="px-4 pb-4 text-sm font-medium text-black border-b border-gray-300 text-nowrap sm:text-base ">
                                            {data?.status !='approved' ? (
                                                <span className="text-gray-400 "
                                                >Download</span>
                                            ) : (
                                                <a className="text-primaryBtnColorHover" href={route('freelancer.transactions.invoice.download', data?.id)}>
                                                    Download
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}




                            </tbody>

                        </table>
                    }
                </div>
            </div>
        </AppLayout>
    );
}
