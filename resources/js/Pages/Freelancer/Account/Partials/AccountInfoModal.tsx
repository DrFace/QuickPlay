import { useForm } from '@inertiajs/react';
import Modal from '@/Components/elements/other/Modal';
import { User } from '@/types';
import React from 'react';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextInput from '@/Components/elements/inputs/TextInput';
import InputError from '@/Components/elements/inputs/InputError';

export default function AccountInfoModal({ show, onClose, user }: { show: boolean, onClose: () => void, user: User }) {
    const { data, setData, post, errors } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('freelancer.account.updateAccountInfo'), {
            onSuccess: (response) => {
                onClose(); // Close the modal after saving
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            }
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg flex justify-center font-semibold">Edit Account Informations</h2>
                <div className="mt-4">
                    
                    <InputLabel required htmlFor="firstname" value="First Name" />

                    <TextInput
                        id="fname"
                        type="text"
                        name="fname"
                        value={data.first_name}
                        className="block w-full mt-1 rounded-xl"
                        //autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('first_name', e.target.value)}
                    />
                    <InputError message={errors.first_name} className="mt-2" />
                </div>
                <div className="mt-4">
                    
                    <InputLabel required htmlFor="lastname" value="Last Name" />
                    <TextInput
                        id="lname"
                        type="text"
                        name="lname"
                        value={data.last_name}
                        className="block w-full mt-1 rounded-xl"
                        autoComplete="email"
                        isFocused={true}
                        onChange={(e) => setData('last_name', e.target.value)}
                        
                    />
                     <InputError message={errors.last_name} className="mt-2" />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                    />
                </div>
                <div className="mt-6 flex justify-end">
                    <button type="button" onClick={onClose} className="mr-3 px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Save</button>
                </div>
            </form>
        </Modal>
    );
}
