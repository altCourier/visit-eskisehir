import { useEffect, useState } from "react";
import { getHotelDetails, getHotelPhotos } from "../api/booking";
import styles from "../Hotels.module.css";

export default function HotelDetails({ hotelId: propId }) {
    const [details, setDetails] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hotelName, setHotelName] = useState("Loading Hotel...");

    // NEW STATE: Tracks the index of the currently viewed photo in the lightbox
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(null);

    // Fallback: read ID from hash
    const hotelId = propId || window.location.hash.replace("#hotel-", "");

    useEffect(() => {
        async function load() {
            setLoading(true);

            try {
                const descData = await getHotelDetails(hotelId);
                const photoData = await getHotelPhotos(hotelId);

                setDetails(descData);

                if (photoData && photoData.hotel_name) {
                    setHotelName(photoData.hotel_name);
                }
                setPhotos(Array.isArray(photoData) ? photoData : (photoData?.photos || []));

            } catch (err) {
                console.error("Hotel details load failed:", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [hotelId]);

    // Handlers for the Lightbox functionality
    const handlePhotoClick = (index) => {
        setCurrentPhotoIndex(index); // Set the index of the clicked photo
    };

    const closeViewer = () => {
        setCurrentPhotoIndex(null); // Close by resetting the index
    };

    // NEW: Navigation functions for previous/next photos
    const showPreviousPhoto = (e) => {
        e.stopPropagation(); // Prevent closing lightbox when clicking button
        setCurrentPhotoIndex((prevIndex) =>
            (prevIndex - 1 + photos.length) % photos.length
        );
    };

    const showNextPhoto = (e) => {
        e.stopPropagation(); // Prevent closing lightbox when clicking button
        setCurrentPhotoIndex((prevIndex) =>
            (prevIndex + 1) % photos.length
        );
    };


    // --- CONDITIONAL RENDERING ---

    if (loading) return (
        <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading hotel details...</p>
        </div>
    );
    if (!details) return (
        <div className={styles.errorState}>
            <p>Hotel details unavailable.</p>
        </div>
    );

    // Determine the URL for the currently selected photo in the lightbox
    const selectedPhotoUrl = currentPhotoIndex !== null && photos[currentPhotoIndex]
        ? (photos[currentPhotoIndex].url_max || photos[currentPhotoIndex].url_original)
        : null;

    return (
        <>
            {/* LIGHTBOX/MODAL RENDERING */}
            {selectedPhotoUrl && (
                <div className={styles.lightboxOverlay} onClick={closeViewer}>
                    <div className={styles.lightboxContent}>
                        <button className={styles.lightboxClose} onClick={closeViewer}>X</button>

                        {/* Previous Button */}
                        <button
                            className={`${styles.lightboxNavButton} ${styles.prevButton}`}
                            onClick={showPreviousPhoto}
                            aria-label="Previous photo"
                        >
                            &#10094; {/* Left arrow character */}
                        </button>

                        <img
                            src={selectedPhotoUrl}
                            alt={`Full-size image of ${hotelName} (${currentPhotoIndex + 1}/${photos.length})`}
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Next Button */}
                        <button
                            className={`${styles.lightboxNavButton} ${styles.nextButton}`}
                            onClick={showNextPhoto}
                            aria-label="Next photo"
                        >
                            &#10095; {/* Right arrow character */}
                        </button>
                    </div>
                </div>
            )}

            {/* MAIN DETAILS CONTENT */}
            <div className={styles.hotelDetailsContainer}>

                <h1 className={styles.hotelDetailsTitle}>
                    {hotelName}
                </h1>

                {photos.length > 0 && (
                    <img
                        src={photos[0].url_max || photos[0].url_original}
                        alt={`Main photo of ${hotelName}`}
                        className={styles.hotelDetailsImage}
                    />
                )}

                <h2>Description</h2>
                <p>{details.description || "No description available."}</p>

                <h2>Photos</h2>
                <div className={styles.hotelPhotoGrid}>
                    {photos.slice(0, 10).map((p, index) => ( // Use index for navigation
                        <img
                            key={p.photo_id}
                            onClick={() => handlePhotoClick(index)} // Pass the index
                            src={p.url_max || p.url_original}
                            alt={`Photo of ${hotelName}`}
                            className={styles.hotelDetailsThumb}
                        />
                    ))}
                </div>

                <button
                    className={styles.backButton}
                    onClick={() => (window.location.hash = "hotels")}
                >
                    ← Back to Hotels
                </button>
            </div>
        </>
    );
}