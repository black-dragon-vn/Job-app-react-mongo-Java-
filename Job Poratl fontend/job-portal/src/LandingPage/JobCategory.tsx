import { Carousel } from '@mantine/carousel';
import { jobCategories } from '../Data/Data';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
const JobCategory = () => {
    return (
        <div className="mt-20 mb-20">
            <div className="text-5xl font-semiboldn text-center mb-10">
                Browse
                <span className="text-amber-500"> Job</span>
                Category
            </div>
            <div>
                <div className="text-lg text-mine-600 text-center mb-10  w-3/5 mx-auto">
                    Explore jobs across various industries and find the perfect fit for your skills and interests.
                </div>
            </div>
            <Carousel
                slideSize="25%"
                slideGap="md"
                className="
                    px-10
                    focus-visible:[&_button]:!outline-none
                    [&_button]:!border-none
                    [&_button]:opacity-0
                    [&_button]:pointer-events-none
                    hover:[&_button]:opacity-100
                    hover:[&_button]:pointer-events-auto
                    [&_button]:transition-opacity
                    [&_button]:duration-200
                "
                nextControlIcon={<IconArrowRight className="h-8 w-8" />}
                previousControlIcon={<IconArrowLeft className="h-8 w-8" />}
                >

                {  jobCategories.map((category) => (
                    <Carousel.Slide key={category.id}>
                        <div className="bg-mine-shaft-800 p-6 rounded-lg text-center hover:shadow-[0_4px_12px_rgba(255,193,7,0.5)] transition-shadow duration-300 cursor-pointer hover:scale-105 relative">
                            <h3 className="text-2xl font-semibold mb-2">{category.name}</h3>
                            <div className="text-amber-400">{category.jobs}+ new job posted</div>
                            <img src={category.image} alt={category.name} className="h-50 w-auto mx-auto mt-4" />
                            <div className="absolute top-4 left-4 text-2xl">
                                {category.icon}
                            </div>
                            <div className="mt-4 text-gray-300">{category.description}</div>
                        </div>
                    </Carousel.Slide>
                ))}
            </Carousel>
            
            
        </div>
    )
}            
export default JobCategory;