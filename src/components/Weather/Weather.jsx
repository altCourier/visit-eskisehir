import { useEffect, useState } from 'react';
import styles from './Weather.module.css';

const Weather = () => {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=39.7767&longitude=30.5206&hourly=temperature_2m,relative_humidity_2m,rain,temperature_120m&current=is_day,temperature_2m,rain,showers,weather_code';
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const response = await fetch(url);
            const data = await response.json();
            setWeatherData(data);
            console.log(data);
        };

        fetchWeatherData();
    }, []);

    const getWeatherAdvice = () => {
        if (!weatherData) return '';

        const temp = weatherData.current.temperature_2m;
        const rain = weatherData.current.rain;

        let advice = [];

        // Temperature advice
        if (temp < 10) {
            advice.push("🧥 Don't forget your coat, it's cold!");
        } else if (temp < 15) {
            advice.push("🧥 A light jacket would be nice!");
        } else if (temp > 30) {
            advice.push("🌞 Stay hydrated, it's hot out there!");
        }

        // Rain advice
        if (rain > 0) {
            advice.push("☂️ Bring an umbrella, it's raining!");
        } else if (rain === 0) {
            advice.push("☀️ No rain expected, enjoy the weather!");
        }

        return advice.length > 0 ? advice.join(' ') : '✨ Perfect weather for exploring!';
    };

    return (
        <div className={styles.weatherSection}>
            {weatherData ? (
                <div className={styles.weatherLayout}>
                    {/* Left side - Weather Card */}
                    <div className={styles.weatherCard}>
                        <h2 className={styles.title}>Current Weather in Eskişehir</h2>
                        <div className={styles.weatherInfo}>
                            <div className={styles.weatherItem}>
                                <span className={styles.icon}>🌡️</span>
                                <div>
                                    <p className={styles.label}>Temperature</p>
                                    <p className={styles.value}>{weatherData.current.temperature_2m}°C</p>
                                </div>
                            </div>
                            <div className={styles.weatherItem}>
                                <span className={styles.icon}>🌧️</span>
                                <div>
                                    <p className={styles.label}>Rain</p>
                                    <p className={styles.value}>{weatherData.current.rain} mm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Advice and Button */}
                    <div className={styles.adviceSection}>
                        <div className={styles.adviceCard}>
                            <p className={styles.adviceText}>
                                {getWeatherAdvice()}
                            </p>
                        </div>
                        <a href="#weather-details" className={styles.detailsButton}>
                            Find More Weather Info
                            <span className={styles.arrow}>→</span>
                        </a>
                    </div>
                </div>

            ) : (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading weather data...</p>
                </div>
            )}
        </div>
    );
};

export default Weather;