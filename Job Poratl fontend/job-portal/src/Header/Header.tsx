/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@mantine/core";
import { IconBrandWaze } from "@tabler/icons-react";
import NavLinks from "./NavLinks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import NotiMenu from "./NotiMenu";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../Slices/UserSlice";
import { setupReponseIntercept } from "../Interceptor/AxiosInsstance";

interface DecodedToken {
    sub?: string;
    email?: string;
    userId?: number;
    id?: string;
    profileId?: string;
    name?: string;
    accountType?: string;
    [key: string]: any;
}

const Header = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    // Setup axios interceptor and decode JWT token on mount
    useEffect(() => {
        console.log('🚀 Header - Setting up');
        setupReponseIntercept(navigate);
        
        const token = localStorage.getItem("token");
        if (!token) {
            console.log('ℹ️ No token found');
            return;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            
            console.log('🔍 Decoded JWT:', decoded);
            console.log('🔍 userId field:', decoded.userId, 'Type:', typeof decoded.userId);
            
            // ✅ EXTRACT userId FROM TOKEN
            const userId = decoded.userId;
            const email = decoded.sub || decoded.email;
            
            console.log('📍 Final userId:', userId, 'Type:', typeof userId);
            console.log('📍 Final email:', email);
            
            if (!userId) {
                console.error('❌ No userId in token!');
                console.error('❌ Token contents:', decoded);
                console.error('❌ This means backend is NOT generating userId in JWT!');
                
                // Clear invalid token
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            
            // ✅ BUILD USER OBJECT WITH userId
            const userData = {
                email: email,
                userId: userId,  // ✅ MUST BE NUMBER (44)
                name: decoded.name,
                accountType: decoded.accountType,
                ...decoded
            };
            
            console.log('💾 Setting user data:', userData);
            console.log('💾 userData.userId:', userData.userId, 'Type:', typeof userData.userId);
            
            dispatch(setUser(userData));
        } catch (error) {
            console.error('❌ Error decoding token:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    }, [dispatch, navigate]);

    // Don't render header on signup/login pages
    if (location.pathname === '/signup' || location.pathname === '/login') {
        return null;
    }

    return (
        <div className="w-full text-white h-20 flex justify-between items-center px-10 bg-mine-shaft-950 font-poppins">
            {/* Logo Section */}
            <div className="flex items-center gap-3 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                    <IconBrandWaze
                        stroke={2}
                        className="h-12 w-12 text-cyan-400 relative z-10 transform group-hover:scale-110 transition-transform"
                    />
                </div>
                <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
                        JobNect
                    </div>
                    <div className="text-sm text-cyan-300">Connecting Talent & Opportunities</div>
                </div>
            </div>

            {/* Navigation Links */}
            <NavLinks />

            {/* Right Actions */}
            <div className="flex gap-5 items-center">
                {/* Profile or Login */}
                {user ? (
                    <ProfileMenu />
                ) : (
                    <Link to="/login">
                        <Button variant="subtle" className="relative group">
                            {/* Animated gradient background layer */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                            {/* Subtle shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

                            <span className="relative z-10 flex items-center gap-2">
                                <span className="text-lg group-hover:-translate-y-1 transition-transform duration-300 font-semibold hover:text-xl">
                                    Login
                                </span>
                            </span>
                        </Button>
                    </Link>
                )}

                {/* Notifications */}
                {user && <NotiMenu />}
            </div>
        </div>
    );
};

export default Header;