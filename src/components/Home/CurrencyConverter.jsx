import React, { useState, useEffect } from 'react';
import styles from './CurrencyConverter.module.css';

// --- CONFIGURATION REQUIRED ---
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = "currency-conversion-and-exchange-rates.p.rapidapi.com";
const API_ENDPOINT = "/latest";

const BASE_CURRENCY = 'TRY';
const POPULAR_CURRENCIES = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'JPY', name: 'Japanese Yen' },
];
// ------------------------------

const CurrencyConverter = () => {
    const [tryAmount, setTryAmount] = useState(100);
    const [rate, setRate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // NEW STATE: Tracks the selected target currency
    const [targetCurrency, setTargetCurrency] = useState(POPULAR_CURRENCIES[0].code);

    const convertedAmount = rate ? (tryAmount * rate).toFixed(2) : '---';

    useEffect(() => {
        const fetchRate = async () => {
            setLoading(true);
            setError(null);

            // Fetch rate for the currently selected target currency
            const symbols = targetCurrency;
            const fullUrl = `https://${API_HOST}${API_ENDPOINT}?base=${BASE_CURRENCY}&symbols=${symbols}`;

            try {
                const response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: {
                        "x-rapidapi-host": API_HOST,
                        "x-rapidapi-key": API_KEY
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error: status ${response.status}`);
                }
                const data = await response.json();

                // Extract the rate for the selected target currency
                const newRate = data.rates ? data.rates[targetCurrency] : null;

                if (newRate) {
                    setRate(parseFloat(newRate));
                } else {
                    throw new Error('Invalid rate data received.');
                }
            } catch (err) {
                console.error("Currency API fetch failed:", err);
                setError(`Could not load rate for ${targetCurrency}: ${err.message}.`);
            } finally {
                setLoading(false);
            }
        };

        if (API_KEY && API_HOST) {
            fetchRate();
        } else {
            setError("API configuration incomplete.");
            setLoading(false);
        }
    }, [targetCurrency]); // Re-run effect when targetCurrency changes

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setTryAmount(value);
    };

    const handleCurrencyChange = (e) => {
        setTargetCurrency(e.target.value);
    };

    return (
        <section className={styles.converterSection}>
            <div className={styles.converterCard}>
                <h3 className={styles.converterTitle}>💱 Live Currency Converter</h3>

                {loading && <p className={styles.loadingText}>Loading live rate...</p>}

                {error && <p className={styles.errorText}>Error: {error}</p>}

                {rate && (
                    <>
                        <p className={styles.rateInfo}>
                            Live Rate: 1 {BASE_CURRENCY} ≈ {rate.toFixed(4)} {targetCurrency}
                        </p>

                        <div className={styles.inputContainer}>
                            {/* Input: Amount in TRY */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="try-input" className={styles.inputLabel}>{BASE_CURRENCY}</label>
                                <input
                                    id="try-input"
                                    type="number"
                                    min="0"
                                    value={tryAmount}
                                    onChange={handleAmountChange}
                                    className={styles.currencyInput}
                                    placeholder={`Amount in ${BASE_CURRENCY}`}
                                />
                            </div>

                            {/* Select: Target Currency */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="target-currency" className={styles.inputLabel}>To</label>
                                <select
                                    id="target-currency"
                                    className={styles.currencySelect}
                                    value={targetCurrency}
                                    onChange={handleCurrencyChange}
                                >
                                    {POPULAR_CURRENCIES.map(c => (
                                        <option key={c.code} value={c.code}>
                                            {c.code} - {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.conversionResult}>
                            <span className={styles.resultAmount}>{convertedAmount}</span>
                            <span className={styles.resultCurrency}>{targetCurrency}</span>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default CurrencyConverter;