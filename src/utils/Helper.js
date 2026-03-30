export const formValidation = (formValues) => {
    if (!formValues.email && !formValues.password) return 'Email and Password are required';
    if (!formValues.email) return 'Email is required';
    if (!formValues.password) return 'Password is required';
    return true;
}

export const showToast = (toast, type, summary, message) => {
    return toast.add({
        severity: type, // success, info, warn, error
        summary: summary,
        detail: message,
        life: 3000, // Time in milliseconds
    });
}

export const emitAppToast = (type, summary, message, life = 3000) => {
    window.dispatchEvent(new CustomEvent('app-toast', {
        detail: {
            severity: type,
            summary,
            detail: message,
            life,
        },
    }));
}

const PASSWORD_REQUIREMENTS_MESSAGE =
    "Password must be at least 12 characters and include uppercase, lowercase, number, and special character, with no spaces.";

export const validateModernPassword = (password, context = {}) => {
    const value = (password || "").trim();

    if (!value) return "Please enter your password";
    if (
        value.length < 12 ||
        /\s/.test(value) ||
        !/[a-z]/.test(value) ||
        !/[A-Z]/.test(value) ||
        !/\d/.test(value) ||
        !/[^A-Za-z0-9]/.test(value)
    ) {
        return PASSWORD_REQUIREMENTS_MESSAGE;
    }

    const email = (context.email || "").toLowerCase().trim();
    if (email) {
        const localPart = email.split("@")[0];
        if (localPart && value.toLowerCase().includes(localPart)) {
            return `${PASSWORD_REQUIREMENTS_MESSAGE} It also cannot contain your email name.`;
        }
    }

    if (context.currentPassword && value === context.currentPassword) {
        return "New password must be different from your current password";
    }

    return true;
}

const tempMailDomains = new Set([
    "mailinator.com", "tempmail.com", "10minutemail.com", "yopmail.com",
    "guerrillamail.com", "trashmail.com", "getnada.com", "maildrop.cc"
]);

export const validateBusinessEmail = (email, fieldName = "Email") => {
    const value = (email || "").trim().toLowerCase();
    if (!value) return `${fieldName} is required`;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return `Please enter a valid ${fieldName.toLowerCase()}`;

    const domain = value.split("@")[1];
    if (tempMailDomains.has(domain)) {
        return `${fieldName} cannot use a temporary or disposable email domain`;
    }

    return true;
}
