/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionIcon, Button, Divider, FileInput, TextInput, Textarea } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled, IconCheck, IconPaperclip, IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBase64, timeAgo } from "../Services/Utilities";
import { useForm } from "@mantine/form";
import { applyJob } from "../Services/JobService";
import { errNotification, sucessNotification } from "../Services/NotificationService";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../Slices/ProfileSlice";

const ApplyJobComp = (props: any) => {
    const [preview, setPreview] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [sec, setSec] = useState(5);
    const navigate = useNavigate();

    const { id } = useParams();
    const user = useSelector((state: any) => state.user);
    const profile = useSelector((state: any) => state.profile);
    const dispatch = useDispatch();
    const [applied, setApplied] = useState(false);

    // ✅ Get correct job ID
    const jobId = props._id || props.id;

    console.log("🔍 Job Props Debug:", {
        propsId: props.id,
        props_Id: props._id,
        resolvedJobId: jobId,
        allPropsKeys: Object.keys(props)
    });

    // 🆕 DEBUG: Log all user properties to find numeric ID
    useEffect(() => {
        console.log("👤 USER OBJECT DEBUG:", {
            userId: user.id,
            userIdType: typeof user.id,
            userEmail: user.email,
            userKeys: Object.keys(user),
            fullUserObject: user
        });
    }, [user]);

    // ✅ LOAD SAVED JOBS FROM LOCALSTORAGE
    useEffect(() => {
        const loadSavedJobs = () => {
            const userId = profile.id || profile._id || user.id || user._id;
            if (!userId) return;

            try {
                const storageKey = `savedJobs_${userId}`;
                const savedJobsJson = localStorage.getItem(storageKey);
                
                if (savedJobsJson) {
                    const savedJobsFromStorage = JSON.parse(savedJobsJson);
                    
                    if (JSON.stringify(savedJobsFromStorage) !== JSON.stringify(profile.savedJobs)) {
                        console.log("📥 Loading savedJobs from localStorage:", savedJobsFromStorage);
                        dispatch(changeProfile({
                            ...profile,
                            savedJobs: savedJobsFromStorage
                        }));
                    }
                }
            } catch (error) {
                console.error('❌ Failed to load saved jobs from localStorage:', error);
            }
        };

        loadSavedJobs();
    }, [user.id, profile.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // ✅ CHECK IF ALREADY APPLIED
    useEffect(() => {
        const hasApplied = props.applicants?.some(
            (applicant: any) => {
                if (applicant.applicantId && user.id) {
                    return applicant.applicantId === user.id || 
                           applicant.applicantId?.toString() === user.id?.toString();
                }
                if (applicant.email && user.email) {
                    return applicant.email.toLowerCase() === user.email.toLowerCase();
                }
                return false;
            }
        ) ?? false;
        setApplied(hasApplied);
    }, [props.applicants, user.id, user.email]);

    // ✅ SAVE/UNSAVE JOB
    const handleSaveJob = () => {
        const userId = profile.id || profile._id || user.id || user._id;
        
        if (!userId) {
            console.warn("⚠️ User not authenticated");
            return;
        }

        const savedJobs: number[] = Array.isArray(profile.savedJobs)
            ? [...profile.savedJobs]
            : [];

        const isSaving = !savedJobs.includes(jobId);
        
        const updatedSavedJobs = isSaving
            ? [...savedJobs, jobId]
            : savedJobs.filter(id => id !== jobId);

        try {
            const storageKey = `savedJobs_${userId}`;
            localStorage.setItem(storageKey, JSON.stringify(updatedSavedJobs));
            console.log("💾 Saved to localStorage:", {
                userId,
                storageKey,
                savedJobs: updatedSavedJobs,
                action: isSaving ? 'SAVED' : 'REMOVED',
                jobId
            });

            dispatch(changeProfile({
                ...profile,
                savedJobs: updatedSavedJobs
            }));

            sucessNotification(
                "Success",
                isSaving ? "✓ Job saved" : "✓ Job removed"
            );

        } catch (error) {
            console.error('❌ localStorage error:', error);
        }
    };

    const handlePreview = () => {
        form.validate();
        if (!form.isValid()) {
            return;
        }
        setPreview(!preview);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleSubmit = async () => {
        // ✅ CHECK 1: User authentication
        if (!user || !user.id) {
            errNotification(
                "Authentication Required",
                "Please log in to apply for this job."
            );
            return;
        }

        // ✅ CHECK 2: Already applied
        if (applied) {
            errNotification(
                "Already Applied",
                "You have already applied for this job."
            );
            return;
        }

        // ✅ CHECK 3: Double-check with applicants list
        const hasAlreadyApplied = props.applicants?.some(
            (applicant: any) => {
                if (applicant.applicantId && user.id) {
                    return applicant.applicantId === user.id || 
                           applicant.applicantId?.toString() === user.id?.toString();
                }
                if (applicant.email && user.email) {
                    return applicant.email.toLowerCase() === user.email.toLowerCase();
                }
                return false;
            }
        );

        if (hasAlreadyApplied) {
            errNotification(
                "Already Applied",
                "You have already applied for this job."
            );
            setApplied(true);
            return;
        }

        setSubmitted(true);

        try {
            // ✅ Validate form
            const validationResult = form.validate();
            if (validationResult.hasErrors) {
                setSubmitted(false);
                errNotification(
                    "Validation Error",
                    "Please fill in all required fields correctly."
                );
                return;
            }

            // ✅ Check resume
            if (!form.values.resume) {
                setSubmitted(false);
                errNotification(
                    "Resume Required",
                    "Please attach your resume before submitting."
                );
                return;
            }

            console.log("=== 🚀 Starting Application Submission ===");
            console.log("Job ID from URL:", id);
            console.log("Job ID from props:", jobId);
            console.log("User ID:", user.id);
            console.log("User Email:", user.email);

            // ✅ Convert resume to base64
            const resume: any = await getBase64(form.values.resume);

            if (!resume || typeof resume !== 'string') {
                throw new Error("Failed to convert resume to base64");
            }

            const resumeData = resume.split(',')[1];

            if (!resumeData) {
                throw new Error("Invalid resume data after base64 conversion");
            }

            // ✅ Check file size (5MB limit)
            const fileSizeInMB = (resumeData.length * 3 / 4) / (1024 * 1024);
            console.log(`📄 Resume file size: ${fileSizeInMB.toFixed(2)}MB`);

            if (fileSizeInMB > 5) {
                setSubmitted(false);
                errNotification(
                    "File Too Large",
                    `Resume file is too large (${fileSizeInMB.toFixed(2)}MB). Please upload a file smaller than 5MB.`
                );
                return;
            }

            // ✅ Process phone number
            const phoneNumber = form.values.phone.replace(/\D/g, '');

            if (!phoneNumber || phoneNumber.length < 10) {
                setSubmitted(false);
                errNotification(
                    "Invalid Phone Number",
                    "Please enter a valid phone number with at least 10 digits."
                );
                return;
            }

            // 🆕 CRITICAL FIX: Handle applicantId properly
            // Try to find a numeric ID, or use a hash of the email
            let applicantIdValue: number;
            
            // Option 1: Check if user has a numeric ID field
            const numericUserId = user.userId || user.user_id || user.pk || user.accountId;
            
            if (numericUserId && !isNaN(Number(numericUserId))) {
                // We found a numeric ID
                applicantIdValue = Number(numericUserId);
                console.log("✅ Using numeric user ID:", applicantIdValue);
            } else if (!isNaN(Number(user.id))) {
                // user.id is already a number
                applicantIdValue = Number(user.id);
                console.log("✅ user.id is numeric:", applicantIdValue);
            } else {
                // user.id is an email string - create a hash
                // Simple hash function to convert email to number
                const emailHash = user.id.split('').reduce((acc: number, char: string) => {
                    return ((acc << 5) - acc) + char.charCodeAt(0);
                }, 0);
                applicantIdValue = Math.abs(emailHash);
                console.log("⚠️ Using email hash as ID:", {
                    email: user.id,
                    hash: applicantIdValue
                });
            }

            // ✅ Prepare applicant data with correct types
            const applicant = {
                name: form.values.name.trim(),
                email: form.values.email.trim().toLowerCase(),
                phone: Number(phoneNumber),
                website: form.values.website.trim(),
                coverLetter: form.values.coverLetter.trim(),
                applicantId: applicantIdValue,  // ✅ Now guaranteed to be a number
                resume: resumeData
            };

            console.log("📤 Applicant Data Prepared:", {
                name: applicant.name,
                email: applicant.email,
                phone: applicant.phone,
                phoneType: typeof applicant.phone,
                website: applicant.website,
                coverLetterLength: applicant.coverLetter.length,
                applicantId: applicant.applicantId,
                applicantIdType: typeof applicant.applicantId,
                applicantIdIsValid: !isNaN(applicant.applicantId) && applicant.applicantId !== null,
                resumeSize: `${fileSizeInMB.toFixed(2)}MB`
            });

            // ✅ Final validation - ensure applicantId is a valid number
            if (isNaN(applicant.applicantId) || applicant.applicantId === null || applicant.applicantId === undefined) {
                console.error("❌ CRITICAL: applicantId is invalid!", {
                    applicantId: applicant.applicantId,
                    type: typeof applicant.applicantId,
                    userObject: user
                });
                setSubmitted(false);
                errNotification(
                    "System Error",
                    "Could not generate a valid application ID. Please contact support."
                );
                return;
            }

            // ✅ Log full payload for debugging
            console.log("📦 Full Request Payload:", JSON.stringify(applicant, null, 2));

            // ✅ Submit application to backend
            console.log("🚀 Sending POST request to backend...");
            console.log("📍 Endpoint: POST /jobs/apply/" + id);
            
            const res = await applyJob(Number(id), applicant);

            console.log("=== ✅ APPLICATION SUBMITTED SUCCESSFULLY ===");
            console.log("Server response:", res);

            sucessNotification(
                "Application Submitted! 🎉",
                res.message || "Your application has been submitted successfully."
            );

            setApplied(true);

            // ✅ Countdown and redirect
            let timer = 5;
            const countdown = setInterval(() => {
                timer -= 1;
                setSec(timer);
                if (timer === 0) {
                    navigate('/job-history');
                    clearInterval(countdown);
                }
            }, 1000);

        } catch (err: any) {
            setSubmitted(false);

            console.error("=== ❌ APPLICATION SUBMISSION ERROR ===");
            console.error("Full error object:", err);
            console.error("Error message:", err.message);
            console.error("Error response:", err.response);

            let errorTitle = "Submission Failed";
            let errorMessage = "There was an error submitting your application. Please try again.";

            if (err.response) {
                const statusCode = err.response.status;
                const responseData = err.response.data;

                console.error("HTTP Status Code:", statusCode);
                console.error("Response Data:", responseData);

                switch (statusCode) {
                    case 400:
                        errorTitle = "Invalid Data";
                        errorMessage = responseData?.errorMessage ||
                            responseData?.message ||
                            "Please check your application data and try again.";
                        
                        console.error("🔴 400 BAD REQUEST - Validation Error:", {
                            responseData,
                            sentData: err.config?.data,
                            parsedData: (() => {
                                try {
                                    return JSON.parse(err.config?.data);
                                } catch {
                                    return "Could not parse request data";
                                }
                            })()
                        });
                        break;

                    case 401:
                        errorTitle = "Unauthorized";
                        errorMessage = "Your session has expired. Please log in again.";
                        setTimeout(() => navigate('/login'), 2000);
                        break;

                    case 403:
                        errorTitle = "Access Denied";
                        errorMessage = "You don't have permission to apply for this job.";
                        break;

                    case 404:
                        errorTitle = "Job Not Found";
                        errorMessage = "This job posting no longer exists or has been removed.";
                        setTimeout(() => navigate('/find-jobs'), 2000);
                        break;

                    case 409:
                        errorTitle = "Already Applied";
                        errorMessage = "You have already applied for this job.";
                        setApplied(true);
                        break;

                    case 500:
                        errorTitle = "Server Error";
                        errorMessage = responseData?.errorMessage ||
                            responseData?.message ||
                            "The server encountered an error. Please try again or contact support.";
                        
                        console.error("🔴 500 INTERNAL SERVER ERROR - Full Details:", {
                            timestamp: new Date().toISOString(),
                            endpoint: err.config?.url,
                            method: err.config?.method,
                            requestHeaders: err.config?.headers,
                            requestData: err.config?.data,
                            parsedRequestData: (() => {
                                try {
                                    const parsed = JSON.parse(err.config?.data);
                                    return {
                                        ...parsed,
                                        phoneType: typeof parsed.phone,
                                        applicantIdType: typeof parsed.applicantId,
                                        applicantIdValue: parsed.applicantId,
                                        resumeLength: parsed.resume?.length || 0
                                    };
                                } catch {
                                    return "Could not parse request data";
                                }
                            })(),
                            responseData: responseData,
                            responseHeaders: err.response?.headers
                        });
                        break;

                    default:
                        errorMessage = responseData?.errorMessage ||
                            responseData?.message ||
                            `Error ${statusCode}: ${err.message}`;
                }
            } else if (err.request) {
                errorTitle = "Network Error";
                errorMessage = "Could not connect to the server. Please check your internet connection and try again.";
                console.error("🔴 Network error - no response received from server");
            } else {
                errorMessage = err.message || "An unexpected error occurred.";
                console.error("🔴 Request setup error:", err.message);
            }

            errNotification(errorTitle, errorMessage);
        }
    }

    const form = useForm({
        mode: 'controlled',
        validateInputOnChange: true,
        initialValues: {
            name: '',
            email: '',
            phone: '',
            website: '',
            resume: null,
            coverLetter: '',
        },
        validate: {
            name: (value) => {
                if (!value || value.trim().length < 2) {
                    return 'Name must be at least 2 characters';
                }
                if (value.trim().length > 100) {
                    return 'Name is too long (max 100 characters)';
                }
                return null;
            },
            email: (value) => {
                if (!value || !value.trim()) {
                    return 'Email is required';
                }
                if (!/^\S+@\S+\.\S+$/.test(value)) {
                    return 'Invalid email address';
                }
                return null;
            },
            phone: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Phone number is required';
                }
                const cleaned = value.replace(/\D/g, '');
                if (cleaned.length < 10) {
                    return 'Phone number must be at least 10 digits';
                }
                if (cleaned.length > 15) {
                    return 'Phone number is too long (max 15 digits)';
                }
                return null;
            },
            website: (value) => {
                if (!value || value.trim().length < 5) {
                    return 'Please provide a valid website or profile link';
                }
                if (!/^https?:\/\/.+/.test(value) && !/^www\..+/.test(value)) {
                    return 'Please enter a valid URL (e.g., https://example.com)';
                }
                return null;
            },
            resume: (value) => {
                if (value === null) {
                    return 'Please attach your resume';
                }
                const file = value as File;
                const validTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ];
                if (!validTypes.includes(file.type)) {
                    return 'Only PDF and DOC/DOCX files are allowed';
                }
                if (file.size > 5 * 1024 * 1024) {
                    return 'File size must not exceed 5MB';
                }
                return null;
            },
            coverLetter: (value) => {
                if (!value || value.trim().length < 20) {
                    return 'Cover letter must be at least 20 characters';
                }
                if (value.trim().length > 2000) {
                    return 'Cover letter is too long (max 2000 characters)';
                }
                return null;
            },
        },
    });

    return (
        <>
            <div className="w-2/3 mx-auto">
                {/* Already Applied Warning */}
                {applied && (
                    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/50 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <IconCheck className="text-yellow-400" size={28} stroke={2.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-yellow-400 mb-1">
                                    Already Applied
                                </h3>
                                <p className="text-yellow-300/80">
                                    You have already submitted an application for this position.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Job Header Card */}
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-mine-shaft-900/60 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-sm">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-pulse" />

                    <div className="relative flex justify-between items-start">
                        <div className="flex items-start gap-5">
                            <div className="relative group flex-shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse" />
                                <div className="relative p-5 bg-gradient-to-br from-mine-shaft-800 via-mine-shaft-850 to-mine-shaft-900 rounded-2xl border-2 border-mine-shaft-700 group-hover:border-cyan-400/60 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                                    <img
                                        src={props.logo}
                                        alt={`${props.company} Logo`}
                                        className="h-16 filter group-hover:brightness-125 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all duration-500"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.company)}&background=0F172A&color=FBBF24&size=64&bold=true&format=svg`;
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                                    {props.jobTitle}
                                </h2>
                                <div className="flex items-center gap-3 text-base">
                                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-300 font-bold">
                                        {props.company}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
                                    <span className="text-mine-shaft-300 font-medium">{timeAgo(props.posTime)}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
                                    <span className="px-3 py-1 bg-mine-shaft-800/50 border border-mine-shaft-700 rounded-full text-mine-shaft-400 text-sm">
                                        {props.location}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 flex-col">
                            <ActionIcon
                                onClick={handleSaveJob}
                                size="xl"
                                className={`relative transition-all duration-500 ${profile.savedJobs?.includes(jobId)
                                    ? "bg-gradient-to-br from-yellow-500/30 to-orange-500/30 hover:from-yellow-500/40 hover:to-orange-500/40 shadow-lg shadow-yellow-500/50"
                                    : "bg-mine-shaft-800 hover:bg-mine-shaft-700 shadow-lg"
                                    } hover:scale-125 hover:rotate-12 border-2 ${profile.savedJobs?.includes(jobId) ? 'border-yellow-400/50' : 'border-mine-shaft-700'}`}
                                variant="light"
                                radius="md"
                            >
                                {profile.savedJobs?.includes(jobId) ? (
                                    <IconBookmarkFilled className="text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" size={24} />
                                ) : (
                                    <IconBookmark className="text-mine-shaft-300 group-hover:text-yellow-400 transition-colors" size={24} stroke={2} />
                                )}
                            </ActionIcon>
                        </div>
                    </div>
                </div>

                <Divider my="xl" className="border-mine-shaft-700" />

                {/* Don't show form if already applied */}
                {applied ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">✓</div>
                        <h3 className="text-2xl font-bold text-mine-shaft-100 mb-3">
                            Application Submitted
                        </h3>
                        <p className="text-mine-shaft-400 mb-8">
                            Your application for this position has been received.
                        </p>
                        <Button
                            onClick={() => navigate('/job-history')}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
                        >
                            View Application Status
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Form Title */}
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                                {preview ? "Review Your Application" : "Submit Your Application"}
                            </h3>
                            <p className="text-mine-shaft-400 mt-2">
                                {preview ? "Please review your information before submitting" : "Fill in your details below"}
                            </p>
                        </div>

                        {/* Application Form */}
                        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-mine-shaft-900/40 to-mine-shaft-950/40 border border-mine-shaft-700/50 backdrop-blur-sm w-2/3 mx-auto mb-10">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/3 via-blue-500/3 to-purple-500/3" />

                            <div className="relative flex flex-col gap-6">
                                <TextInput
                                    placeholder="Enter your name"
                                    {...form.getInputProps('name')}
                                    label="Full Name"
                                    className="w-full"
                                    withAsterisk
                                    readOnly={preview}
                                    variant={preview ? "filled" : "default"}
                                    classNames={{
                                        input: `${preview ? 'bg-mine-shaft-800/50' : 'bg-mine-shaft-900/50 border-mine-shaft-700 focus:border-cyan-500'} transition-all duration-300`,
                                        label: 'text-mine-shaft-300 font-semibold mb-2'
                                    }}
                                />

                                <TextInput
                                    placeholder="Enter your email"
                                    {...form.getInputProps('email')}
                                    label="Email Address"
                                    className="w-full"
                                    withAsterisk
                                    readOnly={preview}
                                    variant={preview ? "filled" : "default"}
                                    classNames={{
                                        input: `${preview ? 'bg-mine-shaft-800/50' : 'bg-mine-shaft-900/50 border-mine-shaft-700 focus:border-cyan-500'} transition-all duration-300`,
                                        label: 'text-mine-shaft-300 font-semibold mb-2'
                                    }}
                                />

                                <TextInput
                                    placeholder="Enter your phone number (e.g., +1234567890)"
                                    {...form.getInputProps('phone')}
                                    label="Phone Number"
                                    className="w-full"
                                    withAsterisk
                                    readOnly={preview}
                                    variant={preview ? "filled" : "default"}
                                    classNames={{
                                        input: `${preview ? 'bg-mine-shaft-800/50' : 'bg-mine-shaft-900/50 border-mine-shaft-700 focus:border-cyan-500'} transition-all duration-300`,
                                        label: 'text-mine-shaft-300 font-semibold mb-2'
                                    }}
                                />

                                <TextInput
                                    placeholder="Personal Website or LinkedIn Profile"
                                    {...form.getInputProps('website')}
                                    label="Personal Website"
                                    withAsterisk
                                    className="w-full"
                                    readOnly={preview}
                                    variant={preview ? "filled" : "default"}
                                    classNames={{
                                        input: `${preview ? 'bg-mine-shaft-800/50' : 'bg-mine-shaft-900/50 border-mine-shaft-700 focus:border-cyan-500'} transition-all duration-300`,
                                        label: 'text-mine-shaft-300 font-semibold mb-2'
                                    }}
                                />

                                <FileInput
                                    leftSection={<IconPaperclip stroke={1.5} />}
                                    {...form.getInputProps('resume')}
                                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    placeholder="Your CV (PDF, DOC, or DOCX - Max 5MB)"
                                    label="Attach your CV"
                                    className="w-full"
                                    withAsterisk
                                    leftSectionPointerEvents="none"
                                    readOnly={preview}
                                    variant={preview ? "filled" : "default"}
                                    classNames={{
                                        input: `${preview ? 'bg-mine-shaft-800/50' : 'bg-mine-shaft-900/50 border-mine-shaft-700 focus:border-cyan-500'} transition-all duration-300`,
                                        label: 'text-mine-shaft-300 font-semibold mb-2'
                                    }}
                                />

                                <Textarea
                                    placeholder="Write a short cover letter explaining why you're a great fit for this position..."
                                    {...form.getInputProps('coverLetter')}
                                    label="Cover Letter"
                                    className="w-full"
                                    withAsterisk
                                    autosize
                                    minRows={4}
                                    maxRows={8}
                                    readOnly={preview}
                                    variant={preview ? "filled" : "default"}
                                    classNames={{
                                        input: `${preview ? 'bg-mine-shaft-800/50' : 'bg-mine-shaft-900/50 border-mine-shaft-700 focus:border-cyan-500'} transition-all duration-300`,
                                        label: 'text-mine-shaft-300 font-semibold mb-2'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex gap-4 justify-center">
                            {!preview ? (
                                <Button
                                    className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 border border-cyan-400/40 hover:border-cyan-300"
                                    size="lg"
                                    onClick={handlePreview}
                                    variant="light"
                                    disabled={submitted}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                                    <span className="relative z-10 flex items-center gap-2">
                                        Preview Application
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                    </span>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        className="group relative overflow-hidden bg-gradient-to-r from-mine-shaft-700 via-mine-shaft-600 to-mine-shaft-700 hover:from-mine-shaft-600 hover:via-mine-shaft-500 hover:to-mine-shaft-600 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-mine-shaft-600 hover:border-mine-shaft-500"
                                        size="lg"
                                        onClick={handlePreview}
                                        variant="light"
                                        disabled={submitted}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                                        <span className="relative z-10 flex items-center gap-2">
                                            <span className="group-hover:-translate-x-1 transition-transform duration-300">
                                                <IconArrowLeft size={18} stroke={2.5} />
                                            </span>
                                            Edit Application
                                        </span>
                                    </Button>

                                    <Button
                                        className="group relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-400 hover:via-emerald-400 hover:to-teal-400 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 border border-green-400/40 hover:border-green-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        size="lg"
                                        onClick={handleSubmit}
                                        variant="light"
                                        disabled={submitted}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                                        <span className="relative z-10 flex items-center gap-2">
                                            Submit Application
                                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                                                <IconCheck size={18} stroke={2.5} />
                                            </span>
                                        </span>
                                    </Button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Success Notification */}
            {submitted && (
                <div className="fixed top-8 right-8 z-50 animate-in slide-in-from-right duration-700">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-75 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-2xl border-2 border-green-400/50 rounded-3xl p-6 shadow-2xl min-w-[350px]">
                            <div className="flex items-start gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-50"></div>
                                    <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                                        <IconCheck className="w-8 h-8 text-white" strokeWidth={3} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-green-400 mb-2 text-xl">
                                        Success! 🎉
                                    </h3>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                                        Your application has been submitted successfully.
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000 rounded-full"
                                                style={{ width: `${((5 - sec) / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-slate-400 text-xs font-bold">{sec}s</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {submitted && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-40">
                    <div className="text-center space-y-8">
                        <div className="relative w-32 h-32 mx-auto">
                            <div className="absolute inset-0 border-8 border-blue-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-8 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-4 border-8 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-slate-100 text-2xl font-black">Processing Application</p>
                            <p className="text-slate-400 text-sm">Please wait while we submit your information...</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ApplyJobComp;