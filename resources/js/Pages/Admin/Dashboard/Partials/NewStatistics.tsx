import BarChart from "@/Components/charts/BarChart";
import { MultiAxisChart } from "@/Components/charts/MultiAxisChart";
import { router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { addYears, format } from "date-fns";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import '../../../../../css/react-date-range.css';
import { UsersIcon, XMarkIcon } from "@heroicons/react/24/outline";
export default function NewStatistics(
    {
        stats,
        filters,
        totalClients,
        totalFreelancers,

        totalEarningCredits,
        totalEarningProject,
        totalEarningMilestone,

        totalJobs,
        totalProposals,
        totalPendingOffers,
        totalAcceptedOffers,
        totalCompletedOffers,

        multiAxisData,
        barChartData,
    }: {
        stats: { name: string, stat: number }[]
        filters: any;
        totalClients: number;
        totalFreelancers: number;

        totalEarningCredits: number;
        totalEarningProject: number;
        totalEarningMilestone: number;

        totalJobs: number;
        totalProposals: number;
        totalPendingOffers: number;
        totalAcceptedOffers: number;
        totalCompletedOffers: number;

        multiAxisData: any;
        barChartData: any;
    }) {

    const [openDate, setOpenDate] = useState(false);

    const [date, setDate] = useState({
        startDate: new Date(filters.range1),
        endDate: new Date(filters.range2),
        key: "selection",
    });

    const [previousDate, setPreviousDate] = useState({
        startDate: new Date(filters.range1),
        endDate: new Date(filters.range2),
    });

    function revisitPage() {

        if (previousDate.startDate.getTime() !== date.startDate.getTime() || previousDate.endDate.getTime() !== date.endDate.getTime()) {
            router.get(
                route("admin.dashboard"),
                {
                    range1: format(date.startDate, "yyyy-MM-dd"),
                    range2: format(date.endDate, "yyyy-MM-dd"),
                },
                {
                    replace: true,
                    preserveState: true,
                    preserveScroll: true,
                }
            );
            setPreviousDate(date);  // Save the new date range to avoid re-triggering
        }
    };

    const handleChange = (ranges: any) => {
        setDate(ranges.selection);
        setOpenDate(false);
    };

    useEffect(() => {
        revisitPage();
    }, [date]);



    const resetFilters = () => {
        router.visit(route("admin.dashboard"),
            {
                method: "get",
                data: {
                    preserveState: true,
                    preserveScroll: true,
                },
            });
    };


    return (
        <div className="">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
                Hello admin, welcome to dashboard.
            </h3>
            <div className="flex flex-col-reverse w-full gap-4 mt-10 lg:flex-row">
                <div className="flex w-full lg:w-1/3">
                    <div className="flex flex-col w-full gap-5 ">
                        <dl className="flex flex-col gap-5 ">
                            {stats.map((item) => (
                                <div
                                    key={item.name}
                                    className="px-4 py-5 overflow-hidden bg-white rounded-lg shadow sm:p-6"
                                >
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        {item.name}
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                                        {item.stat}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
                <div className="flex flex-col w-full gap-4 lg:w-2/3">
                    <div className="flex flex-col-reverse w-full gap-4 lg:flex-row ">

                        <div className="flex flex-col w-full p-4 bg-white rounded-lg shadow">
                            <div className="flex flex-col lg:gap-10 md:gap-10 lg:flex-row md:flex-row">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-500">
                                        Date Range
                                    </label>
                                    <div className="relative flex flex-row w-full mt-2">
                                        <span
                                            className="p-4   text-sm lg:w-[300px] md:w-[300px] w-full border rounded-none cursor-pointer rounded-l-3xl sm:p-2 border-slate-500 sm:text-base"
                                            onClick={() => setOpenDate(!openDate)}
                                        >
                                            {filters.range1 === null
                                                ? <span className="px-2 text-gray-400 "></span>
                                                : date?.startDate?.getTime() === date?.endDate.getTime() ? (
                                                    format(date?.startDate, "MMM dd, yyyy")
                                                ) : (
                                                    `${format(date?.startDate, "MMM dd, yyyy")} - ${format(date?.endDate, "MMM dd, yyyy")}`
                                                )}

                                        </span>
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="px-2 text-sm transition duration-200 border rounded-none cursor-pointer border-slate-500 rounded-r-3xl"
                                        >
                                            <XMarkIcon
                                                className="w-5 h-5 text-gray-400 "
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                    {openDate && (
                                        <DateRangePicker
                                            className="absolute top-[12rem] sm:right-[10rem] z-50 dateRange "
                                            ranges={[date]}
                                            onChange={handleChange}
                                            maxDate={new Date()}
                                        />
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse w-full gap-4 lg:flex-row ">
                        <div className="relative flex flex-col gap-4 p-4 bg-gray-200 rounded-lg shadow lg:w-1/2">
                            {/* <UsersIcon className="absolute w-40 h-40 text-gray-600 opacity-50 right-4 top-4" /> */}
                            <label className="text-base font-medium text-gray-500">
                                Users
                            </label>
                            <div className="z-10 flex flex-row gap-4">
                                <div className="flex w-1/2 p-4 bg-white rounded-lg shadow bg-opacity-80 ">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Clients
                                        </p>
                                        <p className="text-3xl font-bold text-black">
                                            {totalClients}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex w-1/2 p-4 bg-white rounded-lg shadow bg-opacity-80">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Freelancers
                                        </p>
                                        <p className="text-3xl font-bold text-black">
                                            {totalFreelancers}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Users Icon positioned absolutely */}

                        </div>
                        <div className="relative flex flex-col gap-4 p-4 bg-gray-200 rounded-lg shadow lg:w-1/2">
                            {/* <UsersIcon className="absolute w-40 h-40 text-gray-600 opacity-50 right-4 top-4" /> */}
                            <label className="text-base font-medium text-gray-500">
                                Total Earnings
                            </label>
                            <div className="z-10 flex flex-row gap-4">
                                <div className="flex w-1/2 p-4 bg-white rounded-lg shadow bg-opacity-80 ">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Credits
                                        </p>
                                        <p className="text-3xl font-bold text-black">
                                            $ {totalEarningCredits}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex w-1/2 p-4 bg-white rounded-lg shadow bg-opacity-80">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Commissions
                                        </p>
                                        <p className="text-3xl font-bold text-black">
                                            $ {(totalEarningProject + totalEarningMilestone) * 0.01}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse w-full gap-4 lg:flex-row ">
                        <div className="flex flex-row gap-4 lg:w-1/2">
                            <div className="flex w-1/2 p-4 bg-white rounded-lg shadow">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Jobs
                                    </p>
                                    <p className="text-3xl font-bold text-black">
                                        {totalJobs}
                                    </p>
                                </div>
                            </div>

                            <div className="flex w-1/2 p-4 bg-white rounded-lg shadow">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Proposals
                                    </p>
                                    <p className="text-3xl font-bold text-black">
                                        {totalProposals}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 lg:w-1/2">
                            <div className="flex w-1/2 p-4 bg-white rounded-lg shadow">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Offers
                                    </p>
                                    <p className="text-3xl font-bold text-black">
                                        {totalPendingOffers + totalAcceptedOffers + totalCompletedOffers}
                                    </p>
                                </div>
                            </div>

                            <div className="flex w-1/2 p-4 bg-white rounded-lg shadow">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Completed Offers
                                    </p>
                                    <p className="text-3xl font-bold text-black">
                                        {totalCompletedOffers}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-span-2">
                        <div className="p-8 space-y-4 bg-white rounded-xl">
                            <MultiAxisChart multiAxisData={multiAxisData} />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="p-8 space-y-4 bg-white rounded-xl">
                            <BarChart barChartData={barChartData} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
