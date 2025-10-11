/**
 * Formats a date and time string to a human-readable format.
 * @param isoString - The date and time string in ISO format.
 * @returns {string} - The formatted date and time string.
 */
export const formatDateTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
    });
};

/**
 * Formats a date string to a human-readable format.
 * @param isoString - The date string in ISO format.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}