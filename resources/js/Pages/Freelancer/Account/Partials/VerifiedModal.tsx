import React from 'react';

interface VerifiedModalProps {
    onClose: () => void;
    issueId: string;
}

const ThankYouModal: React.FC<VerifiedModalProps > = ({ onClose, issueId }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
                <div className="flex justify-center mb-4">
                    <div className=" p-4">
                    <svg width="106" height="106" viewBox="0 0 106 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="53" cy="53" r="53" fill="#4CAF50" fill-opacity="0.2"/>
                        <g filter="url(#filter0_d_6952_19826)">
                        <path d="M53 18C62.2826 18 71.185 21.6875 77.7487 28.2513C84.3125 34.815 88 43.7174 88 53C88 62.2826 84.3125 71.185 77.7487 77.7487C71.185 84.3125 62.2826 88 53 88C43.7174 88 34.815 84.3125 28.2513 77.7487C21.6875 71.185 18 62.2826 18 53C18 43.7174 21.6875 34.815 28.2513 28.2513C34.815 21.6875 43.7174 18 53 18ZM48.64 59.905L40.865 52.125C40.5863 51.8463 40.2554 51.6252 39.8912 51.4743C39.527 51.3235 39.1367 51.2458 38.7425 51.2458C38.3483 51.2458 37.958 51.3235 37.5938 51.4743C37.2296 51.6252 36.8987 51.8463 36.62 52.125C36.0571 52.6879 35.7408 53.4514 35.7408 54.2475C35.7408 55.0436 36.0571 55.8071 36.62 56.37L46.52 66.27C46.7979 66.5501 47.1286 66.7725 47.4929 66.9242C47.8572 67.076 48.2479 67.1541 48.6425 67.1541C49.0371 67.1541 49.4278 67.076 49.7921 66.9242C50.1564 66.7725 50.4871 66.5501 50.765 66.27L71.265 45.765C71.5475 45.4874 71.7722 45.1567 71.9261 44.7918C72.0801 44.427 72.1604 44.0352 72.1622 43.6392C72.164 43.2432 72.0875 42.8508 71.9369 42.4845C71.7863 42.1182 71.5647 41.7854 71.2848 41.5052C71.005 41.225 70.6724 41.003 70.3063 40.852C69.9402 40.701 69.5478 40.6239 69.1518 40.6253C68.7558 40.6267 68.364 40.7064 67.999 40.86C67.6339 41.0136 67.3029 41.2379 67.025 41.52L48.64 59.905Z" fill="#4CAF50"/>
                        <path d="M48.6404 59.9047L40.8654 52.1247C40.5866 51.846 40.2557 51.6249 39.8916 51.474C39.5274 51.3232 39.1371 51.2456 38.7429 51.2456C38.3487 51.2456 37.9584 51.3232 37.5942 51.474C37.23 51.6249 36.8991 51.846 36.6204 52.1247C36.0575 52.6876 35.7412 53.4511 35.7412 54.2472C35.7412 55.0433 36.0575 55.8068 36.6204 56.3697L46.5204 66.2697C46.7983 66.5499 47.129 66.7722 47.4932 66.924C47.8575 67.0757 48.2483 67.1538 48.6429 67.1538C49.0375 67.1538 49.4282 67.0757 49.7925 66.924C50.1568 66.7722 50.4874 66.5499 50.7654 66.2697L71.2654 45.7647C71.5478 45.4871 71.7725 45.1564 71.9265 44.7915C72.0805 44.4267 72.1607 44.035 72.1626 43.639C72.1644 43.2429 72.0878 42.8505 71.9373 42.4842C71.7867 42.118 71.5651 41.7851 71.2852 41.5049C71.0053 41.2247 70.6728 41.0027 70.3067 40.8517C69.9406 40.7007 69.5482 40.6236 69.1522 40.625C68.7562 40.6264 68.3644 40.7062 67.9993 40.8597C67.6343 41.0133 67.3033 41.2376 67.0254 41.5197L48.6404 59.9047Z" fill="white"/>
                        </g>
                        <defs>
                        <filter id="filter0_d_6952_19826" x="9" y="13" width="88" height="88" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="4"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6952_19826"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6952_19826" result="shape"/>
                        </filter>
                        </defs>
                    </svg>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-4">Verified</h2>
                <div className='w-full text-center mb-8'>
                We’ll use this as your primary bank account for payments
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-10 py-2 bg-blue-900 text-white rounded-3xl hover:bg-blue-900"
                    >
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThankYouModal;
