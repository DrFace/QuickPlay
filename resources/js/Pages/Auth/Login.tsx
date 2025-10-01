import { useEffect, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextInput from '@/Components/elements/inputs/TextInput';
import InputError from '@/Components/elements/inputs/InputError';
import Checkbox from '@/Components/elements/inputs/Checkbox';
import { PrimaryButton } from '@/Components/elements/buttons/PrimaryButton';
import AppLayout from '@/Layouts/AppLayout';
import ApplicationLogo from '@/Components/elements/other/ApplicationLogo';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <AppLayout isFooter={false}>
            <Head title="Log in" />
            <div className="flex flex-col items-center justify-center h-full min-h-screen pt-6 mt-20 bg-white sm:pt-0">
                <div className="w-full px-6 py-10 space-y-6 overflow-hidden bg-white sm:border sm:shadow-md sm:px-14 sm:max-w-md sm:rounded-lg">
                    {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}
                    <h1 className="text-3xl font-medium text-center font-Inter">Log in to Esports</h1>

                    <form onSubmit={submit}>
                        <div className="text-md font-Inter">
                            <InputLabel required htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full mt-1 rounded-xl"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4 text-md font-Inter">
                            <InputLabel required htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full mt-1 rounded-xl"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ml-2 text-gray-600 text-md">Keep me logged in</span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="font-medium font-Inter text-nowrap text-md text-primary hover:text-primary-500"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center justify-center w-full mt-4 rounded-full bg-primaryBtnColor"
                        >
                            <span className="px-8 py-2 font-medium text-white font-Inter text-md">
                                Log in
                            </span>
                        </button>

                        <div className="flex items-center mt-4">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <div className="px-4 text-textSecondary">or</div>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        <a
                            href="/auth/redirect/login"
                            type="button"
                            className="flex items-center w-full p-0.5 mt-4 justify-left rounded-xl bg-primary bg-opacity-10"
                        >
                            <div>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="36" height="36" rx="10" fill="white" />
                                    <path d="M27.8055 16.0415H27V16H18V20H23.6515C22.827 22.3285 20.6115 24 18 24C14.6865 24 12 21.3135 12 18C12 14.6865 14.6865 12 18 12C19.5295 12 20.921 12.577 21.9805 13.5195L24.809 10.691C23.023 9.0265 20.634 8 18 8C12.4775 8 8 12.4775 8 18C8 23.5225 12.4775 28 18 28C23.5225 28 28 23.5225 28 18C28 17.3295 27.931 16.675 27.8055 16.0415Z" fill="#FFC107" />
                                    <path d="M9.15302 13.3455L12.4385 15.755C13.3275 13.554 15.4805 12 18 12C19.5295 12 20.921 12.577 21.9805 13.5195L24.809 10.691C23.023 9.0265 20.634 8 18 8C14.159 8 10.828 10.1685 9.15302 13.3455Z" fill="#FF3D00" />
                                    <path d="M18 28C20.583 28 22.93 27.0115 24.7045 25.404L21.6095 22.785C20.5718 23.5742 19.3037 24.001 18 24C15.399 24 13.1905 22.3415 12.3585 20.027L9.0975 22.5395C10.7525 25.778 14.1135 28 18 28Z" fill="#4CAF50" />
                                    <path d="M27.8055 16.0415H27V16H18V20H23.6515C23.2571 21.1082 22.5467 22.0766 21.608 22.7855L21.6095 22.7845L24.7045 25.4035C24.4855 25.6025 28 23 28 18C28 17.3295 27.931 16.675 27.8055 16.0415Z" fill="#1976D2" />
                                </svg>
                            </div>
                            <div className="flex items-center justify-center w-full">
                                <span className="font-medium text-black font-Inter text-md">
                                    Continue with Google
                                </span>
                            </div>
                        </a>
                    </form>

                    <div className="flex items-center justify-center mt-4">
                        <span className="mr-2 text-md text-textSecondary">Don’t have an Esports account?</span>
                        <Link href={route('register')} className="font-medium text-md font-Inter text-nowrap text-primary hover:text-primary-500">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
