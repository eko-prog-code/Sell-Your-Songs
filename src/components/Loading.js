import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/sell-your-songs.appspot.com/o/nada.png?alt=media&token=f9b7c450-46fa-450f-9a5f-3c8b4a8ad02c"
        alt="Loading"
        className="loading-image"
      />
    </div>
  );
};

export default Loading;
