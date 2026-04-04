import { useEffect } from 'react';

const BodyDark = () => {

    useEffect(() => {
        document.body.classList.add('bg-dark');

        return () => {
            document.body.classList.remove('bg-dark');
        };
    }, []);

    return (
        <>

        </>
    );
};

export default BodyDark;