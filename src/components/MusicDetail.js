import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MusicDetail.css';
import Loading from './Loading'; // Import the Loading component

const MusicDetail = () => {
  const { title } = useParams();
  const [song, setSong] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await axios.get('https://sell-your-songs-default-rtdb.firebaseio.com/ListSong1.json');
        const data = response.data;
        const foundSong = Object.values(data).find(song => song.title === title);
        setSong(foundSong);
      } catch (error) {
        console.error('Error fetching song:', error);
      }
    };

    fetchSong();
  }, [title]);

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setCopySuccess('Berhasil di Salin, silahkan share musik Anda!');
        setTimeout(() => setCopySuccess(''), 3000); 
      })
      .catch((error) => {
        console.error('Failed to copy the link:', error);
        setCopySuccess('Failed to copy link.');
        setTimeout(() => setCopySuccess(''), 3000);
      });
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  if (!song) {
    return <Loading />; // Show the loading component while fetching data
  }

  return (
    <div className="music-detail-container">
      <h1>{song.title}</h1>
      <p>Song Writer: {song.songwriter}</p>
      <p>Description: {song.desc}</p>
      <p>Download Fee: {song.priceDownload}</p>
      <p>License Fee: {song.licensingFee}</p>
      <p>Release Timestamp: {song.timestampRilis}</p>
      <div>
        <h3>Preview:</h3>
        <audio controls>
          <source src={song.trailerSong} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <button className="copy-link-button" onClick={handleCopyLink}>
        Salin & Share Musik Anda
      </button>
      {copySuccess && <p className="copy-success-message">{copySuccess}</p>}

      {/* Add the image for navigating to Home */}
      <img
        src="https://firebasestorage.googleapis.com/v0/b/sell-your-songs.appspot.com/o/Home-Icon.png?alt=media&token=6cb0a424-cfd4-4c64-99da-5968479049de"
        alt="Navigate to Home"
        onClick={handleNavigateHome}
        className="home-icon"
      />
    </div>
  );
};

export default MusicDetail;
