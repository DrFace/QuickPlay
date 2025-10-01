<?php

use App\Http\Controllers\about\AboutUsController;
use App\Http\Controllers\Admin\AdminPagesController;
use App\Http\Controllers\Admin\AdminReplyTicketController;
use App\Http\Controllers\Admin\AdminTicketController;
use App\Http\Controllers\Admin\BalanceRequestController;
use App\Http\Controllers\Admin\BankDetailsController;
use App\Http\Controllers\Admin\ClientsController;
use App\Http\Controllers\Admin\ConnectPackageController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FreelancerController;
use App\Http\Controllers\Admin\IdentityVerificationController as AdminIdentityVerificationController;
use App\Http\Controllers\Admin\JobCategoryController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\SkillCategoryController;
use App\Http\Controllers\Auth\GoogleLoginController;
use App\Http\Controllers\Client\AiTipsController;
use App\Http\Controllers\Client\ApplicantViewController;
use App\Http\Controllers\Client\ContractsController as ClientContractsController;
use App\Http\Controllers\Client\DashboardController as ClientDashboardController;
use App\Http\Controllers\Client\FreelancerReviewController;
use App\Http\Controllers\Client\IdentityVerificationController;
use App\Http\Controllers\Client\JobController;
use App\Http\Controllers\Client\MessagesController;
use App\Http\Controllers\Client\OfferController;
use App\Http\Controllers\Client\OfferMilestoneController;
use App\Http\Controllers\Client\PaymentController as ClientPaymentController;
use App\Http\Controllers\Client\ReplyTicketController as ClientReplyTicketController;
use App\Http\Controllers\Client\SettingsController;
use App\Http\Controllers\Client\TalentController;
use App\Http\Controllers\Client\TicketController as ClientTicketController;
use App\Http\Controllers\Contact\ContactUsController;
use App\Http\Controllers\Freelancer\AccountSettingController;
use App\Http\Controllers\Freelancer\AiTipsController as FreelancerAiTipsController;
use App\Http\Controllers\Freelancer\ApplicantViewController as FreelancerApplicantViewController;
use App\Http\Controllers\Freelancer\ClientReviewController;
use App\Http\Controllers\Freelancer\ContractsController;
use App\Http\Controllers\Freelancer\CreditsController;
use App\Http\Controllers\Freelancer\DashboardController as FreelancerDashboardController;
use App\Http\Controllers\Freelancer\FinanceController;
use App\Http\Controllers\Freelancer\MessagesController as FreelancerMessagesController;
use App\Http\Controllers\Freelancer\OfferController as FreelancerOfferController;
use App\Http\Controllers\Freelancer\OfferMilestoneController as FreelancerOfferMilestoneController;
use App\Http\Controllers\Freelancer\PaymentController;
use App\Http\Controllers\Freelancer\PaymentMethodController;
use App\Http\Controllers\Freelancer\PaymentRequestController;
use App\Http\Controllers\Freelancer\ProfileController as FreelancerProfileController;
use App\Http\Controllers\Freelancer\ProjectController;
use App\Http\Controllers\Freelancer\ProposalController;
use App\Http\Controllers\Freelancer\ReplyTicketController;
use App\Http\Controllers\Freelancer\TicketController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Privacy\PrivacyController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, '__invoke'])->name('home');
Route::get('/privacy-policy', [PrivacyController::class, 'privacy'])->name('privacy-policy.index');
Route::get('/terms-service', [PrivacyController::class, 'term'])->name('terms-of-service.index');
Route::get('/user-agreement', [PrivacyController::class, 'userAgreement'])->name('agreements.index');
Route::get('/about', [AboutUsController::class, 'about'])->name('about.index');
Route::get('/contact', [ContactUsController::class, 'contact'])->name('contact.index');
Route::get('/jv/{job}', [JobController::class, 'showJob']);
Route::get('/profile/{freelancer}', [FreelancerProfileController::class, 'freelancerShow'])->name('profile.show');

Route::middleware('auth')->group(function () {

    Route::post('/profile/activate', [ProfileController::class, 'updateLiveStatus'])->name('profile.activate');
    Route::post('/profile/update-location', [ProfileController::class, 'updateLocation'])->name('profile.LocationUpdate');
    Route::post('/profile/update-image', [ProfileController::class, 'updateProfileImage'])->name('profile.ImageUpdate');
    Route::post('/profile/update-name', [ProfileController::class, 'updateName'])->name('profile.updateNameInfo');
    Route::post('/profile/update-email', [ProfileController::class, 'updateEmail'])->name('profile.updateEmail');
    Route::post('/profile/update-two-factor-info', [ProfileController::class, 'updateTwoFactorInfo'])->name('profile.updateTwoFactorInfo');
    Route::post('/profile/update-password-info', [ProfileController::class, 'updatePasswordInfo'])->name('profile.updatePasswordInfo');
    Route::post('/profile/{type}/send-otp', [ProfileController::class, 'sendOtpCode'])->name('profile.sendOtpCode');
    Route::post('/profile/send-otp', [ProfileController::class, 'sendOtp'])->name('profile.sendOtp');

    // notification delete
    Route::post('/notification/{id}', [ProfileController::class, 'deleteFunction'])->name('notification.delete');
    // notification mark as read
    Route::post('/notification/mark-as-read/all', [ProfileController::class, 'markAllAsRead'])->name('notification.mark-as-read');

    // client
    Route::prefix('client')->middleware('role:Client')->name('client.')->group(function () {

        Route::get('home', [ClientDashboardController::class, 'index'])->name('home');
        // job
        Route::get('job', [JobController::class, 'job'])->name('job');
        Route::get('job/create', [JobController::class, 'create'])->name('job.create');
        Route::post('job/{job}update', [JobController::class, 'jobUpdate'])->name('job.update');
        Route::post('job/{job}update-draft', [JobController::class, 'updateDraft'])->name('job.update-draft');
        Route::get('job/{job}', [JobController::class, 'show'])->name('job.show');
        Route::get('job/{job}/edit', [JobController::class, 'edit'])->name('job.edit');
        Route::post('job/{job}/delete', [JobController::class, 'delete'])->name('job.delete');
        Route::get('jobs/view', [JobController::class, 'allJobs'])->name('job.all');

        // applicant show
        Route::get('applicant/{proposal}', [ApplicantViewController::class, 'index'])->name('applicant.show');
        // freelancer show
        Route::get('freelancer/{freelancer}', [ApplicantViewController::class, 'freelancerShow'])->name('freelancer.show');
        // messages
        Route::get('messages', [MessagesController::class, 'index'])->name('messages');
        Route::get('messages/{proposal}', [MessagesController::class, 'show'])->name('messages.show');
        Route::post('messages/send', [MessagesController::class, 'sendMessage'])->name('messages.send');
        Route::get('getMessages/{chat_id}', [MessagesController::class, 'getMessages'])->name('messages.get');

        Route::get('/ai-tips/{description}', [AiTipsController::class, 'getTips'])->name('ai-tips');

        // Settings
        Route::get('settings', [SettingsController::class, 'index'])->name('settings');

        Route::post('settings/update-password-change-info', [SettingsController::class, 'updatePasswordInfo'])->name('settings.updatePasswordInfo');
        Route::post('settings/password-change-send-otp', [SettingsController::class, 'sendPasswordChangeOtp'])->name('settings.sendPasswordChangeOtp');

        // Talent
        Route::get('/talent', [TalentController::class, 'index'])->name('talent');
        Route::get('/talent/{freelancer}', [TalentController::class, 'freelancerShow'])->name('talent.show');

        Route::post('/identity-verification', [IdentityVerificationController::class, 'store'])->name('identity-verification.store');
        Route::post('/identity-verification/id-card', [IdentityVerificationController::class, 'IDCardImageStore'])->name('identity-verification.id-card.store');

        // offer
        Route::get('/offer/job/{job}/proposal/{proposal}', [OfferController::class, 'create'])->name('offer.create');
        Route::post('/offer/{offer}/price-update', [OfferController::class, 'priceUpdate'])->name('offer.price-update');
        Route::post('/offer/{offer}/title-update', [OfferController::class, 'titleUpdate'])->name('offer.title-update');
        Route::post('/offer/{offer}/description-update', [OfferController::class, 'descriptionUpdate'])->name('offer.description-update');
        Route::post('/offer/{offer}/update', [OfferController::class, 'update'])->name('offer.update');
        Route::get('/offer/{offer}/delete', [OfferController::class, 'delete'])->name('offer.delete');
        Route::get('/offer/{offer}', [OfferController::class, 'show'])->name('offer.show');

        Route::post('milestones/{milestone}/create', [OfferMilestoneController::class, 'createNewMilestone'])->name('newMilestones.create');
        Route::post('milestones/{milestone}/edit', [OfferMilestoneController::class, 'editMilestone'])->name('editMilestones.edit');

        Route::get('/offer/{offer}/hire', [JobController::class, 'hire'])->name('hire');
        Route::get('/payment-intent/{id}', [ClientPaymentController::class, 'createPaymentIntent'])->name('createPaymentIntent');
        Route::post('/process-payment', [ClientPaymentController::class, 'processPayment'])->name('processPayment');

        Route::get('/ticket', [ClientTicketController::class, 'ticket'])->name('ticket');
        Route::post('/ticket', [ClientTicketController::class, 'store']);

        Route::get('/ReplyTicket/{ticketId}', [ClientReplyTicketController::class, 'replies'])->name('ReplyTicket');
        Route::post('/ReplyTicket/{id}/reply', [ClientReplyTicketController::class, 'storeReply'])->name('ReplyTicket.storeReply');

        Route::get('/contracts/{id}', [ClientContractsController::class, 'show'])->name('contracts.show');
        Route::get('/contracts/{id}/review', [FreelancerReviewController::class, 'review'])->name('contracts.review');
        Route::post('/contracts/{id}/review-submit', [FreelancerReviewController::class, 'submitReview'])->name('contracts.review-submit');

        Route::post('/RequestChanges', [MessagesController::class, 'requestChanges'])->name('requestChanges.send');

        Route::get('/project/{id}/approve', [ClientContractsController::class, 'approveProject'])->name('project.approve');
        Route::get('/milestoneProject/{id}/approve', [ClientContractsController::class, 'approveMilestoneProject'])->name('milestoneProject.approve');
    });

    // freelancer
    Route::prefix('freelancer')->middleware('role:Freelancer')->name('freelancer.')->group(function () {

        // is_active
        Route::get('/profile', [FreelancerProfileController::class, 'index'])->name('profile');
        // Account settings
        Route::get('account-settings', [AccountSettingController::class, 'index'])->name('account');

        Route::prefix('account-settings')->name('account.')->group(function () {
            Route::post('/update-profile-info', [AccountSettingController::class, 'updateProfileInfo'])->name('updateProfileInfo');
            Route::post('/update-profile-visibility-info', [AccountSettingController::class, 'updateProfileVisibilityInfo'])->name('updateProfileVisibilityInfo');
            Route::post('/update-profile-experience-info', [AccountSettingController::class, 'updateProfileExperienceInfo'])->name('updateProfileExperienceInfo');
            Route::post('/update-job-category-info', [AccountSettingController::class, 'updateJobCategoryInfo'])->name('updateJobCategoryInfo');
            Route::get('/update-job-category-info/{id}/delete', [AccountSettingController::class, 'deleteJobCategoryInfo'])->name('deleteJobCategoryInfo');
        });

        // dashboard
        Route::get('dashboard', [FreelancerDashboardController::class, 'index'])->name('dashboard');
        // applicant show
        Route::get('applicant/{job}', [FreelancerApplicantViewController::class, 'index'])->name('applicant.show');

        // proposals
        Route::get('/proposals', [ProposalController::class, 'index'])->name('proposals.index');
        Route::get('proposals/create/{job}', [ProposalController::class, 'create'])->name('proposals.create');
        Route::get('proposals/Edit/{proposal}', [ProposalController::class, 'edit'])->name('proposals.edit');
        Route::post('proposals/store', [ProposalController::class, 'store'])->name('proposals.store');
        Route::post('proposals/{proposal}/update', [ProposalController::class, 'update'])->name('proposals.update');
        Route::post('proposals/{proposal}/destroy', [ProposalController::class, 'destroy'])->name('proposals.destroy');
        Route::get('/ai-tips/{description}', [FreelancerAiTipsController::class, 'getTips'])->name('ai-tips');
        Route::get('/proposals/{proposal}', [ProposalController::class, 'show'])->name('proposals.show');

        Route::get('/offer/{offer}', [FreelancerOfferController::class, 'show'])->name('offer.show');
        Route::get('/offer/{offer}/accept', [FreelancerOfferController::class, 'accept'])->name('offer.accept');
        Route::get('/offer/{offer}/decline', [FreelancerOfferController::class, 'decline'])->name('offer.decline');

        Route::get('/contracts', [ContractsController::class, 'index'])->name('contracts.index');
        Route::get('/contract/{id}', [ContractsController::class, 'show'])->name('contract.show');
        Route::get('/contracts/{id}/review', [ClientReviewController::class, 'review'])->name('contracts.review');
        Route::post('/contracts/{id}/review-submit', [ClientReviewController::class, 'submitReview'])->name('contracts.review-submit');

        Route::post('/project/{id}/submit', [ProjectController::class, 'submitProject'])->name('project.submit');
        Route::post('/projectMilestone/{id}/submit', [ProjectController::class, 'submitProjectMilestone'])->name('projectMilestone.submit');

        Route::post('milestones/{milestone}/request', [FreelancerOfferMilestoneController::class, 'requestNewMilestone'])->name('newMilestones.request');
        Route::post('milestones/{milestone}/edit', [FreelancerOfferMilestoneController::class, 'editMilestone'])->name('editMilestones.edit');

        // Credits
        Route::get('/credits', [CreditsController::class, 'index'])->name('credits');
        Route::post('/credits', [CreditsController::class, 'store'])->name('credits.store');

        // portfolio
        Route::post('/portfolio', [FreelancerProfileController::class, 'storePortfolio'])->name('portfolio.store');
        Route::post('/portfolio/draft', [FreelancerProfileController::class, 'storeDraftPortfolio'])->name('portfolio.store-draft');
        Route::post('/portfolio/{id}/delete', [FreelancerProfileController::class, 'deletePortfolio'])->name('portfolio.delete');
        Route::post('/portfolio/{id}/update', [FreelancerProfileController::class, 'updatePortfolio'])->name('portfolio.update');
        Route::post('/portfolio/{id}/Update/draft', [FreelancerProfileController::class, 'updateDraftPortfolio'])->name('portfolio.update-draft');
        Route::post('/portfolio/{id}/publish', [FreelancerProfileController::class, 'publishPortfolio'])->name('portfolio.publish');

        Route::Post('/Title/Update', [FreelancerProfileController::class, 'updateTitle'])->name('title.update');
        Route::Post('/Profile-overview/Update', [FreelancerProfileController::class, 'updateProfileOverview'])->name('profile-overview.update');
        Route::Post('/Youtube/Update', [FreelancerProfileController::class, 'updateYoutube'])->name('youtube.update');
        Route::Post('/Education/Store', [FreelancerProfileController::class, 'storeEducation'])->name('education.store');
        Route::Post('/Education/{id}/Update', [FreelancerProfileController::class, 'updateEducation'])->name('education.update');
        Route::Post('/Education/{id}/Delete', [FreelancerProfileController::class, 'deleteEducation'])->name('education.delete');
        Route::Post('/Language/Store', [FreelancerProfileController::class, 'storeLanguage'])->name('language.store');
        Route::post('/Language/{id}/delete', [FreelancerProfileController::class, 'deleteLanguage'])->name('language.delete');
        Route::post('/FavoriteJob/Store', [FreelancerProfileController::class, 'addFavoriteJobs'])->name('favoriteJob.store');
        Route::post('/Employment/{id}/delete', [FreelancerProfileController::class, 'deleteEmployHistory'])->name('employment.delete');
        Route::post('/Employment/Store', [FreelancerProfileController::class, 'addEmployHistory'])->name('employment.store');

        Route::post('/Skills/Update', [FreelancerProfileController::class, 'updateSkills'])->name('skills.update');

        // financial
        Route::get('/financial', [FinanceController::class, 'financeOverview'])->name('financial.overview');
        Route::get('/financial/history', [FinanceController::class, 'financeHistory'])->name('financial.history');

        // messages
        Route::get('messages', [FreelancerMessagesController::class, 'index'])->name('messages');
        Route::get('messages/{proposal}', [FreelancerMessagesController::class, 'show'])->name('messages.show');
        Route::post('messages/send', [FreelancerMessagesController::class, 'sendMessage'])->name('messages.send');
        Route::get('getMessages/{chat_id}', [FreelancerMessagesController::class, 'getMessages'])->name('messages.get');

        // checkout
        Route::get('/payment-success', [CreditsController::class, 'paymentSuccess'])->name('success');
        Route::get('/payment-cancel', [CreditsController::class, 'paymentCancel'])->name('cancel');

        Route::get('/payment-intent/{id}', [PaymentController::class, 'createPaymentIntent'])->name('createPaymentIntent');
        Route::post('/process-payment', [PaymentController::class, 'processPayment'])->name('processPayment');

        Route::post('/request-payment', [PaymentRequestController::class, 'requestAvailablePayment'])->name('requestPayment');

        Route::get('/export/file', [PaymentRequestController::class, 'export'])->name('transactions.export');

        Route::get('/download/{id}', [PaymentRequestController::class, 'InvoiceDownload'])->name('transactions.invoice.download');

        // Ticket

        Route::get('/ticket', [TicketController::class, 'ticket'])->name('ticket');
        Route::post('/ticket', [TicketController::class, 'store']);

        Route::get('/ReplyTicket/{ticketId}', [ReplyTicketController::class, 'replies'])->name('ReplyTicket');
        Route::post('/ReplyTicket/{id}/reply', [ReplyTicketController::class, 'storeReply'])->name('ReplyTicket.storeReply');

        Route::Post('/BankMethod/{id}/Delete', [PaymentMethodController::class, 'deleteBankMethod'])->name('bankMethod.delete');
        Route::Post('/BankMethod/Store', [PaymentMethodController::class, 'storeBankMethod'])->name('bankMethod.store');

        // Route::get('/contracts/{id}/show', [ContractsController::class, 'show'])->name('contracts.show');

        Route::get('/complete/profile', [ProfileController::class, 'profileComplete'])->name('complete.profile');
    });

    // admin
    Route::prefix('admin')->middleware('role:Admin')->name('admin.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        // pages
        Route::get('/pages/edit', [AdminPagesController::class, 'edit'])->name('pages.edit');
        Route::post('/pages/update', [AdminPagesController::class, 'update'])->name('pages.update');
        // job categories
        Route::post('/categories/{category}/update', [JobCategoryController::class, 'updateCategory'])->name('categories.info.update');
        Route::resource('categories', JobCategoryController::class);
        // Client
        Route::resource('clients', ClientsController::class);

        // skill categories
        Route::post('/skills/{skill}/update', [SkillCategoryController::class, 'updateSkillCategory'])->name('skills.info.update');
        Route::resource('skills', SkillCategoryController::class);
        

        // tickets
        Route::get('/tickets', [AdminTicketController::class, 'index'])->name('tickets.index');
        Route::get('/tickets/{ticket}', [AdminReplyTicketController::class, 'show'])->name('tickets.show');

        Route::get('/tickets/{ticketId}', [AdminReplyTicketController::class, 'replies'])->name('ReplyTicket');
        Route::post('/tickets/{id}/reply', [AdminReplyTicketController::class, 'storeReply'])->name('ReplyTicket.storeReply');
        Route::post('/tickets/{id}/status', [AdminReplyTicketController::class, 'updateStatus'])->name('tickets.updateStatus');

        // connect Packages
        Route::post('/connect-packages/{connect_package}/update', [ConnectPackageController::class, 'updateConnectPackage'])->name('connect-packages.info.update');
        Route::resource('connect-packages', ConnectPackageController::class);

        // payments
        Route::post('/payments/{payment}/update', [AdminPaymentController::class, 'updatePayment'])->name('payments.info.update');
        Route::resource('payments', AdminPaymentController::class);

        // balance requests
        Route::post('/balance-requests/{balance_request}/update', [BalanceRequestController::class, 'updateBalanceRequest'])->name('balance-requests.info.update');
        Route::resource('balance-requests', BalanceRequestController::class);

        // freelancers
        Route::resource('freelancers', FreelancerController::class);

        Route::post('/identity-verifications/{identity_verification}/update', [AdminIdentityVerificationController::class, 'update'])->name('identity-verifications.info.update');
        Route::resource('identity-verifications', AdminIdentityVerificationController::class);

        Route::post('/bank-details/{bank_detail}/update', [BankDetailsController::class, 'update'])->name('bank-details.info.update');
        Route::resource('bank-details', BankDetailsController::class);
    });
});

// google login
Route::get('/auth/redirect/register', [GoogleLoginController::class, 'redirectToGoogleFromRegister'])->name('google.register');
Route::get('/auth/redirect/login', [GoogleLoginController::class, 'redirectToGoogleFromLogin'])->name('google.login');
Route::get('/soc-auth/callback/google', [GoogleLoginController::class, 'handleGoogleCallback']);

require __DIR__.'/auth.php';
