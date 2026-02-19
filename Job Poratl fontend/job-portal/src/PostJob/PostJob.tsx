/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, NumberInput, TagsInput, Textarea } from "@mantine/core";
import { content, fields } from "../Data/PostJob";
import SelectInput from "./SelectInput";
import TextEditor from "./TextEditor";
import { Sparkles, Save, Send } from "lucide-react";
import { useForm, isNotEmpty } from '@mantine/form';
import { getJob, postJob } from "../Services/JobService";
import { errNotification, sucessNotification } from "../Services/NotificationService";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const PostJob = () => {
    const { id } = useParams();
    const user = useSelector((state: any) => state.user);
    const select = fields;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    //  Xác định chế độ CREATE hay UPDATE
    const isUpdateMode = id && id !== "0" && id !== "new";
    
    const form = useForm({
        mode: 'controlled',
        validateInputOnChange: true,
        initialValues: {
            jobTitle: '',          
            company: '',
            logo: '',
            experience: '',
            jobType: '',
            location: '',
            packageOffered: '',     
            skillsRequired: [],     
            about: '',
            description: content
        },
        validate: {
            jobTitle: isNotEmpty('Job Title is required'),        
            company: isNotEmpty('Company Name is required'),
            experience: isNotEmpty('Experience is required'),
            jobType: isNotEmpty('Job Type is required'),
            location: isNotEmpty('Location is required'),
            packageOffered: (value) => {
                if (!value || value === '') return 'Package Offered is required';
                if (Number(value) <= 0) return 'Package must be greater than 0';
                return null;
            },
            skillsRequired: (value) => (value.length === 0 ? 'At least one skill is required' : null),
            about: isNotEmpty('About is required'),
            description: (value) => {
                if (!value || value === '' || value === '<p></p>') return 'Description is required';
                return null;
            }
        }
    });
    
    useEffect(() => {
        window.scrollTo(0, 0);
        if (isUpdateMode) { 
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(true);
            getJob(id)
                .then((res) => {
                    console.log(" Loaded job for editing:", res);
                    form.setValues({
                        jobTitle: res.jobTitle || '',
                        company: res.company || '',
                        logo: res.logo || '',
                        experience: res.experience || '',
                        jobType: res.jobType || '',
                        location: res.location || '',
                        packageOffered: res.packageOffered || '',
                        skillsRequired: res.skillsRequired || [],
                        about: res.about || '',
                        description: res.description || content
                    });
                })
                .catch((err) => {
                    console.error(" Error loading job:", err);
                    errNotification("Error", "Failed to load job details");
                    navigate('/posted-jobs');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]); 
    
    const handlePost = () => {
        form.validate();
        
        if (!form.isValid()) {
            console.log(" Validation errors:", form.errors);
            errNotification("Validation Error", "Please fill all required fields correctly");
            return;
        }

        // ✅ Changed from user.id to user.userId
        if (!user || !user.userId) {
            console.error("❌ User not found");
            errNotification("Error", "User information not found. Please login again.");
            return;
        }
        
        setLoading(true);
        
        const formValues = form.getValues();
        
        console.log("=================================");
        console.log(isUpdateMode ? " UPDATING JOB" : "CREATING NEW JOB");
        console.log("ID from URL:", id);
        console.log("Is Update Mode:", isUpdateMode);
        console.log("User ID:", user.userId);
        console.log("=================================");
        
        //  Chuẩn bị data
        const jobData: any = {
            jobTitle: formValues.jobTitle,
            company: formValues.company,
            logo: formValues.logo?.trim() || '',
            experience: formValues.experience,
            jobType: formValues.jobType,
            location: formValues.location,
            packageOffered: String(formValues.packageOffered),
            skillsRequired: Array.isArray(formValues.skillsRequired) 
                ? formValues.skillsRequired 
                : [],
            about: formValues.about,
            description: formValues.description,
            postedBy: user.userId,  // ✅ Changed from user.id to user.userId
            jobStatus: "ACTIVE"
        };

        //  CHỈ thêm ID khi UPDATE (QUAN TRỌNG!)
        if (isUpdateMode) {
            jobData.id = Number(id);
            console.log(" Added ID for update:", jobData.id);
        } else {
            console.log(" No ID - Creating new job");
        }
        
        console.log(" SENDING DATA:");
        console.log(JSON.stringify(jobData, null, 2));
        
        postJob(jobData)
            .then((res) => {
                console.log(" SUCCESS:", res);
                sucessNotification(
                    "Success", 
                    isUpdateMode ? "Job updated successfully!" : "Job posted successfully!"
                );
                navigate(`/posted-job/${res.id}`);
            })
            .catch((err) => {
                console.error(" ERROR:", err.response?.data);
                
                const errorMessage = err.response?.data?.errorMessage
                    || err.response?.data?.message 
                    || err.response?.data?.error 
                    || err.message
                    || "Failed to post job. Please try again.";
                    
                errNotification("Error", errorMessage);
            })
            .finally(() => {
                setLoading(false);
            });   
    };
    
    const handleDraft = () => {
        form.validate();
        
        if (!form.isValid()) {
            console.log(" Validation errors:", form.errors);
            errNotification("Validation Error", "Please fill all required fields correctly");
            return;
        }

        //  Changed from user.id to user.userId
        if (!user || !user.userId) {
            console.error(" User not found");
            errNotification("Error", "User information not found. Please login again.");
            return;
        }
        
        setLoading(true);
        
        const formValues = form.getValues();
        
        console.log("=================================");
        console.log(isUpdateMode ? " UPDATING DRAFT" : " CREATING NEW DRAFT");
        console.log("ID from URL:", id);
        console.log("Is Update Mode:", isUpdateMode);
        console.log("User ID:", user.userId);
        console.log("=================================");
        
        //  Chuẩn bị data
        const jobData: any = {
            jobTitle: formValues.jobTitle,
            company: formValues.company,
            logo: formValues.logo?.trim() || '',
            experience: formValues.experience,
            jobType: formValues.jobType,
            location: formValues.location,
            packageOffered: String(formValues.packageOffered),
            skillsRequired: Array.isArray(formValues.skillsRequired) 
                ? formValues.skillsRequired 
                : [],
            about: formValues.about,
            description: formValues.description,
            postedBy: user.userId,  //  Changed from user.id to user.userId
            jobStatus: "DRAFT"
        };

        //  CHỈ thêm ID khi UPDATE (QUAN TRỌNG!)
        if (isUpdateMode) {
            jobData.id = Number(id);
            console.log(" Added ID for update:", jobData.id);
        } else {
            console.log(" No ID - Creating new draft");
        }
        
        console.log(" SENDING DATA:");
        console.log(JSON.stringify(jobData, null, 2));
        
        postJob(jobData)
            .then((res) => {
                console.log(" SUCCESS:", res);
                sucessNotification(
                    "Success", 
                    isUpdateMode ? "Draft updated successfully!" : "Job saved as draft!"
                );
                navigate(`/posted-job/${res.id}`);
            })
            .catch((err) => {
                console.error(" ERROR:", err.response?.data);
                
                const errorMessage = err.response?.data?.errorMessage
                    || err.response?.data?.message 
                    || err.response?.data?.error 
                    || err.message
                    || "Failed to save draft. Please try again.";
                    
                errNotification("Error", errorMessage);
            })
            .finally(() => {
                setLoading(false);
            });   
    };
    
    //  Loading state khi đang fetch data để edit
    if (loading && isUpdateMode) {
        return (
            <div className="w-4/5 mx-auto py-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-mine-shaft-300">Loading job details...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-4/5 mx-auto py-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                        <Sparkles className="text-cyan-400" size={28} />
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                        {isUpdateMode ? "Edit Job" : "Post a Job"}
                    </h1>
                </div>
                <p className="text-mine-shaft-400 ml-16">
                    Fill out the details below to {isUpdateMode ? "update" : "post"} your job opening
                </p>
            </div>

            {/* Form Container */}
            <div className="relative">
                {/* Background decoration */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

                <div className="relative bg-gradient-to-br from-mine-shaft-900/60 to-mine-shaft-950/60 border border-mine-shaft-800 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="flex flex-col gap-6">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                                <h2 className="text-xl font-bold text-mine-shaft-100">Basic Information</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="group">
                                    <SelectInput form={form} name="jobTitle" {...select[0]} />
                                </div>
                                <div className="group">
                                    <SelectInput form={form} name="company" {...select[1]} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="group">
                                    <SelectInput form={form} name="experience" {...select[2]} />
                                </div>
                                <div className="group">
                                    <SelectInput form={form} name="jobType" {...select[3]} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="group">
                                    <SelectInput form={form} name="location" {...select[4]} />
                                </div>
                                <div className="group">
                                    <NumberInput
                                        label="Salary Range"
                                        placeholder="Enter Salary Range"
                                        withAsterisk
                                        hideControls
                                        clampBehavior="strict"
                                        min={1}
                                        max={10000000000}
                                        {...form.getInputProps('packageOffered')}
                                        classNames={{
                                            input: 'bg-mine-shaft-900 border-mine-shaft-700 text-mine-shaft-100 placeholder:text-mine-shaft-500 focus:border-cyan-400 transition-colors duration-300',
                                        }} 
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="group">
                                    <SelectInput form={form} name="logo" {...select[6]} />
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-mine-shaft-700 to-transparent my-4" />

                        {/* Skills Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                                <h2 className="text-xl font-bold text-mine-shaft-100">Required Skills</h2>
                            </div>

                            <TagsInput
                                label="Skills"
                                placeholder="Type and press Enter to add skills"
                                data={['JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'TypeScript', 'React', 'Node.js', 'Docker', 'Kubernetes', 'Figma', 'UI/UX Design']}
                                clearable
                                acceptValueOnBlur
                                splitChars={[',', ' ', '|']}
                                withAsterisk
                                {...form.getInputProps('skillsRequired')}
                                classNames={{
                                    input: 'bg-mine-shaft-900 border-mine-shaft-700 text-mine-shaft-100 placeholder:text-mine-shaft-500 focus:border-cyan-400 transition-colors duration-300',
                                    pill: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300',
                                    pillsList: 'gap-2'
                                }}
                            />
                            <Textarea
                                label="About the Job"
                                placeholder="Provide a brief overview of the job"
                                minRows={4}
                                withAsterisk
                                {...form.getInputProps('about')}
                                classNames={{
                                    input: 'bg-mine-shaft-900 border-mine-shaft-700 text-mine-shaft-100 placeholder:text-mine-shaft-500 focus:border-cyan-400 transition-colors duration-300',
                                }}
                            />
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-mine-shaft-700 to-transparent my-4" />

                        {/* Job Description Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                                <h2 className="text-xl font-bold text-mine-shaft-100">Job Description</h2>
                            </div>

                            <div className="[&_button[data-active=true]]:bg-cyan-600 [&_button[data-active=true]]:text-white [&_button]:bg-cyan-900/20 [&_button]:text-cyan-300 [&_button]:hover:bg-cyan-600/80 [&_button]:hover:text-white [&_button]:transition-all [&_button]:duration-300">
                                <TextEditor form={form} />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-mine-shaft-700 to-transparent my-6" />

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="text-sm text-mine-shaft-400">
                                <span className="text-red-400">*</span> Required fields
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant="light"
                                    onClick={handleDraft}
                                    size="lg"
                                    disabled={loading}
                                    className="group relative overflow-hidden bg-mine-shaft-800 hover:bg-mine-shaft-700 text-mine-shaft-200 font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-mine-shaft-600 hover:border-mine-shaft-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    leftSection={<Save size={20} className="group-hover:scale-110 transition-transform duration-300" />}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {loading ? "Saving..." : "Save as Draft"}
                                    </span>
                                </Button>

                                <Button
                                    size="lg"
                                    disabled={loading}
                                    className="group relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-400 hover:via-emerald-400 hover:to-teal-400 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 border border-green-400/40 hover:border-green-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    leftSection={<Send size={20} className="group-hover:translate-x-1 transition-transform duration-300" />}
                                    variant="light"
                                    onClick={handlePost}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                                    <span className="relative z-10 flex items-center gap-2">
                                        {loading ? "Processing..." : (isUpdateMode ? "Update Job" : "Publish Job")}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom decoration */}
            <div className="mt-12 text-center">
                <p className="text-sm text-mine-shaft-500">
                    Need help? Check out our{" "}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 underline transition-colors">
                        posting guidelines
                    </a>
                </p>
            </div>
        </div>
    );
};

export default PostJob;