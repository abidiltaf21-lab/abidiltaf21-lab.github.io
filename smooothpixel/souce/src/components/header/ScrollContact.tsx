import { Link } from 'react-scroll';

interface DataType {
    closeMenu?: () => void;
}

const ScrollContact: React.FC<DataType> = ({ closeMenu }) => {
    return (
        <>
            <li className='button'>
                <Link className="smooth-menu" to="contact" offset={-50} onClick={closeMenu}>{`Let's Talk`} <i className="fas fa-comment-alt" /></Link>
            </li>
        </>
    );
};

export default ScrollContact;