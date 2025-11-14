import React from 'react';
import styles from './IntroHotels.module.css'; // Assuming you create a new CSS file

const IntroHotels = () => {

    const handleHotelNav = () => {
        window.location.hash = 'hotels';

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    };

    return (
        <section className={styles.introHotelsSection}>
            <div className={styles.contentWrapper}>
                <h2 className={styles.title}>Ready to book your stay?</h2>
                <p className={styles.subtitle}>
                    Check out the best accommodations Eskişehir has to offer.
                </p>
                <button
                    className={styles.ctaButton}
                    onClick={handleHotelNav}
                >
                    View Hotels & Book Now →
                </button>
            </div>
        </section>
    );
}

export default IntroHotels;