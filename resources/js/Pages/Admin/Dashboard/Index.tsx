import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import Statistics from "./Partials/Statistics";
import NewStatistics from "./Partials/NewStatistics";


export default function Dashboard(
    {
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

        totalEscrowAmount,
        totalOpenTickets,
        totalPayout,

        totalCredits,
        totalCommission,

        multiAxisData,
        barChartData,

        filters,
    }: {
        totalClients: number;
        totalFreelancers: number;

        totalEarningCredits: number;
        totalEarningProject: number;
        totalEarningMilestone: number

        totalJobs: number;
        totalProposals: number;
        totalPendingOffers: number;
        totalAcceptedOffers: number;
        totalCompletedOffers: number;

        totalEscrowAmount: number;
        totalOpenTickets: number;
        totalPayout: number;

        totalCredits: number;
        totalCommission: number;

        multiAxisData: any;
        barChartData: any;

        filters: any;
    }

) {
    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },

    ];

    // const stats = [
    //     { name: "Total Clients", stat: totalClients.toString() },
    //     { name: "Total Freelancers", stat: totalFreelancers.toString() },
    //     { name: "Total Jobs", stat: totalJobs.toString() },
    //     { name: "Total Proposals", stat: totalProposals.toString() },
    //     { name: "Total Offers", stat: totalOffers.toString() },
    //     { name: "Total Debit ($)", stat: totalDebit.toString() },
    //     { name: "Total Credit ($)", stat: totalCredit.toString() },
    // ];

      const stats = [
        { name: "Total escrow amount ",  stat: totalEscrowAmount },
        { name: "Total open tickets", stat: totalOpenTickets },
        { name: "Total payouts ($)", stat: totalPayout },
        { name: "Total earnings credits ($)", stat: totalCredits },
        { name: "Total earnings commissions ($)", stat: totalCommission },
    ];

    return (
        <AuthenticatedLayout bRoutes={bRoutes}>
            <Head title="Dashboard" />
            <div className="">
                <div className="mx-auto max-w-7xl">
                    {/* <Statistics stats={stats} /> */}
                    <NewStatistics
                    stats={stats}
                    filters={filters}
                    totalClients={totalClients}
                    totalFreelancers={totalFreelancers}

                    totalEarningCredits={totalEarningCredits}
                    totalEarningProject={totalEarningProject}
                    totalEarningMilestone={totalEarningMilestone}

                    totalJobs={totalJobs}
                    totalProposals={totalProposals}
                    totalPendingOffers={totalPendingOffers}
                    totalAcceptedOffers={totalAcceptedOffers}
                    totalCompletedOffers={totalCompletedOffers}

                    multiAxisData={multiAxisData}
                    barChartData={barChartData}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
