import { 
  IconSearch, 
  IconMapPin, 
  IconBriefcase, 
  IconChartBar,
  IconClock
} from "@tabler/icons-react";

export const searchFields = [
  {
    title: "Job Title",
    icon: IconSearch,
    options: [ 
      "Software Engineer", "Frontend Developer", "Backend Developer",
      "Full Stack Developer", "DevOps Engineer", "Data Scientist",
      "Product Manager", "UX/UI Designer", "Mobile Developer",
      "QA Engineer", "Cloud Architect", "Security Engineer"
    ]
  },
  {
    title: "Location",
    icon: IconMapPin,
    options: ['Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Chicago, IL', 'Osaka', 'Tokyo', 'Ha Noi', "Remote", "Hybrid", "On-site",
            "Silicon Valley", "New York", "London",
            "Berlin", "Tokyo", "Singapore",
            "Sydney", "Toronto", "Paris",
            "Bangalore", "Dubai", "Ho Chi Minh City",
            "Hanoi", "Seoul", "Shanghai"]
  },
  {
    title: "Skills",
    icon: IconBriefcase,
    options:['Java','JavaScript', 'TypeScript', 'React', 'Node.js', 'Python','C', 'Django', 'Docker', 'Kubernetes', 'UI/UX Design',
       "Vue.js","Spring Boot", "AWS", "Docker", "Kubernetes", "MongoDB", "PostgreSQL",
      "Machine Learning", "Figma", "Agile", "Git", "GraphQL"]
  },
  {
    title: "Job Type",
    icon: IconClock,
    options: [
      "Full Time", "Part Time", "Contract",
      "Internship", "Freelance", "Remote"
    ]
  },
  {
    title: "Experience",
    icon: IconChartBar,
    options:['Internship', 'Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive']
  }
];
export const talents = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Senior Frontend Developer",
    company: "Google",
    location: "San Francisco, USA",
    experience: "8 years",
    hourlyRate: 85,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    topSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    about: "Specialized in building scalable web applications with modern frontend technologies. Passionate about UX/UI and performance optimization."
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Product Designer",
    company: "Apple",
    location: "Cupertino, USA",
    experience: "6 years",
    hourlyRate: 75,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
    topSkills: ["Figma", "User Research", "Prototyping", "Design Systems", "UI/UX"],
    about: "Award-winning product designer with expertise in creating intuitive user experiences for mobile and web platforms."
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    role: "DevOps Engineer",
    company: "Amazon Web Services",
    location: "Seattle, USA",
    experience: "7 years",
    hourlyRate: 95,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w-400&h=400&fit=crop",
    topSkills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
    about: "Cloud infrastructure specialist focusing on scalable, secure, and highly available systems."
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Data Scientist",
    company: "Netflix",
    location: "Los Angeles, USA",
    experience: "5 years",
    hourlyRate: 90,
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
    topSkills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Data Analysis"],
    about: "ML engineer passionate about recommendation systems and predictive analytics for entertainment platforms."
  },
  {
    id: 5,
    name: "Kenji Tanaka",
    role: "iOS Developer",
    company: "Spotify",
    location: "Stockholm, Sweden",
    experience: "9 years",
    hourlyRate: 80,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    topSkills: ["Swift", "SwiftUI", "iOS SDK", "UIKit", "Core Data"],
    about: "Senior iOS developer with extensive experience in building music streaming applications."
  },
  {
    id: 6,
    name: "Olivia Wilson",
    role: "UX Researcher",
    company: "Meta",
    location: "London, UK",
    experience: "4 years",
    hourlyRate: 70,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    topSkills: ["User Testing", "A/B Testing", "Qualitative Research", "Data Synthesis", "Workshop Facilitation"],
    about: "UX researcher focused on understanding user behavior and translating insights into product improvements."
  },
  {
    id: 7,
    name: "David Kim",
    role: "Backend Engineer",
    company: "Airbnb",
    location: "Tokyo, Japan",
    experience: "10 years",
    hourlyRate: 100,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    topSkills: ["Node.js", "Go", "PostgreSQL", "Redis", "Microservices"],
    about: "Backend specialist with expertise in high-traffic systems and distributed architecture."
  },
  {
    id: 8,
    name: "Aisha Mohammed",
    role: "Security Engineer",
    company: "Tesla",
    location: "Austin, USA",
    experience: "8 years",
    hourlyRate: 110,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    topSkills: ["Cybersecurity", "Penetration Testing", "Network Security", "Cryptography", "IoT Security"],
    about: "Security expert specializing in automotive and IoT device security."
  },
  {
    id: 9,
    name: "Carlos Silva",
    role: "Full Stack Developer",
    company: "GitHub",
    location: "Remote",
    experience: "6 years",
    hourlyRate: 85,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    topSkills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    about: "Versatile full-stack developer passionate about open-source and developer tools."
  },
  {
    id: 10,
    name: "Elena Petrova",
    role: "Product Manager",
    company: "Microsoft",
    location: "Redmond, USA",
    experience: "12 years",
    hourlyRate: 120,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    topSkills: ["Product Strategy", "Agile", "Roadmapping", "Stakeholder Management", "Data-Driven Decisions"],
    about: "Strategic product leader with experience scaling enterprise software products."
  },
  {
    id: 11,
    name: "James Lee",
    role: "Cloud Architect",
    company: "IBM",
    location: "Sydney, Australia",
    experience: "11 years",
    hourlyRate: 115,
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005-128?w=400&h=400&fit=crop",
    topSkills: ["Azure", "Cloud Migration", "System Design", "Infrastructure as Code", "DevOps"],
    about: "Cloud solutions architect helping enterprises transition to cloud-native architectures."
  },
  {
    id: 12,
    name: "Maya Patel",
    role: "AI/ML Engineer",
    company: "OpenAI",
    location: "San Francisco, USA",
    experience: "7 years",
    hourlyRate: 130,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
    topSkills: ["Python", "PyTorch", "Natural Language Processing", "Computer Vision", "Deep Learning"],
    about: "AI researcher focused on large language models and ethical AI development."
  },
  {
    id: 13,
    name: "Thomas Müller",
    role: "Blockchain Developer",
    company: "Coinbase",
    location: "Berlin, Germany",
    experience: "5 years",
    hourlyRate: 140,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    topSkills: ["Solidity", "Web3.js", "Ethereum", "Smart Contracts", "DeFi"],
    about: "Blockchain specialist building decentralized applications and financial protocols."
  },
  {
    id: 14,
    name: "Sophie Williams",
    role: "QA Automation Engineer",
    company: "Adobe",
    location: "Toronto, Canada",
    experience: "4 years",
    hourlyRate: 65,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    topSkills: ["Selenium", "Cypress", "Jest", "Test Automation", "Performance Testing"],
    about: "Quality assurance expert ensuring software reliability through automated testing."
  },
  {
    id: 15,
    name: "Rahul Gupta",
    role: "Technical Writer",
    company: "GitLab",
    location: "Bangalore, India",
    experience: "3 years",
    hourlyRate: 55,
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop",
    topSkills: ["Technical Documentation", "API Guides", "Tutorials", "Markdown", "Git"],
    about: "Technical communicator simplifying complex concepts for developers and end-users."
  },
    {
    id: 16,
    name: "Nguyễn Minh Anh",
    role: "Frontend Developer",
    company: "Tiki",
    location: "Ho Chi Minh City, Vietnam",
    experience: "4 years",
    hourlyRate: 45,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    topSkills: ["React", "Vue.js", "JavaScript", "CSS", "Responsive Design"],
    about: "Frontend developer specializing in e-commerce platforms and user interface development."
  },
  {
    id: 17,
    name: "Trần Quốc Bảo",
    role: "Backend Developer",
    company: "MoMo",
    location: "Hanoi, Vietnam",
    experience: "6 years",
    hourlyRate: 50,
    avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=400&fit=crop",
    topSkills: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "Docker"],
    about: "Backend engineer with expertise in financial technology and payment systems."
  },
];
export const profile = {
  name: "Jarod Wood",
  jobTitle: "Software Engineer",
  company: "Google",
  location: "New York, United States",
  about: "Software Engineer with over 5 years of experience building scalable web applications. Passionate about React, UI/UX, and system performance optimization.",
  banner: "https://cdn.hstatic.net/files/1000290074/article/tet-2044_0a468ca068de4101a7995d82067ddf22.jpg",
  avatar: "/images/cutecat.png",

  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
    "MongoDB",
    "GraphQL",
  ],

  experience: [
    {
      role: "Senior Software Engineer",
      company: "Google",
      period: "2021 - Present",
      description:
        "Develop and optimize web products serving millions of users. Work extensively with React, GraphQL, and Cloud Services.",
    },
    {
      role: "Frontend Developer",
      company: "Meta",
      period: "2019 - 2021",
      description:
        "Build reusable UI components, optimize performance, and enhance user experience.",
    },
  ],

  certifications: [
    {
      name: "Google Professional Cloud Developer",
      issuer: "Google",
      year: "2023",
    },
    {
      name: "React Advanced Certification",
      issuer: "Meta",
      year: "2022",
    },
  ],
};

