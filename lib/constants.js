export const MAX_FILE_SIZE = 5 * 1024 * 1024 


export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const ERROR_MESSAGES = {
    INVALID_IMAGE_FORMAT: "Invalid image format. Use JPG, PNG, or WebP",
    IMAGE_SIZE_EXCEEDED: "Image size must be less than 5MB",
    INVALID_RATING_LIMIT: "Rating must be between 1 and 5 starts",
    COMMENT_LIMIT_EXCEEDED: "Comment must be less than 500 character",
}

export const CUISINES = [
    { value: '', label: 'All Cuisines' },
    { value: 'ITALIAN', label: 'Italian' },
    { value: 'CHINESE', label: 'Chinese' },
    { value: 'MEXICAN', label: 'Mexican' },
    { value: 'INDIAN', label: 'Indian' },
    { value: 'JAPANESE', label: 'Japanese' },
    { value: 'THAI', label: 'Thai' },
    { value: 'AMERICAN', label: 'American' },
    { value: 'FRENCH', label: 'French' },
    { value: 'MEDITERRANEAN', label: 'Mediterranean' },
    { value: 'OTHER', label: 'Other' }
]
