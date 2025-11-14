import styles from './Navbar.module.css';
import {useState, useEffect} from 'react'

const Navbar = () => {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {

        const handleScroll = () => {

            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);

    }, []);

    return (
        <nav className = {`${styles.navbar} ${isVisible ? styles.navbarVisible : ''}`}>

            <a href="#home" className={styles.siteTitle}> Visit Eskişehir </a>

            <ul>
                <li>
                    <a href="#hotels" className={styles.navLink}> Hotels </a>
                </li>
                <li>
                    <a href="#about" className={styles.navLink}> About </a>
                </li>
                <li>
                    <a href="#weather-details" className={styles.navLink}> Weather </a>
                </li>
            </ul>

        </nav>
    )
}

export default Navbar;

