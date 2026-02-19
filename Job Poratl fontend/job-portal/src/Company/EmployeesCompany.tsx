import type { CompanyData } from "../Data/companyData";
import { IconUsers, IconStar, IconTrendingUp, IconAward, IconQuote, IconCalendar, IconBadge, IconCrown, IconBriefcase, IconSparkles } from "@tabler/icons-react";
import { talents } from "../Data/TalentData";
import { IconBookmark, IconMapPin } from "@tabler/icons-react";
import { Divider, Text } from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import { reviews } from "../Data/reviews";

interface EmployeesCompanyProps {
    company: CompanyData;
}

// Định nghĩa kiểu dữ liệu cho talent
interface Talent {
    id: number;
    name: string;
    role: string;
    company: string;
    location: string;
    experience: string;
    hourlyRate: number;
    avatar: string;
    topSkills: string[];
    about: string;
}

// Component TalentCard tách biệt
interface TalentCardProps {
    talent: Talent;
}

const TalentCard = ({ talent }: TalentCardProps) => {
    const [saved, setSaved] = useState(false);

    if (!talent) return null;

    const {
        name,
        role,
        company,
        location,
        experience,
        hourlyRate,
        avatar,
        topSkills,
        about
    } = talent;

    return (
        <div className="bg-mine-shaft-900 p-5 w-full flex flex-col gap-4 rounded-xl hover:shadow-lg transition-all duration-300 border border-mine-shaft-800 hover:border-cyan-500/30 hover:shadow-cyan-500/10 group h-full">

            {/* Header với avatar và thông tin cơ bản */}
            <div className="flex justify-between items-start">
                <div className="flex gap-3 items-start flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <img
                            src={avatar}
                            alt={`${name} avatar`}
                            className="h-14 w-14 object-cover rounded-full border-2 border-mine-shaft-700 group-hover:border-cyan-500/50 transition-all duration-300"
                            onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/56";
                                e.currentTarget.alt = "User avatar";
                            }}
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-lg text-mine-shaft-100 truncate group-hover:text-cyan-100 transition-colors duration-300">
                            {name}
                        </div>
                        <div className="text-sm font-medium text-bright-sun-400 truncate">{role}</div>
                        <div className="text-xs text-mine-shaft-300 truncate">{company}</div>
                    </div>
                </div>

                {/* Bookmark button */}
                <button
                    onClick={() => setSaved(!saved)}
                    className="p-2 hover:bg-mine-shaft-800 rounded-full transition-colors"
                >
                    <IconBookmark
                        className={saved ? "text-cyan-400 fill-cyan-400" : "text-mine-shaft-400 hover:text-cyan-400"}
                        size={20}
                        stroke={1.5}
                    />
                </button>
            </div>

            {/* Location và Experience */}
            <div className="flex items-center gap-4 text-sm text-mine-shaft-400">
                <div className="flex items-center gap-1">
                    <IconMapPin size={16} className="text-mine-shaft-500" />
                    <span>{location}</span>
                </div>
                <div className="flex items-center gap-1">
                    <IconBriefcase size={16} className="text-mine-shaft-500" />
                    <span>{experience}</span>
                </div>
            </div>

            {/* Top Skills */}
            <div className="flex flex-wrap gap-2">
                {topSkills.slice(0, 4).map((skill, index) => (
                    <div
                        key={index}
                        className="py-1 px-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 rounded-lg text-xs font-medium border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105"
                    >
                        {skill}
                    </div>
                ))}
                {topSkills.length > 4 && (
                    <div className="py-1 px-3 bg-mine-shaft-800 text-mine-shaft-400 rounded-lg text-xs font-medium border border-mine-shaft-700">
                        +{topSkills.length - 4}
                    </div>
                )}
            </div>

            {/* About */}
            <Text
                lineClamp={3}
                className="text-sm text-justify text-mine-shaft-300 leading-relaxed group-hover:text-mine-shaft-200 transition-colors duration-300"
            >
                {about}
            </Text>

            <Divider size="xs" className="!border-mine-shaft-700" />

            {/* Footer với hourly rate và action button */}
            <div className="flex justify-between items-center mt-auto">
                <div className="flex flex-col">
                    <div className="text-xs text-mine-shaft-400">Hourly Rate</div>
                    <div className="font-bold text-xl text-cyan-300">
                        ${hourlyRate}
                        <span className="text-sm text-mine-shaft-400 font-normal">/hr</span>
                    </div>
                </div>

                <Link to={"/talent-profile"}>
                    <button className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20">
                        View Profile
                    </button>
                </Link>
            </div>
        </div>
    );
};

const EmployeesCompany = ({ company }: EmployeesCompanyProps) => {
    // Mock employee reviews


    // Filter top talents (first 6)
    const topTalents = talents.slice(0, 6);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Overview with enhanced design */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-mine-shaft-900/40 via-mine-shaft-950/40 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-xl shadow-xl">
                {/* Background glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 -z-10" />

                <div className="flex items-center gap-6 mb-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700" />
                        <div className="relative p-4 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30 backdrop-blur-sm">
                            <IconUsers size={32} className="text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                            Employee Insights
                        </h3>
                        <p className="text-mine-shaft-300/80 mt-2 text-lg">
                            What it's like to work at <span className="text-cyan-300 font-semibold">{company.name}</span>
                        </p>
                    </div>
                </div>

                {/* Enhanced stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-mine-shaft-800/30 via-mine-shaft-900/30 to-mine-shaft-900/50 border border-mine-shaft-700/50 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-105">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl border border-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                                <IconUsers size={24} className="text-cyan-300" />
                            </div>
                            <div>
                                <div className="text-sm text-mine-shaft-400 mb-1">Total Employees</div>
                                <div className="text-3xl font-bold text-cyan-300">
                                    {company.employees ?
                                        (company.employees > 10000 ?
                                            `${(company.employees / 1000).toFixed(0)}K+` :
                                            company.employees.toLocaleString()
                                        ) :
                                        company.size
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-mine-shaft-800/30 via-mine-shaft-900/30 to-mine-shaft-900/50 border border-mine-shaft-700/50 hover:border-yellow-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-105">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl border border-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                                <IconStar size={24} className="text-yellow-300" />
                            </div>
                            <div>
                                <div className="text-sm text-mine-shaft-400 mb-1">Average Rating</div>
                                <div className="text-3xl font-bold text-yellow-300">
                                    {company.stats?.avgRating || 4.6}/5
                                </div>
                                <div className="text-xs text-mine-shaft-500/80 mt-1">
                                    Based on {company.stats?.totalReviews?.toLocaleString() || '25.8K'} reviews
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-mine-shaft-800/30 via-mine-shaft-900/30 to-mine-shaft-900/50 border border-mine-shaft-700/50 hover:border-green-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-105">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                                <IconTrendingUp size={24} className="text-green-300" />
                            </div>
                            <div>
                                <div className="text-sm text-mine-shaft-400 mb-1">Growth Rate</div>
                                <div className="text-3xl font-bold text-green-300">+15%</div>
                                <div className="text-xs text-mine-shaft-500/80 mt-1">
                                    Year-over-year employee growth
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-mine-shaft-800/30 via-mine-shaft-900/30 to-mine-shaft-900/50 border border-mine-shaft-700/50 hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-105">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                                <IconAward size={24} className="text-purple-300" />
                            </div>
                            <div>
                                <div className="text-sm text-mine-shaft-400 mb-1">Retention Rate</div>
                                <div className="text-3xl font-bold text-purple-300">92%</div>
                                <div className="text-xs text-mine-shaft-500/80 mt-1">
                                    Employee retention rate
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Culture & Benefits */}
            {company.culture && company.benefits && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Culture */}
                    <div className="relative p-8 rounded-3xl bg-gradient-to-br from-mine-shaft-900/40 via-mine-shaft-950/40 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-xl shadow-xl group hover:border-cyan-500/30 transition-all duration-300">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
                                    <IconBadge size={28} className="text-cyan-300" />
                                </div>
                                <h4 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                                    Company Culture
                                </h4>
                            </div>
                            <div className="space-y-4">
                                {company.culture.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 group/item">
                                        <div className="relative mt-1.5">
                                            <div className="absolute inset-0 w-3 h-3 bg-cyan-500/20 rounded-full blur group-hover/item:blur-sm transition-all duration-300" />
                                            <div className="relative w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 group-hover/item:scale-125 transition-transform duration-300" />
                                        </div>
                                        <span className="text-mine-shaft-300 group-hover/item:text-cyan-100 transition-colors duration-300 flex-1">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="relative p-8 rounded-3xl bg-gradient-to-br from-mine-shaft-900/40 via-mine-shaft-950/40 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-xl shadow-xl group hover:border-blue-500/30 transition-all duration-300">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                                    <IconAward size={28} className="text-blue-300" />
                                </div>
                                <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                                    Employee Benefits
                                </h4>
                            </div>
                            <div className="space-y-4">
                                {company.benefits.slice(0, 6).map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-4 group/item">
                                        <div className="relative mt-1.5">
                                            <div className="absolute inset-0 w-3 h-3 bg-blue-500/20 rounded-full blur group-hover/item:blur-sm transition-all duration-300" />
                                            <div className="relative w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 group-hover/item:scale-125 transition-transform duration-300" />
                                        </div>
                                        <span className="text-mine-shaft-300 group-hover/item:text-blue-100 transition-colors duration-300 flex-1">
                                            {benefit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Employee Reviews */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-mine-shaft-900/40 via-mine-shaft-950/40 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-xl shadow-xl">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 -z-10" />

                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                        <IconQuote size={28} className="text-purple-300" />
                    </div>
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                        What Employees Say
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="group relative p-8 rounded-2xl bg-gradient-to-br from-mine-shaft-800/30 via-mine-shaft-900/30 to-mine-shaft-900/50 border border-mine-shaft-700/50 hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-105"
                        >
                            <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Review header with avatar */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img
                                        src={review.avatar}
                                        alt={review.name}
                                        className="relative w-14 h-14 rounded-full border-2 border-mine-shaft-700 object-cover group-hover:border-purple-500/50 transition-all duration-300"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-mine-shaft-100 group-hover:text-purple-100 transition-colors duration-300">
                                                {review.name}
                                            </div>
                                            <div className="text-sm text-mine-shaft-400 flex items-center gap-2">
                                                <span>{review.role}</span>
                                                <span className="w-1 h-1 rounded-full bg-mine-shaft-600"></span>
                                                <span className="flex items-center gap-1">
                                                    <IconCalendar size={14} className="text-mine-shaft-500" />
                                                    {review.tenure}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-mine-shaft-800/50 px-3 py-1.5 rounded-full">
                                            {[...Array(5)].map((_, i) => (
                                                <IconStar
                                                    key={i}
                                                    size={16}
                                                    className={i < review.rating ?
                                                        "text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform duration-300" :
                                                        "text-mine-shaft-600"
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Review comment */}
                            <div className="relative">
                                <IconQuote
                                    size={24}
                                    className="absolute -top-2 -left-2 text-purple-500/20 group-hover:text-purple-500/30 transition-colors duration-300"
                                />
                                <p className="text-mine-shaft-300 text-sm leading-relaxed pl-4 group-hover:text-mine-shaft-200 transition-colors duration-300">
                                    "{review.comment}"
                                </p>
                            </div>

                            {/* Decorative line */}
                            <div className="mt-6 pt-4 border-t border-mine-shaft-800/50 group-hover:border-purple-500/20 transition-colors duration-300">
                                <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Enhanced Top Talents Section - Sử dụng TalentCard component */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-mine-shaft-900/40 via-mine-shaft-950/40 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-xl shadow-xl">
                {/* Background effects */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 -z-10" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl -z-10" />

                {/* Section Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700" />
                            <div className="relative p-4 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30 backdrop-blur-sm">
                                <IconCrown size={32} className="text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                Top Talents at {company.name}
                            </h3>
                            <p className="text-mine-shaft-300/80 mt-2 text-lg flex items-center gap-2">
                                <IconSparkles size={20} className="text-cyan-400" />
                                Meet the brilliant minds driving innovation
                            </p>
                        </div>
                    </div>
                    <div className="hidden lg:block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-300 font-bold backdrop-blur-sm">
                        {topTalents.length} Talents
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-mine-shaft-800/30 to-mine-shaft-900/30 border border-mine-shaft-700/50">
                        <div className="text-sm text-mine-shaft-400 mb-1">Avg. Hourly Rate</div>
                        <div className="text-2xl font-bold text-cyan-300">$85/hr</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-mine-shaft-800/30 to-mine-shaft-900/30 border border-mine-shaft-700/50">
                        <div className="text-sm text-mine-shaft-400 mb-1">Avg. Experience</div>
                        <div className="text-2xl font-bold text-blue-300">8.5 years</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-mine-shaft-800/30 to-mine-shaft-900/30 border border-mine-shaft-700/50">
                        <div className="text-sm text-mine-shaft-400 mb-1">Top Skills</div>
                        <div className="text-2xl font-bold text-purple-300">85+</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-mine-shaft-800/30 to-mine-shaft-900/30 border border-mine-shaft-700/50">
                        <div className="text-sm text-mine-shaft-400 mb-1">Projects</div>
                        <div className="text-2xl font-bold text-cyan-400">240+</div>
                    </div>
                </div>

                {/* Talents Grid - Sử dụng TalentCard component */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topTalents.map((talent, index) => (
                        <div key={talent.id} className="group relative">
                            {/* Rank Badge for top 3 */}
                            {index < 3 && (
                                <div className={`absolute -top-3 -left-3 z-20 w-10 h-10 rounded-full flex items-center justify-center ${index === 0
                                        ? 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30'
                                        : index === 1
                                            ? 'bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg shadow-blue-500/30'
                                            : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30'
                                    }`}>
                                    <span className="font-bold text-white text-sm">
                                        #{index + 1}
                                    </span>
                                </div>
                            )}

                            {/* Glow effect */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                            {/* Sử dụng TalentCard component */}
                            <TalentCard talent={talent} />
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-10 text-center">
                    <Link to="/find-talent">
                        <button className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30 border border-cyan-400/40">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                            <span className="relative z-10 flex items-center gap-2">
                                View All Talents
                                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Custom CSS */}
            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }
                
                /* Talent card animation */
                .grid > div {
                    animation: slide-up 0.5s ease-out forwards;
                    animation-delay: calc(var(--index) * 0.1s);
                    opacity: 0;
                }
                
                .grid > div:nth-child(1) { --index: 1; }
                .grid > div:nth-child(2) { --index: 2; }
                .grid > div:nth-child(3) { --index: 3; }
                .grid > div:nth-child(4) { --index: 4; }
                .grid > div:nth-child(5) { --index: 5; }
                .grid > div:nth-child(6) { --index: 6; }
            `}</style>
        </div>
    );
};

export default EmployeesCompany;