import { useForm } from '@inertiajs/react';
import Modal from '@/Components/elements/other/Modal';

export default function ViewCreditHistoryModal({ show, onClose, credits }: { show: boolean, onClose: () => void, credits: any }) {

    // Sort credits by expire_date in descending order
    // const sortedCredits = credits.sort((a: any, b: any) => new Date(b.expire_date).getTime() - new Date(a.expire_date).getTime());

    const handleClose = () => {
        onClose();
    };


    return (
        <Modal show={show} onClose={onClose} >
            <div className="overflow-auto sm:max-h-[400px] max-h-[200px] px-4 py-4 rounded-lg">
                <div className="flex justify-between py-4">
                    <h2 className="flex justify-center text-xl font-bold">Credit History</h2>
                    <button
                        type='button'
                        onClick={handleClose}
                        className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-blue-100 ">
                        <tr>
                            <th className="p-2 text-center text-gray-600 border-b">Connects</th>
                            <th className="p-2 text-center text-gray-600 border-b">Available</th>
                            <th className="p-2 text-center text-gray-600 border-b">Amount</th>
                            <th className="p-2 text-center text-gray-600 border-b">Expire Date</th>
                            <th className="p-2 text-center text-gray-600 border-b">Status</th>
                        </tr>
                    </thead>
                    {credits.length == 0 ?
                        <tbody>
                            <tr>
                                <td colSpan={5} className="p-2 text-center border-b">No History found</td>
                            </tr>
                        </tbody>
                        :
                        <tbody>
                            {credits.map((credit: any) => (
                                <tr key={credit.id} className="hover:bg-gray-100">
                                    <td className="p-2 text-center border-b">{credit.connects}</td>
                                    <td className="p-2 text-center border-b whitespace-nowrap">{credit.available_connects}</td>
                                    <td className="p-2 text-center border-b">$ {credit.amount}</td>
                                    <td className="p-2 text-center border-b whitespace-nowrap ">{credit.expires_at_human}</td>
                                    <td className="p-2 text-center border-b">{credit.status == "active" ? <span className="font-bold text-green-600">Active</span> : credit?.available_connects > 0 ? <span className="font-bold text-yellow-600">Expired</span> : <span className="font-bold text-red-600">Used</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
            </div>

            <div className="flex justify-end mt-2 mb-4">
                <button type="button" onClick={onClose} className="px-4 py-2 mr-3 bg-gray-300 rounded-md">Close</button>
            </div>
        </Modal>
    );
}
