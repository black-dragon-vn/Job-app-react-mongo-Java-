// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signupValidation = (name: string, value: string, formData?: any): string => {
    switch (name) {
        case "name":
            if (value.trim().length === 0) return "Name is required";
            if (value.trim().length < 2) return "Name must be at least 2 characters";
            if (value.trim().length > 50) return "Name must be less than 50 characters";
            // Optionally add more name validation
            // if (!/^[a-zA-Z\sÀ-ỹ]+$/.test(value)) return "Name can only contain letters and spaces";
            return "";

        case "email":
            if (value.trim().length === 0) return "Email is required";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
                return "Please enter a valid email address (e.g., example@domain.com)";
            }
            return "";

        case "password":
            if (value.length === 0) return "Password is required";

            // Check minimum length
            if (value.length < 8) return "Password must be at least 8 characters";

            // Check maximum length
            if (value.length > 15) return "Password must be less than 15 characters";

            // Check for lowercase letter
            if (!/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter";

            // Check for uppercase letter
            if (!/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter";

            // Check for number
            if (!/(?=.*\d)/.test(value)) return "Password must contain at least one number";

            // Check for special character
            if (!/(?=.*[@$!%*?&#])/.test(value)) return "Password must contain at least one special character (@$!%*?&#)";

            // All checks passed
            return "";

        case "confirmPassword":
            if (!value) return "Please confirm your password";
            if (value !== formData) return "Passwords do not match";
            return "";


        case "accountType":
            {
                if (!value || value.trim().length === 0) return "Please select an account type";
                const validTypes = ["APPLICANT", "EMPLOYER", "ADMIN"];
                if (!validTypes.includes(value)) return "Invalid account type selected";
                return "";
            }

        case "agreeTerms":
            if (!value) return "You must accept the terms and conditions";
            return "";

        default:
            return "";
    }
};

export const loginValidation = (name: string, value: string): string => {
    switch (name) {    
        case "email":
            if (value.trim().length === 0) return "Email is required";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
                return "Please enter a valid email address";
            }
            return "";
            
        case "password":
            if (value.length === 0) return "Password is required";
            if (value.length < 8) return "Password must be at least 8 characters";
            return "";
            
        default:
            return "";
    }
};