import { useNavigate } from 'react-router-dom';

// Convert author name to URL-safe format
export const getSafeAuthorName = (authorName) => {
    return authorName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[đĐ]/g, 'd') // Replace đ/Đ with d
        .replace(/[^a-z0-9]/g, '-') // Replace other special chars with hyphen
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

// Hook for handling author clicks
export const useAuthorClick = () => {
    const navigate = useNavigate();

    const handleAuthorClick = (authorName, e) => {
        if (e) {
            e.stopPropagation(); // Prevent event bubbling
        }

        const safeAuthorName = getSafeAuthorName(authorName);
        navigate(`/author/${safeAuthorName}`, {
            state: { originalAuthorName: authorName }
        });
    };

    return handleAuthorClick;
}; 