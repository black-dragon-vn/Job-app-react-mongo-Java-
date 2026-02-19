import { 
  IconBrandWaze, 
  IconBrandFacebook, 
  IconBrandTiktok, 
  IconBrandInstagram,
  IconBrandLinkedin,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCopyright
} from "@tabler/icons-react";
import { footerLinks } from "../Data/Data";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const location = useLocation();
  const handleSubscribe = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (location.pathname!='/signup'&&location.pathname!='/login'?
    <footer className="relative pt-20  to-black text-gray-300 overflow-hidden bg-mine-shaft-950  text-white  items-center font-poppins0">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-yellow-400 to-cyan-400"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Company Info Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <IconBrandWaze stroke={2} className="h-12 w-12 text-cyan-400 relative z-10 transform group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
                  JobNect
                </div>
                <div className="text-sm text-cyan-300">Connecting Talent & Opportunities</div>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Transform your career journey with our intelligent job portal. 
              Showcase your skills, certifications, and experience to land your dream job.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 hover:text-cyan-400 transition-colors cursor-pointer">
                <IconMail className="h-5 w-5" />
                <span className="text-sm">contact@jobnect.com</span>
              </div>
              <div className="flex items-center gap-3 hover:text-cyan-400 transition-colors cursor-pointer">
                <IconPhone className="h-5 w-5" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 hover:text-cyan-400 transition-colors cursor-pointer">
                <IconMapPin className="h-5 w-5" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((item) => (
              <div key={item.id} className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-l-4 border-cyan-400 pl-3">
                  {item.title}
                </h3>
                <ul className="space-y-2">
                  {item.links.map((link, index) => (
                    <li key={index}>
                      <a 
                        href="#" 
                        className="flex items-center group text-gray-400 hover:text-white transition-all duration-300 hover:pl-2"
                      >
                        <span className="w-0 h-0.5 bg-cyan-400 rounded-full group-hover:w-3 mr-0 group-hover:mr-2 transition-all"></span>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to get notified about new job opportunities and career tips.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-gray-500"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-md hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: IconBrandFacebook, color: "bg-blue-600", hover: "hover:bg-blue-700" },
                  { icon: IconBrandTiktok, color: "bg-black", hover: "hover:bg-gray-900" },
                  { icon: IconBrandInstagram, color: "bg-gradient-to-r from-purple-500 to-pink-500", hover: "hover:from-purple-600 hover:to-pink-600" },
                  { icon: IconBrandLinkedin, color: "bg-blue-700", hover: "hover:bg-blue-800" },
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href="#"
                      className={`
                        ${social.color} ${social.hover}
                        p-3 rounded-xl text-white
                        transform transition-all duration-300
                        hover:scale-110 hover:rotate-6 hover:shadow-xl
                        flex items-center justify-center
                      `}
                    >
                      <Icon className="h-6 w-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-800/50"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <IconCopyright className="h-4 w-4" />
            <span>{new Date().getFullYear()} JobNect. All rights reserved.</span>
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors hover:underline">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors hover:underline">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-cyan-500/25 hover:scale-110 transition-all duration-300 z-50"
        >
          ↑
        </button>
      </div>
    </footer>:
    <></>
  );
};

export default Footer;