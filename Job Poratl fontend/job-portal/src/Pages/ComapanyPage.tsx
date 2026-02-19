import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import Company from "../Company/Company";
import SimilarCompanies from "../Company/SimiliarCompanies";

const CompanyPage = () => {
    const { companyName } = useParams<{ companyName?: string }>();

    return (
        <div className="min-h-[100vh] bg-mine-shaft-950 font-poppins p-4">
            <Link to="/jobs" className="my-4 inline-block">
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
                        Back
                    </span>
                </Button>
            </Link>
            <div className="flex gap-5">
                <Company />
                <SimilarCompanies currentCompanyName={companyName ? decodeURIComponent(companyName) : undefined} />
            </div>
        </div>
    );
};

export default CompanyPage;