import { Avatar, Rating } from "@mantine/core";
import { testimonials } from "../Data/Data";

const Testimonials = () => {
    return (
        <div className="w-full mt-20 mb-20 px-10 flex flex-col text-center" >      
            <div className="text-5xl font-semiboldn text-center mb-10">
                What Our
                <span className="text-amber-500"> Users Say</span>
            </div>
            <div className="flex justify-evenly   flex-wrap gap-6 cards">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="flex flex-col gap-3 w-[23%]  border-amber-400 p-3 border rounded-xl mt-10 ">
                        <div className="flex gap-2 items-center ">
                            <Avatar src={testimonial.avatar} alt={testimonial.name}  className="!h-14 !w-14"/>
                            <div>
                                <div className="font-semibold text-mine-shaft-200">{testimonial.name}</div>
                                <Rating value={testimonial.rating} readOnly fractions={2} />
                            </div>
                        </div>
                        <div className="text-xs text-mine-shaft-300">{testimonial.testimonial}</div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default Testimonials;