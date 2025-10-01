<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Http\Resources\BalanceRequestResource;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\BalanceRequest\BalanceRequestInterface;
use App\Repositories\All\BalanceRequestPayment\BalanceRequestPaymentInterface;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\OfferMilestone\OfferMilestoneInterface;
use App\Repositories\All\Payment\PaymentInterface;
use App\Repositories\All\PaymentMethod\PaymentMethodInterface;
use App\Repositories\All\Project\ProjectInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FinanceController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected OfferInterface $offerInterface,
        protected OfferMilestoneInterface $offerMilestoneInterface,
        protected ProjectInterface $projectInterface,
        protected PaymentInterface $paymentInterface,
        protected PaymentMethodInterface $paymentMethodInterface,
        protected BalanceRequestInterface $balanceRequestInterface,
        protected BalanceRequestPaymentInterface $balanceRequestPaymentInterface,

    ) {}

    /**
     * Method index
     *
     * @return void
     */
    public function financeOverview()
    {
        $inProgressProject = $this->offerInterface->getByColumn(['status' => 'accepted', 'payment_type' => 'Project', 'freelancer_id' => Auth::id()], ['id', 'offer_price', 'contract_title', 'due_date', 'created_at']);
        $milestoneProjectIds = $this->offerInterface->getByColumn(['status' => 'accepted', 'payment_type' => 'Milestone', 'freelancer_id' => Auth::id()], ['id']);
        $inProgressMilestone = [];
        foreach ($milestoneProjectIds as $milestoneProjectId) {
            $inProgress = $this->offerMilestoneInterface->findByColumn(['offer_id' => $milestoneProjectId->id, 'project_status' => 'pending'], ['id', 'offer_id', 'amount', 'due_date', 'created_at'], ['offer']);
            if ($inProgress) {
                $inProgressProject[] = $inProgress;
            }
        }
        // dd($inProgressMilestone);

        $inReviewProjectIds = $this->projectInterface->getByColumn(['status' => 'uploaded', 'freelancer_id' => Auth::id()], ['offer_id']);
        $inReviewProject = [];
        foreach ($inReviewProjectIds as $inReviewProjectId) {
            $inProject = $this->offerInterface->findByColumn(['id' => $inReviewProjectId->offer_id], ['id', 'offer_price', 'contract_title', 'due_date', 'created_at']);
            if ($inProject) {
                $inReviewProject[] = $inProject;
            }
        }

        $inReviewMilestone = [];
        foreach ($milestoneProjectIds as $milestoneProjectId) {

            $inReview = $this->offerMilestoneInterface->findByColumn(['offer_id' => $milestoneProjectId->id, 'project_status' => 'uploaded'], ['id', 'offer_id', 'amount', 'due_date', 'created_at'], ['offer']);
            if ($inReview) {
                $inReviewMilestone[] = $inReview;
            }
        }

        // dd($inReviewMilestone);

        $pendingProjectPayment = $this->paymentInterface->getByColumn(['freelancer_id' => Auth::id(), 'status' => 'succeeded', 'type' => 'credit', 'payment_for' => 'full_Project', 'admin_status' => 'pending'], ['id', 'offer_id', 'amount', 'created_at'], ['offer']);
        $pendingMilestonePayment = $this->paymentInterface->getByColumn(['freelancer_id' => Auth::id(), 'status' => 'succeeded', 'type' => 'credit', 'payment_for' => 'milestone', 'admin_status' => 'pending'], ['id', 'offer_id', 'amount', 'created_at'], ['offer']);
        $availablePayment = $this->paymentInterface->getByColumn(['freelancer_id' => Auth::id(), 'status' => 'succeeded', 'type' => 'credit', 'admin_status' => 'approved', 'payment_status' => 'pending'], ['*'])->where('payment_for', '=', 'full_Project' || 'milestone');

        $userPaymentMethods = $this->paymentMethodInterface->getByColumn(['user_id' => Auth::id()]);

        return Inertia::render('Freelancer/FinanceManage/Index', [
            'user' => Auth::user(),

            'inProgressProject' => $inProgressProject ?? [],
            'inProgressMilestone' => $inProgressMilestone ?? [],

            'inReviewProject' => $inReviewProject ?? [],
            'inReviewMilestone' => $inReviewMilestone ?? [],

            'pendingProjectPayment' => $pendingProjectPayment ?? [],
            'pendingMilestonePayment' => $pendingMilestonePayment ?? [],
            'availablePayment' => $availablePayment,

            'userPaymentMethods' => $userPaymentMethods,
        ]);
    }

    public function financeHistory(Request $request)
    {

        // dd($request->all());
        $filters = $request->only('sortBy', 'sortDirection', 'rowPerPage', 'page', 'date');
        $filters['sortBy'] = $filters['sortBy'] ?? 'created_at';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;

        // $this->balanceRequestInterface->getByColumn(['user_id' => Auth::id()], ['*'], ['paymentMethod']),
        return Inertia::render('Freelancer/FinanceHistory/Index', [
            'user' => Auth::user(),
            'filters' => $filters,
            'paymentHistory' => BalanceRequestResource::collection($this->balanceRequestInterface->filterWithParam($filters, ['paymentMethod'], ['user_id' => Auth::id()])),
        ]);
    }
}
