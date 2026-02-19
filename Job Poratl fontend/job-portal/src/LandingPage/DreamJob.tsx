import { Avatar, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

const DreamJob = () => {
    return (
        <div className="flex items-center justify-between w-4/5 mt-20 mb-20 px-15">
            <div className="flex flex-col w-[45%] gap-3">
                <div className="text-6xl font-bold leading-tight">
                    <span>Find your </span>
                    <span className="text-amber-500">dream </span>                   
                    <span className="text-amber-500">job </span>
                    <span className="text-cyan-400">with us</span>
                </div>
                <div className="text-lg text-mine-600">Good life begins with a good company. Start exploring thousands of jobs in one place</div>
                <div className="flex gap-3 mt-5">
                    <TextInput variant="unstyled" placeholder="Software Engineer"  label ='Job Title ' className="bg-mine-shaft-900 rounded-lg p-2 px-4 text-mine-shaft-100 [$_input]:focus:ring-1 focus:outline-none "/>
                    <TextInput variant="unstyled" placeholder="Full Time"  label ='Job Type ' className="bg-mine-shaft-900 rounded-lg p-2 px-4 text-mine-shaft-100 [$_input]:focus:ring-1 focus:outline-none "/>    
                    <div className="flex items-center justify-center h-full w-20 bg-cyan-400 text-mine-shaft-900 cursor-pointer card rounded-lg p-2 px-4 hover:bg-cyan-100 coursor-pointer transition-colors duration-300">
                        <IconSearch className=" h-[85%]  w-[85%] "/>
                    </div>  
                </div>
                
            </div>
            <div className="w-[55%]  flex flex-col items-center relative">
                <img src="images/cute not background.png" alt="character" className="w-full h-full object-cover" />
                <div className="absolute w-fit top-[47%] left-[30px] rounded-xl backdrop-blur-lg bg-gradient-to-r from-white/20 via-cyan-200/20 border border-white/20  shadow-[0_0_30px_rgba(255,255,255,0.3)] p-4 flex flex-col items-center  pearl-cursor">
                    <div className="text-center mb-1 text-mine-shaft-100">10K+ got jobs</div>

                    <Avatar.Group>
                        <Avatar src="https://i.pravatar.cc/150?img=1" alt="Avatar 1" radius="xl" />
                        <Avatar src="https://i.pravatar.cc/150?img=2" alt="Avatar 2" radius="xl" />
                        <Avatar src="images/cute1.png" alt="Avatar 3" radius="xl" />
                        <Avatar>+9k</Avatar>
                        
                    </Avatar.Group>
                </div>
                <div className="absolute w-fit top-[90%] right-5 rounded-xl backdrop-blur-lg bg-gradient-to-r from-white/20 via-amber-200/20  border border-white/20  shadow-[0_0_30px_rgba(255,255,255,0.3)]  flex flex-col items-center pearl-cursor">
                    <div className="flex gap-2 items-center mb-1 p-3">
                        <div className="w-24 h-24 p-1">
                            <img src="images/google.png" alt="Google logo" />
                        </div>
                        <div className="text-xl text-mine-shaft-100 ">
                            <div>Software Engineer</div>
                            <div className="text-mine-shaft-200  " >Tokyo</div>
                        </div>
                       
                    </div>
                    <div className="flex gap-5 text-mine-shaft-200  ">
                        <span>1 days ago</span><span>20 Applicants</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DreamJob;