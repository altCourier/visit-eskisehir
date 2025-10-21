import React, { useState, useEffect } from "react";
import styles from './WikipediaAbout.module.css';

const WikipediaAbout = ({ topic }) => {

    const [summary, setSummary] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWikipediaSummary = async () => {
            setLoading(true);
            setError(null);

            const endpoint = 'https://en.wikipedia.org/w/api.php';

            const params = {
                action: 'query',
                format: 'json',
                prop: 'extracts',
                exintro: true,
                explaintext: true,
                piprop: 'thumbnail|original',
                redirects: 1,
                titles: topic,
                origin: '*',
            };

            const url = endpoint + '?' + new URLSearchParams(params);

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error: status ${response.status}`);
                }

                const data = await response.json();
                const pages = data.query.pages;
                const pageId = Object.keys(pages)[0];
                const page = pages[pageId];

                if (page.extract) {
                    setSummary(page.extract);
                } else {
                    setSummary(`No Wikipedia summary found for "${topic}".`);
                }

                if (page.thumbnail) {
                    setImageUrl(page.thumbnail.source);
                } else if (page.original) {
                    setImageUrl(page.original.source);
                }

            }
            catch (err) {
                setError('Failed to fetch data from Wikipedia.');
                console.error("Wikipedia fetch error:", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchWikipediaSummary();
    }, [topic]);

    return (
        <section className={styles.aboutSection}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>
                    About {topic}
                </h2>

                {loading && (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p className={styles.loadingText}>Loading from Wikipedia...</p>
                    </div>
                )}

                {error && (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorTitle}>Error:</p>
                        <p className={styles.errorText}>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className={styles.card}>
                        {imageUrl && (
                            <div className={styles.imageContainer}>
                                <img
                                    src={imageUrl}
                                    alt={`${topic}`}
                                    className={styles.image}
                                />
                            </div>
                        )}

                        <div className={styles.content}>
                            <div className={styles.textContent}>
                                {summary.split('\n').filter(p => p.trim()).map((paragraph, index) => (
                                    <p key={index} className={styles.paragraph}>
                                        {paragraph}
                                    </p>
                                ))}
                                <p className={styles.source}>
                                    Source: Wikipedia (Summary of the main article)
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default WikipediaAbout;