import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth, database } from './firebase';
import { ref, get, child } from 'firebase/database';
import Comment from './Comment';
import './Home.css';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDescModal, setShowDescModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentDesc, setCurrentDesc] = useState('');
  const [currentSongId, setCurrentSongId] = useState(null);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://sell-your-songs-default-rtdb.firebaseio.com/ListSong1.json');
        const data = response.data;
        const formattedData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setSongs(formattedData);
        setFilteredSongs(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://sell-your-songs-default-rtdb.firebaseio.com/ListSong1.json');
        const data = response.data;
        const categoriesSet = new Set();
        Object.values(data).forEach(song => {
          if (song.category) {
            categoriesSet.add(song.category);
          }
        });
        setCategories(Array.from(categoriesSet));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredSongs(
      songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, songs]);

  useEffect(() => {
    setFilteredSongs(
      selectedCategory
        ? songs.filter(song => song.category === selectedCategory)
        : songs
    );
  }, [selectedCategory, songs]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          const dbRef = ref(database);
          const snapshot = await get(child(dbRef, `users/${user.uid}`));
          const userData = snapshot.val();
          setUserName(userData ? userData.nama : user.email);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenDescModal = (desc) => {
    setCurrentDesc(desc);
    setShowDescModal(true);
  };

  const handleCloseDescModal = () => {
    setShowDescModal(false);
    setCurrentDesc('');
  };

  const handleOpenCommentModal = (songId) => {
    if (!user) {
      navigate('/login');
    } else {
      setCurrentSongId(songId);
      setShowCommentModal(true);
    }
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setCurrentSongId(null);
  };

  const handlePlayAudio = (songId) => {
    const audioElement = document.getElementById(`audio-${songId}`);

    if (currentSongId === songId) {
      if (audioElement) {
        audioElement.pause();
        setCurrentSongId(null);
      }
    } else {
      if (currentSongId !== null) {
        const currentAudioElement = document.getElementById(`audio-${currentSongId}`);
        if (currentAudioElement) {
          currentAudioElement.pause();
        }
      }

      setCurrentSongId(songId);
      if (audioElement) {
        audioElement.play();
      }
    }
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        setUser(null);
        setUserName('');
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleIconClick = () => {
    navigate('/sys-info-and-uploud');
  };

  const handlePaymentClick = (song) => {
    // Navigate to Payment.js with the selected song data
    navigate('/payment', { state: { song } });
  };

  return (
    <div className="container">
      <div className="title">
        <img src="https://firebasestorage.googleapis.com/v0/b/sell-your-songs.appspot.com/o/Sys.png?alt=media&token=290960a9-fc63-492e-8498-f5d093782f0d" alt="Logo" className="logo" />
      </div>

      {user && (
        <p>Hai, {userName} (Sedang Online)</p>
      )}

      <p>"Sebarkan lagu ekslusif Anda ke akses global"</p>

      <input
        type="text"
        placeholder="Cari judul lagu..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="filter-input"
      />

      <div className="category-container">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-card"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </div>
        ))}
      </div>

      <div className="song-cards">
        {filteredSongs.slice().reverse().map((song) => (
          <div key={song.id} className="song-card">
            <h4>{song.title}</h4>
            <p>{song.songwriter}</p>
            <button
              style={{ backgroundColor: 'blue', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}
              onClick={() => handleOpenDescModal(song.desc)}
            >
              Deskripsi Lagu
            </button>
            <button
              style={{ backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}
              onClick={() => handleOpenCommentModal(song.id)}
            >
              Komentar
            </button>
            <p>Download fee: {song.priceDownload}</p>
            <p>Lisensi Fee: {song.licensingFee}</p>
            <p>Timestamp Rilis: {song.timestampRilis}</p>
            <p>Song Trailer klik button play</p>
            <div>
              <img
                src={currentSongId === song.id
                  ? "https://firebasestorage.googleapis.com/v0/b/sell-your-songs.appspot.com/o/pausebtn.png?alt=media&token=1620b7f3-0b25-42bd-a80b-2770da6901c4"
                  : "https://firebasestorage.googleapis.com/v0/b/sell-your-songs.appspot.com/o/playbtn.png?alt=media&token=0b427d12-bdfa-47c0-93fd-b122f8876fd3"
                }
                alt={currentSongId === song.id ? "Pause" : "Play"}
                onClick={() => handlePlayAudio(song.id)}
                style={{ cursor: 'pointer', width: '50px', height: '50px' }}
              />
              <audio id={`audio-${song.id}`}>
                <source src={song.trailerSong} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            <div>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/sell-your-songs.appspot.com/o/uang.png?alt=media&token=668b46f9-ef7f-481a-9e11-088b1f2f7917"
                alt="Payment"
                onClick={() => handlePaymentClick(song)}
                style={{ cursor: 'pointer', width: '50px', height: '50px', marginTop: '10px' }}
              />
            </div>
          </div>
        ))}
      </div>

      {showDescModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseDescModal}>&times;</span>
            <p className="modal-text">{currentDesc}</p>
          </div>
        </div>
      )}

      {showCommentModal && (
        <Comment
          songId={currentSongId}
          onClose={handleCloseCommentModal}
          userName={userName}
        />
      )}

{user && (
        <img
          src="https://firebasestorage.googleapis.com/v0/b/sell-your-songs.appspot.com/o/logout-icon.png?alt=media&token=ca0b7904-f2d2-4c3f-8394-2845a9d7e4ee"
          alt="Logout"
          onClick={handleLogout}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            width: '50px',
            height: '50px',
            cursor: 'pointer'
          }}
        />
      )}

      <img
        src="https://firebasestorage.googleapis.com/v0/b/sell-your-songs.appspot.com/o/nada.png?alt=media&token=f9b7c450-46fa-450f-9a5f-3c8b4a8ad02c"
        alt="Sys Info"
        onClick={handleIconClick}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          cursor: 'pointer'
        }}
      />
    </div>
  );
};

export default Home;
