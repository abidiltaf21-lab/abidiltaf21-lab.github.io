
const SmooothPixelLogo = ({ className = "logo" }: { className?: string, light?: boolean }) => {
    return (
        <img 
            src="/assets/img/logo/Header_logo_.gif" 
            alt="Logo" 
            className={`smooothpixel-logo-wrapper ${className}`} 
            style={{ maxHeight: '200px', display: 'inline-block' }} 
        />
    );
};

export default SmooothPixelLogo;
