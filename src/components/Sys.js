import React, { useState, useEffect } from 'react';
import { ref, get, update } from 'firebase/database';
import { storage, database } from './firebase';
import { uploadBytesResumable, getDownloadURL, ref as storageRef } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './Sys.css';

const Sys = () => {
  const [id, setId] = useState(1);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [songwriter, setSongwriter] = useState('');
  const [licensingFee, setLicensingFee] = useState('');
  const [priceDownload, setPriceDownload] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestId = async () => {
      try {
        const dbRef = ref(database, 'ListSong1');
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const ids = Object.keys(data).map((key) => parseInt(data[key].id, 10));
          const maxId = Math.max(...ids);
          setId(maxId + 1);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchLatestId();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload an audio file.');
      return;
    }
    setUploading(true);
    setError(null);

    const fileRef = storageRef(storage, `audio/${id}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress monitoring can be done here if needed
      },
      (err) => {
        setError('Error uploading file: ' + err.message);
        setUploading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const newSong = {
            id: id.toString(),
            title,
            desc,
            category,
            songwriter,
            licensingFee,
            priceDownload,
            trailerSong: url,
          };
          const dbRef = ref(database, 'ListSong1/' + id);
          await update(dbRef, newSong);
          setUploading(false);
          navigate('/');
        } catch (err) {
          setError('Error saving data: ' + err.message);
          setUploading(false);
        }
      }
    );
  };

  return (
    <div className="sys-container">
      <h2>Upload New Song</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID Lagu Anda: {id}</label>
        </div>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} required />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div>
          <label>Songwriter:</label>
          <input type="text" value={songwriter} onChange={(e) => setSongwriter(e.target.value)} required />
        </div>
        <div>
          <label>Licensing Fee:</label>
          <input type="text" value={licensingFee} onChange={(e) => setLicensingFee(e.target.value)} required />
        </div>
        <div>
          <label>Price Download:</label>
          <input type="text" value={priceDownload} onChange={(e) => setPriceDownload(e.target.value)} required />
        </div>
        <div>
          <label>Upload MP3:</label>
          <input type="file" accept=".mp3" onChange={handleFileChange} required />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Song'}
        </button>
      </form>
      {/* New content below the form */}
      <div className="image-section">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/sell-your-songs.appspot.com/o/InfoKompetisi%20Acer.png?alt=media&token=b01af35f-cfee-4cac-8ba7-26f531fe52be"
          alt="Info Kompetisi Acer"
          className="info-image"
        />
        <a
          href="https://www.instagram.com/p/C-sQoNZyVak/?utm_source=ig_web_copy_link"
          target="_blank"
          rel="noopener noreferrer"
          className="view-more-link"
        >
          View more info
        </a>
      </div>
    </div>
  );
};

export default Sys;
