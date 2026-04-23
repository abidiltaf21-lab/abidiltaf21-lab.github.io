
const SmooothPixelLogo = ({ className = "logo" }: { className?: string, light?: boolean }) => {
    return (
        <img 
            src="/assets/img/logo/Header_logo_.gif" 
            alt="Logo" 
            className={`smooothpixel-logo-wrapper ${className}`} 
            style={{ maxHeight: '60px', display: 'inline-block', width: 'auto' }} 
        />
    );
};

export default SmooothPixelLogo;
