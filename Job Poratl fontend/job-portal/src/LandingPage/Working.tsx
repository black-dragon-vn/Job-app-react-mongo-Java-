import { Avatar } from "@mantine/core";
import { work } from "../Data/Data";
const Working = () => {
    return (
        <div className="mt-20 mb-20">
            <div className="text-5xl font-semiboldn text-center mb-10">
                <span className="text-amber-500"> How it </span>
                Works
            </div>
            <div>
                <div className="text-lg text-mine-600 text-center mb-10  w-3/5 mx-auto">
                    Discover how JobNect connects job seekers with their dream careers through a seamless and efficient process.
                </div>
            </div>
            <div className="flex px-16  items-center gap-20 ">
                <div className="relative">
                    <img className="w-[40rem]" src="/images/cutecat.png" alt="" />
                    <div className="w-40 absolute flex flex-col items-center  gap-2 mt-4 mx-auto  p-4  rounded-xl backdrop-blur-lg bg-gradient-to-r from-white/20 via-cyan-200/20 border border-white/20  shadow-[0_0_30px_rgba(255,255,255,0.3)] top-2 right-1 pearl-cursor">
                        <Avatar src="images/cat1.jpg" alt="progress"  className="!h-20 !w-20"/>
                        <div className="text-l text-center font-semibold text-mine-shaft-200">Complete your profile</div>
                        <div className="text-m text-mine-shaft-300"> 70% Complete</div>
                    </div>
                </div>
                <div className="flex flex-col">
                    {
                        work.map((item) => (
                        <div key={item.id} className="flex items-center mb-8">
                        <div className="rounded-full w-12 h-12 flex justify-center items-center mb-4 mr-4 bg-amber-500"><img src={item.icon} alt={item.title} /></div>
                        <div>
                            <div className="font-semibold text-mine-shaft-200 text-2xl">{item.title}</div>
                            <div className="text-mine-shaft-300 font-semibold">{item.description}</div>
                        </div>
                    </div>
                        ))  
                    }
                </div>
            </div>
        </div>
    )
}


export default Working;