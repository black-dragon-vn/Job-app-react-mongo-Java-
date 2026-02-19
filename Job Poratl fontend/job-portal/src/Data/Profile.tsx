import {
  IconBriefcase,
  IconBuilding,
  IconMapPin,
  IconCode,
  IconCurrencyDollar,
  IconEPassport,
} from "@tabler/icons-react";

export const fields = [
  {
    name: "jobTitle",
    label: "Job Title",
    placeholder: "Select job title",
    options: [
      "Frontend Developer",
      "Backend Developer",
      "Fullstack Developer",
      "UI/UX Designer",
    ],
    value: "Frontend Developer",
    leftSection: IconBriefcase,
  },
  {
    name: "company",
    label: "Company",
    placeholder: "Select company",
    options: [
      "Google",
      "Microsoft",
      "Amazon",
      "Meta",
      "Netflix",
    ],
    value: "Google",
    leftSection: IconBuilding,
  },
  {
    name: "location",
    label: "Location",
    placeholder: "Select location",
    options: [
      "Tokyo",
      "Osaka",
      "Hanoi",
      "Ho Chi Minh City",
      "Remote",
    ],
    value: "Tokyo",
    leftSection: IconMapPin,
  },// Trong file Profile.ts hoặc nơi bạn định nghĩa fields
  {
    name: 'totalExp',
    label: 'Total Experience (Years)',
    type: 'number',
    placeholder: 'Enter years of experience',
    leftSection: IconEPassport
  },
  {
    name: "skill",
    label: "Main Skill",
    placeholder: "Select skill",
    options: [
      "React",
      "TypeScript",
      "Node.js",
      "Python",
      "Docker",
    ],
    value: "React",
    leftSection: IconCode,
  },
  {
    name: "salary",
    label: "Expected Salary",
    placeholder: "Select salary range",
    options: [
      "$1,000 - $2,000",
      "$2,000 - $3,000",
      "$3,000 - $4,000",
      "$4,000+",
    ],
    value: "$2,000 - $3,000",
    leftSection: IconCurrencyDollar,
  },
];
