import { Divider } from "@mantine/core"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import FindJobs from "./FindJobs"
import FindTalentPage from "./FindTalentPage"
import JobDescPage from "./JobDescPage"
import CompanyPage from "./ComapanyPage"
import ApplyJobPage from "./ApplyJobPage"
import JobHistoryPage from "./JobHistoryPage"
import PostedJobPage from "./PostedJobPages"
import PostJobPage from "./PostJobPage"
import TalentProfilePage from "./TalentProfilePage"
import SignUpPage from "./SignUpPage"
import ProfilePage from "./ProfilePage"
import HomePage from "./HomePage"
import Headers from "../Header/Header";
import Footer from '../Foot/Footer';
// import { useSelector } from "react-redux"

const AppRoutes = () => {
    
    // const user = useSelector((state:any) =>state.user);
    return <BrowserRouter>
        <Headers />
        <Divider size="xs" mx='md' />
        <Routes>
            <Route path='/find-jobs' element={<FindJobs />} />
            <Route path='/find-talent' element={<FindTalentPage />} />
            <Route path='/jobs/:id' element={<JobDescPage />} />
            <Route path='/company/:companyName' element={<CompanyPage />} />
            <Route path='/apply-job/:id' element={<ApplyJobPage />} />
            <Route path='/job-history' element={<JobHistoryPage />} />
            <Route path='/posted-job/:id' element={<PostedJobPage />} />
            <Route path='/post-job/:id' element={<PostJobPage />} />
            <Route path='/talent-profile/:id' element={<TalentProfilePage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/login' element={<SignUpPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='*' element={<HomePage />} />
        </Routes>
        <Footer />
    </BrowserRouter>
}
export default AppRoutes