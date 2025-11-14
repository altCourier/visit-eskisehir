import styles from "../../Hotels/Hotels.module.css";

export default function HotelCard({ hotel }) {
    const goToDetails = () => {
        // Use an anchor tag for navigation hash change to maintain button styling integrity
        // This function will likely be called by the View Details button or the card click listener
        if (!hotel || !hotel.hotel_id) {
            console.error("Cannot navigate: Hotel object or ID is missing.", hotel);
            return; // Exit the function if data is missing
        }

        window.location.hash = `hotel-details?id=${hotel.hotel_id}`;
    };

    return (
        // 1. Use styles.hotelCard for the outermost container
        <div className={styles.hotelCard}>
            {/* 2. Use styles.hotelImage for the photo */}
            <img
                src={hotel.max_photo_url}
                alt={hotel.hotel_name}
                className={styles.hotelImage}
            />

            {/* 3. Wrap content in styles.hotelContent */}
            <div className={styles.hotelContent}>
                {/* 4. Use styles.hotelName for the title */}
                <h3 className={styles.hotelName}>{hotel.hotel_name}</h3>

                {/* 5. Use styles.hotelAddress for the address */}
                <p className={styles.hotelAddress}>{hotel.address}</p>

                {/* 6. Use styles.hotelMeta for the rating info for consistent placement */}
                <div className={styles.hotelMeta}>
                    <p style={{ margin: 0 }}>
                        ⭐ {hotel.review_score} ({hotel.review_nr} reviews)
                    </p>
                </div>

                {/* 7. Use styles.hotelPrice for the price */}
                <p className={styles.hotelPrice}>
                    From: ₺{Math.round(hotel.min_total_price)}
                </p>

                {/* 8. Use styles.detailsBtn for the button and bind navigation to it */}
                <button
                    className={styles.detailsBtn}
                    onClick={goToDetails}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}