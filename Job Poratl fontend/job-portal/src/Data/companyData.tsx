// types/company.ts - Merged CompanyData interface
export interface CompanyData {
    // Core fields (required)
    name: string;
    logo: string;
    overview: string;
    industry: string;
    website: string;
    size: string;
    headquarters: string;
    specialties: string[];
    
    // Optional fields from original definition
    founded?: number;
    revenue?: string;
    employees?: number;
    mission?: string;
    culture?: string[];
    benefits?: string[];
    social?: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        facebook?: string;
    };
    stats?: {
        totalJobs?: number;
        activeJobs?: number;
        avgRating?: number;
        totalReviews?: number;
    };
    
    // Additional fields from Company.tsx (for backward compatibility)
    id?: number;
    location?: string;
}

// data/companyData.ts
export const companyData: CompanyData[] = [
    {
        name: "Google LLC",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        overview: "Google is a global technology leader focused on improving the ways people connect with information. Our innovations in web search, advertising, operating systems, and enterprise services have transformed how businesses operate and people interact with technology worldwide. We're committed to building products that help billions of people daily.",
        industry: "Technology & Internet Services",
        website: "https://www.google.com",
        size: "100,000+ employees",
        headquarters: "Mountain View, California, United States",
        specialties: [
            "Search Engine Technology",
            "Cloud Computing",
            "Artificial Intelligence",
            "Machine Learning",
            "Mobile Operating Systems",
            "Digital Advertising",
            "Hardware Development",
            "Quantum Computing"
        ],
        founded: 1998,
        revenue: "$282.8 billion (2023)",
        employees: 190000,
        mission: "To organize the world's information and make it universally accessible and useful.",
        culture: [
            "Innovation-driven environment",
            "Data-driven decision making",
            "Collaborative workspaces",
            "20% time for personal projects",
            "Diversity and inclusion focus",
            "Continuous learning culture"
        ],
        benefits: [
            "Competitive salary and bonuses",
            "Comprehensive health insurance",
            "401(k) matching program",
            "Generous parental leave",
            "Onsite wellness centers",
            "Free meals and snacks",
            "Fitness reimbursement",
            "Tuition reimbursement",
            "Flexible work hours",
            "Remote work options"
        ],
        social: {
            linkedin: "https://linkedin.com/company/google",
            twitter: "https://twitter.com/google",
            instagram: "https://instagram.com/google",
            facebook: "https://facebook.com/Google"
        },
        stats: {
            totalJobs: 1250,
            activeJobs: 340,
            avgRating: 4.6,
            totalReviews: 25800
        }
    },
    {
        name: "Microsoft Corporation",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        overview: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge. Our mission is to empower every person and every organization on the planet to achieve more.",
        industry: "Software & Cloud Services",
        website: "https://www.microsoft.com",
        size: "221,000+ employees",
        headquarters: "Redmond, Washington, United States",
        specialties: [
            "Operating Systems",
            "Productivity Software",
            "Cloud Services (Azure)",
            "Gaming (Xbox)",
            "Enterprise Solutions",
            "Developer Tools",
            "AI & Machine Learning"
        ],
        founded: 1975,
        revenue: "$211.9 billion (2023)",
        employees: 221000,
        mission: "To empower every person and every organization on the planet to achieve more.",
        culture: [
            "Growth mindset culture",
            "Customer-obsessed",
            "Diverse and inclusive",
            "One Microsoft approach",
            "Ethical AI principles"
        ],
        benefits: [
            "Industry-leading healthcare",
            "Paid time off",
            "Parental leave",
            "Employee stock purchase",
            "Fitness subsidies",
            "Education assistance"
        ]
    },
    {
        name: "Amazon.com Inc",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        overview: "Amazon is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking.",
        industry: "E-commerce & Cloud Computing",
        website: "https://www.amazon.com",
        size: "1,600,000+ employees",
        headquarters: "Seattle, Washington, United States",
        specialties: [
            "E-commerce Platform",
            "Cloud Computing (AWS)",
            "Logistics & Supply Chain",
            "Digital Streaming",
            "Artificial Intelligence",
            "Smart Devices"
        ],
        founded: 1994,
        revenue: "$574.8 billion (2023)",
        employees: 1600000,
        mission: "To be Earth's most customer-centric company, where customers can find and discover anything they might want to buy online."
    },
    {
        name: "Apple Inc.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        overview: "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
        industry: "Consumer Electronics",
        website: "https://www.apple.com",
        size: "164,000+ employees",
        headquarters: "Cupertino, California, United States",
        specialties: [
            "Consumer Electronics",
            "Software Development",
            "Hardware Design",
            "Retail Experience",
            "Chip Design",
            "Privacy & Security"
        ],
        founded: 1976,
        revenue: "$383.3 billion (2023)",
        employees: 164000
    },
    {
        name: "Meta Platforms Inc.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",
        overview: "Meta builds technologies that help people connect, find communities, and grow businesses through social platforms and virtual reality.",
        industry: "Social Media & Technology",
        website: "https://www.meta.com",
        size: "86,000+ employees",
        headquarters: "Menlo Park, California, United States",
        specialties: [
            "Social Media Platforms",
            "Virtual Reality",
            "Augmented Reality",
            "Digital Advertising",
            "Artificial Intelligence",
            "Connectivity Solutions"
        ],
        founded: 2004,
        employees: 86000
    },
    {
        name: "Tesla Inc.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
        overview: "Tesla designs, develops, manufactures, sells, and leases electric vehicles and energy storage systems, and installs and maintains solar and energy storage products.",
        industry: "Automotive & Clean Energy",
        website: "https://www.tesla.com",
        size: "140,000+ employees",
        headquarters: "Austin, Texas, United States",
        specialties: [
            "Electric Vehicles",
            "Battery Technology",
            "Autonomous Driving",
            "Solar Energy",
            "Energy Storage",
            "Manufacturing Innovation"
        ],
        founded: 2003,
        revenue: "$96.8 billion (2023)"
    },
    {
        name: "Netflix Inc.",
         logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        overview: "Netflix is the world's leading streaming entertainment service with over 260 million paid memberships in over 190 countries enjoying TV series, films, and games.",
        industry: "Entertainment & Streaming",
        website: "https://www.netflix.com",
        size: "13,000+ employees",
        headquarters: "Los Gatos, California, United States",
        specialties: [
            "Streaming Technology",
            "Content Production",
            "Personalization Algorithms",
            "Global Distribution",
            "Original Programming"
        ],
        founded: 1997,
        employees: 13000
    },
    {
        name: "Airbnb Inc.",
         logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg",
        overview: "Airbnb is a community based on connection and belonging that began with two friends hosting three travelers in San Francisco.",
        industry: "Travel & Hospitality",
        website: "https://www.airbnb.com",
        size: "6,800+ employees",
        headquarters: "San Francisco, California, United States",
        specialties: [
            "Peer-to-Peer Marketplace",
            "Travel Technology",
            "Community Building",
            "Trust & Safety Systems",
            "Global Payments"
        ],
        founded: 2008,
        employees: 6800
    },
    {
        name: "Shopify Inc.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
        overview: "Shopify is a leading global commerce company providing trusted tools to start, grow, market, and manage a retail business.",
        industry: "E-commerce & Retail",
        website: "https://www.shopify.com",
        size: "11,600+ employees",
        headquarters: "Ottawa, Ontario, Canada",
        specialties: [
            "E-commerce Platform",
            "Payment Processing",
            "Merchant Services",
            "Retail POS Systems",
            "International Commerce"
        ],
        founded: 2006,
        employees: 11600
    },
    {
        name: "Spotify Technology S.A.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
        overview: "Spotify transformed music listening forever when it launched in 2008, giving millions of people access to music.",
        industry: "Music Streaming & Audio",
        website: "https://www.spotify.com",
        size: "9,000+ employees",
        headquarters: "Stockholm, Sweden",
        specialties: [
            "Music Streaming",
            "Audio Content",
            "Personalized Recommendations",
            "Podcast Platform",
            "Audio Advertising"
        ],
        founded: 2006,
        employees: 9000
    }
];

// Helper functions
export const getCompanyByName = (name: string): CompanyData | undefined => {
    return companyData.find(company => company.name.toLowerCase() === name.toLowerCase());
};

export const getCompaniesByIndustry = (industry: string): CompanyData[] => {
    return companyData.filter(company =>
        company.industry.toLowerCase().includes(industry.toLowerCase())
    );
};

export const getCompaniesBySize = (size: string): CompanyData[] => {
    const sizeMap: { [key: string]: number } = {
        'small': 100,
        'medium': 1000,
        'large': 10000,
        'enterprise': 100000
    };

    const maxSize = sizeMap[size] || Infinity;
    return companyData.filter(company => {
        const employees = company.employees || 0;
        return employees <= maxSize;
    });
};

export const getTopCompanies = (limit: number = 10): CompanyData[] => {
    return companyData.slice(0, limit);
};

export const searchCompanies = (query: string): CompanyData[] => {
    const lowerQuery = query.toLowerCase();
    return companyData.filter(company =>
        company.name.toLowerCase().includes(lowerQuery) ||
        company.industry.toLowerCase().includes(lowerQuery) ||
        company.overview.toLowerCase().includes(lowerQuery) ||
        company.headquarters.toLowerCase().includes(lowerQuery) ||
        company.specialties.some(specialty => specialty.toLowerCase().includes(lowerQuery))
    );
};

export const getCompanyStats = () => {
    const totalCompanies = companyData.length;
    const totalEmployees = companyData.reduce((sum, company) => sum + (company.employees || 0), 0);
    const totalIndustries = new Set(companyData.map(company => company.industry)).size;
    const avgEmployees = Math.round(totalEmployees / totalCompanies);

    return {
        totalCompanies,
        totalEmployees: totalEmployees.toLocaleString(),
        totalIndustries,
        avgEmployees: avgEmployees.toLocaleString()
    };
};

// Export một object để dễ import
export const CompanyAPI = {
    getAll: () => companyData,
    getByName: getCompanyByName,
    getByIndustry: getCompaniesByIndustry,
    getBySize: getCompaniesBySize,
    getTop: getTopCompanies,
    search: searchCompanies,
    getStats: getCompanyStats
};

export default companyData;