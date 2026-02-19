import type { Certification } from "./Profile";
import { ActionIcon } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import CertiInput from "./CertiInput";
import dayjs from "dayjs";

interface CertiCardProps {
    data: Certification[];
    onChange?: (index: number, updatedCert: Certification) => void;
    onSave?: (index: number, certData: Certification) => void; // ✅ THÊM certData
    onCancel?: () => void;
    onDelete?: (index: number) => void;
    editingIndex?: number | null;
    onEditChange?: (index: number) => void;
}

const CertiCard = ({ 
    data, 
    onChange, 
    onSave, 
    onCancel, 
    onDelete, 
    editingIndex, 
    onEditChange 
}: CertiCardProps) => {
    // Logo mapping for issuers
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
     
    };

    const handleDelete = (index: number) => {
        if (confirm('Are you sure you want to delete this certification?')) {
            onDelete?.(index);
        }
    };

    // ✅ FIX: Call onSave với index và certData
    const handleSave = (index: number, certData: Certification) => {
        onSave?.(index, certData);
    };

    // ✅ Call onCancel
    const handleCancel = () => {
        onCancel?.();
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return dayjs(dateString).format('MMM YYYY');
        } catch {
            return dateString;
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {data.map((cert, index) => (
                <div key={index}>
                    {editingIndex === index ? (
                        // EDIT MODE - Show CertiInput
                        <CertiInput
                            certification={cert}
                            index={index}
                            onUpdate={onChange!}
                            onRemove={handleDelete}
                            onSave={(idx, certData) => handleSave(idx, certData)} // ✅ Pass certData
                            onExit={handleCancel}
                        />
                    ) : (
                        // VIEW MODE - Show Card
                        <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-mine-shaft-900/80 to-mine-shaft-950/80 border border-mine-shaft-700/50 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-500">
                            {/* Animated gradient overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/0 via-orange-500/0 to-yellow-500/0 group-hover:from-yellow-500/10 group-hover:via-orange-500/5 group-hover:to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            
                            {/* Subtle animated border glow */}
                            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-yellow-500/0 via-orange-500/0 to-yellow-500/0 group-hover:from-yellow-500/30 group-hover:via-orange-500/30 group-hover:to-yellow-500/30 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 -z-10" />
                            
                            <div className="relative flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    {/* Logo with glow effect */}
                                    <div className="relative flex-shrink-0">
                                        <div className="absolute inset-0 bg-yellow-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                        <div className="relative p-3 bg-gradient-to-br from-mine-shaft-800 to-mine-shaft-900 rounded-xl border border-mine-shaft-700 group-hover:border-yellow-500/40 group-hover:scale-110 transition-all duration-500">
                                            <img 
                                                className='h-8 w-8 object-contain filter group-hover:brightness-110 transition-all duration-500' 
                                                src={logoMap[cert.issuer] || "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"} 
                                                alt={cert.issuer} 
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <div className="font-bold text-xl text-white group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:via-orange-400 group-hover:to-yellow-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                                            {cert.name}
                                        </div>
                                        <div className="text-base text-mine-shaft-300 group-hover:text-yellow-300 transition-colors duration-300">
                                            {cert.issuer}
                                        </div>
                                        {cert.certificateId && (
                                            <div className="text-sm text-mine-shaft-500 group-hover:text-yellow-400/80">
                                                ID: {cert.certificateId}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <div className="px-4 py-1.5 rounded-full bg-mine-shaft-800/80 border border-mine-shaft-700 text-mine-shaft-300 text-sm font-medium group-hover:bg-yellow-500/10 group-hover:border-yellow-500/40 group-hover:text-yellow-400 transition-all duration-300">
                                        {formatDate(cert.issueDate)}
                                    </div>
                                    
                                    {/* Action buttons - hiện khi hover */}
                                    {onChange && onDelete && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <ActionIcon
                                                color="yellow"
                                                variant="subtle"
                                                size="lg"
                                                onClick={() => onEditChange?.(index)}
                                                className="hover:scale-110 transition-transform duration-300"
                                            >
                                                <IconPencil size={18} />
                                            </ActionIcon>
                                            <ActionIcon
                                                color="red"
                                                variant="subtle"
                                                size="lg"
                                                onClick={() => handleDelete(index)}
                                                className="hover:scale-110 transition-transform duration-300"
                                            >
                                                <IconTrash size={18} />
                                            </ActionIcon>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default CertiCard;