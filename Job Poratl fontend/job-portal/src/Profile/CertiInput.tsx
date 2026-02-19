/* eslint-disable react-hooks/set-state-in-effect */
import type { Certification } from "./Profile";
import { useState, useEffect } from "react";
import { MonthPickerInput } from "@mantine/dates";
import { IconDeviceFloppy, IconLogout, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";

interface CertiInputProps {
    certification: Certification;
    index: number;
    onUpdate: (index: number, updatedCert: Certification) => void;
    onRemove: (index: number) => void;
    onSave?: (index: number, certData: Certification) => void; // ✅ THÊM certData
    onExit?: () => void;
}

const CertiInput = ({ certification, index, onUpdate, onRemove, onSave, onExit }: CertiInputProps) => {
    // ✅ Local state để lưu thay đổi tạm thời
    const [localCertification, setLocalCertification] = useState<Certification>(certification);
    const [hasChanges, setHasChanges] = useState(false);
    
    // Parse issueDate to Date
    const [issueDate, setIssueDate] = useState<Date | null>(() => {
        if (certification.issueDate && certification.issueDate.trim()) {
            try {
                return new Date(certification.issueDate);
            } catch {
                return null;
            }
        }
        return null;
    });

    // ✅ Kiểm tra thay đổi
    useEffect(() => {
        const changed = 
            localCertification.name !== certification.name ||
            localCertification.issuer !== certification.issuer ||
            localCertification.issueDate !== certification.issueDate ||
            localCertification.certificateId !== certification.certificateId;
        setHasChanges(changed);
    }, [localCertification, certification]);

    // Sync state when certification changes externally
    useEffect(() => {
        setLocalCertification(certification);
        
        // Parse issueDate
        if (certification.issueDate && certification.issueDate.trim()) {
            try {
                const date = new Date(certification.issueDate);
                if (!isNaN(date.getTime())) {
                    setIssueDate(date);
                } else {
                    setIssueDate(null);
                }
            } catch {
                setIssueDate(null);
            }
        } else {
            setIssueDate(null);
        }
    }, [certification]);

    // ✅ Chỉ update local state
    const handleLocalChange = (field: keyof Certification, value: string | undefined) => {
        const updated = {
            ...localCertification,
            [field]: value
        };
        setLocalCertification(updated);
    };

    const handleIssueDateChange = (value: unknown) => {
        const date = value as Date | null;
        setIssueDate(date);
        
        if (date) {
            const dateStr = dayjs(date).format('YYYY-MM-DD');
            setLocalCertification(prev => ({
                ...prev,
                issueDate: dateStr
            }));
        } else {
            setLocalCertification(prev => ({
                ...prev,
                issueDate: ''
            }));
        }
    };

    // Kiểm tra form hợp lệ
    const isFormValid = () => {
        return localCertification.name.trim() !== '' && 
               localCertification.issuer.trim() !== '' && 
               localCertification.issueDate.trim() !== '';
    };

    // ✅ FIX: Xử lý save - Pass localCertification vào onSave
    const handleSave = () => {
        if (isFormValid()) {
            // Update parent state
            onUpdate(index, localCertification);
            
            // ✅ Pass localCertification vào onSave
            if (onSave) onSave(index, localCertification);
            
            setHasChanges(false);
        }
    };

    // ✅ Handle cancel - reset về giá trị ban đầu
    const handleCancel = () => {
        setLocalCertification(certification);
        setIssueDate(certification.issueDate ? new Date(certification.issueDate) : null);
        setHasChanges(false);
    };

    // ✅ Handle exit
    const handleExit = () => {
        if (hasChanges) {
            const confirmExit = window.confirm(
                "You have unsaved changes.\n\n" +
                "Exit will discard all changes.\n" +
                "Are you sure you want to exit?"
            );
            
            if (confirmExit && onExit) {
                onExit();
            }
        } else if (onExit) {
            onExit();
        }
    };

    return (
        <div className="p-6 bg-gradient-to-br from-mine-shaft-900/60 to-mine-shaft-950/60 border border-mine-shaft-800 rounded-2xl space-y-4 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
                        <span className="text-yellow-400 font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-mine-shaft-200">Edit Certification #{index + 1}</h3>
                </div>
            </div>

            {/* Change indicator */}
            {hasChanges && (
                <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-amber-400">You have unsaved changes</span>
                    </div>
                </div>
            )}

            {/* Form validation warning */}
            {!isFormValid() && (
                <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-red-400">Please fill in all required fields (*)</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-mine-shaft-400 mb-2 block flex items-center gap-1">
                        Certification Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={localCertification.name}
                        onChange={(e) => handleLocalChange('name', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-mine-shaft-900 text-mine-shaft-100 border border-mine-shaft-700 focus:border-yellow-400 focus:outline-none placeholder:text-mine-shaft-500 transition-all duration-300"
                        placeholder="e.g., AWS Certified Solutions Architect"
                    />
                </div>
                <div>
                    <label className="text-sm text-mine-shaft-400 mb-2 block flex items-center gap-1">
                        Issuer <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={localCertification.issuer}
                        onChange={(e) => handleLocalChange('issuer', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-mine-shaft-900 text-mine-shaft-100 border border-mine-shaft-700 focus:border-yellow-400 focus:outline-none placeholder:text-mine-shaft-500 transition-all duration-300"
                        placeholder="e.g., Amazon Web Services"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-mine-shaft-400 mb-2 block">Certificate ID (Optional)</label>
                    <input
                        type="text"
                        value={localCertification.certificateId || ''}
                        onChange={(e) => handleLocalChange('certificateId', e.target.value || undefined)}
                        className="w-full px-4 py-2 rounded-lg bg-mine-shaft-900 text-mine-shaft-100 border border-mine-shaft-700 focus:border-yellow-400 focus:outline-none placeholder:text-mine-shaft-500 transition-all duration-300"
                        placeholder="e.g., AWS-123456"
                    />
                </div>
                <div>
                    <label className="text-sm text-mine-shaft-400 mb-2 block flex items-center gap-1">
                        Issue Date <span className="text-red-400">*</span>
                    </label>
                    <MonthPickerInput
                        placeholder="Select issue date"
                        value={issueDate}
                        onChange={handleIssueDateChange}
                        valueFormat="MMM YYYY"
                        maxDate={new Date()}
                        clearable
                        classNames={{
                            input: 'bg-mine-shaft-900 text-mine-shaft-100 border-mine-shaft-700 focus:border-yellow-400 placeholder:text-mine-shaft-500'
                        }}
                    />
                </div>
            </div>

            {/* Buttons layout */}
            <div className="flex justify-between pt-4 border-t border-mine-shaft-800/50">
                <div className="flex gap-2">
                    <button
                        onClick={() => onRemove(index)}
                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
                    >
                        Remove
                    </button>
                    
                    <button
                        onClick={handleCancel}
                        className={`px-4 py-2 rounded-lg border transition-all duration-300 flex items-center gap-2 ${hasChanges 
                            ? 'bg-mine-shaft-800 text-mine-shaft-300 border-mine-shaft-700 hover:border-mine-shaft-500 hover:text-mine-shaft-100' 
                            : 'bg-mine-shaft-900 text-mine-shaft-500 border-mine-shaft-800 cursor-not-allowed'
                        }`}
                        disabled={!hasChanges}
                    >
                        <IconX size={18} />
                        Reset
                    </button>
                </div>

                <div className="flex gap-2">
                    {onExit && (
                        <button
                            onClick={handleExit}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/30 hover:border-red-400 hover:text-red-300 transition-all duration-300 group/exit"
                            title="Exit without saving"
                        >
                            <IconLogout size={18} className="group-hover/exit:animate-pulse" />
                            Exit
                        </button>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || !isFormValid()}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${hasChanges && isFormValid()
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:shadow-yellow-500/30 group/save' 
                            : 'bg-mine-shaft-800 text-mine-shaft-500 border border-mine-shaft-700 cursor-not-allowed'
                        }`}
                        title={!isFormValid() ? "Please fill required fields" : hasChanges ? "Save changes" : "No changes to save"}
                    >
                        <IconDeviceFloppy size={18} className={hasChanges && isFormValid() ? "group-hover/save:animate-bounce" : ""} />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertiInput;