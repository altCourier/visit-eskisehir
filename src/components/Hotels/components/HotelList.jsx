import HotelCard from "./HotelCard.jsx";
import styles from "../../Hotels/Hotels.module.css";

/**
 * Renders the list of hotel cards, handling loading, error, and empty states.
 * * @param {Array<Object>} hotels - The array of hotel data to display.
 * @param {boolean} isLoading - True if the API request is currently in flight.
 * @param {string|null} error - A string message if an API error occurred.
 */
export default function HotelList({ hotels, isLoading, error }) {

    // --- 1. ERROR STATE CHECK ---
    if (error) {
        return (
            <div className={styles.errorState}>
                <p>⚠️ **An error occurred fetching data:**</p>
                <p>{error}</p>
                <p style={{ fontSize: '0.9rem' }}>Please check your network connection or API credentials.</p>
            </div>
        );
    }

    // --- 2. LOADING STATE CHECK ---
    if (isLoading) {
        return (
            <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Searching for the best hotels...</p>
            </div>
        );
    }

    // --- 3. EMPTY DATA CHECK ---
    // If we're not loading and there's no error, but the data is missing or empty.
    const isDataValid = Array.isArray(hotels) && hotels.length > 0;

    if (!isDataValid) {
        return (
            <div className={styles.errorState}>
                <p>😔 **Content unavailable. No hotels were found.**</p>
                <p style={{ fontSize: '0.9rem' }}>Try broadening your search criteria or selecting a different city.</p>
            </div>
        );
    }

    // --- 4. SUCCESS STATE: RENDER HOTELS ---
    return (
        <div className={styles.hotelGrid}>
            {hotels.map((hotel) => (
                <HotelCard
                    // Crucial check: Only use the ID if it exists for the key
                    key={hotel.hotel_id || hotel.name}
                    hotel={hotel}
                />
            ))}
        </div>
    );
}