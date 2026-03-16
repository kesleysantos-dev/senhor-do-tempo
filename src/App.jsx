import { useState, useEffect } from 'react';
import './App.css';

const getTempAccent = (temp) => {
  if (temp <= 10) return '#38bdf8';
  if (temp <= 25) return '#fbbf24';
  return '#ef4444';
};

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Efeito para busca automática com Debounce
  useEffect(() => {
    // Só busca se o usuário digitou 3 ou mais letras
    if (city.trim().length < 3) {
      setWeather(null);
      setError(null);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchWeather(city);
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [city]);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${apiKey}`;

    console.log('Buscando cidade:', cityName); // Veja se o nome está saindo certo
    console.log('API Key carregada:', apiKey);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Cidade não encontrada.');

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const tempAccent = weather ? getTempAccent(weather.main.temp) : '#333333';

  return (
    <main className="app-container" style={{ '--temp-accent': tempAccent }}>
      <div className="search-box">
        <h1>Previsão do Tempo</h1>
        <div className="search-form">
          <input
            type="text"
            placeholder="Digite a cidade..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <div className="loading-indicator">
            {loading && <div className="spinner"></div>}
          </div>
        </div>
      </div>

      {error && <div className="error-badge">{error}</div>}

      {weather && !loading && (
        <article className="weather-display">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <div className="main-info">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt={weather.weather[0].description}
            />
            <span className="temp">{Math.round(weather.main.temp)}°C</span>
          </div>

          <p className="condition">{weather.weather[0].description}</p>

          <div className="extra-details">
            <div className="detail-item">
              <span>Umidade</span>
              <strong>{weather.main.humidity}%</strong>
            </div>
            <div className="detail-item">
              <span>Vento</span>
              <strong>{Math.round(weather.wind.speed * 3.6)} km/h</strong>
            </div>
          </div>
        </article>
      )}
    </main>
  );
};

export default App;
