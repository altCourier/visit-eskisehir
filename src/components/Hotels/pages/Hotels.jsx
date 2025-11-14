import { useState, useEffect } from "react";
import { getLocationByName, searchHotels } from "../api/booking";
import HotelList from "../components/HotelList.jsx";
import styles from "../Hotels.module.css";

export default function Hotels() {
    const [destId, setDestId] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDestId() {
            try {
                const data = await getLocationByName("Eskişehir");
                if (data && data.length > 0) setDestId(data[0].dest_id);
            } catch (err) {
                console.error("Failed to load location:", err);
            }
        }
        fetchDestId();
    }, []);

    useEffect(() => {
        if (!destId) return;

        async function fetchHotels() {
            try {
                const data = await searchHotels({
                    dest_id: destId,
                    dest_type: "city",
                    checkin_date: "2025-11-21",
                    checkout_date: "2025-11-30",
                    adults_number: "2",
                    room_number: "1",
                    units: "metric",
                    order_by: "popularity",
                    filter_by_currency: "TRY",
                    locale: "en-gb"
                });

                setHotels(data.result || []);
            } catch (err) {
                console.error("Failed to load Eskişehir hotels:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchHotels();
    }, [destId]);

    return (
        <section className={styles.hotelsContainer}>

            {/* 1. HEADER (Moved outside of .hotelLayout to span full width) */}
            <div className={styles.hotelsHero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.headerTitle}>Hotels in Eskişehir</h1>
                    <p className={styles.heroSubtitle}>
                        Explore the best places to stay in the beautiful city of Eskişehir.
                    </p>

                    <button
                        className={styles.backButton}
                        onClick={() => (window.location.hash = "home")}
                    >
                        ⬅ Back to Home
                    </button>
                </div>
            </div>

            {/* 2. MAIN LAYOUT CONTAINER (Now only contains the main content) */}
            <div className={styles.hotelLayout}>
                {/* Hotel list wrapper */}
                <div className={styles.hotelsGrid}>
                    {loading ? (
                        <div className={styles.loadingState}>
                            <div className={styles.spinner}></div>
                            <p className={styles.loadingText}>Loading hotels...</p>
                        </div>
                    ) : hotels.length === 0 ? (
                        <div className={styles.noResults}>
                            <p className={styles.noHotels}>No hotels found in Eskişehir.</p>
                        </div>
                    ) : (
                        <HotelList hotels={hotels} />
                    )}
                </div>
            </div>
            {/* End of .hotelLayout */}

            {/* 3. FOOTER (Moved outside of .hotelLayout to span full width) */}
            <div className={styles.hotelsCta}>
                <p className={styles.footerText}>
                    © 2025 Visit Eskişehir — All Rights Reserved
                </p>
            </div>

        </section>
    );
}