/** Budget ranges shown on the public contact form. */
export const CONTACT_BUDGET_OPTIONS = [
    { value: '', label: 'Estimated budget (optional)' },
    { value: 'Under $500', label: 'Under $500' },
    { value: '$500 – $1,000', label: '$500 – $1,000' },
    { value: '$1,000 – $2,500', label: '$1,000 – $2,500' },
    { value: '$2,500 – $5,000', label: '$2,500 – $5,000' },
    { value: '$5,000 – $10,000', label: '$5,000 – $10,000' },
    { value: '$10,000+', label: '$10,000+' },
    { value: 'Not sure yet', label: 'Not sure yet' },
] as const;
