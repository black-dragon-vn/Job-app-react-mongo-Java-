import { IconBriefcase, IconChartBar, IconClock, IconMapPin, IconSearch } from "@tabler/icons-react";

// Helper function để loại bỏ duplicate
const uniqueArray = <T,>(arr: T[]): T[] => Array.from(new Set(arr));

const rawJobSearchFields = [
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
    options: [
      'Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 
      'Seattle, WA', 'Chicago, IL', 'Osaka', 'Tokyo', 'Ha Noi', 
      "Remote", "Hybrid", "On-site", "Silicon Valley", "New York", 
      "London", "Berlin", "Tokyo", "Singapore", "Sydney", "Toronto", 
      "Paris", "Bangalore", "Dubai", "Ho Chi Minh City", "Hanoi", 
      "Seoul", "Shanghai"
    ]
  },
  {
    title: "Skills",
    icon: IconBriefcase,
    options: [
      'Java','JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
      'C', 'Django', 'Docker', 'Kubernetes', 'UI/UX Design', "Vue.js",
      "Spring Boot", "AWS", "Docker", "Kubernetes", "MongoDB", "PostgreSQL",
      "Machine Learning", "Figma", "Agile", "Git", "GraphQL"
    ]
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
    options: [
      'Internship', 'Entry Level', 'Mid Level', 
      'Senior Level', 'Director', 'Executive'
    ]
  }
];

// ✅ TỰ ĐỘNG LOẠI BỎ DUPLICATE
export const jobSearchFields = rawJobSearchFields.map(field => ({
  ...field,
  options: uniqueArray(field.options)
}));