const Preloader = () => {
    return (
        <>
            <div className="preloader">
                <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    <path id="preloaderSvg" d="M0,1005S175,995,500,995s500,5,500,5V0H0Z" />
                </svg>
                <div className="preloader-heading">
                    <div className="load-text">
                        <img 
                            src="/assets/img/logo/Loader.gif" 
                            alt="Loading" 
                            style={{ 
                                width: "100%",
                                maxWidth: "800px", 
                                maxHeight: "800px", 
                                objectFit: "contain",
                                margin: "0 auto",
                                display: "block",
                                position: "relative",
                                zIndex: 999 
                            }} 
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Preloader;