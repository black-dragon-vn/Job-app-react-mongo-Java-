const fields = [
    {
        label: "Job Title", type: "text", placeholder: "Enter job title", options: ['Developer', 'Designer', 'Manager', 'Analyst', 'Intern', 'Consultant', 'Engineer', 'Administrator', "Software Engineer", "Frontend Developer", "Backend Developer",
            "Full Stack Developer", "DevOps Engineer", "Data Scientist",
            "Product Manager", "UX/UI Designer", "Mobile Developer",
            "QA Engineer", "Cloud Architect", "Security Engineer"]
    },
    { label: "Company Name", type: "text", placeholder: "Enter company name", options: ['Google', 'Apple', 'Microsoft', 'Amazon', 'Facebook', 'Tiktok', 'NVIDIA', 'Dell', 'Tesla', 'Shopify'] },
    { label: "Experience", type: "select", placeholder: "Select experience level", options: ['Internship', 'Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'] },
    { label: "Job Type", type: "select", placeholder: "Select job type", options: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Volunteer'] },
    {
        label: "Location", type: "select", placeholder: "Select location", options: ['Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Chicago, IL', 'Osaka', 'Tokyo', 'Ha Noi', "Remote", "Hybrid", "On-site",
            "Silicon Valley", "New York", "London",
            "Berlin", "Tokyo", "Singapore",
            "Sydney", "Toronto", "Paris",
            "Bangalore", "Dubai", "Ho Chi Minh City",
            "Hanoi", "Seoul", "Shanghai"]
    },
    { label: "Salary Range", type: "select", placeholder: "Select salary range", options: ['$40,000 - $60,000', '$60,000 - $80,000', '$80,000 - $100,000', '$100,000 - $120,000', '$120,000+'] },
    {
        label: "Logo",
        type: "textarea",
        placeholder: "Enter job logo URL",
        options: [
            // Các URL Wikipedia thường có format chuẩn
            "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            "https://upload.wikimedia.org/wikipedia/commons/a/a9/TikTok_logo.png",
            "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
            "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
            "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
            "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",
            "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
            "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
            "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"

        ]
    }

    ,
    { label: "Skills Required", type: "multiselect", placeholder: "Select required skills", options: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Django', 'AWS', 'Docker', 'Kubernetes', 'Figma', 'UI/UX Design',
       "Vue.js","Spring Boot", "AWS", "Docker", "Kubernetes", "MongoDB", "PostgreSQL",
      "Machine Learning", "Figma", "Agile", "Git", "GraphQL"] },
    { label: "About", type: "textarea", placeholder: "Enter about the job/company" },
    { label: "Description", type: "textarea", placeholder: "Enter job description" },
];
const content =
    '<h2 style = "text-align:center;">Welcome to Mr Tuyen application</h2>' +
    '<p><code>if you want to work with me, please contact me via email: </code>' +
    '<ul><li>   Email:' +
    '<a href="mailto: tuyen.nguyen@example.com">tuyen.nguyen@example.com</a></li></ul>' +
    '<p><code>Mr Tuyen is a dedicated professional with a passion for technology and innovation. With a strong background in software development and a keen eye for detail, Mr Tuyen has successfully led numerous projects from conception to completion. His expertise lies in creating efficient, scalable, and user-friendly applications that meet the needs of diverse clients.</code></p>' +
    '<p>In addition to his technical skills, Mr Tuyen is known for his excellent communication and teamwork abilities. He thrives in collaborative environments and is always eager to share knowledge and learn from others. Outside of work, Mr Tuyen enjoys exploring new technologies, contributing to open-source projects, and staying up-to-date with industry trends.</p>' +
    '<p>Whether working on a small startup or a large enterprise project, Mr Tuyen approaches each challenge with enthusiasm and a commitment to excellence. He is always looking for new opportunities to grow professionally and make a positive impact in the tech community.</p>';


export { fields, content };
