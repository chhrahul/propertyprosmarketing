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

export const validateModernPassword = (password, context = {}) => {
    const value = (password || "").trim();

    if (!value) return "Please enter your password";
    if (value.length < 12) return "Password must be at least 12 characters long";
    if (/\s/.test(value)) return "Password cannot contain spaces";
    if (!/[a-z]/.test(value)) return "Password must include at least one lowercase letter";
    if (!/[A-Z]/.test(value)) return "Password must include at least one uppercase letter";
    if (!/\d/.test(value)) return "Password must include at least one number";
    if (!/[^A-Za-z0-9]/.test(value)) return "Password must include at least one special character";

    const email = (context.email || "").toLowerCase().trim();
    if (email) {
        const localPart = email.split("@")[0];
        if (localPart && value.toLowerCase().includes(localPart)) {
            return "Password should not contain your email name";
        }
    }

    if (context.currentPassword && value === context.currentPassword) {
        return "New password must be different from your current password";
    }

    return true;
}
