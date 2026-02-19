import { ActionIcon } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import type { CompanyData } from "../Data/companyData";

interface CompanyCardProps {
    company: CompanyData;
}
 
const CompanyCard = ({ company }: CompanyCardProps) => {
    return (
        <div className="relative p-5 bg-gradient-to-br from-mine-shaft-900 to-mine-shaft-950 border border-mine-shaft-800 rounded-2xl hover:border-cyan-500/50 transition-all duration-500 group cursor-pointer overflow-hidden">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            
            <div className="relative flex justify-between items-start gap-4">
                {/* Left side - Company info */}
                <div className="flex gap-4 items-start flex-1 min-w-0">
                    {/* Logo/Avatar with enhanced effects */}
                    <div className="relative flex-shrink-0">
                        {/* Outer glow */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        
                        {/* Inner glow */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/50 to-blue-400/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        
                        {/* Logo container */}
                        <div className="relative h-16 w-16 bg-mine-shaft-800 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                            <img
                                src={company.logo}
                                alt={`${company.name} logo`}
                                className="h-12 w-12 object-contain"
                                onError={(e) => {
                                    // Fallback: Hiển thị chữ cái đầu với gradient nếu logo lỗi
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling;
                                    if (fallback) {
                                        (fallback as HTMLElement).style.display = 'flex';
                                    }
                                }}
                            />
                            {/* Fallback letter */}
                            <div className="hidden absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 items-center justify-center text-white font-bold text-2xl">
                                {company.name.charAt(0)}
                            </div>
                        </div>
                    </div>

                    {/* Company details */}
                    <div className="flex-1 min-w-0 space-y-2">
                        {/* Company name */}
                        <h3 className="font-bold text-xl text-mine-shaft-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-blue-300 group-hover:bg-clip-text transition-all duration-300 truncate">
                            {company.name}
                        </h3>
                        
                        {/* Industry tag */}
                        {company.industry && (
                            <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full">
                                <span className="text-xs font-medium text-cyan-300 truncate">
                                    {company.industry}
                                </span>
                            </div>
                        )}
                        
                        {/* Metadata */}
                        <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1.5 text-mine-shaft-300 group-hover:text-mine-shaft-200 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="font-medium">
                                    {company.employees 
                                        ? company.employees > 1000 
                                            ? `${(company.employees / 1000).toFixed(0)}K+` 
                                            : company.employees.toLocaleString()
                                        : company.size
                                    }
                                </span>
                            </div>
                            
                            {company.headquarters && (
                                <>
                                    <div className="w-1 h-1 rounded-full bg-mine-shaft-600" />
                                    <div className="flex items-center gap-1.5 text-mine-shaft-400 truncate">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="truncate">
                                            {company.headquarters.split(',')[0]}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right side - Action button */}
                <ActionIcon 
                    size="lg"
                    variant="light"
                    color="cyan"
                    className="flex-shrink-0 hover:scale-110 hover:rotate-12 transition-all duration-300"
                >
                    <IconExternalLink size={20} />
                </ActionIcon>
            </div>

            {/* Bottom stats bar */}
            {company.stats && (
                <div className="relative mt-5 pt-4 border-t border-mine-shaft-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Rating */}
                        {company.stats.avgRating && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">★</span>
                                    <span className="text-base font-bold text-mine-shaft-100">
                                        {company.stats.avgRating}
                                    </span>
                                </div>
                                {company.stats.totalReviews && (
                                    <span className="text-xs text-mine-shaft-500">
                                        ({company.stats.totalReviews.toLocaleString()})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Active jobs badge */}
                    {company.stats.activeJobs && (
                        <div className="px-4 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full backdrop-blur-sm group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                            <span className="text-sm font-bold text-cyan-300">
                                {company.stats.activeJobs} Open Positions
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CompanyCard;