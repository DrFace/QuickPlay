import { PrimaryButton } from '@/Components/elements/buttons/PrimaryButton';
import InputError from '@/Components/elements/inputs/InputError';
import TextInput from '@/Components/elements/inputs/TextInput';
import AppLayout from '@/Layouts/AppLayout';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler, useState } from 'react';

export default function TwoFactorChallenge({ email }: { email?: string }) {
    // Define the form data type
    interface FormData {
        code: string;
        email: string;

    }


    // Use the useForm hook with TypeScript
    const { data, setData, post, processing, errors } = useForm<FormData>({
        code: '',
        email: email || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('two-factor.verify'));
    };

    return (
        <AppLayout isFooter={false}
            isHeader={false}
            isCustomHeader={true}
        >
            <Head title="Two Factor Authentication" />
            <div className="flex flex-col items-center justify-center h-full min-h-screen pt-6 mt-20 bg-white sm:pt-0">
                <div className="w-full px-10 py-10 space-y-6 overflow-hidden bg-white sm:border sm:shadow-md sm:px-14 sm:max-w-md sm:rounded-lg">

                    {/* //black button */}
                    <div className="flex items-center justify-between w-full">
                        <h1 className="text-lg font-medium sm:text-xl font-Inter ">Two factor authentication</h1>
                        <Link href={route('login')}>
                            <XMarkIcon className="w-8 h-8 text-black" />
                        </Link>
                    </div>
                    <div className="mb-4 text-sm text-gray-600">
                        Please confirm access to your account by entering the authentication code send to your email address.
                    </div>

                    {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

                    <form onSubmit={submit}>
                        <TextInput
                            id="code"
                            type="text"
                            name="code"
                            value={data.code}
                            className="block w-full mt-1 placeholder:text-sm"
                            isFocused={true}
                            placeholder="Enter your 2FA code"
                            onChange={(e) => setData('code', e.target.value)}
                        />

                        <InputError message={errors.code} className="mt-2" />

                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton className="ms-4 rounded-3xl" disabled={processing}>
                                {processing ? 'Verifying...' : 'Verify'}
                            </PrimaryButton>
                        </div>
                    </form>
                    <div className="flex items-center justify-center mt-4">
                        <span className="mr-2 text-sm sm:text-md text-textSecondary">Don’t have an AI Geeks account?</span>
                        <Link href={route('register')} className="text-sm font-medium sm:text-md text-nowrap font-Inter text-primary hover:text-primary-500">
                            Sign Up
                        </Link>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
};

