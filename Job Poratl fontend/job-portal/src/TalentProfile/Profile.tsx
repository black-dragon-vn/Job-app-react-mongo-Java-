/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { Button, Divider } from "@mantine/core";
import { IconBriefcase, IconMapPin, IconMessage } from "@tabler/icons-react";
import ExCard from "./ExpCard";
import CertiCard from "./CertiCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../Services/ProfileService";
import MessageModal from "./Messagemodal";

/* =======================
   Interfaces (Models)
======================= */
export interface Experience {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | null;
    description: string;
    working?: boolean;
}

export interface Certification {
    name: string;
    issuer: string;
    issueDate: string;
    certificateId: string;
}

export interface ProfileData {
    id?: number;
    name: string;
    email: string;
    jobTitle: string;
    company: string;
    location: string;
    about: string;
    picture?: any;
    skills: string[];
    experiences: Experience[];
    certifications: Certification[];
    _class?: string;
}

/* =======================
   Component
======================= */
const Profile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const defaultBanner = "https://cdn.hstatic.net/files/1000290074/article/tet-2044_0a468ca068de4101a7995d82067ddf22.jpg";
    const defaultAvatar = "https://bizweb.dktcdn.net/100/503/764/files/tet-co-truyen-viet-nam-1.jpg?v=1727269102692";

    useEffect(() => {
        window.scrollTo(0, 0);

        if (!id) { setError("No profile ID provided"); setLoading(false); return; }

        const profileId = parseInt(id, 10);
        if (isNaN(profileId)) { setError("Invalid profile ID"); setLoading(false); return; }

        setLoading(true);
        getProfile(profileId)
            .then((res) => { setProfile(res); setLoading(false); })
            .catch((err) => {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile");
                setLoading(false);
            });
    }, [id]);

    const getAvatarUrl = () => {
        if (!profile?.picture) return defaultAvatar;
        const picture = profile.picture;
        if (typeof picture === "string") {
            return picture.startsWith("data:image")
                ? picture
                : `data:image/jpeg;base64,${picture}`;
        }
        if (picture && typeof picture === "object") {
            try {
                const b64 = picture.buffer || picture.data || picture.toString?.("base64") || picture;
                return `data:image/jpeg;base64,${b64}`;
            } catch { return defaultAvatar; }
        }
        return defaultAvatar;
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="w-2/3 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-mine-shaft-300">Loading profile...</p>
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (error || !profile) {
        return (
            <div className="w-2/3 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-400 text-lg mb-2">⚠️ {error || "Profile not found"}</p>
                    <p className="text-mine-shaft-400">Please try again later</p>
                </div>
            </div>
        );
    }

    const avatarUrl = getAvatarUrl();

    return (
        <div className="w-2/3">
            {/* ===== Banner & Avatar ===== */}
            <div className="relative group">
                <div className="w-full aspect-video md:aspect-[21/9] rounded-t-2xl overflow-hidden">
                    <img
                        src={defaultBanner}
                        alt="Banner"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mine-shaft-950/80 via-transparent to-transparent" />
                </div>

                <div className="absolute -bottom-24 left-6">
                    <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <img
                        src={avatarUrl}
                        alt={`${profile.name} avatar`}
                        className="relative w-48 h-48 rounded-full border-4 border-mine-shaft-800 object-cover ring-4 ring-cyan-500/20 group-hover:ring-cyan-500/40 transition-all duration-500"
                        onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                    />
                </div>
            </div>

            {/* ===== Basic Info ===== */}
            <div className="px-6 mt-32 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent mb-2">
                            {profile.name}
                        </h1>
                        <div className="text-xl flex items-center gap-2 text-mine-shaft-200 mb-2">
                            <IconBriefcase size={22} className="text-cyan-400" />
                            <span className="font-medium">{profile.jobTitle}</span>
                            <span className="text-mine-shaft-600">•</span>
                            <span className="text-cyan-400 font-medium">{profile.company}</span>
                        </div>
                        <div className="text-base flex items-center gap-2 text-mine-shaft-400">
                            <IconMapPin size={20} className="text-mine-shaft-500" />
                            {profile.location}
                        </div>
                    </div>

                    {/* ─────────────────────────────────
                        MESSAGE BUTTON  →  dùng MessageModal
                    ───────────────────────────────── */}
                    <MessageModal
                        name={profile.name}
                        jobTitle={profile.jobTitle}
                        company={profile.company}
                        email={profile.email}
                        picture={profile.picture}
                        skills={profile.skills}
                        /* onSend={yourApiCall} */   // ← bỏ comment khi có API thật
                        trigger={(openModal) => (
                            <Button
                                color="cyan"
                                variant="light"
                                size="md"
                                leftSection={<IconMessage size={16} />}
                                className="hover:scale-105 transition-transform duration-300"
                                onClick={openModal}
                            >
                                Message
                            </Button>
                        )}
                    />
                </div>
            </div>

            <Divider my="xl" className="border-mine-shaft-800" />

            {/* ===== About ===== */}
            <section className="px-6">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    About
                </h2>
                <p className="text-base text-mine-shaft-300 leading-relaxed">{profile.about}</p>
            </section>

            <Divider my="xl" className="border-mine-shaft-800" />

            {/* ===== Skills ===== */}
            <section className="px-6">
                <h2 className="text-3xl font-bold mb-5 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                    {profile.skills?.length > 0 ? (
                        profile.skills.map((skill, index) => (
                            <span
                                key={`${skill}-${index}`}
                                className="group relative px-5 py-2 text-sm font-semibold rounded-full
                                    bg-gradient-to-r from-yellow-400/10 to-orange-400/10 text-yellow-400
                                    border border-yellow-400/30
                                    hover:from-yellow-400 hover:to-orange-400 hover:text-black hover:border-transparent
                                    hover:shadow-lg hover:shadow-yellow-400/40 hover:scale-110
                                    transition-all duration-300 cursor-pointer"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/0 to-orange-400/0 group-hover:from-yellow-400/20 group-hover:to-orange-400/20 blur-xl transition-all duration-300" />
                                <span className="relative">{skill}</span>
                            </span>
                        ))
                    ) : (
                        <p className="text-mine-shaft-400">No skills listed</p>
                    )}
                </div>
            </section>

            <Divider my="xl" className="border-mine-shaft-800" />

            {/* ===== Experience ===== */}
            <section className="px-6">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Experience
                </h2>
                {profile.experiences?.length > 0 ? (
                    <ExCard data={profile.experiences} />
                ) : (
                    <p className="text-mine-shaft-400">No experience listed</p>
                )}
            </section>

            <Divider my="xl" className="border-mine-shaft-800" />

            {/* ===== Certifications ===== */}
            <section className="px-6 mb-8">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    Certifications
                </h2>
                {profile.certifications?.length > 0 ? (
                    <CertiCard data={profile.certifications} />
                ) : (
                    <p className="text-mine-shaft-400">No certifications listed</p>
                )}
            </section>
        </div>
    );
};

export default Profile;