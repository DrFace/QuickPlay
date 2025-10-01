import { User } from "@/types";
import { useState } from "react";
import { ArrowUpOnSquareIcon, CheckIcon, DocumentIcon } from "@heroicons/react/24/outline";
import CameraModal from "./CameraModal";
import ConfirmationModal from "./SelfieConfirmationModal";
import IDUploadModal from './IDUploadModal';
import path from "path";

export default function IdentityVerification(
    {
    user,
    status ,
    rejectReason,
}: {
    user: User,
    status: string,
    rejectReason: string,
 }) {
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [selfieImage, setSelfieImage] = useState<string | null>(null);
    const [showIDUploadModal, setShowIDUploadModal] = useState(false);



    const handleOpenCamera = () => {
        setShowCameraModal(true);
    };
    const handleCloseCamera = () => {
        setShowCameraModal(false);
    };
    const handleConfirmSelfie = (selfieUrl: string) => {
        setSelfieImage(selfieUrl);
        setShowCameraModal(false);
        setShowConfirmationModal(true);
    };
    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
    };

    const handleIDUpload = () => {
        setShowIDUploadModal(true);
    };

    const handleCloseIDUploadModal = () => {
        setShowIDUploadModal(false);
    };


    return (

        <div className="w-full h-auto bg-white ">
            <div className="p-6 space-y-4 ">
                <h2 className="text-lg font-semibold text-gray-900">Identity verification</h2>
                <p className="text-gray-500 text-m">
                    you're completed an important part of estabilishing trual in our global work markatplace.
                </p>
                <div className="space-y-6">

                    <div className="relative flex items-start space-x-3 sm:flex-row sm:items-center sm:space-x-3">


                        {status === "start" ? (
                            <div>
                                <div className="relative flex items-start space-x-3 sm:flex-row sm:items-center sm:space-x-3">
                                    <div className="flex items-center justify-center w-8 h-8 mb-12 font-bold rounded-full">
                                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.5" y="0.5" width="33" height="33" rx="16.5" stroke="#004AAD" />
                                            <path d="M20.6168 10.2769L19.5932 7.64813C19.3774 7.23938 19.0817 6.98438 18.7503 6.98438H15.2126C14.8811 6.98438 14.5854 7.23938 14.3697 7.64813L13.3461 10.2769C13.1303 10.6863 12.8523 10.9844 12.5208 10.9844H10.2137C9.88731 10.9844 9.57432 11.1951 9.34356 11.5702C9.1128 11.9452 8.98315 12.4539 8.98315 12.9844V24.9844C8.98315 25.5148 9.1128 26.0235 9.34356 26.3986C9.57432 26.7737 9.88731 26.9844 10.2137 26.9844H23.7492C24.0755 26.9844 24.3885 26.7737 24.6193 26.3986C24.85 26.0235 24.9797 25.5148 24.9797 24.9844V12.9844C24.9797 12.4539 24.85 11.9452 24.6193 11.5702C24.3885 11.1951 24.0755 10.9844 23.7492 10.9844H21.4804C21.1478 10.9844 20.8325 10.6863 20.6168 10.2769Z" stroke="#004AAD" stroke-width="1.00189" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M11.9126 10.8711V9.48438H10.9818V10.8711" stroke="#004AAD" stroke-width="1.00189" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M20.0488 18.8109V17.9789C20.0486 17.0301 19.8822 16.101 19.5693 15.3001C19.2563 14.4992 18.8096 13.8596 18.2814 13.4558C17.7531 13.0521 17.1651 12.9009 16.5859 13.02C16.0068 13.1391 15.4605 13.5235 15.0107 14.1284M13.9047 17.1582V17.9902C13.9051 18.937 14.0709 19.8642 14.3828 20.6639C14.6946 21.4635 15.1398 22.1029 15.6664 22.5075C16.1931 22.9122 16.7796 23.0655 17.3577 22.9497C17.9359 22.8339 18.4819 22.4536 18.9324 21.8532" stroke="#004AAD" stroke-width="1.00189" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M14.6816 17.9904L13.9089 16.7344L13.1361 17.9904" stroke="#004AAD" stroke-width="1.00189" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M20.8335 17.9844L20.0607 19.2404L19.288 17.9844" stroke="#004AAD" stroke-width="1.00189" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                    </div>
                                    <div>
                                        <h3 className="mt-4 font-semibold text-blue-900">Appear on camera</h3>
                                        <p className="text-sm text-blue-700">To show us it's really you. Take an automatic selfie or join a video chat.</p>
                                        <button className="px-4 py-2 mt-2 text-white bg-blue-900 rounded-lg shadow hover:bg-blue-700" onClick={handleOpenCamera}>
                                            Open Camera
                                        </button>
                                    </div>
                                </div>

                                <div className="relative flex items-start mt-4 space-x-3 sm:items-center">
                                    <div className="flex items-center justify-center w-8 h-8 mb-5 font-bold border border-gray-600 rounded-full">
                                        <DocumentIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Show us a government-issued photo ID</h3>
                                        <p className="text-sm text-gray-500">We'll check that the country where your ID is from matches the country in your profile.</p>
                                    </div>
                                    <div className="absolute h-20 mt-2 border-l-2 border-gray-300 left-1 top-6"></div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-8 h-8 mt-12 font-bold border border-gray-600 rounded-full">
                                        <CheckIcon className="w-6 h-6" />
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="font-semibold text-gray-900 mt-9">Submit for identity review</h3>
                                        <p className="text-sm text-gray-500">
                                            We can't instantly verify you. We'll start a manual review process.
                                        </p>
                                    </div>
                                </div>

                            </div>



                        ) : (
                            <div className="relative flex items-start space-x-3 sm:flex-row sm:items-center sm:space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 mb-12 font-bold rounded-full">
                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0.5" y="0.5" width="33" height="33" rx="16.5" fill="#004AAD" />
                                        <rect x="0.5" y="0.5" width="33" height="33" rx="16.5" stroke="#004AAD" />
                                        <path d="M23.266 11.8694H21.1593C21.0522 11.8694 20.9194 11.7812 20.8158 11.6422L19.8896 9.78167C19.8749 9.75214 19.8586 9.72404 19.8407 9.6976C19.5207 9.2227 19.0883 8.96094 18.6242 8.96094H15.3392C14.875 8.96094 14.4426 9.2227 14.1226 9.6976C14.1047 9.72404 14.0884 9.75214 14.0737 9.78167L13.1475 11.6449C13.0682 11.7549 12.9568 11.8721 12.8397 11.8721V11.5086C12.8397 11.3157 12.7795 11.1308 12.6724 10.9944C12.5652 10.8581 12.4199 10.7815 12.2684 10.7815H11.4114C11.2599 10.7815 11.1146 10.8581 11.0075 10.9944C10.9003 11.1308 10.8401 11.3157 10.8401 11.5086V11.8721H10.6973C10.2429 11.8727 9.80723 12.1027 9.48591 12.5117C9.1646 12.9206 8.98387 13.4751 8.9834 14.0535V22.7761C8.98387 23.3545 9.1646 23.9089 9.48591 24.3179C9.80723 24.7268 10.2429 24.9569 10.6973 24.9575H23.266C23.7204 24.9569 24.1561 24.7268 24.4774 24.3179C24.7987 23.9089 24.9794 23.3545 24.9799 22.7761V14.0507C24.9794 13.4724 24.7987 12.9179 24.4774 12.509C24.1561 12.1 23.7204 11.87 23.266 11.8694ZM19.154 21.0628C18.6872 21.5487 18.1281 21.8693 17.5329 21.9923C16.9377 22.1154 16.3275 22.0366 15.7639 21.7639C15.2003 21.4912 14.7031 21.0341 14.3225 20.4389C13.9419 19.8437 13.6913 19.1312 13.596 18.3734C13.474 18.4261 13.3416 18.4248 13.2203 18.3697C13.099 18.3145 12.9959 18.2089 12.9277 18.0698C12.8595 17.9307 12.8303 17.7663 12.8447 17.6034C12.8591 17.4405 12.9164 17.2886 13.0072 17.1723L13.7213 16.2634C13.8284 16.1272 13.9737 16.0506 14.1251 16.0506C14.2766 16.0506 14.4218 16.1272 14.529 16.2634L15.2431 17.1723C15.323 17.274 15.3773 17.4035 15.3993 17.5445C15.4214 17.6856 15.4101 17.8317 15.3668 17.9645C15.3236 18.0973 15.2504 18.2109 15.1565 18.2908C15.0626 18.3707 14.9522 18.4134 14.8393 18.4134C14.8154 18.4131 14.7915 18.4109 14.7679 18.4071C14.8634 18.881 15.0513 19.3165 15.3141 19.6736C15.5769 20.0307 15.9062 20.2977 16.2715 20.45C16.6368 20.6023 17.0264 20.635 17.4043 20.545C17.7822 20.4551 18.1361 20.2454 18.4335 19.9354C18.4916 19.8746 18.5586 19.829 18.6306 19.8012C18.7026 19.7734 18.7782 19.7641 18.8531 19.7736C18.9279 19.7831 19.0006 19.8114 19.0668 19.8567C19.1331 19.9021 19.1917 19.9636 19.2392 20.0379C19.2867 20.1121 19.3222 20.1976 19.3437 20.2893C19.3652 20.3811 19.3723 20.4774 19.3645 20.5726C19.3567 20.6678 19.3341 20.7602 19.2982 20.8443C19.2623 20.9284 19.2137 21.0027 19.1551 21.0628H19.154ZM20.9561 18.1998L20.242 19.1087C20.1349 19.245 19.9896 19.3215 19.8382 19.3215C19.6867 19.3215 19.5415 19.245 19.4343 19.1087L18.7202 18.1998C18.6367 18.0932 18.5812 17.9562 18.5615 17.8078C18.5417 17.6594 18.5587 17.5068 18.61 17.3711C18.6613 17.2355 18.7444 17.1234 18.8479 17.0505C18.9513 16.9775 19.07 16.9472 19.1876 16.9637C19.0922 16.489 18.904 16.0527 18.6406 15.6953C18.3773 15.3378 18.0472 15.0709 17.6811 14.9192C17.315 14.7675 16.9248 14.736 16.5466 14.8276C16.1683 14.9192 15.8144 15.131 15.5177 15.4432C15.4603 15.5078 15.3933 15.557 15.3207 15.588C15.248 15.619 15.1712 15.6311 15.0948 15.6235C15.0185 15.616 14.944 15.5889 14.876 15.544C14.808 15.4991 14.7478 15.4373 14.699 15.3622C14.6501 15.287 14.6137 15.2002 14.5917 15.1068C14.5698 15.0133 14.5628 14.9152 14.5713 14.8183C14.5798 14.7214 14.6035 14.6277 14.641 14.5426C14.6785 14.4576 14.729 14.3831 14.7896 14.3234C15.2557 13.8329 15.8155 13.508 16.4121 13.3819C17.0087 13.2557 17.6209 13.3326 18.1866 13.6049C18.7523 13.8772 19.2513 14.3352 19.633 14.9323C20.0147 15.5293 20.2655 16.2443 20.3598 17.0046C20.4819 16.9493 20.6151 16.9484 20.7376 17.002C20.8601 17.0557 20.9646 17.1608 21.034 17.3C21.1034 17.4392 21.1336 17.6043 21.1196 17.7682C21.1056 17.9322 21.0482 18.0852 20.9569 18.2021L20.9561 18.1998Z" fill="white" />
                                    </svg>

                                </div>
                                <div>
                                    <h3 className="mt-4 font-semibold text-blue-900">Appear on camera</h3>
                                    <p className="text-sm text-blue-700">To show us it's really you. Take an automatic selfie or join a video chat.</p>

                                    <div className="flex items-center justify-center w-8 h-8 mb-3 font-bold text-white rounded-full">
                                        <svg width="29" height="29" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.5" y="0.5" width="26" height="26" rx="13" stroke="black" />
                                            <path d="M13.4863 16.3146C14.4724 16.3146 15.2718 15.2972 15.2718 14.0421C15.2718 12.787 14.4724 11.7695 13.4863 11.7695C12.5001 11.7695 11.7007 12.787 11.7007 14.0421C11.7007 15.2972 12.5001 16.3146 13.4863 16.3146Z" fill="#004AAD" />
                                            <path d="M18.3951 9.49684H16.7493C16.6656 9.49684 16.5618 9.42796 16.4809 9.31932L15.7573 7.8658C15.7458 7.84274 15.7331 7.82078 15.7191 7.80012C15.4691 7.42911 15.1313 7.22461 14.7687 7.22461H12.2023C11.8396 7.22461 11.5018 7.42911 11.2518 7.80012C11.2378 7.82078 11.2251 7.84274 11.2136 7.8658L10.49 9.32145C10.4281 9.40737 10.3411 9.49897 10.2496 9.49897V9.21494C10.2496 9.06428 10.2025 8.9198 10.1188 8.81327C10.0351 8.70673 9.9216 8.64688 9.80322 8.64688H9.13373C9.01535 8.64688 8.90182 8.70673 8.81812 8.81327C8.73442 8.9198 8.68739 9.06428 8.68739 9.21494V9.49897H8.57581C8.2208 9.49944 7.88044 9.67914 7.62941 9.99863C7.37838 10.3181 7.23719 10.7513 7.23682 11.2031V18.0177C7.23719 18.4695 7.37838 18.9027 7.62941 19.2222C7.88044 19.5417 8.2208 19.7214 8.57581 19.7219H18.3951C18.7501 19.7214 19.0905 19.5417 19.3415 19.2222C19.5925 18.9027 19.7337 18.4695 19.7341 18.0177V11.201C19.7337 10.7492 19.5925 10.316 19.3415 9.9965C19.0905 9.67701 18.7501 9.49731 18.3951 9.49684ZM13.4855 17.4497C12.9558 17.4497 12.438 17.2498 11.9976 16.8752C11.5573 16.5007 11.214 15.9684 11.0113 15.3456C10.8086 14.7228 10.7556 14.0375 10.8589 13.3764C10.9623 12.7152 11.2173 12.1079 11.5918 11.6312C11.9664 11.1546 12.4435 10.83 12.963 10.6984C13.4825 10.5669 14.0209 10.6344 14.5103 10.8924C14.9996 11.1504 15.4179 11.5872 15.7121 12.1477C16.0064 12.7082 16.1634 13.3672 16.1634 14.0413C16.1626 14.9449 15.8802 15.8113 15.3782 16.4502C14.8761 17.0892 14.1955 17.4486 13.4855 17.4497Z" fill="#004AAD" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}



                        <div className="absolute h-20 mt-3 border-l-2 border-blue-700 left-1 top-8 sm:top-8 "></div>
                    </div>


                    {status === "step_one_done" ? (
                        <div>
                            <div className="relative flex items-start space-x-3 sm:items-center">
                                <div className="flex items-center justify-center w-8 h-8 mb-12 font-bold border border-blue-900 rounded-full">
                                    <DocumentIcon className="w-6 h-6 text-blue-900" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-blue-900">Show us a government-issued photo ID</h3>
                                    <p className="text-sm text-blue-700">
                                        We'll check that the country where your ID is from matches the country in your profile.
                                    </p>

                                    <div className="mt-1">
                                        <button
                                            className="px-3 py-1 text-white bg-blue-900 shadow rounded-3xl hover:bg-blue-700"
                                            onClick={handleIDUpload}
                                        >
                                            Upload ID
                                        </button>

                                    </div>
                                </div>
                                <div className="absolute h-20 border-l-2 border-gray-300 left-1 top-10"></div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 mt-6 font-bold border border-gray-600 rounded-full">
                                    <CheckIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mt-11">Submit for identity review</h3>
                                    <p className="text-sm text-gray-500">
                                        We can't instantly verify you. We'll start a manual review process.
                                    </p>
                                </div>
                            </div>
                        </div>






                    ) : (status === "step_two_done" ? (

                        <div>
                            <div className="relative flex items-start space-x-3 sm:items-center">
                                <div className="flex items-center justify-center w-8 h-8 mb-12 bg-blue-900 border border-gray-600 rounded-full">
                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0.5" y="0.5" width="33" height="33" rx="16.5" fill="#004AAD" />
                                        <rect x="0.5" y="0.5" width="33" height="33" rx="16.5" stroke="#004AAD" />
                                        <path d="M26.354 15.8876H19.195C18.544 15.8876 17.9196 15.6392 17.4593 15.1972C16.999 14.7551 16.7404 14.1556 16.7404 13.5304V6.65541C16.7404 6.60332 16.7189 6.55335 16.6805 6.51652C16.6421 6.47968 16.5901 6.45898 16.5359 6.45898H11.8313C10.9633 6.45898 10.1309 6.79011 9.51715 7.37951C8.9034 7.96891 8.55859 8.7683 8.55859 9.60184V25.3161C8.55859 26.1497 8.9034 26.9491 9.51715 27.5385C10.1309 28.1279 10.9633 28.459 11.8313 28.459H23.2859C24.1538 28.459 24.9863 28.1279 25.6 27.5385C26.2138 26.9491 26.5586 26.1497 26.5586 25.3161V16.084C26.5586 16.0319 26.537 15.9819 26.4987 15.9451C26.4603 15.9083 26.4083 15.8876 26.354 15.8876Z" fill="white" />
                                        <path d="M25.9044 14.1483L18.5494 7.08521C18.5351 7.07155 18.5169 7.06226 18.4971 7.05851C18.4773 7.05475 18.4568 7.05669 18.4382 7.06409C18.4196 7.0715 18.4036 7.08402 18.3924 7.1001C18.3811 7.11618 18.3751 7.13509 18.375 7.15446V13.53C18.375 13.7384 18.4612 13.9383 18.6147 14.0856C18.7681 14.233 18.9763 14.3158 19.1933 14.3158H25.8323C25.8524 14.3157 25.8721 14.3099 25.8889 14.2991C25.9056 14.2883 25.9186 14.273 25.9264 14.2551C25.9341 14.2372 25.9361 14.2175 25.9322 14.1985C25.9283 14.1795 25.9186 14.162 25.9044 14.1483Z" fill="white" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-blue-900">Show us a government-issued photo ID</h3>
                                    <p className="text-sm text-blue-600">
                                        We'll check that the country where your ID is from matches the country in your profile.
                                    </p>

                                    <div className="flex items-center justify-center w-8 h-8 mt-3 text-blue-800 rounded-full">
                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.3604 8.5957H13.2822V15.6758C13.2822 15.883 13.1999 16.0817 13.0534 16.2282C12.9069 16.3747 12.7082 16.457 12.501 16.457C12.2938 16.457 12.0951 16.3747 11.9486 16.2282C11.802 16.0817 11.7197 15.883 11.7197 15.6758V8.5957H6.6416C5.91664 8.59648 5.22159 8.88481 4.70896 9.39744C4.19634 9.91007 3.908 10.6051 3.90723 11.3301V20.7051C3.908 21.43 4.19634 22.1251 4.70896 22.6377C5.22159 23.1504 5.91664 23.4387 6.6416 23.4395H18.3604C19.0853 23.4387 19.7804 23.1504 20.293 22.6377C20.8056 22.1251 21.094 21.43 21.0947 20.7051V11.3301C21.094 10.6051 20.8056 9.91007 20.293 9.39744C19.7804 8.88481 19.0853 8.59648 18.3604 8.5957Z" fill="#004AAD" />
                                            <path d="M13.2825 4.23195L15.8557 6.80458C16.0034 6.94493 16.2001 7.02202 16.4038 7.01941C16.6076 7.0168 16.8023 6.9347 16.9463 6.79062C17.0904 6.64654 17.1725 6.45187 17.1751 6.24812C17.1777 6.04437 17.1007 5.84766 16.9603 5.69993L13.0535 1.79313C12.907 1.6467 12.7083 1.56445 12.5012 1.56445C12.294 1.56445 12.0954 1.6467 11.9488 1.79313L8.04204 5.69993C7.90169 5.84766 7.8246 6.04437 7.82721 6.24812C7.82982 6.45187 7.91192 6.64654 8.056 6.79062C8.20009 6.9347 8.39476 7.0168 8.59851 7.01941C8.80226 7.02202 8.99896 6.94493 9.14669 6.80458L11.7198 4.23195V8.59634H13.2825V4.23195Z" fill="#004AAD" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="absolute h-20 mt-1 border-l-2 border-blue-700 left-1 top-8 sm:top-8 "></div>
                            </div>


                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 mt-5 font-bold border border-blue-900 rounded-full">
                                    <CheckIcon className="w-6 h-6 text-blue-900" />
                                </div>
                                <div>
                                    <h3 className="mt-6 font-semibold text-blue-900">Submit for identity review</h3>
                                    <p className="text-sm text-blue-600">
                                        We can't instantly verify you. We'll start a manual review process.
                                    </p>
                                </div>

                            </div>
                        </div>


                    ) : (null)
                    )
                    }

                    {status === "verified" ? (
                        <div>
                            <div className="relative flex items-start space-x-3 sm:items-center">
                                <div className="flex items-center justify-center w-8 h-8 mb-12 bg-blue-700 border border-gray-600 rounded-full">
                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0.5" y="0.5" width="33" height="33" rx="16.5" fill="#004AAD" />
                                        <rect x="0.5" y="0.5" width="33" height="33" rx="16.5" stroke="#004AAD" />
                                        <path d="M26.354 15.8876H19.195C18.544 15.8876 17.9196 15.6392 17.4593 15.1972C16.999 14.7551 16.7404 14.1556 16.7404 13.5304V6.65541C16.7404 6.60332 16.7189 6.55335 16.6805 6.51652C16.6421 6.47968 16.5901 6.45898 16.5359 6.45898H11.8313C10.9633 6.45898 10.1309 6.79011 9.51715 7.37951C8.9034 7.96891 8.55859 8.7683 8.55859 9.60184V25.3161C8.55859 26.1497 8.9034 26.9491 9.51715 27.5385C10.1309 28.1279 10.9633 28.459 11.8313 28.459H23.2859C24.1538 28.459 24.9863 28.1279 25.6 27.5385C26.2138 26.9491 26.5586 26.1497 26.5586 25.3161V16.084C26.5586 16.0319 26.537 15.9819 26.4987 15.9451C26.4603 15.9083 26.4083 15.8876 26.354 15.8876Z" fill="white" />
                                        <path d="M25.9044 14.1483L18.5494 7.08521C18.5351 7.07155 18.5169 7.06226 18.4971 7.05851C18.4773 7.05475 18.4568 7.05669 18.4382 7.06409C18.4196 7.0715 18.4036 7.08402 18.3924 7.1001C18.3811 7.11618 18.3751 7.13509 18.375 7.15446V13.53C18.375 13.7384 18.4612 13.9383 18.6147 14.0856C18.7681 14.233 18.9763 14.3158 19.1933 14.3158H25.8323C25.8524 14.3157 25.8721 14.3099 25.8889 14.2991C25.9056 14.2883 25.9186 14.273 25.9264 14.2551C25.9341 14.2372 25.9361 14.2175 25.9322 14.1985C25.9283 14.1795 25.9186 14.162 25.9044 14.1483Z" fill="white" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-blue-900">Show us a government-issued photo ID</h3>
                                    <p className="text-sm text-blue-600">
                                        We'll check that the country where your ID is from matches the country in your profile.
                                    </p>

                                    <div className="flex items-center justify-center w-8 h-8 mt-3 text-blue-800 rounded-full">
                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.3604 8.5957H13.2822V15.6758C13.2822 15.883 13.1999 16.0817 13.0534 16.2282C12.9069 16.3747 12.7082 16.457 12.501 16.457C12.2938 16.457 12.0951 16.3747 11.9486 16.2282C11.802 16.0817 11.7197 15.883 11.7197 15.6758V8.5957H6.6416C5.91664 8.59648 5.22159 8.88481 4.70896 9.39744C4.19634 9.91007 3.908 10.6051 3.90723 11.3301V20.7051C3.908 21.43 4.19634 22.1251 4.70896 22.6377C5.22159 23.1504 5.91664 23.4387 6.6416 23.4395H18.3604C19.0853 23.4387 19.7804 23.1504 20.293 22.6377C20.8056 22.1251 21.094 21.43 21.0947 20.7051V11.3301C21.094 10.6051 20.8056 9.91007 20.293 9.39744C19.7804 8.88481 19.0853 8.59648 18.3604 8.5957Z" fill="#004AAD" />
                                            <path d="M13.2825 4.23195L15.8557 6.80458C16.0034 6.94493 16.2001 7.02202 16.4038 7.01941C16.6076 7.0168 16.8023 6.9347 16.9463 6.79062C17.0904 6.64654 17.1725 6.45187 17.1751 6.24812C17.1777 6.04437 17.1007 5.84766 16.9603 5.69993L13.0535 1.79313C12.907 1.6467 12.7083 1.56445 12.5012 1.56445C12.294 1.56445 12.0954 1.6467 11.9488 1.79313L8.04204 5.69993C7.90169 5.84766 7.8246 6.04437 7.82721 6.24812C7.82982 6.45187 7.91192 6.64654 8.056 6.79062C8.20009 6.9347 8.39476 7.0168 8.59851 7.01941C8.80226 7.02202 8.99896 6.94493 9.14669 6.80458L11.7198 4.23195V8.59634H13.2825V4.23195Z" fill="#004AAD" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="absolute h-20 mt-1 border-l-2 border-blue-700 left-1 top-6 sm:top-8 "></div>
                            </div>


                            <div className="flex items-center space-x-3 sm:items-center">
                                <div className="flex items-center justify-center w-8 h-8 mt-5 font-bold text-white bg-blue-900 border border-blue-900 rounded-full">
                                    <CheckIcon className="w-6 h-6 " />
                                </div>
                                <div>
                                    <h3 className="mt-6 font-semibold text-blue-900">Submit for identity review</h3>
                                    <p className="text-sm text-blue-600">
                                        We can't instantly verify you. We'll start a manual review process.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-row items-center w-10 h-10 gap-2 mt-1 ml-12 rounded-full">
                            <div>
                                <svg
                                    width="21"
                                    height="21"
                                    viewBox="0 0 21 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M17.5313 0.34375H3.46875C2.64023 0.344655 1.8459 0.674186 1.26004 1.26004C0.674186 1.8459 0.344655 2.64023 0.34375 3.46875V17.5313C0.344655 18.3598 0.674186 19.1541 1.26004 19.74C1.8459 20.3258 2.64023 20.6553 3.46875 20.6563H17.5313C18.3598 20.6553 19.1541 20.3258 19.74 19.74C20.3258 19.1541 20.6553 18.3598 20.6563 17.5313V3.46875C20.6553 2.64023 20.3258 1.8459 19.74 1.26004C19.1541 0.674186 18.3598 0.344655 17.5313 0.34375ZM15.7856 7.09619L9.22315 14.9087C9.15116 14.9944 9.06159 15.0637 8.96049 15.1118C8.8594 15.1599 8.74915 15.1857 8.63721 15.1875H8.62402C8.51452 15.1875 8.40625 15.1644 8.30623 15.1198C8.20622 15.0752 8.11669 15.0101 8.04346 14.9287L5.23096 11.8037C5.15953 11.728 5.10397 11.6387 5.06753 11.5411C5.0311 11.4436 5.01453 11.3398 5.0188 11.2357C5.02307 11.1317 5.0481 11.0296 5.0924 10.9353C5.1367 10.8411 5.1994 10.7567 5.27679 10.687C5.35419 10.6174 5.44473 10.5639 5.54309 10.5298C5.64144 10.4956 5.74564 10.4815 5.84954 10.4881C5.95345 10.4948 6.05497 10.5222 6.14814 10.5687C6.24132 10.6152 6.32426 10.6798 6.39209 10.7588L8.60352 13.2158L14.5894 6.09131C14.7236 5.93607 14.9136 5.83991 15.1182 5.82361C15.3228 5.80731 15.5256 5.87217 15.6827 6.00418C15.8399 6.1362 15.9388 6.32475 15.958 6.52909C15.9773 6.73343 15.9154 6.93714 15.7856 7.09619Z"
                                        fill="#004AAD"
                                    />
                                </svg>
                                </div>
                                <div>
                                <span className="mr-2 text-sm text-blue-500">Verified</span>
                                </div>
                            </div>


                        </div>
                    ) : (null)
                    }
                </div>
                {rejectReason  && (
                    <div className="p-8 mt-6 bg-red-100 rounded-lg">
                        <h3 className="font-semibold text-red-900">Your identity verification was rejected</h3>
                        <p className="text-sm text-red-600">your identity verification was rejected because of the following reason:
                        <span className="font-semibold">{" "}{rejectReason}</span>,
                        please try again.</p>

                    </div>
                )}

            </div>
            {showCameraModal && (
                <CameraModal
                    isOpen={showCameraModal}
                    onClose={handleCloseCamera}
                    onConfirmSelfie={handleConfirmSelfie}
                />
            )}

            {showConfirmationModal && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={handleCloseConfirmationModal}
                    stream={cameraStream}
                    selfieImage={selfieImage}
                    setShowCameraModal={setShowCameraModal}

                />
            )}

            {showIDUploadModal && (
                <IDUploadModal onClose={handleCloseIDUploadModal} />
            )}
        </div>

    );
}
