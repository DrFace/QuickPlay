import { useEffect, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextInput from '@/Components/elements/inputs/TextInput';
import InputError from '@/Components/elements/inputs/InputError';
import { PrimaryButton } from '@/Components/elements/buttons/PrimaryButton';
import AppLayout from '@/Layouts/AppLayout';
import SelectInput from '@/Components/elements/inputs/SelectInput';
import useState from "react-usestateref";

export default function Register({
    countries,
    timeZoneOptions,
}: {
    countries: { label: string; value: string }[];
    timeZoneOptions: { label: string; value: string }[];
}) {
    const [googleDataError, setGoogleDataError] = useState("");
    const [selectedOption, setSelectedOption] = useState("client"); // default to client
    const [isJoined, setIsJoined] = useState(true); // skip initial selection screen
    const [emailOptIn, setEmailOptIn] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        country: '',
        time_zone: '',
        type: 'client', // default type
        emailNotification: false,
        terms: false,
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setData('password', password);
        evaluatePasswordStrength(password);
    };

    const evaluatePasswordStrength = (password: string) => {
        let strength = 'Weak';
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (strongPasswordRegex.test(password)) {
            strength = 'Strong';
        } else if (password.length >= 6) {
            strength = 'Medium';
        }
        setPasswordStrength(strength);
    };

    const handelTermsAccepted = () => {
        setTermsAccepted(!termsAccepted);
        setData('terms', !termsAccepted);
    }

    const handelEmailOptIn = () => {
        setEmailOptIn(!emailOptIn);
        setData('emailNotification', !emailOptIn);
    }

    const dataValidation = () => {
        if (!data.country || !data.time_zone || !data.type) {
            setGoogleDataError("Please select your country and timezone before proceeding.");
            return false;
        }
        return true;
    }

    const handleGoogleLogin = () => {
        if (!dataValidation()) return;
        const googleLoginUrl = `/auth/redirect/register?role=${data.type}&country=${data.country}&time_zone=${data.time_zone}`;
        window.location.href = googleLoginUrl;
    };

    return (
        <AppLayout isFooter={false} isHeader={false}>
            <Head title="Register" />
            <div className="flex flex-col items-center justify-center h-full min-h-screen pt-6 mt-20 bg-white sm:pt-0">
                <div className={`absolute top-0 left-0 w-full  bg-transparent`}>
                    <div className="px-6 py-4 ">
                        <div className="flex items-center justify-between h-auto">
                            <div className=" lg:w-1/5">
                                <Link href={route("home")} className="hidden lg:flex">
                                    <img
                                        className="h-[46px] w-auto object-contain"
                                        src="/assets/images/ai-geeks.png?a=234"
                                        alt="Logo"
                                    />
                                </Link>
                                <Link href={route("home")} className="lg:hidden">
                                    <span className="sr-only">Ai-Geeks</span>
                                    <img
                                        src="/assets/images/ai-geeks.png?a=234"
                                        alt="Logo"
                                        className="w-auto h-10"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Directly show registration form */}
                <div className="w-full px-8 py-10 mt-10 space-y-4 bg-white sm:px-14 sm:max-w-xl ">
                    <h1 className="text-3xl font-medium text-center font-Inter">
                        Sign up to Be Entertained
                    </h1>
                    <form onSubmit={submit}>
                        {/* Google login */}
                        <button type="button" onClick={handleGoogleLogin} className="flex items-center w-full p-0.5 mt-4 justify-left rounded-xl bg-primary bg-opacity-10">
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
                                <span>Continue with Google</span>
                            </div>
                        </button>
                        {googleDataError && <div className="mt-2 text-xs text-red-500">{googleDataError}</div>}

                        {/* or line */}
                        <div className="flex items-center mt-4">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <div className="px-4 text-textSecondary">or</div>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        <div className="flex flex-col w-full gap-4 mt-4 sm:flex-row">
                            <div className="sm:w-1/2">
                                <InputLabel required htmlFor="first_name" value="First Name" />
                                <TextInput
                                    id="first_name"
                                    name="first_name"
                                    maxLength={50}
                                    placeholder='First Name'
                                    value={data.first_name}
                                    className="block w-full h-10 mt-1 rounded-xl placeholder:text-xs"
                                    autoComplete="first_name"
                                    isFocused={true}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.first_name} className="mt-2" />
                            </div>
                            <div className="mt-4 sm:w-1/2 sm:mt-0">
                                <InputLabel required htmlFor="last_name" value="Last Name" />
                                <TextInput
                                    id="last_name"
                                    maxLength={50}
                                    name="last_name"
                                    placeholder='Last Name'
                                    value={data.last_name}
                                    className="block w-full h-10 mt-1 rounded-xl placeholder:text-xs"
                                    autoComplete="last_name"
                                    required
                                    onChange={(e) => setData('last_name', e.target.value)}
                                />
                                <InputError message={errors.last_name} className="mt-2" />
                            </div>
                        </div>

                        <div className="mt-4">
                            <InputLabel required htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                placeholder='Email'
                                name="email"
                                maxLength={100}
                                value={data.email}
                                className="block w-full h-10 mt-1 rounded-xl placeholder:text-xs"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="flex flex-col w-full mt-4 sm:gap-4 sm:flex-row">
                            <div className="sm:w-1/2">
                                <InputLabel required htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    maxLength={50}
                                    placeholder='Password'
                                    value={data.password}
                                    className="block w-full h-10 mt-1 rounded-xl placeholder:text-xs"
                                    autoComplete="new-password"
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-4 sm:w-1/2 sm:mt-0">
                                <InputLabel required htmlFor="password_confirmation" value="Confirm Password" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    maxLength={50}
                                    name="password_confirmation"
                                    placeholder='Confirm Password'
                                    value={data.password_confirmation}
                                    className="block w-full h-10 mt-1 rounded-xl placeholder:text-xs"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>
                        </div>

                        <div className={`mt-2 bg-gray-200 rounded-lg ${passwordStrength === '' ? 'hidden' : 'block'}`}>
                            <div
                                className={`h-2 rounded-full ${passwordStrength === 'Strong' ? 'bg-green-600' :
                                    passwordStrength === 'Medium' ? 'bg-yellow-600' :
                                        'bg-red-600'
                                    }`}
                                style={{
                                    width: passwordStrength === 'Strong' ? '100%' :
                                        passwordStrength === 'Medium' ? '66%' :
                                            passwordStrength === 'Weak' ? '33%' : '0%',
                                    transition: 'width 0.3s ease'
                                }}
                            />
                        </div>
                        <div className={`mt-2  text-sm ${passwordStrength === 'Strong' ? 'text-green-600 ' : passwordStrength === 'Medium' ? 'text-yellow-600 ' : passwordStrength === 'Weak' ? 'text-red-600 ' : 'hidden'}`}>
                            Password Strength: {passwordStrength}
                        </div>
                        <p className="mt-1 text-xs text-gray-600">
                            Password must be at least 8 characters long, include uppercase and lowercase letters, numbers, and special characters ( @$!%*?& ).
                        </p>

                        <div className="flex flex-col w-full mt-4 sm:gap-4 sm:flex-row">
                            <div className="mt-4 sm:w-1/2 sm:mt-0">
                                <InputLabel required htmlFor="country" value="Country" />
                                <SelectInput
                                    className="mt-2 rounded-xl placeholder:text-xs"
                                    options={countries}
                                    placeholder='Select your country'
                                    selectedOption={countries?.filter(
                                        (obj: any) => obj?.value === data?.country
                                    )}
                                    setData={(e: any) => setData("country", e)}
                                />
                                <InputError message={errors?.country} className="mt-2" />
                            </div>
                            <div className="mt-4 sm:w-1/2 sm:mt-0">
                                <InputLabel required htmlFor="Timezone" value="Timezone" />
                                <SelectInput
                                    className="mt-2 rounded-xl placeholder:text-xs"
                                    options={timeZoneOptions}
                                    placeholder='Select your timezone'
                                    selectedOption={timeZoneOptions?.filter(
                                        (obj: any) => obj?.value === data?.time_zone
                                    )}
                                    setData={(e: any) => setData("time_zone", e)}
                                />
                                <InputError message={errors?.time_zone} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex items-center mt-4 mb-4">
                            <input
                                type="checkbox"
                                id="emailOptIn"
                                checked={emailOptIn}
                                onChange={() => handelEmailOptIn()}
                                className="w-5 h-5 text-blue-600 form-checkbox"
                            />
                            <label htmlFor="emailOptIn" className="ml-2 text-sm text-gray-700 font-Inter">
                                Send me helpful emails to find rewarding work and job leads.
                            </label>
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="termsAccepted"
                                checked={termsAccepted}
                                onChange={() => handelTermsAccepted()}
                                className="w-5 h-5 text-blue-600 form-checkbox"
                            />
                            <label htmlFor="termsAccepted" className="ml-2 text-sm text-gray-700 font-Inter">
                                Yes, I understand and agree to the{" "}
                                <a target="_blank" rel="noopener noreferrer" href="/terms-service" className="text-blue-600 underline">
                                    AI Geeks Term of Service
                                </a>, including the{" "}
                                <a target="_blank" rel="noopener noreferrer" href="/user-agreement" className="text-blue-600 underline">
                                    User Agreement
                                </a>{" "}
                                and{" "}
                                <a target="_blank" rel="noopener noreferrer" href="/privacy-policy" className="text-blue-600 underline">
                                    Privacy Policy
                                </a>.
                            </label>
                        </div>

                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                disabled={processing || !termsAccepted || passwordStrength !== 'Strong'}
                                className={`w-auto px-8 py-2 mb-4 text-white rounded-full ${(!termsAccepted || passwordStrength !== 'Strong')
                                    ? "bg-gray-400 "
                                    : "bg-primaryBtnColor hover:bg-primaryBtnColorHover"
                                    }`}
                            >
                                Create my account
                            </button>
                        </div>

                        <p className="text-center text-gray-600">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 underline">
                                Log In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
