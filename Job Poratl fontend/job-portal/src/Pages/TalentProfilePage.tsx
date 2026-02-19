/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, LoadingOverlay } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import Profile from "../TalentProfile/Profile";
import RecomendTalent from "../TalentProfile/RecommendTalent";
import { useEffect, useState } from "react";
import { getAllProfile } from "../Services/ProfileService";

const TalentProfilePage = () => {
    const navigate = useNavigate();
    const [talents, setTalents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                setLoading(true);
                const response = await getAllProfile();
                
                // Debug: Log the response
                console.log("Raw API Response:", response);
                
                // Handle different response structures
                const profileData = Array.isArray(response) 
                    ? response 
                    : response?.data || [];
                
                console.log("Processed profiles:", profileData);
                setTalents(profileData);
                setError(null);
            } catch (err) {
                console.error("Error fetching profiles:", err);
                setError("Failed to load talent profiles");
                setTalents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    return (
        <div className="min-h-[100vh] bg-mine-shaft-950 font-poppins p-4">
            <LoadingOverlay visible={loading} />
            
            <div className="my-4 inline-block">
                <Button
                    className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 border border-cyan-400/40 hover:border-cyan-300"
                    type="submit"
                    onClick={() => navigate(-1)}
                    size="md"
                    variant="light"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    <span className="relative z-10 flex items-center gap-2">
                        <span className="group-hover:-translate-x-1 transition-transform duration-300">
                            <IconArrowLeft size={18} stroke={2.5} />
                        </span>
                        Back
                    </span>
                </Button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {!loading && talents.length === 0 && !error && (
                <div className="text-center text-gray-400 py-10">
                    No talent profiles found
                </div>
            )}

            <div className="flex gap-10 justify-center mt-6 mb-10">
                <Profile />
                <RecomendTalent talents={talents} />
            </div>
        </div>
    );
};

export default TalentProfilePage;