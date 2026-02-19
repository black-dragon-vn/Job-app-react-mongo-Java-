/* eslint-disable @typescript-eslint/no-explicit-any */

import { useParams } from "react-router-dom";
import TalentCard from "../FindTalent/TalentCard";

interface RecommendTalentProps {
    talents: any[];
}

const RecommendTalent = ({ talents }: RecommendTalentProps) => {
    const { id } = useParams();
    
    // Filter out current talent and limit to 5
    const recommendedTalents = talents
        .filter((talent) => talent.id?.toString() !== id)
        .slice(0, 5);

    return (
        <div>
            <div className="text-xl font-semibold mb-5">
                Recommended Talents
            </div>
            <div className="flex flex-col gap-5">
                {recommendedTalents.length > 0 ? (
                    recommendedTalents.map((talent) => (
                        <TalentCard 
                            key={talent.id} 
                            talent={talent} 
                            posted={true} 
                            invited={false} 
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-8">
                        No recommended talents available
                    </p>
                )}     
            </div>
        </div>
    );
}

export default RecommendTalent;