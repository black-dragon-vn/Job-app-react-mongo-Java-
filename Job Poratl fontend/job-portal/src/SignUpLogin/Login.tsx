/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, PasswordInput, rem, TextInput } from "@mantine/core";
import { IconAt, IconLock, IconSparkles } from "@tabler/icons-react";
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { loginValidation } from "../Services/FormValidation";
import { useDisclosure } from "@mantine/hooks";
import ResetPassword from "./ResetPassword";
import { useDispatch } from "react-redux";
import { setUser } from "../Slices/UserSlice";
import { errNotification, sucessNotification } from "../Services/NotificationService";
import { setJwt } from "../Slices/JwtSlice";
import { jwtDecode } from "jwt-decode";
import { loginUser } from "../Services/AuthService";

// Định nghĩa interface cho JWT payload
interface JwtPayload {
    sub: string;
    id: number;
    accountType: string;
    iat: number;
    exp: number;
}

// Định nghĩa interface cho form local
interface LoginFormData {
    email: string;
    password: string;
}

const initialForm: LoginFormData = {
    email: "",
    password: '',
}

const Login = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState<LoginFormData>(initialForm);
    const [formError, setFormError] = useState<{ [key: string]: string }>({});
    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Effect để tăng progress khi loading
    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) return 95;
                    return prev + 1;
                });
            }, 50);

            return () => clearInterval(interval);
        } else {
            setProgress(0);
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
            [name]: loginValidation(name, value)
        }));
    };

    const [passwordStrength, setPasswordStrength] = useState(1);
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setData((prev) => ({
            ...prev,
            password: value,
        }));

        const len = value.length;
        if (len < 4) setPasswordStrength(1);
        else if (len < 8) setPasswordStrength(2);
        else if (len < 12) setPasswordStrength(3);
        else setPasswordStrength(4);
        
        setFormError(prev => ({
            ...prev,
            password: loginValidation("password", value)
        }));
    };

    const handleSubmit = async () => {
        const newFormError: { [key: string]: string } = {};
        let valid = true;

        for (const key in data) {
            const errorMsg = loginValidation(key, data[key as keyof typeof data]);
            if (errorMsg) {
                valid = false;
                newFormError[key] = errorMsg;
            }
        }

        setFormError(newFormError);

        if (!valid) {
            errNotification('Validation Failed', 'Please fix the errors in the form');
            return;
        }

        setLoading(true);
        setProgress(0);

        try {
            const res = await loginUser(data);
            console.log(res);

            setProgress(100);
            await new Promise(resolve => setTimeout(resolve, 300));
            
            sucessNotification('Login Successfully', 'Redirecting to home page...');
            dispatch(setJwt(res.jwt));
            
            const decoded = jwtDecode<JwtPayload>(res.jwt);
            console.log(decoded);
            
            dispatch(setUser({ 
                ...decoded, 
                email: decoded.sub 
            }));
            
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (err: any) {
            console.error(err);
            setProgress(100);
            await new Promise(resolve => setTimeout(resolve, 300));
            errNotification(
                'Login Failed',
                err.response?.data?.errorMessage || 'Invalid credentials'
            );
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-[9999] grid place-items-center justify-center bg-black/90 backdrop-blur-sm">
                    <div className="text-center w-80 max-w-[90vw]">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-cyan-900/30 rounded-full"></div>
                            <div
                                className="absolute inset-0 border-4 border-transparent rounded-full border-t-cyan-400 border-r-blue-400 animate-spin"
                                style={{ animationDuration: '1.5s' }}
                            ></div>
                            <div
                                className="absolute inset-4 border-4 border-transparent rounded-full border-b-purple-400 border-l-pink-400 animate-spin"
                                style={{ animationDuration: '1s', animationDirection: 'reverse' }}
                            ></div>
                            <div className="absolute inset-8 flex items-center justify-center">
                                <div className="w-12 h-12 border-2 border-white/20 rounded-full flex items-center justify-center">
                                    <IconSparkles className="text-cyan-300 animate-pulse" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <p className="text-white text-2xl font-bold animate-pulse">Logging in...</p>
                            <p className="text-gray-300 text-sm">Authenticating your credentials</p>
                        </div>

                        <div className="w-full space-y-2">
                            <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-cyan-300 text-sm font-medium">
                                    {progress < 100 ? 'Processing...' : 'Complete!'}
                                </span>
                                <span className="text-white text-sm font-bold">
                                    {progress}%
                                </span>
                            </div>

                            <div className="flex justify-center gap-2 py-2">
                                {[1, 2, 3].map((dot) => (
                                    <div
                                        key={dot}
                                        className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                                        style={{
                                            animationDelay: `${dot * 0.15}s`,
                                            opacity: progress < 100 ? 1 : 0.5
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                            <p className="text-cyan-200 text-xs">
                                {progress < 30 && 'Initializing session...'}
                                {progress >= 30 && progress < 60 && 'Verifying credentials...'}
                                {progress >= 60 && progress < 90 && 'Loading user data...'}
                                {progress >= 90 && 'Finalizing login...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-1/2 px-20 flex flex-col justify-center gap-5">
                <div className="mb-6 text-center">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3 tracking-tight">
                        Login Account
                    </h1>
                    <p className="text-mine-shaft-300 text-base">
                        Join thousands of professionals and start your journey
                    </p>
                </div>

                <div className="bg-mine-shaft-900 p-8 rounded-xl border border-mine-shaft-800 space-y-5">
                    <div className="space-y-5">
                        <div className="group/input relative">
                            <TextInput
                                name="email"
                                error={formError.email}
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

                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div key={level} className="h-2 flex-1 bg-mine-shaft-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 rounded-full ${
                                                    level <= passwordStrength
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
                                <p className={`text-xs font-semibold transition-colors duration-300 ${
                                    passwordStrength === 1 ? 'text-red-400'
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

                            <div className="text-right">
                                <span
                                    onClick={open}
                                    className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors duration-300 hover:underline cursor-pointer"
                                >
                                    Forgot password?
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleSubmit}
                    loading={loading}
                    size="lg"
                    fullWidth
                    className="group relative overflow-hidden !bg-gradient-to-r !from-cyan-500 !via-blue-500 !to-purple-500 hover:!from-cyan-400 hover:!via-blue-400 hover:!to-purple-400 !text-white !font-black !rounded-xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                        <IconSparkles size={22} className="group-hover:rotate-12 transition-transform duration-300" />
                        {loading ? "Logging in..." : "Login"}
                    </span>
                </Button>

                <div className="text-center">
                    <div className="relative cursor-pointer inline-flex items-center gap-2 text-mine-shaft-300 px-8 py-4 rounded-xl bg-gradient-to-br from-mine-shaft-900/80 to-mine-shaft-950/80 border-2 border-mine-shaft-800/50 backdrop-blur-sm shadow-lg">
                        <span className="font-medium">Don't have an account?</span>
                        <span
                            onClick={() => {
                                navigate("/signup");
                                setFormError({});
                                setData(initialForm);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 font-black transition-all duration-300 hover:underline decoration-2 underline-offset-4 inline-flex items-center gap-1.5 group/link"
                        >
                            Sign Up
                            <svg className="w-4 h-4 transform group-hover/link:translate-x-1 group-hover/link:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <ResetPassword opened={opened} close={close} />
        </>
    );
}

export default Login;