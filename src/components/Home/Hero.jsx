import styles from './Hero.module.css';

const Hero = ( {onExploreClick} ) => {

    return (

        <section className={styles.hero}>

            {/* Animated bg elements */}
            <div className={styles.bgBlob1}></div>
            <div className={styles.bgBlob2}></div>
            <div className={styles.bgBlob3}></div>


            {/* Main Content */}
            <div className={styles.heroContent}>

                <h1>
                    <span className={styles.visitText}>Visit</span>
                    <span className={styles.cityName}>ESKİŞEHİR</span>
                </h1>

                <p className={styles.subtitle}>
                    Discover the hidden gem of Turkey where tradition meets modernity
                </p>

                <button className={styles.ctaButton} onClick = {onExploreClick}>
                    Explore Now

                </button>
            </div>

            {/* Scroll indicator*/}
            <div className={styles.scrollIndicator}>
                <div className={styles.mouse}>
                    <div className={styles.wheel}></div>
                </div>
            </div>

        </section>

    );
};

export default Hero;