import { Anchor, Button, Checkbox, PasswordInput, Radio, rem, TextInput } from "@mantine/core";
import { IconAt, IconLock, IconUser, IconSparkles, IconShieldCheck, IconCheck, IconX } from "@tabler/icons-react";
import { useState, useEffect } from "react"; // Thêm useEffect
import { useNavigate } from "react-router-dom"
import type { AccountType } from "../types/Usetype";
import { signupValidation } from "../Services/FormValidation";
import { notifications } from "@mantine/notifications";
import { registerUser } from "../Services/UserService";
import { createPortal } from "react-dom";

// Định nghĩa interface cho form local
interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    accountType: AccountType;
}

const initialForm: SignUpFormData = {
    name: "",
    email: "",
    password: '',
    confirmPassword: "",
    accountType: 'APPLICANT',
}
const SignUp = () => {

    const [data, setData] = useState<SignUpFormData>(initialForm);
    const [formError, setFormError] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Thêm state loading
    const [progress, setProgress] = useState(0); // Thêm state cho progress

    // Effect để tăng progress khi loading
    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) return 95; // Dừng ở 95% chờ response
                    return prev + 1;
                });
            }, 50); 

            return () => clearInterval(interval);
        } else {
            setProgress(0); // Reset khi loading kết thúc
        }
    }, [loading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setFormError(prev => ({
            ...prev,
            [name]:
                name === "confirmPassword"
                    ? signupValidation("confirmPassword", value, data.password)
                    : signupValidation(name, value),
        }));


    };
    const [passwordStrength, setPasswordStrength] = useState(1);// 1-4 levels
    const handlePasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;

        setData((prev) => ({
            ...prev,
            password: value,
        }));

        // Simple strength calculation
        const len = value.length;
        if (len < 4) setPasswordStrength(1);
        else if (len < 8) setPasswordStrength(2);
        else if (len < 12) setPasswordStrength(3);
        else setPasswordStrength(4);
        // Validate password
        setFormError(prev => ({
            ...prev,
            password: signupValidation("password", value)
        }));
    };

    const handleSubmit = async () => { // Đổi thành async function
        let valid = true;
        const newFormError: { [key: string]: string } = {};

        // Validate all fields
        for (const key in data) {
            if (key === "accountType") continue;

            let errorMsg = "";
            if (key === "confirmPassword") {
                errorMsg = signupValidation("confirmPassword", data[key], data.password);
            } else {
                errorMsg = signupValidation(key, data[key as keyof SignUpFormData] as string);
            }

            if (errorMsg !== "") {
                valid = false;
                newFormError[key] = errorMsg;
            }
        }

        setFormError(newFormError);
        if (!valid) {
            console.log("Form has errors:", newFormError);
            notifications.show({
                title: 'Validation Failed',
                message: 'Please fix the errors in the form',
                color: 'red',
                icon: <IconX size={20} />,
                withBorder: true,
                autoClose: 3000,
                className: "!border-red-500"
            });
            return;
        }

        setLoading(true);
        setProgress(0); // Reset progress khi bắt đầu

        try {
            console.log("DATA SUBMIT:", data);
            const res = await registerUser(data);

            // Hoàn thành progress
            setProgress(100);

            // Đợi một chút để hiển thị progress đầy
            await new Promise(resolve => setTimeout(resolve, 300));

            setData(initialForm);
            console.log(res);
            notifications.show({
                title: 'Registered Successfully',
                message: 'Redirecting to login page...',
                withCloseButton: true,
                icon: <IconCheck style={{ width: "90%", height: "90%" }} />,
                color: "teal",
                withBorder: true,
                className: "!border-green-500"
            });

            setTimeout(() => {
                navigate("/login");
            }, 1000);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.log(err);
            // Hoàn thành progress khi có lỗi
            setProgress(100);
            await new Promise(resolve => setTimeout(resolve, 300));

            notifications.show({
                title: 'Registration Failed',
                message: err.response?.data?.errorMessage || 'Registration failed',
                withCloseButton: true,
                icon: <IconX style={{ width: "90%", height: "90%" }} />,
                color: "red",
                withBorder: true,
                className: "!border-red-500"
            });
        } finally {
            // Đợi thêm một chút trước khi tắt loading
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    const handleAccountTypeChange = (value: string) => {
        // Type assertion với kiểm tra an toàn
        if (value === "APPLICANT" || value === "EMPLOYER" || value === "ADMIN") {
            setData(prev => ({
                ...prev,
                accountType: value,
            }));
        }
    };

    return (
        <>
            {loading &&
                createPortal(
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
                        <div className="text-center w-80 max-w-[90vw]">
                            {/* Spinner Container */}
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-cyan-900/30 rounded-full"></div>

                                <div
                                    className="absolute inset-0 border-4 border-transparent rounded-full border-t-cyan-400 border-r-blue-400 animate-spin"
                                    style={{ animationDuration: "1.5s" }}
                                />

                                <div
                                    className="absolute inset-4 border-4 border-transparent rounded-full border-b-purple-400 border-l-pink-400 animate-spin"
                                    style={{
                                        animationDuration: "1s",
                                        animationDirection: "reverse",
                                    }}
                                />

                                <div className="absolute inset-8 flex items-center justify-center">
                                    <div className="w-12 h-12 border-2 border-white/20 rounded-full flex items-center justify-center">
                                        <IconSparkles className="text-cyan-300 animate-pulse" size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Text */}
                            <div className="space-y-3 mb-6">
                                <p className="text-white text-2xl font-bold animate-pulse">
                                    Creating Account...
                                </p>
                                <p className="text-gray-300 text-sm">Setting up your profile</p>
                            </div>

                            {/* Progress */}
                            <div className="w-full space-y-2">
                                <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-cyan-300">
                                        {progress < 100 ? "Processing..." : "Complete!"}
                                    </span>
                                    <span className="text-white font-bold">{progress}%</span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mt-6 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                                <p className="text-cyan-200 text-xs">
                                    {progress < 20 && "Initializing registration..."}
                                    {progress >= 20 && progress < 40 && "Validating data..."}
                                    {progress >= 40 && progress < 70 && "Creating account..."}
                                    {progress >= 70 && progress < 90 && "Setting up preferences..."}
                                    {progress >= 90 && "Finalizing registration..."}
                                </p>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }


            {/*  form */}
            <div className="w-1/2 px-20 flex flex-col justify-center gap-6 ">
                {/* Header Section with Glow */}
                <div className="relative mb-4 text-center">
                    {/* Glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 blur-3xl opacity-50 animate-pulse" />

                    <div className="relative">
                        <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-3 tracking-tight drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                            Create Account
                        </h1>
                        <p className="text-mine-shaft-300 text-base font-medium">
                            Join thousands of professionals and start your journey ✨
                        </p>
                    </div>
                </div>

                {/* Form Section - Premium Card */}
                <div className="relative group">
                    {/* Outer glow */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:via-blue-500/20 group-hover:to-purple-500/20 rounded-2xl blur-xl transition-all duration-700 -z-10" />

                    {/* Card */}
                    <div className="relative bg-gradient-to-br from-mine-shaft-900/80 to-mine-shaft-950/80 p-10 rounded-2xl border-2 border-mine-shaft-700/50 backdrop-blur-sm shadow-2xl">
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl opacity-50" />

                        {/* Corner decorations */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-2xl blur-2xl" />

                        <div className="relative space-y-6">
                            {/* Full Name Input */}
                            <div className="group/input relative">
                                <TextInput
                                    error={formError.name}
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                    withAsterisk
                                    label='Full name'
                                    placeholder="Your name"
                                    leftSection={<IconUser style={{ width: rem(18), height: rem(18) }} className="text-cyan-400" />}
                                    classNames={{
                                        input: "!bg-mine-shaft-900/80 !border-2 !border-mine-shaft-700 focus:!border-cyan-400 hover:!border-cyan-500/50 !text-white !transition-all !duration-300 !rounded-lg focus:!shadow-lg focus:!shadow-cyan-500/20 !placeholder-mine-shaft-500",
                                        label: "!text-cyan-400 !font-bold mb-2 text-base group-focus-within/input:!text-cyan-300 !transition-colors"
                                    }}
                                />
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-focus-within/input:from-cyan-500/10 group-focus-within/input:to-blue-500/10 pointer-events-none transition-all duration-300 -z-10" />
                            </div>

                            {/* Email Input */}
                            <div className="group/input relative">
                                <TextInput
                                    error={formError.email}
                                    name="email"
                                    onChange={handleChange}
                                    value={data.email}
                                    withAsterisk
                                    label='Email'
                                    placeholder="your.email@example.com"
                                    leftSection={<IconAt style={{ width: rem(18), height: rem(18) }} className="text-cyan-400" />}
                                    classNames={{
                                        input: "!bg-mine-shaft-900/80 !border-2 !border-mine-shaft-700 focus:!border-cyan-400 hover:!border-cyan-500/50 !text-white !transition-all !duration-300 !rounded-lg focus:!shadow-lg focus:!shadow-cyan-500/20 !placeholder-mine-shaft-500",
                                        label: "!text-cyan-400 !font-bold mb-2 text-base group-focus-within/input:!text-cyan-300 !transition-colors"
                                    }}
                                />
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-focus-within/input:from-cyan-500/10 group-focus-within/input:to-blue-500/10 pointer-events-none transition-all duration-300 -z-10" />
                            </div>

                            {/* Password Input with Strength */}
                            <div className="space-y-3">
                                <div className="group/input relative">
                                    <PasswordInput
                                        error={formError.password}
                                        name="password"
                                        onChange={handlePasswordChange}
                                        value={data.password}
                                        withAsterisk
                                        leftSection={<IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} className="text-cyan-400" />}
                                        label='Password'
                                        placeholder="••••••••"
                                        classNames={{
                                            input: "!bg-mine-shaft-900/80 !border-2 !border-mine-shaft-700 focus:!border-cyan-400 hover:!border-cyan-500/50 !text-white !transition-all !duration-300 !rounded-lg focus:!shadow-lg focus:!shadow-cyan-500/20",
                                            label: "!text-cyan-400 !font-bold mb-2 text-base group-focus-within/input:!text-cyan-300 !transition-colors",
                                            innerInput: "!bg-transparent !text-white !placeholder-mine-shaft-500"
                                        }}
                                    />
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-focus-within/input:from-cyan-500/10 group-focus-within/input:to-blue-500/10 pointer-events-none transition-all duration-300 -z-10" />
                                </div>

                                {/* Enhanced Password Strength Indicator */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div key={level} className="h-2 flex-1 bg-mine-shaft-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 rounded-full ${level <= passwordStrength
                                                        ? level === 1 ? 'bg-gradient-to-r from-red-500 to-orange-500 w-full'
                                                            : level === 2 ? 'bg-gradient-to-r from-orange-500 to-yellow-500 w-full'
                                                                : level === 3 ? 'bg-gradient-to-r from-yellow-500 to-lime-500 w-full'
                                                                    : 'bg-gradient-to-r from-green-500 to-emerald-500 w-full'
                                                        : 'w-0'
                                                        }`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p className={`text-xs font-semibold transition-colors duration-300 ${passwordStrength === 1 ? 'text-red-400'
                                        : passwordStrength === 2 ? 'text-orange-400'
                                            : passwordStrength === 3 ? 'text-yellow-400'
                                                : 'text-green-400'
                                        }`}>
                                        {passwordStrength === 1 ? '🔴 Weak - Add more characters'
                                            : passwordStrength === 2 ? '🟠 Fair - Add special characters'
                                                : passwordStrength === 3 ? '🟡 Good - Almost there!'
                                                    : '🟢 Strong - Excellent password!'}
                                    </p>
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="group/input relative">
                                <PasswordInput
                                    error={formError.confirmPassword}
                                    name="confirmPassword"
                                    value={data.confirmPassword}
                                    onChange={handleChange}

                                    withAsterisk
                                    leftSection={<IconShieldCheck style={{ width: rem(18), height: rem(18) }} stroke={1.5} className="text-cyan-400" />}
                                    label='Confirm Password'
                                    placeholder="••••••••"
                                    classNames={{
                                        input: "!bg-mine-shaft-900/80 !border-2 !border-mine-shaft-700 focus:!border-cyan-400 hover:!border-cyan-500/50 !text-white !transition-all !duration-300 !rounded-lg focus:!shadow-lg focus:!shadow-cyan-500/20",
                                        label: "!text-cyan-400 !font-bold mb-2 text-base group-focus-within/input:!text-cyan-300 !transition-colors",
                                        innerInput: "!bg-transparent !text-white !placeholder-mine-shaft-500"
                                    }}
                                />
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-focus-within/input:from-cyan-500/10 group-focus-within/input:to-blue-500/10 pointer-events-none transition-all duration-300 -z-10" />
                            </div>

                            {/* Radio Group - Account Type */}

                            <div className="space-y-3">
                                <label className="text-gray-300 font-semibold text-base">
                                    Select your role <span className="text-red-500">*</span>
                                </label>

                                <Radio.Group

                                    value={data.accountType}
                                    onChange={handleAccountTypeChange}
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                                        {/* Applicant Option - Clean Design */}
                                        <label className={`relative cursor-pointer transition-all duration-300 ${data.accountType === "APPLICANT"
                                            ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                                            : 'hover:ring-1 hover:ring-blue-400/50'
                                            } rounded-xl overflow-hidden`}>
                                            <div className={`p-4 transition-all duration-300 ${data.accountType === "APPLICANT"
                                                ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500'
                                                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80'
                                                } border-2 rounded-xl h-full`}>

                                                {/* Selected indicator */}
                                                {data.accountType === "APPLICANT" && (
                                                    <div className="absolute top-2 right-2">
                                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex flex-col items-center gap-3 text-center">
                                                    {/* Icon Container */}
                                                    <div className={`p-3 rounded-full transition-all duration-300 ${data.accountType === "APPLICANT"
                                                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                                                        : 'bg-gray-700 text-gray-400 group-hover:text-blue-400'
                                                        }`}>
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>

                                                    {/* Text Content */}
                                                    <div className="w-full">
                                                        <div className={`font-bold text-sm transition-colors duration-300 ${data.accountType === "APPLICANT" ? 'text-blue-400' : 'text-gray-200'
                                                            }`}>
                                                            Job Seeker
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1 leading-tight">
                                                            Looking for job opportunities
                                                        </div>
                                                    </div>

                                                    {/* Hidden Radio */}
                                                    <Radio
                                                        value="APPLICANT"
                                                        className="absolute opacity-0"
                                                        classNames={{ radio: "!hidden" }}
                                                    />
                                                </div>
                                            </div>
                                        </label>

                                        {/* Employer Option - Clean Design */}
                                        <label className={`relative cursor-pointer transition-all duration-300 ${data.accountType === "EMPLOYER"
                                            ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/20'
                                            : 'hover:ring-1 hover:ring-green-400/50'
                                            } rounded-xl overflow-hidden`}>
                                            <div className={`p-4 transition-all duration-300 ${data.accountType === "EMPLOYER"
                                                ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500'
                                                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80'
                                                } border-2 rounded-xl h-full`}>

                                                {/* Selected indicator */}
                                                {data.accountType === "EMPLOYER" && (
                                                    <div className="absolute top-2 right-2">
                                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex flex-col items-center gap-3 text-center">
                                                    {/* Icon Container */}
                                                    <div className={`p-3 rounded-full transition-all duration-300 ${data.accountType === "EMPLOYER"
                                                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                                                        : 'bg-gray-700 text-gray-400 group-hover:text-green-400'
                                                        }`}>
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>

                                                    {/* Text Content */}
                                                    <div className="w-full">
                                                        <div className={`font-bold text-sm transition-colors duration-300 ${data.accountType === "EMPLOYER" ? 'text-green-400' : 'text-gray-200'
                                                            }`}>
                                                            Employer
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1 leading-tight">
                                                            Hiring and posting jobs
                                                        </div>
                                                    </div>

                                                    {/* Hidden Radio */}
                                                    <Radio
                                                        value="EMPLOYER"
                                                        className="absolute opacity-0"
                                                        classNames={{ radio: "!hidden" }}
                                                    />
                                                </div>
                                            </div>
                                        </label>

                                        {/* Admin Option - Clean Design */}
                                        <label className={`relative cursor-pointer transition-all duration-300 ${data.accountType === "ADMIN"
                                            ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/20'
                                            : 'hover:ring-1 hover:ring-purple-400/50'
                                            } rounded-xl overflow-hidden`}>
                                            <div className={`p-4 transition-all duration-300 ${data.accountType === "ADMIN"
                                                ? 'bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500'
                                                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80'
                                                } border-2 rounded-xl h-full`}>

                                                {/* Selected indicator */}
                                                {
                                                    data.accountType === "ADMIN" && (
                                                        <div className="absolute top-2 right-2">
                                                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}

                                                <div className="flex flex-col items-center gap-3 text-center">
                                                    {/* Icon Container */}
                                                    <div className={`p-3 rounded-full transition-all duration-300 ${data.accountType === "ADMIN"
                                                        ? 'bg-gradient-to-br from-purple-500 to-violet-500 text-white'
                                                        : 'bg-gray-700 text-gray-400 group-hover:text-purple-400'
                                                        }`}>
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                    </div>

                                                    {/* Text Content */}
                                                    <div className="w-full">
                                                        <div className={`font-bold text-sm transition-colors duration-300 ${data.accountType === "ADMIN" ? 'text-purple-400' : 'text-gray-200'
                                                            }`}>
                                                            Administrator
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1 leading-tight">
                                                            System management
                                                        </div>
                                                    </div>

                                                    {/* Hidden Radio */}
                                                    <Radio
                                                        value="ADMIN"
                                                        className="absolute opacity-0"
                                                        classNames={{ radio: "!hidden" }}
                                                    />
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </Radio.Group>
                            </div>
                            {/* Terms & Conditions Checkbox */}
                            <div className="pt-2">
                                <Checkbox
                                    autoContrast
                                    size="md"
                                    label={
                                        <span className="text-mine-shaft-200 text-sm font-medium">
                                            I accept{' '}
                                            <Anchor
                                                className="!text-cyan-400 hover:!text-cyan-300 !transition-colors !duration-200 !font-bold !underline !decoration-2 !underline-offset-2"
                                            >
                                                terms & conditions
                                            </Anchor>
                                        </span>
                                    }
                                    classNames={{
                                        input: "!border-2 !border-mine-shaft-700 checked:!bg-gradient-to-br checked:!from-cyan-500 checked:!to-blue-500 checked:!border-cyan-400 !transition-all !duration-300 !cursor-pointer hover:!border-cyan-500/50 hover:!scale-110",
                                        label: "!cursor-pointer"
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button - Premium */}
                <Button
                    onClick={handleSubmit}
                    loading={loading}
                    size="lg"
                    fullWidth
                    className="group relative overflow-hidden !bg-gradient-to-r !from-cyan-500 !via-blue-500 !to-purple-500 hover:!from-cyan-400 hover:!via-blue-400 hover:!to-purple-400 !text-white !font-black !rounded-xl "
                >
                    {/* Glow layer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

                    <span className="relative z-100  flex items-center justify-center gap-2 text-lg">
                        <IconSparkles size={22} className="group-hover:rotate-12 transition-transform duration-300" />
                        {loading ? "Creating Account..." : "Create Account"}
                    </span>
                </Button>

                {/* Footer Link - Enhanced */}
                <div className="text-center">

                    <div className="relative cursor-pointer inline-flex items-center gap-2 text-mine-shaft-300 px-8 py-4 rounded-xl bg-gradient-to-br from-mine-shaft-900/80 to-mine-shaft-950/80 border-2 border-mine-shaft-800/50 backdrop-blur-sm shadow-lg">
                        <span className="font-medium">Already have an account?</span>
                        <span
                            onClick={() => {
                                navigate("/login");
                                setFormError({});
                                setData(initialForm);

                            }}
                            className=" text-cyan-400 hover:text-cyan-300 font-black transition-all duration-300 hover:underline decoration-2 underline-offset-4 inline-flex items-center gap-1.5 group/link"
                        >
                            Login
                            <svg className="w-4 h-4 transform group-hover/link:translate-x-1 group-hover/link:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUp;