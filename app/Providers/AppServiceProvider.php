<?php

namespace App\Providers;

use App\Repositories\All\BalanceRequest\BalanceRequestInterface;
use App\Repositories\All\BalanceRequest\BalanceRequestRepository;
use App\Repositories\All\BalanceRequestPayment\BalanceRequestPaymentInterface;
use App\Repositories\All\BalanceRequestPayment\BalanceRequestPaymentRepository;
use App\Repositories\All\BankDetails\BankDetailsInterface;
use App\Repositories\All\BankDetails\BankDetailsRepository;
use App\Repositories\All\Chat\ChatInterface;
use App\Repositories\All\Chat\ChatRepository;
use App\Repositories\All\ConnectPackage\ConnectPackageInterface;
use App\Repositories\All\ConnectPackage\ConnectPackageRepository;
use App\Repositories\All\Credit\CreditInterface;
use App\Repositories\All\Credit\CreditRepository;
use App\Repositories\All\Education\EducationInterface;
use App\Repositories\All\Education\EducationRepository;
use App\Repositories\All\EmployHistory\EmployHistoryInterface;
use App\Repositories\All\EmployHistory\EmployHistoryRepository;
use App\Repositories\All\FavoriteJob\FavoriteJobInterface;
use App\Repositories\All\FavoriteJob\FavoriteJobRepository;
use App\Repositories\All\IdentityVerification\IdentityVerificationInterface;
use App\Repositories\All\IdentityVerification\IdentityVerificationRepository;
use App\Repositories\All\Job\JobInterface;
use App\Repositories\All\Job\JobRepository;
use App\Repositories\All\JobAttachment\JobAttachmentInterface;
use App\Repositories\All\JobAttachment\JobAttachmentRepository;
use App\Repositories\All\JobCategory\JobCategoryInterface;
use App\Repositories\All\JobCategory\JobCategoryRepository;
use App\Repositories\All\Language\LanguageInterface;
use App\Repositories\All\Language\LanguageRepository;
use App\Repositories\All\Message\MessageInterface;
use App\Repositories\All\Message\MessageRepository;
use App\Repositories\All\MessageAttachment\MessageAttachmentInterface;
use App\Repositories\All\MessageAttachment\MessageAttachmentRepository;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\Offer\OfferRepository;
use App\Repositories\All\OfferAttachment\OfferAttachmentInterface;
use App\Repositories\All\OfferAttachment\OfferAttachmentRepository;
use App\Repositories\All\OfferMilestone\OfferMilestoneInterface;
use App\Repositories\All\OfferMilestone\OfferMilestoneRepository;
use App\Repositories\All\OfferMilestoneAttachment\OfferMilestoneAttachmentInterface;
use App\Repositories\All\OfferMilestoneAttachment\OfferMilestoneAttachmentRepository;
use App\Repositories\All\OfferRecentActivity\OfferRecentActivityInterface;
use App\Repositories\All\OfferRecentActivity\OfferRecentActivityRepository;
use App\Repositories\All\Pages\PageInterface;
use App\Repositories\All\Pages\PageRepository;
use App\Repositories\All\Payment\PaymentInterface;
use App\Repositories\All\Payment\PaymentRepository;
use App\Repositories\All\PaymentMethod\PaymentMethodInterface;
use App\Repositories\All\PaymentMethod\PaymentMethodRepository;
use App\Repositories\All\Portfolio\PortfolioInterface;
use App\Repositories\All\Portfolio\PortfolioRepository;
use App\Repositories\All\Project\ProjectInterface;
use App\Repositories\All\Project\ProjectRepository;
use App\Repositories\All\ProjectAttachment\ProjectAttachmentInterface;
use App\Repositories\All\ProjectAttachment\ProjectAttachmentRepository;
use App\Repositories\All\Proposal\ProposalInterface;
use App\Repositories\All\Proposal\ProposalRepository;
use App\Repositories\All\ProposalAttachment\ProposalAttachmentInterface;
use App\Repositories\All\ProposalAttachment\ProposalAttachmentRepository;
use App\Repositories\All\ProposalMilestone\ProposalMilestoneInterface;
use App\Repositories\All\ProposalMilestone\ProposalMilestoneRepository;
use App\Repositories\All\Review\ReviewInterface;
use App\Repositories\All\Review\ReviewRepository;
use App\Repositories\All\SkillCategory\SkillCategoryInterface;
use App\Repositories\All\SkillCategory\SkillCategoryRepository;
use App\Repositories\All\Ticket\ReplyTicketInterface;
use App\Repositories\All\Ticket\ReplyTicketRepository;
use App\Repositories\All\Ticket\TicketInterface;
use App\Repositories\All\Ticket\TicketRepository;
use App\Repositories\All\User\UserInterface;
use App\Repositories\All\User\UserRepository;
use App\Repositories\All\UserJobCategory\UserJobCategoryInterface;
use App\Repositories\All\UserJobCategory\UserJobCategoryRepository;
use Illuminate\Support\ServiceProvider;
use App\Repositories\All\SportsCategory\SportsCategoryInterface;
use App\Repositories\All\SportsCategory\SportsCategoryRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // $this->app->bind(PageInterface::class, PageRepository::class);

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->bind(PortfolioInterface::class, PortfolioRepository::class);
        $this->app->bind(PageInterface::class, PageRepository::class);
        $this->app->bind(JobCategoryInterface::class, JobCategoryRepository::class);
        $this->app->bind(JobInterface::class, JobRepository::class);
        $this->app->bind(JobAttachmentInterface::class, JobAttachmentRepository::class);
        $this->app->bind(ProposalInterface::class, ProposalRepository::class);
        $this->app->bind(ProposalAttachmentInterface::class, ProposalAttachmentRepository::class);
        $this->app->bind(ProposalMilestoneInterface::class, ProposalMilestoneRepository::class);
        $this->app->bind(UserInterface::class, UserRepository::class);
        $this->app->bind(CreditInterface::class, CreditRepository::class);
        $this->app->bind(SkillCategoryInterface::class, SkillCategoryRepository::class);
        $this->app->bind(EducationInterface::class, EducationRepository::class);
        $this->app->bind(LanguageInterface::class, LanguageRepository::class);
        $this->app->bind(UserJobCategoryInterface::class, UserJobCategoryRepository::class);
        $this->app->bind(OfferInterface::class, OfferRepository::class);
        $this->app->bind(OfferAttachmentInterface::class, OfferAttachmentRepository::class);
        $this->app->bind(OfferMilestoneInterface::class, OfferMilestoneRepository::class);
        $this->app->bind(ChatInterface::class, ChatRepository::class);
        $this->app->bind(MessageInterface::class, MessageRepository::class);
        $this->app->bind(MessageAttachmentInterface::class, MessageAttachmentRepository::class);
        $this->app->bind(TicketInterface::class, TicketRepository::class);
        $this->app->bind(IdentityVerificationInterface::class, IdentityVerificationRepository::class);
        $this->app->bind(ConnectPackageInterface::class, ConnectPackageRepository::class);
        $this->app->bind(PaymentMethodInterface::class, PaymentMethodRepository::class);
        $this->app->bind(BankDetailsInterface::class, BankDetailsRepository::class);
        $this->app->bind(ReplyTicketInterface::class, ReplyTicketRepository::class);
        $this->app->bind(ProjectInterface::class, ProjectRepository::class);
        $this->app->bind(ProjectAttachmentInterface::class, ProjectAttachmentRepository::class);
        $this->app->bind(ReviewInterface::class, ReviewRepository::class);
        $this->app->bind(FavoriteJobInterface::class, FavoriteJobRepository::class);
        $this->app->bind(EmployHistoryInterface::class, EmployHistoryRepository::class);
        $this->app->bind(OfferMilestoneAttachmentInterface::class, OfferMilestoneAttachmentRepository::class);
        $this->app->bind(PaymentInterface::class, PaymentRepository::class);
        $this->app->bind(BalanceRequestInterface::class, BalanceRequestRepository::class);
        $this->app->bind(BalanceRequestPaymentInterface::class, BalanceRequestPaymentRepository::class);
        $this->app->bind(OfferRecentActivityInterface::class, OfferRecentActivityRepository::class);
        $this->app->bind(SportsCategoryInterface::class, SportsCategoryRepository::class);


    }
}
