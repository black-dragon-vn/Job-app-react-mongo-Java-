import Marquee from "react-fast-marquee";
import { companies } from "../Data/Data";
const Companies = () => {
    return (
        <div className="mt-20 pb-20 ">
            <div className="text-5xl font-semiboldn text-center mb-10">
                Trust By
                <span className="text-amber-500"> 10000+</span>
                Companies
            </div>
            <Marquee pauseOnHover={true} speed={100} gradient={false}>
                {companies.map((company) => (
                    <div key={company.id} className="mx-8 px-4 flex items-center justify-center py-1 hover:scale-110 transition-transform duration-300 cursor-pointer text-white">
                        <img src={company.logo} alt={company.name} className="h-14 w-auto" />
                    </div>
                ))}
            </Marquee>

        </div>
    )
}

export default Companies;