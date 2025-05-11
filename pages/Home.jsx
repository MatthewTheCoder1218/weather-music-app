// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [background, setBackground] = useState('');
  const navigate = useNavigate();

useEffect(() => {
  const storedWeather = localStorage.getItem('weather');
  const storedBackground = localStorage.getItem('backgroundVideo');

  if (storedWeather) {
    const parsed = JSON.parse(storedWeather);
    setWeather(parsed);
    setBackground(storedBackground || getBackgroundForWeather(parsed.weather[0].main));
  }
}, []);


  const getBackgroundForWeather = (main) => {
    const videoMap = {
      Clear: '/videos/clear.mp4',
      Clouds: '/videos/clouds.mp4',
      Rain: '/videos/rain.mp4',
      Thunderstorm: '/videos/thunderstorm.mp4',
      Snow: '/videos/snow.mp4',
      Drizzle: '/videos/drizzle.mp4',
      Mist: '/videos/mist.mp4',
      Fog: '/videos/mist.mp4',
    };
    return videoMap[main] || '/videos/clear.mp4';
  };

  const getTagsForWeather = (main) => {
  const tagMap = {
    Clear: ['bright', 'happy', 'chill', 'energetic'],
    Clouds: ['moody', 'lo-fi', 'indie', 'soft'],
    Rain: ['emotional', 'cozy', 'acoustic', 'slow'],
    Drizzle: ['calm', 'ambient', 'jazzy', 'soothing'],
    Thunderstorm: ['intense', 'dramatic', 'darkwave', 'electronic'],
    Snow: ['peaceful', 'instrumental', 'holiday', 'dreamy'],
    Mist: ['ethereal', 'ambient', 'mysterious', 'lo-fi'],
    Smoke: ['grunge', 'dark', 'industrial', 'raw'],
    Haze: ['vintage', 'indie', 'soul', 'dream-pop'],
    Dust: ['folk', 'desert-blues', 'acoustic', 'earthy'],
    Fog: ['cinematic', 'slowcore', 'trip-hop', 'spacey'],
    Sand: ['tribal', 'world', 'deep house', 'organic'],
    Ash: ['post-rock', 'goth', 'experimental', 'gritty'],
    Squall: ['metal', 'breakcore', 'progressive', 'hard rock'],
    Tornado: ['chaotic', 'punk', 'drum & bass', 'hardcore'],
  };

  return tagMap[main] || ['mood', 'vibe', 'music', 'weather'];
};


  const fetchWeather = async () => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      localStorage.setItem('weather', JSON.stringify(response.data));
      setWeather(response.data);
      setBackground(getBackgroundForWeather(response.data.weather[0].main));
      localStorage.setItem('backgroundVideo', getBackgroundForWeather(response.data.weather[0].main));
      const tags = getTagsForWeather(response.data.weather[0].main);
      localStorage.setItem('weatherTags', JSON.stringify(tags));
          setTimeout(() => {
            navigate('/search', { state: { weather: response.data } });
            setLocation('');
          }, 4000);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  return (
    <div className="relative h-screen w-full">
      {background && (
        <video
          src={background}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      <div
        className={`relative z-10 flex flex-col items-center justify-center h-full text-center px-4 text-white`}
      >
        <h1 className="text-[2.5rem] font-bold">Music That Matches Your Weather.</h1>
        <h4 className="text-2xl mt-2">Enter your location to get music that fits your current mood and sky</h4>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-6">
          <div className="bg-gray-100 p-4 rounded-lg border-2 h-12 w-[400px] flex items-center border-gray-300">
            <input
              type="text"
              placeholder="Enter your location"
              className="border-0 outline-0 bg-transparent w-full text-black"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button
            onClick={fetchWeather}
            className="bg-blue-500 text-white rounded-lg p-3 cursor-pointer w-full sm:w-[200px] h-12 flex items-center justify-center hover:bg-blue-600 transition duration-300"
          >
            Get Music
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
