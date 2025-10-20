import styles from './Card.module.css';

const Card = ({ title, description, image }) => {

    return (

        <div className = {styles.card}>
            {
                image && (
                    <div className = {styles.imageContainer}>
                        <img
                    src={image}
                    alt={title}
                    className= {styles.image} />
                    </div>
                )
            }

            <div className = {styles.content}>
                <h3 className = {styles.title}> {title} </h3>
                <p className = {styles.description}> {description} </p>
            </div>
        </div>
    );
}

export default Card;