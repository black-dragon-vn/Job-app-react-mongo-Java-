
import Companies from "../LandingPage/Companies";
import DreamJob from "../LandingPage/DreamJob";
import JobCategory from "../LandingPage/JobCategory";
import Subscribe from "../LandingPage/Subscribe";
import Testimonials from "../LandingPage/Testimionials";
import Working from "../LandingPage/Working";
const HomePage = () => {
    return (
        <div className="min-h-[100vh] bg-mine-shaft-950  text-white flex flex-col items-center font-poppins">
            
            <DreamJob/>
            <Companies/>
            <JobCategory/>
            <Working/>  
            <Testimonials/>
            <Subscribe/>
            
        </div>
    )
}
export default HomePage;    
