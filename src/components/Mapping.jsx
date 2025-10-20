import React from 'react';
import styles from './Mapping.module.css';

const Mapping = () => {

    return (

        <div className = {styles.mappingContainer}>

            <div className = {styles.textSection}>

                <h2 className = {styles.title}> Eskişehir is reachable from anywhere. </h2>

            </div>

            <div className ={styles.mapSection}>

                <iframe
                    src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d785110.4698755013!2d30.520882!3d39.776667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34e956f7a5fcd%3A0x82ed06e0bb2f0b5d!2zRXNracWfZWhpciwgVHVya2V5!5e0!3m2!1sen!2str!4v1234567890"
                    className = {styles.map}
                    allowFullScreen = {true}
                    loading = "lazy"
                    referrerPolicy = "no-referrer-when-downgrade"
                    title = "Eskişehir Location Map"
                ></iframe>

            </div>

        </div>
    );
};

export default Mapping;