import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const [role, setRole] = useState<'student' | 'teacher'>('student');

    return (
        <>
            <Head title="Register" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label>I am registering as</Label>

                                <input
                                    type="hidden"
                                    name="role"
                                    value={role}
                                />

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setRole('student')}
                                        className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                                            role === 'student'
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-input bg-background text-foreground'
                                        }`}
                                    >
                                        Student
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setRole('teacher')}
                                        className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                                            role === 'teacher'
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-input bg-background text-foreground'
                                        }`}
                                    >
                                        Teacher
                                    </button>
                                </div>

                                <InputError message={errors.role} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Email address
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />

                                <InputError message={errors.email} />
                            </div>

                            {role === 'student' && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="student_id">
                                            Student ID
                                        </Label>

                                        <Input
                                            id="student_id"
                                            type="text"
                                            required
                                            tabIndex={3}
                                            name="student_id"
                                            placeholder="Student ID"
                                        />

                                        <InputError
                                            message={errors.student_id}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="year_level">
                                            Year level
                                        </Label>

                                        <select
                                            id="year_level"
                                            name="year_level"
                                            required
                                            tabIndex={4}
                                            defaultValue=""
                                            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="" disabled>
                                                Select your year level
                                            </option>

                                            <option value="1st Year">
                                                1st Year
                                            </option>

                                            <option value="2nd Year">
                                                2nd Year
                                            </option>

                                            <option value="3rd Year">
                                                3rd Year
                                            </option>

                                            <option value="4th Year">
                                                4th Year
                                            </option>
                                        </select>

                                        <InputError
                                            message={errors.year_level}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>

                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    passwordrules={passwordRules}
                                />

                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>

                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    passwordrules={passwordRules}
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={7}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={8}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};