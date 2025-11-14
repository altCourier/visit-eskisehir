import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import styles from './WeatherDetails.module.css';

const WeatherDetails = () => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            // Fetch hourly data for graphs
            const response = await fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=39.7767&longitude=30.5206&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation,wind_speed_10m,relative_humidity_2m&timezone=Europe%2FIstanbul&forecast_days=3'
            );
            const data = await response.json();
            setWeatherData(data);
            console.log(data);
        };

        fetchWeatherData();
    }, []);

    // Format hourly data for charts
    const getChartData = () => {
        if (!weatherData) return [];

        const hourlyData = [];
        const times = weatherData.hourly.time;
        const temps = weatherData.hourly.temperature_2m;
        const precipitation = weatherData.hourly.precipitation;
        const humidity = weatherData.hourly.relative_humidity_2m;
        const windSpeed = weatherData.hourly.wind_speed_10m;

        // Take next 24 hours
        for (let i = 0; i < 24 && i < times.length; i++) {
            const date = new Date(times[i]);
            hourlyData.push({
                time: date.getHours() + ':00',
                temperature: temps[i],
                precipitation: precipitation[i],
                humidity: humidity[i],
                windSpeed: windSpeed[i]
            });
        }

        return hourlyData;
    };

    const getWindDirection = (degrees) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    };

    return (
        <div className={styles.weatherDetailsPage}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Detailed Weather Information</h1>

                {weatherData ? (
                    <>
                        {/* Current Weather Overview */}
                        <div className={styles.detailsGrid}>
                            <div className={styles.mainCard}>
                                <h2 className={styles.cardTitle}>Current Conditions</h2>
                                <div className={styles.mainTemp}>
                                    {weatherData.current.temperature_2m}°C
                                </div>
                                <p className={styles.feelsLike}>
                                    Feels like {weatherData.current.apparent_temperature}°C
                                </p>
                                <p className={styles.location}>Eskişehir, Turkey</p>
                            </div>

                            {/* Temperature & Humidity */}
                            <div className={styles.detailCard}>
                                <h3 className={styles.detailTitle}>🌡️ Temperature & Humidity</h3>
                                <div className={styles.detailContent}>
                                    <div className={styles.detailRow}>
                                        <span>Current Temp:</span>
                                        <strong>{weatherData.current.temperature_2m}°C</strong>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Feels Like:</span>
                                        <strong>{weatherData.current.apparent_temperature}°C</strong>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Humidity:</span>
                                        <strong>{weatherData.current.relative_humidity_2m}%</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Wind Details */}
                            <div className={styles.detailCard}>
                                <h3 className={styles.detailTitle}>💨 Wind</h3>
                                <div className={styles.detailContent}>
                                    <div className={styles.detailRow}>
                                        <span>Speed:</span>
                                        <strong>{weatherData.current.wind_speed_10m} km/h</strong>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Direction:</span>
                                        <strong>{getWindDirection(weatherData.current.wind_direction_10m)} ({weatherData.current.wind_direction_10m}°)</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Precipitation */}
                            <div className={styles.detailCard}>
                                <h3 className={styles.detailTitle}>🌧️ Precipitation</h3>
                                <div className={styles.detailContent}>
                                    <div className={styles.detailRow}>
                                        <span>Current:</span>
                                        <strong>{weatherData.current.precipitation} mm</strong>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Rain:</span>
                                        <strong>{weatherData.current.rain} mm</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className={styles.detailCard}>
                                <h3 className={styles.detailTitle}>📍 Location</h3>
                                <div className={styles.detailContent}>
                                    <div className={styles.detailRow}>
                                        <span>Latitude:</span>
                                        <strong>{weatherData.latitude}°</strong>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Longitude:</span>
                                        <strong>{weatherData.longitude}°</strong>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Elevation:</span>
                                        <strong>{weatherData.elevation} m</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Timezone */}
                            <div className={styles.detailCard}>
                                <h3 className={styles.detailTitle}>🕐 Time Zone</h3>
                                <div className={styles.detailContent}>
                                    <div className={styles.detailRow}>
                                        <span>Zone:</span>
                                        <strong>{weatherData.timezone}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Temperature Chart */}
                        <div className={styles.chartCard}>
                            <h2 className={styles.chartTitle}>📈 24-Hour Temperature Forecast</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={getChartData()}>
                                    <defs>
                                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0894D2" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#0894D2" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#b8dff2" />
                                    <XAxis dataKey="time" stroke="#5b7b96" />
                                    <YAxis stroke="#5b7b96" unit="°C" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #d4e9f7',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="temperature"
                                        stroke="#0894D2"
                                        fillOpacity={1}
                                        fill="url(#colorTemp)"
                                        name="Temperature (°C)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Precipitation Chart */}
                        <div className={styles.chartCard}>
                            <h2 className={styles.chartTitle}>🌧️ 24-Hour Precipitation Forecast</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={getChartData()}>
                                    <defs>
                                        <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4299e1" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#4299e1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="time" stroke="#718096" />
                                    <YAxis stroke="#718096" unit="mm" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="precipitation"
                                        stroke="#4299e1"
                                        fillOpacity={1}
                                        fill="url(#colorPrecip)"
                                        name="Precipitation (mm)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Multi-line Chart: Humidity & Wind Speed */}
                        <div className={styles.chartCard}>
                            <h2 className={styles.chartTitle}>💨 24-Hour Humidity & Wind Speed</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={getChartData()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="time" stroke="#718096" />
                                    <YAxis stroke="#718096" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="humidity"
                                        stroke="#48bb78"
                                        strokeWidth={2}
                                        name="Humidity (%)"
                                        dot={{ fill: '#48bb78' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="windSpeed"
                                        stroke="#ed8936"
                                        strokeWidth={2}
                                        name="Wind Speed (km/h)"
                                        dot={{ fill: '#ed8936' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                    </>
                ) : (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading detailed weather data...</p>
                    </div>
                )}

                <a href="#home" className={styles.backButton}>
                    ← Back to Home
                </a>
            </div>
        </div>
    );
};

export default WeatherDetails;