<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminClientResource;
use App\Http\Resources\FreelancerResource;
use App\Http\Resources\JobResource;
use App\Http\Resources\OfferResource;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\ProposalResource;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\BalanceRequest\BalanceRequestInterface;
use App\Repositories\All\Job\JobInterface;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\Payment\PaymentInterface;
use App\Repositories\All\Proposal\ProposalInterface;
use App\Repositories\All\Ticket\TicketInterface;
use App\Repositories\All\User\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected UserInterface $userInterface,
        protected JobInterface $jobInterface,
        protected ProposalInterface $proposalInterface,
        protected OfferInterface $offerInterface,
        protected PaymentInterface $paymentInterface,
        protected BalanceRequestInterface $balanceRequestInterface,
        protected TicketInterface $ticketInterface
    ) {}

    /**
     * Method index
     *
     * @return void
     */
    public function index(Request $request)
    {
        $filters = $request->only('sortBy', 'sortDirection', 'rowPerPage', 'page', 'range1', 'range2');
        $filters['sortBy'] = $filters['sortBy'] ?? 'id';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;
        $filters['range1'] = $filters['range1'] ?? Carbon::now()->subYear()->format('Y-m-d');
        $filters['range2'] = $filters['range2'] ?? Carbon::now()->format('Y-m-d');

        // dd($filters);

        $totalEscrowAmount =
        $this->paymentInterface->getByColumn(['type' => 'credit', 'payment_for' => 'full_project'])->sum('amount') +
        $this->paymentInterface->getByColumn(['type' => 'credit', 'payment_for' => 'milestone'])->sum('amount') -
        $this->balanceRequestInterface->getByColumn(['status' => 'approved'])->sum('amount');

        $totalCredits = $this->paymentInterface->getByColumn(['type' => 'credit', 'payment_for' => 'connect_package'])->sum('amount');

        $totalCommission =
        $this->paymentInterface->getByColumn(['type' => 'credit', 'payment_for' => 'full_project'])->sum('amount') +
        $this->paymentInterface->getByColumn(['type' => 'credit', 'payment_for' => 'milestone'])->sum('amount');

        $labels = $this->getPastDays(7);
        $newFilters = $filters;
        foreach ($labels as $label) {
            $newFilters['range1'] = $label;
            $newFilters['range2'] = $label;
            $jobCount[] = JobResource::collection($this->jobInterface->filterWithParam($newFilters, [], ['status' => 'active']))->count();
            $proposalCount[] = ProposalResource::collection($this->proposalInterface->filterWithParam($newFilters, [], ['status' => 'active']))->count();
            $offerPendingCount = OfferResource::collection($this->offerInterface->filterWithParam($newFilters, [], ['status' => 'pending']))->count();
            $offerAcceptedCount = OfferResource::collection($this->offerInterface->filterWithParam($newFilters, [], ['status' => 'accepted']))->count();
            $offerCompletedCount = OfferResource::collection($this->offerInterface->filterWithParam($newFilters, [], ['status' => 'completed']))->count();
            $offerCount[] = $offerPendingCount + $offerAcceptedCount + $offerCompletedCount;

            $totalCreditEarning[] = PaymentResource::collection($this->paymentInterface->filterWithParam($newFilters, [], ['type' => 'credit', 'payment_for' => 'connect_package']))->sum('amount');
            $totalProjectEarning = PaymentResource::collection($this->paymentInterface->filterWithParam($newFilters, [], ['type' => 'credit', 'payment_for' => 'full_project']))->sum('amount');
            $totalMilestoneEarning = PaymentResource::collection($this->paymentInterface->filterWithParam($newFilters, [], ['type' => 'credit', 'payment_for' => 'milestone']))->sum('amount');
            $totalCommissionEarning[] = ($totalProjectEarning + $totalMilestoneEarning) * 0.01;

        }

        $multiAxisData = [
            'labels' => $labels,
            'jobs' => $jobCount,
            'proposals' => $proposalCount,
            'offers' => $offerCount,
        ];

        $barChartData =
        [
            'labels' => $labels,
            'creditEarning' => $totalCreditEarning,
            'commissionEarning' => $totalCommissionEarning,
        ];

        return Inertia::render('Admin/Dashboard/Index', [
            'totalClients' => AdminClientResource::collection($this->userInterface->filterWithParam($filters, [], ['user_type' => 'client']))->count() ?? 0,
            'totalFreelancers' => FreelancerResource::collection($this->userInterface->filterWithParam($filters, [], ['user_type' => 'freelancer']))->count() ?? 0,

            'totalEarningCredits' => PaymentResource::collection($this->paymentInterface->filterWithParam($filters, [], ['type' => 'credit', 'payment_for' => 'connect_package']))->sum('amount') ?? 0,
            'totalEarningProject' => PaymentResource::collection($this->paymentInterface->filterWithParam($filters, [], ['type' => 'credit', 'payment_for' => 'full_project']))->sum('amount') ?? 0,
            'totalEarningMilestone' => PaymentResource::collection($this->paymentInterface->filterWithParam($filters, [], ['type' => 'credit', 'payment_for' => 'milestone']))->sum('amount') ?? 0,

            'totalJobs' => JobResource::collection($this->jobInterface->filterWithParam($filters, [], ['status' => 'active']))->count() ?? 0,
            'totalProposals' => ProposalResource::collection($this->proposalInterface->filterWithParam($filters, [], ['status' => 'active']))->count() ?? 0,

            'totalPendingOffers' => OfferResource::collection($this->offerInterface->filterWithParam($filters, [], ['status' => 'pending']))->count() ?? 0,
            'totalAcceptedOffers' => OfferResource::collection($this->offerInterface->filterWithParam($filters, [], ['status' => 'accepted']))->count() ?? 0,
            'totalCompletedOffers' => OfferResource::collection($this->offerInterface->filterWithParam($filters, [], ['status' => 'completed']))->count() ?? 0,
            // 'totalOffers' => OfferResource::collection($this->offerInterface->filterWithParam($filters,[] ,['status' != 'draft']))->count(),

            'totalEscrowAmount' => $totalEscrowAmount ?? 0,
            'totalOpenTickets' => $this->ticketInterface->getByColumn(['status' => 'active'])->count() ?? 0,
            'totalPayout' => $this->balanceRequestInterface->getByColumn(['status' => 'pending'])->sum('amount') ?? 0,

            'totalCredits' => $totalCredits ?? 0,
            'totalCommission' => $totalCommission * 0.01 ?? 0,

            'multiAxisData' => $multiAxisData,
            'barChartData' => $barChartData,

            'filters' => $filters,
        ]);
    }
}
