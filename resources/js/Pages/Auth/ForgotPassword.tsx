import { PrimaryButton } from '@/Components/elements/buttons/PrimaryButton';
import InputError from '@/Components/elements/inputs/InputError';
import TextInput from '@/Components/elements/inputs/TextInput';
import AppLayout from '@/Layouts/AppLayout';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';


export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!data.email.trim()) {
            setError('email', 'Enter email address Here');
            return;
        }

        clearErrors('email');
        post(route('password.email'));
    };

    return (
        <AppLayout isFooter={false}
            isHeader={false}
            isCustomHeader={true}
        >
            <Head title="Forgot Password" />
            <div className="flex flex-col items-center justify-center h-full min-h-screen pt-6 mt-20 bg-white sm:pt-0">
                <div className="w-full px-10 py-10 space-y-6 overflow-hidden bg-white sm:border sm:shadow-md sm:px-14 sm:max-w-md sm:rounded-lg">

                    {/* //black button */}
                    <div className="flex items-center justify-between w-full">
                        <h1 className="text-lg font-medium text-center sm:text-xl font-Inter ">Forgot your password?</h1>
                        <Link href={route('home')}>
                            <XMarkIcon className="w-8 h-8 text-black" />
                        </Link>
                    </div>
                    <div className="mb-4 text-sm text-gray-600">
                        No problem. Just let us know your email address and we will email you a password
                        reset link that will allow you to choose a new one.
                    </div>

                    {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

                    <form onSubmit={submit}>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full mt-1 placeholder:text-sm"
                            isFocused={true}
                            placeholder="Enter your email address"
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />

                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton className="ms-4 rounded-3xl" disabled={processing}>
                                Email Reset Link
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
}
