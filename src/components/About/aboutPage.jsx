import React, { useState, useEffect } from "react";
import styles from './AboutPage.module.css';

const AboutPage = () => {
    const [sections, setSections] = useState({
        overview: { loading: true, content: null, error: null },
        wwi: { loading: true, content: null, error: null },
        railway: { loading: true, content: null, error: null },
        independence: { loading: true, content: null, error: null },
        culture: { loading: true, content: null, error: null },
        food: { loading: true, content: null, error: null }
    });

    const fetchWikipediaSection = async (topic, sectionKey) => {
        const endpoint = 'https://en.wikipedia.org/w/api.php';
        const params = {
            action: 'query',
            format: 'json',
            prop: 'extracts|pageimages',
            exintro: sectionKey === 'overview',
            explaintext: true,
            piprop: 'thumbnail|original',
            pithumbsize: 500,
            redirects: 1,
            titles: topic,
            origin: '*',
        };

        // For historical background, get full article instead of just intro
        if (sectionKey === 'history') {
            delete params.exintro;
            params.exsectionformat = 'plain';
        }

        const url = endpoint + '?' + new URLSearchParams(params);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

            const data = await response.json();
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            const page = pages[pageId];

            let text = page.extract || 'No content available.';

            // Clean up Wikipedia markup and special characters
            text = text
                .replace(/%5B%5B[^%]*%5D%5D/g, '') // Remove encoded wiki links
                .replace(/\[\[[^\]]*\]\]/g, '') // Remove wiki links
                .replace(/{{{[^}]*}}}/g, '') // Remove template variables
                .replace(/\{\{[^}]*\}\}/g, '') // Remove templates
                .replace(/\*\*/g, '') // Remove bold markers
                .replace(/##/g, '') // Remove headers
                .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
                .trim();

            return {
                text: text,
                image: page.thumbnail?.source || page.original?.source || null
            };
        } catch (err) {
            console.error(`Error fetching ${topic}:`, err);
            throw err;
        }
    };

    useEffect(() => {
        const fetchAllContent = async () => {
            const topics = [
                { key: 'overview', title: 'Eskişehir' },
                { key: 'wwi', title: 'Battle of Sakarya' },
                { key: 'railway', title: 'Turkish State Railways' },
                { key: 'independence', title: 'Turkish War of Independence' },
                { key: 'culture', title: 'Meerschaum' },
                { key: 'food', title: 'Çibörek' }
            ];

            for (const topic of topics) {
                try {
                    const content = await fetchWikipediaSection(topic.title, topic.key);
                    setSections(prev => ({
                        ...prev,
                        [topic.key]: { loading: false, content, error: null }
                    }));
                } catch (err) {
                    setSections(prev => ({
                        ...prev,
                        [topic.key]: { loading: false, content: null, error: 'Failed to load content' }
                    }));
                }
            }
        };

        fetchAllContent();
    }, []);

    const LoadingSpinner = () => (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading content...</p>
        </div>
    );

    const SectionCard = ({ title, data, description }) => {
        if (data.loading) return <LoadingSpinner />;
        if (data.error) return <div className={styles.error}>{data.error}</div>;
        if (!data.content) return null;

        return (
            <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>{title}</h2>
                {description && <p className={styles.sectionDescription}>{description}</p>}

                <div className={styles.cardContent}>
                    {data.content.image && (
                        <div className={styles.imageContainer}>
                            <img
                                src={data.content.image}
                                alt={title}
                                className={styles.sectionImage}
                            />
                        </div>
                    )}
                    <div className={styles.textContent}>
                        {data.content.text.split('\n').filter(p => p.trim()).map((paragraph, index) => (
                            <p key={index} className={styles.paragraph}>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.aboutPage}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.mainTitle}>Eskişehir: A Journey Through History</h1>
                    <p className={styles.subtitle}>
                        Discover the rich historical tapestry of one of Turkey's most significant cities
                    </p>
                </div>
            </header>

            <div className={styles.container}>
                <SectionCard
                    title="Overview of Eskişehir"
                    data={sections.overview}
                    description="Ancient Dorylaeum, modern Eskişehir - a city where history meets innovation"
                />

                <div className={styles.divider}></div>

                <div className={styles.highlightSection}>
                    <div className={styles.highlightBanner}>
                        <h2 className={styles.highlightTitle}>Eskişehir in World War I and the Turkish War of Independence</h2>
                        <p className={styles.highlightText}>
                            Eskişehir played a crucial role during one of the most tumultuous periods in Turkish history.
                            The city witnessed significant military operations and served as a strategic location during
                            both World War I and the subsequent War of Independence.
                        </p>
                    </div>
                </div>

                <SectionCard
                    title="The Battle of Sakarya and WWI Context"
                    data={sections.wwi}
                    description="A pivotal battle that changed the course of Turkish history"
                />

                <div className={styles.divider}></div>

                <SectionCard
                    title="The Turkish War of Independence"
                    data={sections.independence}
                    description="How Eskişehir contributed to the birth of modern Turkey"
                />

                <div className={styles.divider}></div>

                <SectionCard
                    title="Railway Heritage"
                    data={sections.railway}
                    description="Eskişehir's transformation into Turkey's railway hub"
                />

                <div className={styles.divider}></div>

                <SectionCard
                    title="Cultural Significance: Meerschaum"
                    data={sections.culture}
                    description="The white gold of Eskişehir - a unique cultural treasure"
                />

                <div className={styles.divider}></div>

                <SectionCard
                    title="Culinary Heritage: Turkish Cuisine"
                    data={sections.food}
                    description="Explore the rich flavors and traditional dishes that define Turkish gastronomy"
                />

                <div className={styles.timeline}>
                    <h2 className={styles.timelineTitle}>Historical Timeline</h2>
                    <div className={styles.timelineContent}>
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineYear}>Ancient Era</div>
                            <div className={styles.timelineDescription}>
                                Phrygian settlements establish the foundations of what would become Dorylaeum
                            </div>
                        </div>
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineYear}>1097</div>
                            <div className={styles.timelineDescription}>
                                Battle of Dorylaeum during the First Crusade
                            </div>
                        </div>
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineYear}>1481</div>
                            <div className={styles.timelineDescription}>
                                Ottoman conquest under Sultan Bayezid II
                            </div>
                        </div>
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineYear}>1892</div>
                            <div className={styles.timelineDescription}>
                                Railway reaches Eskişehir, transforming the city's economy
                            </div>
                        </div>
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineYear}>1921</div>
                            <div className={styles.timelineDescription}>
                                Battle of Sakarya - decisive victory for Turkish forces
                            </div>
                        </div>
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineYear}>1923</div>
                            <div className={styles.timelineDescription}>
                                Eskişehir becomes part of the newly founded Republic of Turkey
                            </div>
                        </div>
                    </div>
                </div>

                <footer className={styles.footer}>
                    <p className={styles.footerText}>
                        All content sourced from Wikipedia and other educational resources.
                        This page is designed for educational and informational purposes.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default AboutPage;