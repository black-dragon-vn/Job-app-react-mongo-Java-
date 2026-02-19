import { Textarea } from "@mantine/core";
import type { Experience } from "./Profile";
import { useState, useEffect } from "react";
import { MonthPickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IconDeviceFloppy, IconLogout, IconX } from "@tabler/icons-react";

dayjs.extend(customParseFormat);

interface ExpInputProps {
    experience: Experience;
    index: number;
    onUpdate: (index: number, updatedExp: Experience) => void;
    onRemove: (index: number) => void;
    onSave?: (index: number, expData: Experience) => void; // ✅ THÊM expData
    onExit?: () => void;
}

const ExpInput = ({ experience, index, onUpdate, onRemove, onSave, onExit }: ExpInputProps) => {
    // State để lưu thay đổi tạm thời
    const [localExperience, setLocalExperience] = useState<Experience>(experience);
    const [hasChanges, setHasChanges] = useState(false);

    // State cho dates
    const [startDate, setStartDate] = useState<Date | null>(() => {
        return experience.startDate ? new Date(experience.startDate) : null;
    });
    
    const [endDate, setEndDate] = useState<Date | null>(() => {
        return experience.endDate ? new Date(experience.endDate) : null;
    });
    
    const [isPresent, setIsPresent] = useState(!experience.endDate);

    // Kiểm tra thay đổi
    useEffect(() => {
        const changed = 
            localExperience.title !== experience.title ||
            localExperience.company !== experience.company ||
            localExperience.location !== experience.location ||
            localExperience.startDate !== experience.startDate ||
            localExperience.endDate !== experience.endDate ||
            localExperience.description !== experience.description;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasChanges(changed);
    }, [localExperience, experience]);

    // Sync khi experience từ parent thay đổi
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalExperience(experience);
        setStartDate(experience.startDate ? new Date(experience.startDate) : null);
        setEndDate(experience.endDate ? new Date(experience.endDate) : null);
        setIsPresent(!experience.endDate);
    }, [experience]);

    // Cập nhật một field cụ thể
    const handleLocalChange = (field: keyof Experience, value: string | null) => {
        const updated = {
            ...localExperience,
            [field]: value
        };
        setLocalExperience(updated);
    };

    const handleStartDateChange = (value: unknown) => {
        const date = value as Date | null;
        setStartDate(date);

        if (date) {
            const dateStr = dayjs(date).format('YYYY-MM-DD');
            handleLocalChange('startDate', dateStr);
        } else {
            handleLocalChange('startDate', '');
        }
    };

    const handleEndDateChange = (value: unknown) => {
        const date = value as Date | null;
        setEndDate(date);

        if (date) {
            const dateStr = dayjs(date).format('YYYY-MM-DD');
            handleLocalChange('endDate', dateStr);
        } else {
            handleLocalChange('endDate', null);
        }
    };

    const handlePresentToggle = () => {
        const newIsPresent = !isPresent;
        setIsPresent(newIsPresent);

        if (newIsPresent) {
            setEndDate(null);
            handleLocalChange('endDate', null);
        } else {
            // Nếu chuyển từ Present sang có end date, set end date là ngày hiện tại
            const today = dayjs().format('YYYY-MM-DD');
            const endDateObj = new Date(today);
            setEndDate(endDateObj);
            handleLocalChange('endDate', today);
        }
    };

    // ✅ FIX: Xử lý save - Pass localExperience vào onSave
    const handleSave = () => {
        // Đảm bảo endDate là null nếu isPresent
        const finalExperience = {
            ...localExperience,
            endDate: isPresent ? null : localExperience.endDate
        };
        
        // Update parent state
        onUpdate(index, finalExperience);
        
        // ✅ Pass finalExperience vào onSave
        if (onSave) onSave(index, finalExperience);
        
        setHasChanges(false);
    };

    const handleCancel = () => {
        setLocalExperience(experience);
        setStartDate(experience.startDate ? new Date(experience.startDate) : null);
        setEndDate(experience.endDate ? new Date(experience.endDate) : null);
        setIsPresent(!experience.endDate);
        setHasChanges(false);
    };

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

    // Kiểm tra required fields
    const isFormValid = () => {
        return localExperience.title.trim() !== '' && 
               localExperience.company.trim() !== '' && 
               localExperience.startDate.trim() !== '';
    };

    return (
        <div className="p-6 bg-gradient-to-br from-mine-shaft-900/60 to-mine-shaft-950/60 border border-mine-shaft-800 rounded-2xl space-y-4 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <span className="text-cyan-400 font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-mine-shaft-200">Edit Experience #{index + 1}</h3>
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

            {/* Required fields warning */}
            {!isFormValid() && (
                <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-red-400">Please fill in all required fields (*)</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-mine-shaft-400 mb-2 block flex items-center gap-1">
                        Title <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={localExperience.title}
                        onChange={(e) => handleLocalChange('title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-mine-shaft-900 text-mine-shaft-100 border border-mine-shaft-700 focus:border-cyan-400 focus:outline-none placeholder:text-mine-shaft-500 transition-all duration-300"
                        placeholder="Job Title (required)"
                    />
                </div>
                <div>
                    <label className="text-sm text-mine-shaft-400 mb-2 block flex items-center gap-1">
                        Company <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={localExperience.company}
                        onChange={(e) => handleLocalChange('company', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-mine-shaft-900 text-mine-shaft-100 border border-mine-shaft-700 focus:border-cyan-400 focus:outline-none placeholder:text-mine-shaft-500 transition-all duration-300"
                        placeholder="Company Name (required)"
                    />
                </div>
            </div>

            <div>
                <label className="text-sm text-mine-shaft-400 mb-2 block">
                    Location
                </label>
                <input
                    type="text"
                    value={localExperience.location}
                    onChange={(e) => handleLocalChange('location', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-mine-shaft-900 text-mine-shaft-100 border border-mine-shaft-700 focus:border-cyan-400 focus:outline-none placeholder:text-mine-shaft-500 transition-all duration-300"
                    placeholder="e.g., San Francisco, CA"
                />
            </div>

            <div>
                <label className="text-sm text-mine-shaft-400 mb-2 block flex items-center gap-1">
                    Period <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-mine-shaft-500 mb-1 block">Start Date *</label>
                        <MonthPickerInput
                            placeholder="Select start date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            valueFormat="MMM YYYY"
                            maxDate={new Date()}
                            classNames={{
                                input: 'bg-mine-shaft-900 text-mine-shaft-100 border-mine-shaft-700 focus:border-cyan-400 placeholder:text-mine-shaft-500'
                            }}
                        />
                    </div>

                    <div>
                        <label className="text-xs text-mine-shaft-500 mb-1 block">End Date</label>
                        <div className="flex gap-2">
                            <MonthPickerInput
                                placeholder="Select end date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                valueFormat="MMM YYYY"
                                disabled={isPresent}
                                maxDate={new Date()}
                                classNames={{
                                    input: `bg-mine-shaft-900 text-mine-shaft-100 border-mine-shaft-700 focus:border-cyan-400 placeholder:text-mine-shaft-500 ${isPresent ? 'opacity-50' : ''}`
                                }}
                                className="flex-1"
                            />

                            <button
                                type="button"
                                onClick={handlePresentToggle}
                                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${isPresent ? 'bg-cyan-500 text-white' : 'bg-mine-shaft-900 text-mine-shaft-400 border border-mine-shaft-700 hover:border-cyan-400'}`}
                            >
                                <span className={`w-2 h-2 rounded-full ${isPresent ? 'bg-white animate-pulse' : 'bg-mine-shaft-500'}`}></span>
                                Present
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label className="text-sm text-mine-shaft-400 mb-2 block">Description</label>
                <Textarea
                    value={localExperience.description}
                    onChange={(e) => handleLocalChange('description', e.target.value)}
                    rows={3}
                    className="[&_textarea]:bg-mine-shaft-900 [&_textarea]:text-mine-shaft-100 [&_textarea]:border [&_textarea]:border-mine-shaft-700 [&_textarea]:focus:border-cyan-400 [&_textarea]:focus:outline-none [&_textarea]:placeholder:text-mine-shaft-500 [&_textarea]:rounded-lg [&_textarea]:transition-all [&_textarea]:duration-300"
                    placeholder="Describe your role and achievements..."
                    autosize
                    minRows={3}
                    maxRows={8}
                />
            </div>

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
                    <button
                        onClick={handleExit}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/30 hover:border-red-400 hover:text-red-300 transition-all duration-300 group/exit"
                        title="Exit without saving"
                    >
                        <IconLogout size={18} className="group-hover/exit:animate-pulse" />
                        Exit
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || !isFormValid()}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${hasChanges && isFormValid()
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/30 group/save' 
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

export default ExpInput;