/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAllJobs } from "../Services/JobService";
import CompanyCard from "./CompanyCard";
import { Link } from "react-router-dom";
import { Skeleton } from "@mantine/core";
import type { CompanyData } from "../Data/companyData";

interface SimilarCompaniesProps {
    currentCompanyName?: string;
}

const SimilarCompanies = ({ currentCompanyName }: SimilarCompaniesProps) => {
    const [companies, setCompanies] = useState<CompanyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const allJobs = await getAllJobs();
                
                // Group jobs by company
                const companyMap = new Map<string, any[]>();
                
                allJobs.forEach((job: any) => {
                    const companyName = job.company;
                    if (!companyMap.has(companyName)) {
                        companyMap.set(companyName, []);
                    }
                    companyMap.get(companyName)?.push(job);
                });

                // Convert to company data array
                const companiesData: CompanyData[] = Array.from(companyMap.entries())
                    .filter(([name]) => name !== currentCompanyName) // Exclude current company
                    .map(([name, jobs], index) => {
                        const firstJob = jobs[0];
                        
                        // Extract unique locations - ĐÃ SỬA LỖI
                        const allLocations = jobs
                            .map((j: any) => j.location)
                            .filter((loc: any) => loc && String(loc).trim() !== '');
                        
                        const uniqueLocations = [...new Set(allLocations)];
                        const safeLocation = uniqueLocations.length > 0 ? String(uniqueLocations[0]) : "Remote";
                        
                        return {
                            id: index + 1,
                            name: name,
                            industry: "Technology",
                            size: `${jobs.length} positions`,
                            headquarters: safeLocation, // ĐÃ SỬA
                            employees: jobs.reduce((sum: number, job: any) => 
                                sum + (job.applicants?.length || 0), 0
                            ),
                            logo: firstJob.logo || getCompanyLogo(name),
                            stats: {
                                totalJobs: jobs.length,
                                activeJobs: jobs.length,
                                avgRating: 4.5,
                                totalReviews: Math.floor(Math.random() * 10000) + 1000
                            },
                            // Thêm các fields bắt buộc từ CompanyData type
                            overview: `${name} is a leading technology company dedicated to innovation and excellence.`,
                            website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
                            specialties: [
                                "Software Development",
                                "Technology Solutions",
                                "Innovation"
                            ]
                        };
                    })
                    .slice(0, 5); // Limit to 5 companies

                setCompanies(companiesData);
            } catch (error) {
                console.error("Error fetching companies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [currentCompanyName]);

    // Helper function to get company logo
    const getCompanyLogo = (companyName: string) => {
        const cleanCompany = companyName
            .replace(/Co\.,?\s*Ltd\.?/gi, '')
            .replace(/Ltd\.?/gi, '')
            .replace(/Inc\.?/gi, '')
            .replace(/Corporation/gi, '')
            .trim();

        return `https://logo.clearbit.com/${encodeURIComponent(cleanCompany.toLowerCase().replace(/\s+/g, ''))}.com`;
    };

    if (loading) {
        return (
            <div className="w-96">
                <div className="text-xl font-semibold mb-5 text-mine-shaft-100">
                    Similar Companies
                </div>
                <div className="flex flex-col gap-5">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} height={120} radius="xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (companies.length === 0) {
        return (
            <div className="w-96">
                <div className="text-xl font-semibold mb-5 text-mine-shaft-100">
                    Similar Companies
                </div>
                <div className="p-6 rounded-2xl bg-mine-shaft-900/50 border border-mine-shaft-800 text-center">
                    <p className="text-mine-shaft-400">No similar companies found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-96">
            <div className="text-xl font-semibold mb-5 text-mine-shaft-100">
                Similar Companies
            </div>

            <div className="flex flex-col gap-5">
                {companies.map((company) => (
                    <Link 
                        key={company.id} 
                        to={`/company/${encodeURIComponent(company.name)}`}
                        className="block"
                    >
                        <CompanyCard company={company} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SimilarCompanies;