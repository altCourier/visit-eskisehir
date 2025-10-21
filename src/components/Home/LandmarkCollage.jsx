import React, { useState } from "react";
import styles from './LandmarkCollage.module.css';

import odunpazari from '../../assets/images/odunpazari-evleri.jpg';
import omm from '../../assets/images/omm-museum.jpg';
import plane from '../../assets/images/plane.jpg';
import sazova from '../../assets/images/sazova-tower.jpg';
import seyit from '../../assets/images/seyit-battal-kulliye.jpg';
import wax from '../../assets/images/wax-museum.jpg';

const LandmarkCollage = React.forwardRef((props, ref) => {

    const [activeIndex, setActiveIndex] = useState(0);

    const landmarks = [
        {
            id: 1,
            title: "Odunpazarı Houses",
            description: "Historic Ottoman-era houses with colorful architecture in the heart of Eskişehir.",
            image: odunpazari,
        },
        {
            id: 2,
            title: "OMM Museum",
            description: "Modern Odunpazarı Museum showcasing contemporary art and glass works.",
            image: omm
        },
        {
            id: 3,
            title: "Aviation Museum",
            description: "Turkey's largest aviation museum featuring historic aircraft and aviation history.",
            image: plane
        },
        {
            id: 4,
            title: "Sazova Tower",
            description: "Iconic tower in Sazova Park offering panoramic views of the city.",
            image: sazova
        },
        {
            id: 5,
            title: "Seyit Battal Gazi",
            description: "Historic complex and tomb of the legendary warrior saint Seyit Battal Gazi.",
            image: seyit
        },
        {
            id: 6,
            title: "Wax Museum",
            description: "Turkey's first wax museum featuring life-like figures of historical personalities.",
            image: wax
        }
    ];

    return (
        <div className ={styles.collageContainer} ref = {ref}>
            <h1 className = {styles.header}> Eskişehir </h1>

            <p className = {styles.subtitle}>
                Discover the cultural treasures and modern attractions of Eskişehir, where history meets contemporary Turkish culture.
            </p>

            <div className={styles.collageWrapper}>

                {landmarks.map((landmark, index) => (

                    <div
                        key={landmark.id}
                        className = {`${styles.panel} ${activeIndex === index ? styles.active : ''}`}
                        onClick={() => setActiveIndex(index)}
                    >
                        <img
                            src={landmark.image}
                            alt={landmark.title}
                            className ={styles.panelImage}
                        />

                        <div className ={styles.panelLabel}>
                            {landmark.title}
                        </div>

                        <div className= {styles.panelContent}>

                            <h3 className= {styles.panelTitle}>{landmark.title}</h3>
                            <p className = {styles.panelDescription}>{landmark.description}</p>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default LandmarkCollage;