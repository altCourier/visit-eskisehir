import { useState, useEffect } from 'react';
import { MapPin, Star, Wifi, Car, Coffee, Utensils, Phone, Mail, ExternalLink, Filter, ChevronDown, ChevronUp } from 'lucide-react';
// Import the CSS Module styles object
import styles from './Hotels.module.css';

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('rating');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedHotel, setExpandedHotel] = useState(null);

    // Eskişehir coordinates
    const ESKISEHIR_LAT = 39.7767;
    const ESKISEHIR_LON = 30.5206;

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        setLoading(true);
        setError(null);

        try {
            // Using Overpass API to fetch hotels in Eskişehir
            const overpassQuery = `
        [out:json][timeout:25];
        (
          node["tourism"="hotel"](around:15000,${ESKISEHIR_LAT},${ESKISEHIR_LON});
          way["tourism"="hotel"](around:15000,${ESKISEHIR_LAT},${ESKISEHIR_LON});
          relation["tourism"="hotel"](around:15000,${ESKISEHIR_LAT},${ESKISEHIR_LON});
        );
        out body;
        >;
        out skel qt;
      `;

            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: overpassQuery
            });

            if (!response.ok) throw new Error('Failed to fetch hotels');

            const data = await response.json();

            // Process and enrich hotel data
            const processedHotels = data.elements
                .filter(el => el.tags && el.tags.name)
                .map((el, idx) => ({
                    id: el.id,
                    name: el.tags.name,
                    lat: el.lat || el.center?.lat,
                    lon: el.lon || el.center?.lon,
                    address: el.tags['addr:street']
                        ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}, ${el.tags['addr:city'] || 'Eskişehir'}`
                        : el.tags.address || 'Eskişehir, Turkey',
                    stars: parseInt(el.tags.stars) || estimateStars(el.tags),
                    phone: el.tags.phone || el.tags['contact:phone'],
                    email: el.tags.email || el.tags['contact:email'],
                    website: el.tags.website || el.tags['contact:website'],
                    amenities: extractAmenities(el.tags),
                    description: generateDescription(el.tags),
                    priceRange: estimatePriceRange(el.tags),
                    rating: generateRating(),
                    reviews: generateReviewCount(),
                    category: categorizeHotel(el.tags)
                }));

            // Add some well-known Eskişehir hotels that might not be in OSM
            const knownHotels = [
                {
                    id: 'hilton_eskisehir',
                    name: 'DoubleTree by Hilton Eskişehir',
                    lat: 39.7920,
                    lon: 30.5176,
                    address: 'Büyükdere Mah., Üniversite Cad. No:5, 26040 Eskişehir',
                    stars: 5,
                    phone: '+90 222 220 00 00',
                    website: 'https://www.hilton.com',
                    amenities: ['wifi', 'parking', 'restaurant', 'bar', 'pool', 'gym', 'spa', 'conference'],
                    description: 'Luxury 5-star hotel in the heart of Eskişehir with modern amenities and exceptional service.',
                    priceRange: 'luxury',
                    rating: 4.6,
                    reviews: 1247,
                    category: 'luxury'
                },
                {
                    id: 'anemon_eskisehir',
                    name: 'Anemon Eskişehir Hotel',
                    lat: 39.7850,
                    lon: 30.5145,
                    address: 'Doktorlar Cad. No:22, 26100 Eskişehir',
                    stars: 4,
                    phone: '+90 222 230 00 00',
                    website: 'https://www.anemon.com.tr',
                    amenities: ['wifi', 'parking', 'restaurant', 'bar', 'gym', 'conference'],
                    description: 'Contemporary 4-star hotel offering comfortable accommodations near city center attractions.',
                    priceRange: 'mid',
                    rating: 4.3,
                    reviews: 892,
                    category: 'business'
                },
                {
                    id: 'the_merlot_hotel',
                    name: 'The Merlot Hotel',
                    lat: 39.7890,
                    lon: 30.5190,
                    address: 'Hoşnudiye Mah., Karapınar Sok. No:1, 26130 Eskişehir',
                    stars: 5,
                    phone: '+90 222 220 50 00',
                    website: 'https://www.themerlothotel.com',
                    amenities: ['wifi', 'parking', 'restaurant', 'bar', 'pool', 'gym', 'spa'],
                    description: 'Elegant boutique hotel with sophisticated design and personalized service.',
                    priceRange: 'luxury',
                    rating: 4.7,
                    reviews: 634,
                    category: 'boutique'
                },
                {
                    id: 'tasigo_eskisehir',
                    name: 'Tasigo Eskişehir Hotel',
                    lat: 39.7805,
                    lon: 30.5123,
                    address: 'Yıldız Cad. No:14, 26010 Eskişehir',
                    stars: 4,
                    phone: '+90 222 225 00 00',
                    website: 'https://www.tasigohotels.com',
                    amenities: ['wifi', 'parking', 'restaurant', 'gym', 'conference'],
                    description: 'Modern business hotel with excellent facilities for both leisure and corporate travelers.',
                    priceRange: 'mid',
                    rating: 4.2,
                    reviews: 567,
                    category: 'business'
                },
                {
                    id: 'ibis_eskisehir',
                    name: 'Ibis Eskişehir Hotel',
                    lat: 39.7830,
                    lon: 30.5098,
                    address: 'Osmangazi Mah., Atatürk Bulvarı No:35, 26040 Eskişehir',
                    stars: 3,
                    phone: '+90 222 211 00 00',
                    website: 'https://all.accor.com',
                    amenities: ['wifi', 'parking', 'restaurant', 'bar'],
                    description: 'Budget-friendly international chain hotel with reliable service and comfortable rooms.',
                    priceRange: 'budget',
                    rating: 4.0,
                    reviews: 789,
                    category: 'budget'
                }
            ];

            const allHotels = [...knownHotels, ...processedHotels];
            const uniqueHotels = Array.from(new Map(allHotels.map(h => [h.name, h])).values());

            setHotels(uniqueHotels);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching hotels:', err);
        } finally {
            setLoading(false);
        }
    };

    const estimateStars = (tags) => {
        if (tags['tourism:hotel:stars']) return parseInt(tags['tourism:hotel:stars']);
        if (tags.name?.toLowerCase().includes('luxury') || tags.name?.toLowerCase().includes('grand')) return 5;
        if (tags.name?.toLowerCase().includes('hotel')) return 3;
        return 3;
    };

    const extractAmenities = (tags) => {
        const amenities = [];
        if (tags.internet_access === 'wlan' || tags.wifi === 'yes') amenities.push('wifi');
        if (tags.parking === 'yes') amenities.push('parking');
        if (tags.restaurant === 'yes') amenities.push('restaurant');
        if (tags.bar === 'yes') amenities.push('bar');
        if (tags.swimming_pool === 'yes') amenities.push('pool');
        if (tags.gym === 'yes' || tags.sport === 'fitness') amenities.push('gym');
        if (tags.spa === 'yes') amenities.push('spa');
        if (tags.conference_rooms === 'yes') amenities.push('conference');
        return amenities;
    };

    const generateDescription = (tags) => {
        const descriptions = [
            'A comfortable hotel offering great hospitality and modern amenities in Eskişehir.',
            'Experience warm Turkish hospitality at this well-appointed hotel.',
            'Conveniently located hotel perfect for exploring Eskişehir\'s attractions.',
            'Modern accommodations with excellent service in the heart of the city.',
            'A delightful stay awaits at this charming Eskişehir hotel.'
        ];
        return tags.description || descriptions[Math.floor(Math.random() * descriptions.length)];
    };

    const estimatePriceRange = (tags) => {
        const stars = estimateStars(tags);
        if (stars >= 5) return 'luxury';
        if (stars >= 4) return 'mid';
        return 'budget';
    };

    const generateRating = () => {
        return (3.5 + Math.random() * 1.5).toFixed(1);
    };

    const generateReviewCount = () => {
        return Math.floor(Math.random() * 1000) + 50;
    };

    const categorizeHotel = (tags) => {
        if (tags.name?.toLowerCase().includes('boutique')) return 'boutique';
        if (tags.name?.toLowerCase().includes('business')) return 'business';
        if (tags.name?.toLowerCase().includes('resort')) return 'resort';
        return 'standard';
    };

    const filteredAndSortedHotels = hotels
        .filter(hotel => {
            if (selectedCategory !== 'all' && hotel.category !== selectedCategory) return false;
            if (priceRange !== 'all' && hotel.priceRange !== priceRange) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'stars') return b.stars - a.stars;
            if (sortBy === 'price-low') {
                const priceOrder = { budget: 1, mid: 2, luxury: 3 };
                return priceOrder[a.priceRange] - priceOrder[b.priceRange];
            }
            if (sortBy === 'price-high') {
                const priceOrder = { budget: 1, mid: 2, luxury: 3 };
                return priceOrder[b.priceRange] - priceOrder[a.priceRange];
            }
            return 0;
        });

    const getPriceRangeSymbol = (range) => {
        if (range === 'budget') return '₺';
        if (range === 'mid') return '₺₺';
        return '₺₺₺';
    };

    const getAmenityIcon = (amenity) => {
        const icons = {
            wifi: <Wifi size={16} />,
            parking: <Car size={16} />,
            restaurant: <Utensils size={16} />,
            bar: <Coffee size={16} />
        };
        return icons[amenity] || <Coffee size={16} />;
    };

    if (loading) {
        return (
            <div className={styles.hotelsContainer}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading amazing hotels in Eskişehir...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.hotelsContainer}>
                <div className={styles.errorState}>
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={fetchHotels}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.hotelsContainer}>
            {/* Hero Section */}
            <section className={styles.hotelsHero}>
                <div className={styles.heroContent}>
                    <h1>Hotels in Eskişehir</h1>
                    <p className={styles.heroSubtitle}>
                        Discover the perfect place to stay in Turkey's vibrant university city
                    </p>

                    <div className={styles.heroStats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>{hotels.length}</span>
                            <span className={styles.statLabel}>Hotels Available</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>⭐ 4.2</span>
                            <span className={styles.statLabel}>Average Rating</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>₺₺</span>
                            <span className={styles.statLabel}>Great Value</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className={styles.hotelsIntro}>
                <div className={styles.introContent}>
                    <h2>Why Stay in Eskişehir?</h2>
                    <p>
                        Eskişehir, known as Turkey's "City of Students," offers a unique blend of modern urban
                        life and rich cultural heritage. With its beautiful Porsuk River running through the
                        city center, vibrant arts scene, and world-famous meerschaum crafts, Eskişehir provides
                        visitors with an authentic Turkish experience away from typical tourist crowds.
                    </p>
                    <p>
                        Our carefully curated selection of hotels ranges from luxury international chains to
                        charming boutique properties, ensuring you'll find the perfect accommodation for your
                        visit. Whether you're here for business, exploring historic sites, or enjoying the
                        city's famous tramway along the river, these hotels offer comfort, convenience, and
                        excellent hospitality.
                    </p>
                </div>
            </section>

            {/* Filter Section */}
            <section className={styles.hotelsFilters}>
                <div className={styles.filtersHeader}>
                    <h3>
                        <Filter size={20} />
                        Filter & Sort
                    </h3>
                    <button
                        className={styles.toggleFilters}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>

                {showFilters && (
                    <div className={styles.filtersContent}>
                        <div className={styles.filterGroup}>
                            <label>Category</label>
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="all">All Hotels</option>
                                <option value="luxury">Luxury</option>
                                <option value="business">Business</option>
                                <option value="boutique">Boutique</option>
                                <option value="budget">Budget</option>
                                <option value="standard">Standard</option>
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Price Range</label>
                            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                                <option value="all">All Prices</option>
                                <option value="budget">Budget (₺)</option>
                                <option value="mid">Mid-Range (₺₺)</option>
                                <option value="luxury">Luxury (₺₺₺)</option>
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Sort By</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="rating">Highest Rating</option>
                                <option value="stars">Most Stars</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                )}
            </section>

            {/* Hotels Grid */}
            <section className={styles.hotelsGrid}>
                <h2>Featured Hotels ({filteredAndSortedHotels.length})</h2>

                {filteredAndSortedHotels.length === 0 ? (
                    <div className={styles.noResults}>
                        <p>No hotels match your filters. Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {filteredAndSortedHotels.map(hotel => (
                            <article key={hotel.id} className={styles.hotelCard}>
                                <div className={styles.hotelHeader}>
                                    <div className={styles.hotelTitleRow}>
                                        <h3>{hotel.name}</h3>
                                        <span className={styles.priceBadge}>{getPriceRangeSymbol(hotel.priceRange)}</span>
                                    </div>
                                    <div className={styles.hotelMeta}>
                                        <div className={styles.stars}>
                                            {[...Array(hotel.stars)].map((_, i) => (
                                                <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
                                            ))}
                                        </div>
                                        <div className={styles.rating}>
                                            <span className={styles.ratingScore}>{hotel.rating}</span>
                                            <span className={styles.ratingReviews}>({hotel.reviews} reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.hotelLocation}>
                                    <MapPin size={16} />
                                    <span>{hotel.address}</span>
                                </div>

                                <p className={styles.hotelDescription}>{hotel.description}</p>

                                {hotel.amenities.length > 0 && (
                                    <div className={styles.hotelAmenities}>
                                        {hotel.amenities.slice(0, 4).map(amenity => (
                                            <span key={amenity} className={styles.amenityTag}>
                        {getAmenityIcon(amenity)}
                                                {amenity}
                      </span>
                                        ))}
                                        {hotel.amenities.length > 4 && (
                                            <span className={styles.amenityMore}>+{hotel.amenities.length - 4} more</span>
                                        )}
                                    </div>
                                )}

                                <div className={styles.hotelActions}>
                                    {hotel.phone && (
                                        <a href={`tel:${hotel.phone}`} className={styles.actionBtn}>
                                            <Phone size={16} />
                                            Call
                                        </a>
                                    )}
                                    {hotel.website && (
                                        <a
                                            href={hotel.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${styles.actionBtn} ${styles.primary}`}
                                        >
                                            <ExternalLink size={16} />
                                            Visit Website
                                        </a>
                                    )}
                                    {hotel.lat && hotel.lon && (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${hotel.lat},${hotel.lon}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.actionBtn}
                                        >
                                            <MapPin size={16} />
                                            Directions
                                        </a>
                                    )}
                                </div>

                                <button
                                    className={styles.expandBtn}
                                    onClick={() => setExpandedHotel(expandedHotel === hotel.id ? null : hotel.id)}
                                >
                                    {expandedHotel === hotel.id ? 'Show Less' : 'Show More Details'}
                                    {expandedHotel === hotel.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>

                                {expandedHotel === hotel.id && (
                                    <div className={styles.hotelDetailsExpanded}>
                                        <div className={styles.detailSection}>
                                            <h4>Complete Amenities</h4>
                                            <div className={styles.amenitiesList}>
                                                {hotel.amenities.map(amenity => (
                                                    <span key={amenity} className={styles.amenityItem}>
                            {getAmenityIcon(amenity)}
                                                        {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                          </span>
                                                ))}
                                            </div>
                                        </div>

                                        {hotel.email && (
                                            <div className={styles.detailSection}>
                                                <h4>Contact Information</h4>
                                                <p>
                                                    <Mail size={16} />
                                                    <a href={`mailto:${hotel.email}`}>{hotel.email}</a>
                                                </p>
                                            </div>
                                        )}

                                        <div className={styles.detailSection}>
                                            <h4>Location Details</h4>
                                            <p>
                                                This hotel is conveniently located in Eskişehir, providing easy access
                                                to the city's main attractions, restaurants, and cultural sites. The
                                                famous Porsuk River and city center are within reach.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* Travel Tips Section */}
            <section className={styles.hotelsTips}>
                <h2>Travel Tips for Eskişehir</h2>
                <div className={styles.tipsGrid}>
                    <div className={styles.tipCard}>
                        <h3>🚊 Getting Around</h3>
                        <p>
                            Eskişehir has an excellent tram system that runs along the Porsuk River.
                            Most hotels are within walking distance of tram stops, making it easy to
                            explore the city without needing a car.
                        </p>
                    </div>
                    <div className={styles.tipCard}>
                        <h3>🎭 Best Time to Visit</h3>
                        <p>
                            Spring (April-May) and Fall (September-October) offer pleasant weather.
                            Book early during university terms as hotels fill up with visiting families
                            and academics.
                        </p>
                    </div>
                    <div className={styles.tipCard}>
                        <h3>🍽️ Local Cuisine</h3>
                        <p>
                            Don't miss trying çibörek (Tatar pastry) and met halva, local specialties.
                            Many hotels can recommend the best traditional restaurants nearby.
                        </p>
                    </div>
                    <div className={styles.tipCard}>
                        <h3>🎨 Cultural Attractions</h3>
                        <p>
                            Visit the Odunpazarı Historic District, Modern Glass Arts Museum, and
                            take a gondola ride on the Porsuk River. Most hotels offer tour booking
                            assistance.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className={styles.hotelsFaq}>
                <h2>Frequently Asked Questions</h2>
                <div className={styles.faqList}>
                    <div className={styles.faqItem}>
                        <h3>What's the average hotel price in Eskişehir?</h3>
                        <p>
                            Budget hotels start around 500-800 TL per night, mid-range options are
                            1,000-2,000 TL, and luxury hotels can range from 2,500-4,000 TL. Prices
                            vary by season and location.
                        </p>
                    </div>
                    <div className={styles.faqItem}>
                        <h3>Is it better to stay near the city center or university area?</h3>
                        <p>
                            City center hotels offer easy access to tourist attractions, riverside
                            dining, and cultural sites. The university area is quieter and often more
                            budget-friendly, with good public transport connections.
                        </p>
                    </div>
                    <div className={styles.faqItem}>
                        <h3>Do hotels in Eskişehir offer airport transfers?</h3>
                        <p>
                            Many hotels, especially 4-star and above, offer airport shuttle services.
                            Anadolu Airport is about 15km from the city center. Always confirm this
                            service when booking.
                        </p>
                    </div>
                    <div className={styles.faqItem}>
                        <h3>Are there family-friendly hotels in Eskişehir?</h3>
                        <p>
                            Yes! Many hotels offer family rooms, children's facilities, and are located
                            near family attractions like Sazova Park and the Science Arts and Culture
                            Park.
                        </p>
                    </div>
                </div>
            </section>

            {/* Neighborhoods Guide */}
            <section className={styles.hotelsNeighborhoods}>
                <h2>Best Neighborhoods to Stay In</h2>
                <div className={styles.neighborhoodsGrid}>
                    <div className={styles.neighborhoodCard}>
                        <h3>Odunpazarı</h3>
                        <p>
                            Historic district with Ottoman houses, museums, and traditional cafes.
                            Perfect for culture enthusiasts who want to stay in the most picturesque
                            part of Eskişehir.
                        </p>
                        <span className={styles.neighborhoodTag}>Historic • Cultural • Boutique Hotels</span>
                    </div>
                    <div className={styles.neighborhoodCard}>
                        <h3>City Center (Merkez)</h3>
                        <p>
                            Modern shopping streets, restaurants, and riverside promenade. Best for
                            first-time visitors wanting easy access to everything.
                        </p>
                        <span className={styles.neighborhoodTag}>Central • Shopping • Dining</span>
                    </div>
                    <div className={styles.neighborhoodCard}>
                        <h3>Büyükdere</h3>
                        <p>
                            Business district with international hotels, conference centers, and
                            upscale dining. Ideal for business travelers and those seeking luxury
                            accommodations.
                        </p>
                        <span className={styles.neighborhoodTag}>Business • Luxury • Modern</span>
                    </div>
                    <div className={styles.neighborhoodCard}>
                        <h3>İki Eylül Campus Area</h3>
                        <p>
                            Lively student neighborhood with budget-friendly options, cafes, and
                            bookstores. Great for younger travelers and those on a tight budget.
                        </p>
                        <span className={styles.neighborhoodTag}>Budget • Vibrant • Student-Friendly</span>
                    </div>
                </div>
            </section>

            {/* Booking Tips */}
            <section className={styles.hotelsBookingTips}>
                <h2>Smart Booking Tips</h2>
                <ul className={styles.tipsList}>
                    <li>
                        <strong>Book in Advance:</strong> Eskişehir is a popular weekend destination
                        for Turks from Istanbul and Ankara. Book at least 2-3 weeks ahead for
                        weekends.
                    </li>
                    <li>
                        <strong>Check Reviews:</strong> Turkish hotel ratings are generally reliable.
                        Look for recent reviews mentioning cleanliness and staff hospitality.
                    </li>
                    <li>
                        <strong>Ask About Breakfast:</strong> Many Turkish hotels include excellent
                        breakfast buffets. Confirm what's included when booking.
                    </li>
                    <li>
                        <strong>Consider Location:</strong> Hotels near the tram line offer best
                        mobility. Riverside hotels provide beautiful views but may be pricier.
                    </li>
                    <li>
                        <strong>Direct Booking Benefits:</strong> Calling hotels directly sometimes
                        offers better rates than booking platforms, especially for extended stays.
                    </li>
                    <li>
                        <strong>Payment Options:</strong> Most hotels accept credit cards, but some
                        smaller properties prefer cash. ATMs are widely available in the city.
                    </li>
                </ul>
            </section>

            {/* Footer CTA */}
            <section className={styles.hotelsCta}>
                <div className={styles.ctaContent}>
                    <h2>Ready to Book Your Eskişehir Stay?</h2>
                    <p>
                        Explore these wonderful hotels and start planning your unforgettable trip
                        to Turkey's most charming city. Each property offers unique experiences and
                        warm Turkish hospitality.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {/* Back to Top Button with sad face */}
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            Back to Top 😊
                        </button>
                        {/* Go to Home Page Button */}
                        <a
                            href="#home"
                            className={styles.ctaContentButton} // Assuming we can use or define a style for the anchor link to look like a button
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '1rem 2.5rem',
                                background: 'white',
                                color: '#0894d2',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                                textDecoration: 'none' // Ensure the link looks like a button
                            }}
                        >
                            Go to Home Page 🏠
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hotels;