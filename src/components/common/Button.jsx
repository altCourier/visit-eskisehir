import styles from './Button.module.css';

const Button = ( {text, onClick, type = "button", className = "" } ) => {

    return (

        <button
            className = {`${styles.button} ${className}`}
            onClick = {onClick}
            type = {type}
        >
            {text}
        </button>
    );
};

export default Button;