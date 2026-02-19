
import { Link, useLocation } from "react-router-dom";

const NavLinks = () => {
    const links = [
        { name: 'Home', url: '' },
        { name: 'Find Jobs', url: 'find-jobs' },
        { name: 'Find Talent', url: 'find-talent' },
        { name: 'Post Job', url: 'post-job/0' },
        { name: 'Posted Job', url: 'posted-job/0' },
        { name: 'Job History', url: 'job-history' },
        // { name: 'Signup', url: 'signup' },
        // { name: 'About Us', url: 'about-us' }
    ];
    const location = useLocation();
    return (
        <div className="flex gap-8 text-white font-medium text-lg">

            {links.map((link, index) => <div key={index} className={location.pathname === `/${link.url}` ? "text-cyan-400 hover:text-cyan-400 transition-colors duration-300" : ""}>
                <Link to={(`/${link.url}`)} key={index} className="hover:text-cyan-400 transition-colors duration-300">{link.name}</Link></div>)}
        </div>
    );
}
export default NavLinks;