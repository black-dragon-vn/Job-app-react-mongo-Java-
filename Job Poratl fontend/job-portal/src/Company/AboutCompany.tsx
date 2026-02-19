import { IconGlobe, IconCalendar, IconChartBar, IconTrendingUp, IconTarget } from "@tabler/icons-react";
import type { CompanyData } from "../Data/companyData";


interface AboutCompanyProps {
    company: CompanyData;
}

const AboutCompany = ({ company }: AboutCompanyProps) => {
    return (
        <div className="space-y-8">
            {/* Mission Section */}
            {company.mission && (
                <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-900/10 to-blue-900/10 border border-cyan-500/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                            <IconTarget size={24} className="text-cyan-400" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                            Our Mission
                        </h3>
                    </div>
                    <p className="text-mine-shaft-300 text-lg leading-relaxed italic">
                        "{company.mission}"
                    </p>
                </div>
            )}

            {/* Overview Section */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-mine-shaft-900/40 to-mine-shaft-950/40 border border-mine-shaft-700/50 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    Company Overview
                </h3>
                <p className="text-mine-shaft-300 leading-relaxed mb-8">
                    {company.overview}
                </p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {company.founded && (
                        <div className="p-6 rounded-xl bg-gradient-to-br from-mine-shaft-800/50 to-mine-shaft-900/50 border border-mine-shaft-700/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-cyan-900/30 rounded-lg">
                                    <IconCalendar size={20} className="text-cyan-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-mine-shaft-400">Founded</div>
                                    <div className="text-2xl font-bold text-cyan-300">{company.founded}</div>
                                </div>
                            </div>
                            <div className="text-xs text-mine-shaft-500 mt-2">
                                Years of innovation
                            </div>
                        </div>
                    )}
                    
                    {company.employees && (
                        <div className="p-6 rounded-xl bg-gradient-to-br from-mine-shaft-800/50 to-mine-shaft-900/50 border border-mine-shaft-700/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-900/30 rounded-lg">
                                    <IconChartBar size={20} className="text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-mine-shaft-400">Employees</div>
                                    <div className="text-2xl font-bold text-blue-300">
                                        {company.employees > 10000 ? 
                                            `${(company.employees / 1000).toFixed(0)}K+` : 
                                            company.employees.toLocaleString()
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-mine-shaft-500 mt-2">
                                Global workforce
                            </div>
                        </div>
                    )}
                    
                    {company.revenue && (
                        <div className="p-6 rounded-xl bg-gradient-to-br from-mine-shaft-800/50 to-mine-shaft-900/50 border border-mine-shaft-700/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-900/30 rounded-lg">
                                    <IconTrendingUp size={20} className="text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-mine-shaft-400">Annual Revenue</div>
                                    <div className="text-2xl font-bold text-purple-300">{company.revenue.split(' ')[0]}</div>
                                </div>
                            </div>
                            <div className="text-xs text-mine-shaft-500 mt-2">
                                {company.revenue.split(' ')[1]}
                            </div>
                        </div>
                    )}
                    
                    <div className="p-6 rounded-xl bg-gradient-to-br from-mine-shaft-800/50 to-mine-shaft-900/50 border border-mine-shaft-700/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-900/30 rounded-lg">
                                <IconGlobe size={20} className="text-green-400" />
                            </div>
                            <div>
                                <div className="text-sm text-mine-shaft-400">Headquarters</div>
                                <div className="text-lg font-bold text-green-300 line-clamp-1">{company.headquarters}</div>
                            </div>
                        </div>
                        <div className="text-xs text-mine-shaft-500 mt-2">
                            Global operations center
                        </div>
                    </div>
                </div>
            </div>

            {/* Specialties Section */}
            {company.specialties && (
                <div className="p-8 rounded-2xl bg-gradient-to-br from-mine-shaft-900/40 to-mine-shaft-950/40 border border-mine-shaft-700/50 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                        Core Specialties
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {company.specialties.map((specialty, index) => (
                            <div 
                                key={index}
                                className="p-4 rounded-xl bg-gradient-to-br from-mine-shaft-800/50 to-mine-shaft-900/50 border border-mine-shaft-700/50 hover:border-cyan-500/30 transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:scale-125 transition-transform duration-300" />
                                    <span className="text-mine-shaft-300 group-hover:text-cyan-300 transition-colors duration-300">
                                        {specialty}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Industry Section */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-mine-shaft-900/40 to-mine-shaft-950/40 border border-mine-shaft-700/50 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    Industry & Operations
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="text-sm text-mine-shaft-400 mb-2">Primary Industry</div>
                        <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg inline-block">
                            <span className="text-cyan-300 font-medium">{company.industry}</span>
                        </div>
                    </div>
                    
                    {company.website && (
                        <div>
                            <div className="text-sm text-mine-shaft-400 mb-2">Official Website</div>
                            <a 
                                href={company.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-mine-shaft-800/50 to-mine-shaft-900/50 border border-mine-shaft-700 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-900/20 transition-all duration-300 group"
                            >
                                <IconGlobe size={18} className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                                    {company.website.replace('https://', '')}
                                </span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutCompany;