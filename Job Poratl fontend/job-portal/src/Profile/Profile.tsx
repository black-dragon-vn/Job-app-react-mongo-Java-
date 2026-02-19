/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionIcon, Divider, TagsInput, Textarea, Button, Overlay, NumberInput } from "@mantine/core";
import { IconBriefcase, IconDeviceFloppy, IconEdit, IconEPassport, IconMapPin, IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import CertiCard from "./CertiCard";
import SelectInput from "./SelectInput";
import { fields } from "../Data/Profile";
import { useEffect, useState } from "react";
import ExCard from "./ExpCard";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile } from "../Services/ProfileService";
import { changeProfile, setProfile } from "../Slices/ProfileSlice";
import { sucessNotification, errNotification } from "../Services/NotificationService";
import { useHover } from "@mantine/hooks";
import { FileInput } from '@mantine/core';
import { getBase64 } from "../Services/Utilities";

/* =======================
   Interfaces (Models)
======================= */
export interface Experience {
    title: string;
    company: string;
    location: string;
    startDate: string;        // Format: "YYYY-MM-DD" trong frontend
    endDate: string | null;   // Format: "YYYY-MM-DD" trong frontend
    description: string;
    working?: boolean;        // Field để map với backend
}

export interface Certification {
    name: string;
    issuer: string;
    issueDate: string;        // Format: "YYYY-MM-DD" trong frontend
    certificateId: string;
}

export interface ProfileProps {
    name: string;
    jobTitle: string;
    company: string;
    totalExp: number;
    location: string;
    banner: string;
    avatar: string;
    about: string;
    skills: string[];
    experience: Experience[];
    certifications: Certification[];
}

/* =======================
   Component
======================= */
const Profile = ({
    jobTitle,
    company,
    totalExp,
    location,
    banner,
    avatar,
    about,
    skills,
    experience,
    certifications,
}: ProfileProps) => {
    // State cho edit sections
    const [editSections, setEditSections] = useState({
        basicInfo: false,
        about: false,
        skills: false,
    });

    // State cho form values
    const [formValues, setFormValues] = useState({
        jobTitle: jobTitle,
        company: company,
        totalExp: totalExp,
        location: location,
        about: about,
        skills: skills,
        experience: experience,
        certifications: certifications,
        skill: '',
        salary: ''
    });

    // State backup để restore khi cancel
    const [backupValues, setBackupValues] = useState({
        jobTitle: jobTitle,
        company: company,
        totalExp: totalExp,
        location: location,
        about: about,
        skills: skills,
    });

    // State để track experience đang được edit
    const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);
    const [backupExperience, setBackupExperience] = useState<Experience | null>(null);

    // State để track certification đang được edit  
    const [editingCertificationIndex, setEditingCertificationIndex] = useState<number | null>(null);
    const [backupCertification, setBackupCertification] = useState<Certification | null>(null);

    // State cho loading khi save từng section
    const [savingSection, setSavingSection] = useState<string | null>(null);

    const select = fields;
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const profile = useSelector((state: any) => state.profile);

    // HÀM CHUYỂN ĐỔI DATE FORMAT
    const formatDateForBackend = (dateString: string): string => {
        if (!dateString) return '';
        // Nếu đã là ISO format (có chữ T), giữ nguyên
        if (dateString.includes('T')) {
            return dateString;
        }
        // Chuyển từ "YYYY-MM-DD" sang "YYYY-MM-DDT00:00:00"
        return `${dateString}T00:00:00`;
    };

    const formatDateForFrontend = (dateString: string): string => {
        if (!dateString) return '';
        // Nếu là ISO format, lấy phần date
        if (dateString.includes('T')) {
            return dateString.split('T')[0];
        }
        return dateString;
    };

    // ✅ FIXED: Load profile data - Dùng user.userId
    useEffect(() => {
        if (user?.userId) {
            console.log('📥 Loading profile for userId:', user.userId);
            
            getProfile(user.userId)
                .then((data: any) => {
                    console.log('📥 Profile data from backend:', data);

                    // FORMAT DATA TỪ BACKEND VỀ FRONTEND
                    const formattedExperiences = (data.experiences || []).map((exp: any) => ({
                        ...exp,
                        startDate: formatDateForFrontend(exp.startDate),
                        endDate: exp.endDate ? formatDateForFrontend(exp.endDate) : null
                    }));

                    const formattedCertifications = (data.certifications || []).map((cert: any) => ({
                        ...cert,
                        issueDate: formatDateForFrontend(cert.issueDate)
                    }));

                    dispatch(setProfile(data));

                    const profileData = {
                        jobTitle: data.jobTitle || '',
                        company: data.company || '',
                        totalExp: data.totalExp || 0,
                        location: data.location || '',
                        about: data.about || '',
                        skills: data.skills || [],
                        experience: formattedExperiences,
                        certifications: formattedCertifications,
                        skill: '',
                        salary: ''
                    };

                    setFormValues(profileData);

                    setBackupValues({
                        jobTitle: data.jobTitle || '',
                        company: data.company || '',
                        totalExp: data.totalExp || 0,
                        location: data.location || '',
                        about: data.about || '',
                        skills: data.skills || [],
                    });
                })
                .catch((error: any) => {
                    console.error("❌ Load profile error:", error);
                    errNotification("Error", error.response?.data?.message || "Failed to load profile data");
                });
        }
    }, [user.userId, dispatch]);

    // ✅ HÀM FORMAT DATA ĐỂ GỬI LÊN BACKEND
    const formatProfileForBackend = (newExperiences?: Experience[], newCertifications?: Certification[]) => {
        // Format experiences
        const experiencesToSend = (newExperiences || formValues.experience).map(exp => {
            const isPresent = !exp.endDate;
            return {
                title: exp.title || '',
                company: exp.company || '',
                location: exp.location || '',
                startDate: formatDateForBackend(exp.startDate),
                endDate: exp.endDate ? formatDateForBackend(exp.endDate) : null,
                working: isPresent,
                description: exp.description || ''
            };
        });

        // Format certifications
        const certificationsToSend = (newCertifications || formValues.certifications).map(cert => ({
            name: cert.name || '',
            issuer: cert.issuer || '',
            issueDate: formatDateForBackend(cert.issueDate),
            certificateId: cert.certificateId || ''
        }));

        return {
            id: profile.id || user.userId,
            email: user.email || '',
            name: user.name || '',
            jobTitle: formValues.jobTitle || '',
            totalExp: formValues.totalExp || 0,
            company: formValues.company || '',
            location: formValues.location || '',
            about: formValues.about || '',
            skills: formValues.skills || [],
            experiences: experiencesToSend,
            certifications: certificationsToSend,
            banner: banner || '',
            avatar: avatar || ''
        };
    };

    const validateSection = (sectionName: string): boolean => {
        if (sectionName === 'Basic Info') {
            if (!formValues.jobTitle.trim()) {
                errNotification("Validation Error", "Job Title is required");
                return false;
            }
            if (!formValues.company.trim()) {
                errNotification("Validation Error", "Company is required");
                return false;
            }
            if (!formValues.location.trim()) {
                errNotification("Validation Error", "Location is required");
                return false;
            }
            // ✅ Validation cho totalExp
            if (formValues.totalExp < 0) {
                errNotification("Validation Error", "Total experience must be a positive number");
                return false;
            }
        }

        if (sectionName === 'About') {
            if (!formValues.about.trim()) {
                errNotification("Validation Error", "About section cannot be empty");
                return false;
            }
        }

        if (sectionName === 'Skills') {
            if (formValues.skills.length === 0) {
                errNotification("Validation Error", "Please add at least one skill");
                return false;
            }
        }

        return true;
    };

    // ✅ HÀM SAVE CHÍNH - CHỈ GỬI DATA, KHÔNG UPDATE formValues
    const saveProfileToBackend = async (newExperiences?: Experience[], newCertifications?: Certification[]) => {
        if (!profile.id && !user.userId) {
            errNotification("Error", "Profile ID not found. Please refresh the page.");
            return false;
        }

        try {
            // Format data đúng chuẩn backend
            const profileToSave = formatProfileForBackend(newExperiences, newCertifications);

            console.log('📤 Sending to backend:', {
                experiencesCount: profileToSave.experiences.length,
                certificationsCount: profileToSave.certifications.length,
                totalExp: profileToSave.totalExp,
                sampleExperience: profileToSave.experiences[0]
            });

            const result = await updateProfile(profileToSave);

            const freshProfile = await getProfile(user.userId);

            dispatch(setProfile(freshProfile));

            console.log('✅ Save successful');
            return true;

        } catch (error: any) {
            console.error("❌ Save failed:", error);

            const backendError = error.response?.data;
            let errorMessage = "Failed to save changes";

            if (backendError?.message) {
                errorMessage = backendError.message;
            } else if (error.response?.status === 500) {
                errorMessage = "Server error (500). Please check data format.";
            }

            errNotification("Save Failed", errorMessage);
            return false;
        }
    };

    const saveSection = async (sectionName: string) => {
        if (!validateSection(sectionName)) {
            return false;
        }

        setSavingSection(sectionName);
        try {
            const success = await saveProfileToBackend();
            if (success) {
                sucessNotification("Success", `${sectionName} updated successfully!`);
                setBackupValues({
                    jobTitle: formValues.jobTitle,
                    company: formValues.company,
                    totalExp: formValues.totalExp,
                    location: formValues.location,
                    about: formValues.about,
                    skills: formValues.skills,
                });
                return true;
            }
            return false;

        } catch (error: any) {
            console.error("❌ Error updating profile:", error);
            const errorMessage = error.response?.data?.message
                || error.message
                || `Failed to update ${sectionName}. Please try again.`;
            errNotification("Update Failed", errorMessage);
            return false;
        } finally {
            setSavingSection(null);
        }
    };

    const handleCancel = (section: keyof typeof editSections) => {
        setFormValues(prev => ({
            ...prev,
            jobTitle: backupValues.jobTitle,
            company: backupValues.company,
            totalExp: backupValues.totalExp,
            location: backupValues.location,
            about: backupValues.about,
            skills: backupValues.skills,
        }));

        setEditSections(prev => ({
            ...prev,
            [section]: false
        }));
    };

    const handleEdit = async (section: keyof typeof editSections) => {
        if (editSections[section]) {
            setEditSections(prev => ({
                ...prev,
                [section]: false
            }));
        } else {
            setBackupValues({
                jobTitle: formValues.jobTitle,
                totalExp: formValues.totalExp,
                company: formValues.company,
                location: formValues.location,
                about: formValues.about,
                skills: formValues.skills,
            });

            setEditSections(prev => ({
                ...prev,
                [section]: true
            }));
        }
    };

    const handleSave = async (section: keyof typeof editSections) => {
        const sectionNames = {
            basicInfo: 'Basic Info',
            about: 'About',
            skills: 'Skills'
        };

        const success = await saveSection(sectionNames[section]);

        if (success) {
            setEditSections(prev => ({
                ...prev,
                [section]: false
            }));
        }
    };

    const handleFieldChange = (name: string, value: string | string[] | number | Experience[] | Certification[]) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // === EXPERIENCE HANDLERS ===

    const handleStartEditExperience = (index: number) => {
        setBackupExperience({ ...formValues.experience[index] });
        setEditingExperienceIndex(index);
    };

    const handleCancelEditExperience = () => {
        if (editingExperienceIndex !== null) {
            const currentExp = formValues.experience[editingExperienceIndex];

            const isNewEmpty = !currentExp.title?.trim() &&
                !currentExp.company?.trim() &&
                !currentExp.startDate?.trim();

            if (isNewEmpty) {
                const newExp = formValues.experience.filter((_, i) => i !== editingExperienceIndex);
                handleFieldChange('experience', newExp);
            } else if (backupExperience) {
                const newExp = [...formValues.experience];
                newExp[editingExperienceIndex] = backupExperience;
                handleFieldChange('experience', newExp);
            }
        }

        setEditingExperienceIndex(null);
        setBackupExperience(null);
    };

    const handleChangeExperience = (index: number, updatedExp: Experience) => {
        const newExp = [...formValues.experience];
        newExp[index] = updatedExp;
        handleFieldChange('experience', newExp);
    };

    // ✅ FIXED: Handle Save Experience - Nhận expData từ ExpInput
    const handleSaveExperience = async (index: number, expData: Experience) => {
        console.log('💾 [1] Received expData to save:', expData);

        // Validation từ expData được pass vào
        if (!expData.title?.trim()) {
            errNotification("Validation Error", "Job title is required");
            return;
        }
        if (!expData.company?.trim()) {
            errNotification("Validation Error", "Company is required");
            return;
        }
        if (!expData.startDate?.trim()) {
            errNotification("Validation Error", "Start date is required");
            return;
        }

        // ✅ Update formValues với exp data mới TRƯỚC KHI save
        const newExp = [...formValues.experience];
        newExp[index] = expData;

        console.log('📝 [2] Updating formValues with new experiences:', newExp);

        setSavingSection('experience');
        try {
            // ✅ Save với data mới
            const success = await saveProfileToBackend(
                newExp,  // ← Dùng newExp thay vì formValues.experience
                formValues.certifications
            );

            if (success) {
                // 2. Exit edit mode NGAY (unmount component)
                setEditingExperienceIndex(null);
                setBackupExperience(null);

                // 3. Fetch fresh data từ backend
                const freshProfile = await getProfile(user.userId);

                console.log('🔄 Fresh experiences from backend:', freshProfile.experiences);

                // 4. Format data về frontend
                const formattedExperiences = (freshProfile.experiences || []).map((exp: any) => ({
                    ...exp,
                    startDate: formatDateForFrontend(exp.startDate),
                    endDate: exp.endDate ? formatDateForFrontend(exp.endDate) : null
                }));

                console.log('✨ Formatted experiences:', formattedExperiences);

                // 5. Update formValues MỘT LẦN DUY NHẤT
                setFormValues(prev => {
                    console.log('🔄 Updating formValues from:', prev.experience, 'to:', formattedExperiences);
                    return {
                        ...prev,
                        experience: formattedExperiences
                    };
                });

                sucessNotification("Success", "Experience saved successfully!");
            }
        } catch (error: any) {
            console.error("❌ Error saving experience:", error);
            errNotification("Save Failed", "Failed to save experience");
        } finally {
            setSavingSection(null);
        }
    };

    const handleDeleteExperience = async (index: number) => {
        if (!confirm('Are you sure you want to delete this experience?')) {
            return;
        }

        const newExp = formValues.experience.filter((_, i) => i !== index);

        setSavingSection('experience');
        try {
            const success = await saveProfileToBackend(newExp, formValues.certifications);
            if (success) {
                handleFieldChange('experience', newExp);
                sucessNotification("Success", "Experience deleted successfully!");
            }
        } catch (error: any) {
            console.error("❌ Error deleting experience:", error);
            errNotification("Delete Failed", "Failed to delete experience");
        } finally {
            setSavingSection(null);
        }

        if (editingExperienceIndex === index) {
            setEditingExperienceIndex(null);
            setBackupExperience(null);
        } else if (editingExperienceIndex && editingExperienceIndex > index) {
            setEditingExperienceIndex(editingExperienceIndex - 1);
        }
    };

    const handleAddExperience = async () => {
        const newExp: Experience = {
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: null,
            description: '',
            working: true
        };

        const updatedExperiences = [newExp, ...formValues.experience];

        // 1. Update local state trước
        handleFieldChange('experience', updatedExperiences);

        // 2. Save lên backend với data đúng format
        setSavingSection('experience');
        try {
            const success = await saveProfileToBackend(updatedExperiences, formValues.certifications);
            if (success) {
                // 3. Set edit mode sau khi save thành công
                setBackupExperience({ ...newExp });
                setEditingExperienceIndex(0);
                sucessNotification("Success", "New experience added!");
            }
        } catch (error: any) {
            console.error("❌ Error adding experience:", error);
            errNotification("Add Failed", "Failed to add experience");
            // Rollback nếu lỗi
            handleFieldChange('experience', formValues.experience);
        } finally {
            setSavingSection(null);
        }
    };

    // === CERTIFICATION HANDLERS ===

    const handleStartEditCertification = (index: number) => {
        setBackupCertification({ ...formValues.certifications[index] });
        setEditingCertificationIndex(index);
    };

    const handleCancelEditCertification = () => {
        if (editingCertificationIndex !== null) {
            const currentCert = formValues.certifications[editingCertificationIndex];

            const isNewEmpty = !currentCert.name?.trim() &&
                !currentCert.issuer?.trim() &&
                !currentCert.issueDate?.trim();

            if (isNewEmpty) {
                const newCerts = formValues.certifications.filter((_, i) => i !== editingCertificationIndex);
                handleFieldChange('certifications', newCerts);
            } else if (backupCertification) {
                const newCerts = [...formValues.certifications];
                newCerts[editingCertificationIndex] = backupCertification;
                handleFieldChange('certifications', newCerts);
            }
        }

        setEditingCertificationIndex(null);
        setBackupCertification(null);
    };

    const handleChangeCertification = (index: number, updatedCert: Certification) => {
        const newCerts = [...formValues.certifications];
        newCerts[index] = updatedCert;
        handleFieldChange('certifications', newCerts);
    };

    // ✅ FIXED: Handle Save Certification - Nhận certData từ CertiInput
    const handleSaveCertification = async (index: number, certData: Certification) => {
        console.log('💾 [1] Received certData to save:', certData);

        // ✅ Validation từ certData được pass vào
        if (!certData.name?.trim()) {
            errNotification("Validation Error", "Certification name is required");
            return;
        }
        if (!certData.issuer?.trim()) {
            errNotification("Validation Error", "Issuer is required");
            return;
        }
        if (!certData.issueDate?.trim()) {
            errNotification("Validation Error", "Issue date is required");
            return;
        }

        // ✅ Update formValues với cert data mới TRƯỚC KHI save
        const newCerts = [...formValues.certifications];
        newCerts[index] = certData;

        console.log('📝 [2] Updating formValues with new certifications:', newCerts);

        setSavingSection('certification');
        try {
            // ✅ Save với data mới
            const success = await saveProfileToBackend(
                formValues.experience,
                newCerts  // ← Dùng newCerts thay vì formValues.certifications
            );

            if (success) {
                // 2. Exit edit mode NGAY (unmount component)
                setEditingCertificationIndex(null);
                setBackupCertification(null);

                // 3. Fetch fresh data từ backend
                const freshProfile = await getProfile(user.userId);

                console.log('🔄 Fresh certifications from backend:', freshProfile.certifications);

                // 4. Format data về frontend
                const formattedCertifications = (freshProfile.certifications || []).map((cert: any) => ({
                    ...cert,
                    issueDate: formatDateForFrontend(cert.issueDate)
                }));

                console.log('✨ Formatted certifications:', formattedCertifications);

                // 5. Update formValues MỘT LẦN DUY NHẤT
                setFormValues(prev => {
                    console.log('🔄 Updating formValues from:', prev.certifications, 'to:', formattedCertifications);
                    return {
                        ...prev,
                        certifications: formattedCertifications
                    };
                });

                sucessNotification("Success", "Certification saved successfully!");
            }
        } catch (error: any) {
            console.error("❌ Error saving certification:", error);
            errNotification("Save Failed", "Failed to save certification");
        } finally {
            setSavingSection(null);
        }
    };

    const handleDeleteCertification = async (index: number) => {
        if (!confirm('Are you sure you want to delete this certification?')) {
            return;
        }

        const newCerts = formValues.certifications.filter((_, i) => i !== index);

        setSavingSection('certification');
        try {
            const success = await saveProfileToBackend(formValues.experience, newCerts);
            if (success) {
                handleFieldChange('certifications', newCerts);
                sucessNotification("Success", "Certification deleted successfully!");
            }
        } catch (error: any) {
            console.error("❌ Error deleting certification:", error);
            errNotification("Delete Failed", "Failed to delete certification");
        } finally {
            setSavingSection(null);
        }

        if (editingCertificationIndex === index) {
            setEditingCertificationIndex(null);
            setBackupCertification(null);
        } else if (editingCertificationIndex && editingCertificationIndex > index) {
            setEditingCertificationIndex(editingCertificationIndex - 1);
        }
    };

    const handleAddCertification = async () => {
        const newCert: Certification = {
            name: '',
            issuer: '',
            issueDate: '',
            certificateId: ''
        };

        const updatedCertifications = [newCert, ...formValues.certifications];

        // 1. Update local state trước
        handleFieldChange('certifications', updatedCertifications);

        // 2. Save lên backend với data đúng format
        setSavingSection('certification');
        try {
            const success = await saveProfileToBackend(formValues.experience, updatedCertifications);
            if (success) {
                // 3. Set edit mode sau khi save thành công
                setBackupCertification({ ...newCert });
                setEditingCertificationIndex(0);
                sucessNotification("Success", "New certification added!");
            }
        } catch (error: any) {
            console.error("❌ Error adding certification:", error);
            errNotification("Add Failed", "Failed to add certification");
            // Rollback nếu lỗi
            handleFieldChange('certifications', formValues.certifications);
        } finally {
            setSavingSection(null);
        }
    };

    const { hovered, ref } = useHover();

    // Đổi tên hàm xử lý avatar
    const handleAvatarChange = async (image: File | null) => {
        if (!image) return;

        try {
            const picture = await getBase64(image);
            const base64Data = picture.split(',')[1];

            // 1. Save lên backend TRƯỚC
            const profileToSave = {
                ...formatProfileForBackend(),
                picture: base64Data
            };

            await updateProfile(profileToSave);

            // 2. Update Redux SAU KHI save thành công
            const updatedProfile = { ...profile, picture: base64Data };
            dispatch(changeProfile(updatedProfile));

            sucessNotification("Success", "Picture updated successfully!");
        } catch (error: any) {
            console.error("❌ Error updating picture:", error);
            errNotification("Error", "Failed to update picture");
        }
    };

    // Tạo URL cho avatar từ base64 hoặc dùng avatar mặc định
    const avatarUrl = profile.picture
        ? `data:image/jpeg;base64,${profile.picture}`
        : avatar;

    return (
        <div className="w-4/5 mx-auto">
            {/* ===== Banner & Avatar ===== */}
            <div className="relative group">
                <div className="w-full aspect-video md:aspect-[21/9] rounded-t-2xl overflow-hidden">
                    <img
                        src={banner}
                        alt="Banner"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mine-shaft-950/80 via-transparent to-transparent" />
                </div>

                <div ref={ref} className="absolute -bottom-24 left-6 flex items-center justify-center">
                    <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <img
                        src={avatarUrl}
                        alt="Profile"
                        className="relative w-48 h-48 rounded-full border-4 border-mine-shaft-800 object-cover ring-4 ring-cyan-500/20 group-hover:ring-cyan-500/40 transition-all duration-500"
                    />
                    {hovered && <Overlay className="!rounded-full" color="#000" backgroundOpacity={0.75} />}
                    {hovered && <IconEdit className="absolute z-[300]" />}
                    {hovered && <FileInput className="absolute z-[301] [&_*]:!rounded-full [&_*]:!h-full !h-full w-full"
                        variant="transparent"
                        accept="image/png,image/jpeg"
                        onChange={handleAvatarChange} />}
                </div>

            </div>

            {/* ===== Basic Info ===== */}
            <div className="px-6 mt-32 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent mb-2">
                            {user.name}
                        </h1>
                        <div className="text-xl flex items-center gap-2 text-mine-shaft-200 mb-2">
                            <IconBriefcase size={22} className="text-cyan-400" />
                            <span className="font-medium">{formValues.jobTitle}</span>
                            <span className="text-mine-shaft-600">•</span>
                            <span className="text-cyan-400 font-medium">{formValues.company}</span>
                        </div>
                        <div className="text-base flex items-center gap-2 text-mine-shaft-400">
                            <IconMapPin size={20} className="text-mine-shaft-500" />
                            <span>{formValues.location}</span>
                            <span className="text-mine-shaft-600">•</span>
                            <IconEPassport size={20} className="text-mine-shaft-500" />
                            <span>Experience: {formValues.totalExp} {formValues.totalExp === 1 ? 'year' : 'years'}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {editSections.basicInfo && (
                            <ActionIcon
                                color="red"
                                variant="subtle"
                                size="lg"
                                className="hover:scale-105 transition-transform duration-300"
                                onClick={() => handleCancel('basicInfo')}
                            >
                                <IconX className="h-4/5 w-4/5" />
                            </ActionIcon>
                        )}
                        <ActionIcon
                            color="cyan"
                            variant="subtle"
                            size="lg"
                            className="hover:scale-105 transition-transform duration-300"
                            onClick={() => editSections.basicInfo ? handleSave('basicInfo') : handleEdit('basicInfo')}
                            loading={savingSection === 'Basic Info'}
                        >
                            {editSections.basicInfo ? (
                                <IconDeviceFloppy className="h-4/5 w-4/5" />
                            ) : (
                                <IconPencil className="h-4/5 w-4/5" />
                            )}
                        </ActionIcon>
                    </div>
                </div>

                {editSections.basicInfo && (
                    <div className="grid grid-cols-2 gap-6 mt-6 p-6 bg-gradient-to-br from-mine-shaft-900/60 to-mine-shaft-950/60 border border-mine-shaft-800 rounded-2xl animate-fadeIn">
                        {/* Job Title, Company, Location */}
                        {select.slice(0, 3).map((field, idx) => (
                            <div key={idx} className="group">
                                <SelectInput
                                    {...field}
                                    leftSection={field.leftSection ? <field.leftSection stroke={1.5} size={20} /> : undefined}
                                    value={formValues[field.name as keyof typeof formValues] as string}
                                    onChange={(value) => handleFieldChange(field.name, value)}
                                />
                            </div>
                        ))}

                        {/* ✅ Total Experience - NumberInput riêng */}
                        <div className="group">
                            <NumberInput
                                label="Total Experience (Years)"
                                placeholder="Enter years of experience"
                                leftSection={<IconEPassport stroke={1.5} size={20} />}
                                value={formValues.totalExp}
                                onChange={(value) => handleFieldChange('totalExp', value || 0)}
                                min={0}
                                max={50}
                                classNames={{
                                    input: `
                                        bg-gradient-to-br from-mine-shaft-900/60 to-mine-shaft-950/60
                                        text-mine-shaft-100 
                                        border border-mine-shaft-800
                                        focus:border-cyan-400 
                                        focus:shadow-lg focus:shadow-cyan-400/20
                                        placeholder:text-mine-shaft-500
                                        rounded-xl
                                        transition-all duration-300
                                        hover:border-mine-shaft-700
                                    `,
                                    label: 'text-mine-shaft-300 font-medium mb-2'
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <Divider my="xl" className="border-mine-shaft-800" />

            {/* ===== About ===== */}
            <section className="px-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        About
                    </h2>

                    <div className="flex gap-2">
                        {editSections.about && (
                            <ActionIcon
                                color="red"
                                variant="subtle"
                                size="lg"
                                className="hover:scale-105 transition-transform duration-300"
                                onClick={() => handleCancel('about')}
                            >
                                <IconX size={20} />
                            </ActionIcon>
                        )}
                        <ActionIcon
                            color="cyan"
                            variant="subtle"
                            size="lg"
                            className="hover:scale-105 transition-transform duration-300"
                            onClick={() => editSections.about ? handleSave('about') : handleEdit('about')}
                            loading={savingSection === 'About'}
                        >
                            {editSections.about ? (
                                <IconDeviceFloppy size={20} />
                            ) : (
                                <IconPencil size={20} />
                            )}
                        </ActionIcon>
                    </div>
                </div>

                {editSections.about ? (
                    <Textarea
                        value={formValues.about}
                        onChange={(e) => handleFieldChange('about', e.target.value)}
                        rows={6}
                        className="
                        [&_textarea]:bg-gradient-to-br [&_textarea]:from-mine-shaft-900/60 [&_textarea]:to-mine-shaft-950/60
                        [&_textarea]:text-mine-shaft-100 
                        [&_textarea]:border [&_textarea]:border-mine-shaft-800
                        [&_textarea]:focus:border-cyan-400 
                        [&_textarea]:focus:shadow-lg [&_textarea]:focus:shadow-cyan-400/20
                        [&_textarea]:placeholder:text-mine-shaft-500
                        [&_textarea]:rounded-xl
                        [&_textarea]:transition-all [&_textarea]:duration-300
                        [&_textarea]:hover:border-mine-shaft-700
                        "
                        placeholder="Tell us about yourself..."
                        autosize
                        minRows={6}
                        maxRows={12}
                    />
                ) : (
                    <p className="text-base text-mine-shaft-300 leading-relaxed">
                        {formValues.about}
                    </p>
                )}
            </section>

            <Divider my="xl" className="border-mine-shaft-800" />

            {/* ===== Skills ===== */}
            <section className="px-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        Skills
                    </h2>

                    <div className="flex gap-2">
                        {editSections.skills && (
                            <ActionIcon
                                color="red"
                                variant="subtle"
                                size="lg"
                                className="hover:scale-105 transition-transform duration-300"
                                onClick={() => handleCancel('skills')}
                            >
                                <IconX size={20} />
                            </ActionIcon>
                        )}
                        <ActionIcon
                            color="yellow"
                            variant="subtle"
                            size="lg"
                            className="hover:scale-105 transition-transform duration-300"
                            onClick={() => editSections.skills ? handleSave('skills') : handleEdit('skills')}
                            loading={savingSection === 'Skills'}
                        >
                            {editSections.skills ? (
                                <IconDeviceFloppy size={20} />
                            ) : (
                                <IconPencil size={20} />
                            )}
                        </ActionIcon>
                    </div>
                </div>

                {editSections.skills ? (
                    <TagsInput
                        value={formValues.skills}
                        onChange={(value) => handleFieldChange('skills', value)}
                        placeholder="Press Enter to add skill"
                        classNames={{
                            input: `
                    bg-gradient-to-br from-mine-shaft-900/60 to-mine-shaft-950/60
                    text-mine-shaft-100 
                    border border-mine-shaft-800
                    focus:border-yellow-400 
                    focus:shadow-lg focus:shadow-yellow-400/20
                    placeholder:text-mine-shaft-500
                    rounded-xl
                    transition-all duration-300
                    hover:border-mine-shaft-700
                `,
                            pill: `
                    bg-gradient-to-r from-yellow-400/10 to-orange-400/10
                    text-yellow-400
                    border border-yellow-400/30
                `,
                            pillsList: 'gap-2'
                        }}
                        splitChars={[',', ';', '|']}
                    />
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {formValues.skills.map((skill) => (
                            <span
                                key={skill}
                                className="
                        group relative
                        px-5 py-2 text-sm font-semibold rounded-full
                        bg-gradient-to-r from-yellow-400/10 to-orange-400/10
                        text-yellow-400
                        border border-yellow-400/30
                        hover:from-yellow-400 hover:to-orange-400
                        hover:text-black hover:border-transparent
                        hover:shadow-lg hover:shadow-yellow-400/40
                        hover:scale-110
                        transition-all duration-300
                        cursor-pointer
                    "
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/0 to-orange-400/0 group-hover:from-yellow-400/20 group-hover:to-orange-400/20 blur-xl transition-all duration-300" />
                                <span className="relative">{skill}</span>
                            </span>
                        ))}
                    </div>
                )}
            </section>

            <Divider my="xl" className="border-mine-shaft-800" />

            {/* ===== Experience ===== */}
            <section className="px-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Experiences
                    </h2>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        variant="gradient"
                        gradient={{ from: 'cyan', to: 'blue', deg: 90 }}
                        onClick={handleAddExperience}
                        loading={savingSection === 'experience'}
                        className="hover:scale-105 transition-transform duration-300"
                    >
                        Add Experience
                    </Button>
                </div>

                {savingSection === 'experience' && (
                    <div className="mb-4 text-center text-cyan-400 text-sm">
                        Saving changes...
                    </div>
                )}

                <ExCard
                    data={formValues.experience}
                    onChange={handleChangeExperience}
                    onSave={(index, expData) => handleSaveExperience(index, expData)}
                    onCancel={handleCancelEditExperience}
                    onDelete={handleDeleteExperience}
                    editingIndex={editingExperienceIndex}
                    onEditChange={handleStartEditExperience}
                />

                {formValues.experience.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-mine-shaft-500 mb-4">No experience added yet</div>
                        <Button
                            leftSection={<IconPlus size={18} />}
                            variant="outline"
                            color="cyan"
                            onClick={handleAddExperience}
                            loading={savingSection === 'experience'}
                            className="hover:scale-105 transition-transform duration-300"
                        >
                            Add Your First Experience
                        </Button>
                    </div>
                )}
            </section>

            <Divider my="xl" className="border-mine-shaft-800" />

            {/* ===== Certifications ===== */}
            <section className="px-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        Certifications
                    </h2>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        variant="gradient"
                        gradient={{ from: 'yellow', to: 'orange', deg: 90 }}
                        onClick={handleAddCertification}
                        loading={savingSection === 'certification'}
                        className="hover:scale-105 transition-transform duration-300"
                    >
                        Add Certification
                    </Button>
                </div>

                {savingSection === 'certification' && (
                    <div className="mb-4 text-center text-yellow-400 text-sm">
                        Saving changes...
                    </div>
                )}

                <CertiCard
                    data={formValues.certifications}
                    onChange={handleChangeCertification}
                    onSave={(index, certData) => handleSaveCertification(index, certData)}
                    onCancel={handleCancelEditCertification}
                    onDelete={handleDeleteCertification}
                    editingIndex={editingCertificationIndex}
                    onEditChange={handleStartEditCertification}
                />

                {formValues.certifications.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-mine-shaft-500 mb-4">No certifications added yet</div>
                        <Button
                            leftSection={<IconPlus size={18} />}
                            variant="outline"
                            color="yellow"
                            onClick={handleAddCertification}
                            loading={savingSection === 'certification'}
                            className="hover:scale-105 transition-transform duration-300"
                        >
                            Add Your First Certification
                        </Button>
                    </div>
                )}
            </section>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Profile;