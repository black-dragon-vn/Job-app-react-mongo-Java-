import { profile } from "../Data/TalentData"
import Profile from "../Profile/Profile"

const ProfilePage = () => {
    return (
        <div className="min-h-[100vh] bg-mine-shaft-950   font-poppins p-4">
            <div className="flex gap-10 justify-center">
                <Profile {...profile} />
            </div>


        </div>
    )
}
export default ProfilePage