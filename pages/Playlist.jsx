// src/pages/Playlist.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Playlist = () => {
  const [song, setSong] = useState(null);
    const [background, setBackground] = useState('');
    const [weather, setWeather] = useState(null)
    const navigate = useNavigate()

  useEffect(() => {
    const data = localStorage.getItem('selectedSong');
    if (data) {
      setSong(JSON.parse(data));
    }
  }, []);

    useEffect(() => {
      const backgroundVideo = localStorage.getItem('backgroundVideo');
      const storedWeather = localStorage.getItem('weather')
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

// ...existing code...
useEffect(() => {
  const requestNotificationPermission = async () => {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  requestNotificationPermission();

  const handleVisibilityChange = () => {
    if (document.hidden && song) {  // Only show notification if we have a song
      if (Notification.permission === "granted") {
        const largeIcon = song.image.replace(/\/w=\d+/, '/w=512'); // Increase image size if URL contains width parameter
        const notification = new Notification("Music Still Playing", {
        body: `Currently playing: ${song.name} by ${song.artist_name}`,
        icon: largeIcon,  // Must be a relative or absolute URL to an image
        silent: false
      });

        // Automatically close notification after 5 seconds
        setTimeout(() => notification.close(), 5000);
      }
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [song]);


  if (!song) return <p className="p-8">Loading song...</p>;

  return (
    <div className="p-8 flex flex-col items-center w-[100%] justify-center min-h-screen text-center">
        {background && (
        <video
          src={background}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      <div className='relative z-10 min-h-screen overflow-y-auto px-4 custom-scroll text-white w-full flex flex-col items-center justify-center'>
        <img src={song.image} alt="Song image" className='rounded w-[200px] p-2'/>
        <div className="text-2xl font-bold">{song.name}</div>
        <p className="text-gray-300 mb-4">By {song.artist_name}</p>
        <audio controls className="w-full max-w-md">
          <source src={song.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
          <div onClick={() => {navigate("/search")}} className='absolute top-0 left-0'>Back</div>
      </div>
    </div>
  );
};

export default Playlist;
