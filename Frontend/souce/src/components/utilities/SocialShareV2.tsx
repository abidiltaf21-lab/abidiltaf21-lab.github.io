import { Link } from "react-router-dom";

const SocialShareV2 = () => {
    return (
        <>
            <li className='facebook'>
                <Link to="http://facebook.com" target='_blank'><i className="fab fa-facebook-f"></i></Link>
            </li>
            <li className='twitter'>
                <Link to="http://twitter.com" target='_blank'><i className="fab fa-twitter"></i></Link>
            </li>
            <li className='pinterest'>
                <Link to="http://pinterest.com" target='_blank'> <i className="fab fa-pinterest-p"></i></Link>
            </li>
            <li className='linkedin'>
                <Link to="http://linkedin.com" target='_blank'><i className="fab fa-linkedin-in"></i></Link>
            </li>
        </>
    );
};

export default SocialShareV2;