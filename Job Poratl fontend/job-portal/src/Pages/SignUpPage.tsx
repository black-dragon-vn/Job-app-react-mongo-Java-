import { IconBrandWaze, IconSparkles, IconUsers, IconBriefcase, IconTrendingUp, IconCheck, IconArrowLeft } from "@tabler/icons-react";
import SignUp from "../SignUpLogin/SignUp";
import Login from "../SignUpLogin/Login";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@mantine/core";

const SignUpPage = () => {
    const location = useLocation();
    const isSignUp = location.pathname === '/signup';

    return (
        <div className="min-h-[100vh] bg-mine-shaft-950 font-poppins overflow-hidden relative ">
             <Link to="/" className="my-4 inline-block !absolute left-5 z-100   ">
                <Button
                    className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 border border-cyan-400/40 hover:border-cyan-300"
                    type="submit"
                    size="md"
                    variant="light"
                >
                    {/* Animated gradient background layer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

                    <span className="relative z-10 flex items-center gap-2">
                        <span className="group-hover:-translate-x-1 transition-transform duration-300">
                            <IconArrowLeft size={18} stroke={2.5} />
                        </span>
                        Home
                    </span>
                </Button>
            </Link>
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Mesh */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.3) 0%, transparent 40%),
                                          radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.3) 0%, transparent 40%)`
                    }}>
                </div>

                {/* Animated Grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px),
                                          linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* Main Container */}
            <div className={`h-[150vh] w-[100vw] transition-transform ease-in-out duration-1000 flex [&>*]:flex-shrink-0 relative z-10 ${isSignUp ? '-translate-x-1/2' : 'translate-x-0'}`}>
                {/* Login Component */}
                <Login />

                {/* Center Branding Section */}
                <div className={`w-1/2 h-full transition-all ease-in-out duration-1000 bg-gradient-to-br from-mine-shaft-900 via-mine-shaft-800 to-mine-shaft-900 relative overflow-hidden
                    ${isSignUp ? 'rounded-r-[100px]' : 'rounded-l-[100px]'}
                    flex items-center justify-center flex-col gap-8 px-16`}
                >
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0">
                        {/* Floating circles */}
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-cyan-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 border border-purple-500/20 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
                    </div>

                    {/* Logo & Brand */}
                    <div className="flex items-center gap-4 group relative z-10">
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-cyan-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>

                            {/* Main icon */}
                            <div className="relative bg-gradient-to-br from-cyan-600 to-cyan-900 p-4 rounded-2xl shadow-2xl shadow-cyan-500/30 transform group-hover:scale-105 transition-all duration-300">
                                <IconBrandWaze stroke={2} className="h-16 w-16 text-white" />
                            </div>

                            {/* Sparkle effect */}
                            <div className="absolute -top-2 -right-2">
                                <IconSparkles className="h-6 w-6 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400  to-yellow-400 bg-clip-text text-transparent leading-tight">
                                JobNect
                            </h1>
                            <p className="text-lg text-cyan-300 font-medium tracking-wide flex items-center gap-2 mt-2">
                                <IconSparkles size={18} className="animate-pulse" />
                                Connecting Talent & Opportunities
                            </p>
                        </div>
                    </div>

                    {/* Main Headline */}
                    <div className="text-center space-y-4 max-w-2xl relative z-10">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            {isSignUp ? 'Start Your Career Journey' : 'Welcome Back, Professional!'}
                        </h2>
                        <p className="text-xl text-mine-shaft-300 leading-relaxed">
                            {isSignUp
                                ? 'Join thousands who found their dream job through our platform'
                                : 'Continue connecting with top employers worldwide'
                            }
                        </p>
                    </div>

                    {/* Benefits List */}
                    <div className="space-y-4 max-w-lg relative z-10">
                        {[
                            { text: 'Personalized job recommendations', icon: IconCheck },
                            { text: 'Direct contact with recruiters', icon: IconCheck },
                            { text: 'AI-powered resume analysis', icon: IconCheck },
                            { text: 'Interview preparation tools', icon: IconCheck }
                        ].map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3 text-mine-shaft-200 group">
                                <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                    <benefit.icon size={18} className="text-white" />
                                </div>
                                <span className="text-lg group-hover:text-cyan-300 transition-colors duration-300">
                                    {benefit.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-3 gap-6 max-w-2xl relative z-10 mt-8">
                        <div className="bg-mine-shaft-800/40 backdrop-blur-sm p-5 rounded-xl border border-mine-shaft-700/50 hover:border-cyan-500/50 transition-all duration-300 group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                    <IconUsers size={20} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">10K+</div>
                                    <div className="text-sm text-mine-shaft-400">Active Users</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-mine-shaft-800/40 backdrop-blur-sm p-5 rounded-xl border border-mine-shaft-700/50 hover:border-purple-500/50 transition-all duration-300 group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <IconBriefcase size={20} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">5K+</div>
                                    <div className="text-sm text-mine-shaft-400">Job Listings</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-mine-shaft-800/40 backdrop-blur-sm p-5 rounded-xl border border-mine-shaft-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <IconTrendingUp size={20} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">95%</div>
                                    <div className="text-sm text-mine-shaft-400">Success Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Quote */}
                    <div className="relative z-10 mt-8 text-center">
                        <div className="text-mine-shaft-400 italic text-lg">
                            "The best way to predict the future is to create it."
                        </div>
                        <div className="text-cyan-400 font-medium mt-2">
                            - Join JobNect Today
                        </div>
                    </div>

                    {/* Animated Border Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                </div>

                {/* SignUp Component */}
                <SignUp />
            </div>
        </div>
    );
}

export default SignUpPage;