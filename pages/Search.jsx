// src/pages/Search.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const moods = ['chill', 'happy', 'sad', 'ambient', 'energetic', 'romantic', 'jazz'];

const Search = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const [weatherTags, setWeatherTags] = useState([]);
  const [background, setBackground] = useState('');
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const savedTags = localStorage.getItem('weatherTags');
    const backgroundVideo = localStorage.getItem('backgroundVideo');
    const storedWeather = localStorage.getItem('weather')
    if (savedTags) {
      setWeatherTags(JSON.parse(savedTags));
    }
    if (backgroundVideo) {
      const parsed = JSON.parse(storedWeather)
      setWeather(parsed)
      setBackground(backgroundVideo || getBackgroundForWeather(parsed.weather[0].main));
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
  

  const clientId = 'ec235139'; // replace this

  // Fetch songs based on mood or keyword
  const fetchSongs = async () => {
    setLoading(true);
    try {
      let url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=10&audioformat=mp31`;

      if (selectedMood) {
        url += `&tags=${selectedMood}`;
      } else if (searchTerm) {
        url += `&namesearch=${encodeURIComponent(searchTerm)}`;
      }

      const response = await axios.get(url);
      setSongs(response.data.results);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when mood or term changes
  useEffect(() => {
    if (selectedMood || searchTerm) {
      fetchSongs();
    }
  }, [selectedMood]);

    const handleSongClick = (song) => {
    localStorage.setItem('selectedSong', JSON.stringify(song));
    navigate('/playlist');
  };

  return (
    <div className="p-2 relative h-screen w-full overflow-hidden">
        {background && (
        <video
          src={background}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      <div className="relative z-10 h-full overflow-y-auto px-4 py-8 custom-scroll text-white">
      <h1 className="text-3xl font-bold mb-4">Search for Songs</h1>

      {weatherTags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Suggestions based on your weather:</h2>
          <div className="flex flex-wrap gap-2">
            {weatherTags.map((tag) => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-full ${
                  selectedMood === tag ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'
                }`}
                onClick={() => {
                  setSelectedMood(tag);
                  setSearchTerm('');
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="flex gap-2 mb-6 h-12 items-center">
        <div className='bg-gray-100 p-4 rounded-lg border-2 h-12 w-[900px] flex items-center border-gray-300 text-black'>
            <input
          type="text"
          placeholder="Search by keyword"
          className="border-0 outline-0 border-gray-300 rounded-lg w-full text-black"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedMood('');
          }}
        />
        </div>
        
        <button
          onClick={fetchSongs}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Songs */}
      {loading ? (
        <p>Loading songs...</p>
      ) : (
        <div className="grid gap-4">
          {songs.map((song) => (
            <div
            key={song.id}
            onClick={() => handleSongClick(song)}
            className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300 cursor-pointer hover:bg-gray-200 transition"
            >
            <h2 className="font-semibold text-black">{song.name}</h2>
            <p className="text-sm text-gray-500">By {song.artist_name}</p>
            <audio controls className="mt-2 w-full">
                <source src={song.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            </div>
        ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default Search;
