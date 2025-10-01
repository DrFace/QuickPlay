import { useEffect, FormEventHandler, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';

import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextInput from '@/Components/elements/inputs/TextInput';
import InputError from '@/Components/elements/inputs/InputError';
import { PrimaryButton } from '@/Components/elements/buttons/PrimaryButton';

export default function ResetPassword({ token, email }: { token: string, email: string }) {
    const [passwordStrength, setPasswordStrength] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);
    const canSubmit = () => {
        return (
            data.email &&
            data.password &&
            data.password_confirmation &&
            data.password === data.password_confirmation &&
            passwordStrength === 'Strong'
        );
    };
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (canSubmit()) {
            post(route('password.store'));
        }
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

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full mt-1"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full mt-1"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={handlePasswordChange}
                    />

                    <InputError message={errors.password} className="mt-2" />
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
                    <div className={`mt-2 text-sm ${passwordStrength === 'Strong' ? 'text-green-600 ' : passwordStrength === 'Medium' ? 'text-yellow-600 ' : passwordStrength === 'Weak' ? 'text-red-600 ' : 'hidden'}`}>
                        Password Strength: {passwordStrength}
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Password must be at least 8 characters long, include uppercase and lowercase letters, numbers, and special characters ( @$!%*?& ).
                    </p>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block w-full mt-1"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ms-4" disabled={processing || !canSubmit()}>
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
