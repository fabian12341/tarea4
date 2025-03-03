"use client";

import { useState } from "react";

export default function WeatherApp() {
  const [city, setCity] = useState("");

  interface WeatherData {
    name: string;
    sys: {
      country: string;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    main: {
      temp: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
  }

  const [weatherHistory, setWeatherHistory] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "387d0c0522f249d0bdde26ab1244456b"; // Clave de API

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Por favor ingresa una ciudad válida.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );

      const data = await res.json();

      if (data.cod !== 200) {
        throw new Error(data.message);
      }

      // Agregar al historial sin borrar los anteriores
      setWeatherHistory((prev) => [data, ...prev]);

      setCity(""); // Limpia la barra de búsqueda
    } catch (err) {
      console.error("Error en la API:", err);
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-r from-blue-400 to-purple-500">
      <h1 className="text-3xl font-bold text-black mb-6">Clima en tiempo real</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Escribe una ciudad..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 border rounded-md text-black focus:outline-none"
        />
        <button
          onClick={fetchWeather}
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Buscar
        </button>
      </div>

      {loading && <p className="text-black">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Historial en Grid 3x3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {weatherHistory.map((weather, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-bold text-black">{weather.name}, {weather.sys.country}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather icon"
              width={100}
              height={100}
            />
            <p className="text-xl font-semibold text-black">{weather.weather[0].description}</p>
            <p className="text-lg text-black"> Temperatura:{weather.main.temp}°C</p>
            <p className="text-lg text-black"> Humedad: {weather.main.humidity}%</p>
            <p className="text-lg text-black"> Viento: {weather.wind.speed} m/s</p>
          </div>
        ))}
      </div>
    </div>
  );
}
