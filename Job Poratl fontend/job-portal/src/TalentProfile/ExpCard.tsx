import type { Experience } from "./Profile";
import dayjs from "dayjs";

interface ExCardProps {
    data: Experience[];
}

const ExCard = ({ data }: ExCardProps) => {
    // Logo mapping for companies
    const logoMap: Record<string, string> = {
        "Google": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "AWS Certified": "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
        "Amazon": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        "Cisco Certified": "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
        "Cisco": "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
        "Microsoft Certified": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", 
        "Meta": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
        "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        "Amazon Web Services": "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
        "AWS": "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
        "Oracle": "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
        "IBM": "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
        "Salesforce": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Salesforce_logo.svg",
        "Apple": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        "Facebook": "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
        "Intel": "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg",
        "Netflix": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        "Tesla": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg"
    };

    // Format period từ startDate và endDate
    const formatPeriod = (startDate: string, endDate: string | null) => {
        if (!startDate) return 'N/A';
        const start = dayjs(startDate).format('MMM YYYY');
        const end = endDate ? dayjs(endDate).format('MMM YYYY') : 'Present';
        return `${start} - ${end}`;
    };

    // Empty state khi không có experience
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-mine-shaft-600 mb-4">
                    <div className="text-6xl mb-2">📋</div>
                    <p className="text-xl text-mine-shaft-400">No experiences yet</p>
                    <p className="text-mine-shaft-500">Add your first experience to get started</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {data.map((exp, index) => (
                <div 
                    key={index} 
                    className="group relative p-5 rounded-xl bg-mine-shaft-900/50 border border-mine-shaft-800 hover:border-cyan-500/30 hover:bg-mine-shaft-900/80 transition-all duration-300"
                >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300" />
                    
                    <div className="relative flex justify-between items-start">
                        <div className="flex gap-4 items-start flex-1">
                            {/* Company Logo */}
                            <div className="p-3 bg-mine-shaft-800 rounded-lg group-hover:bg-mine-shaft-700 transition-colors duration-300 flex-shrink-0">
                                <img 
                                    className='h-8 w-8 object-contain' 
                                    src={logoMap[exp.company] || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"} 
                                    alt={exp.company}
                                    onError={(e) => {
                                        e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                                    }}
                                />
                            </div>
                            
                            {/* Experience Details */}
                            <div className="flex flex-col gap-1">
                                {/* Job Title */}
                                <div className="font-semibold text-xl text-white group-hover:text-cyan-400 transition-colors duration-300">
                                    {exp.title || "Untitled Position"}
                                </div>
                                
                                {/* Company & Location */}
                                <div className="text-base text-mine-shaft-300 flex items-center gap-2 flex-wrap">
                                    <span>{exp.company || "No company specified"}</span>
                                    {exp.location && (
                                        <>
                                            <span className="text-mine-shaft-600">•</span>
                                            <span className="text-sm text-mine-shaft-400">{exp.location}</span>
                                        </>
                                    )}
                                </div>
                                
                                {/* Period */}
                                <div className="text-sm text-mine-shaft-400">
                                    {formatPeriod(exp.startDate, exp.endDate)}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Description */}
                    {exp.description && (
                        <div className="relative mt-4 pl-16 text-sm text-mine-shaft-400 leading-relaxed whitespace-pre-line">
                            {exp.description}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default ExCard;