import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { auth } from './firebase';
import './Comment.css';

const Comment = ({ songId, onClose }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const commentsRef = ref(db, `comments/${songId}`);

    // Mendapatkan komentar dari Firebase
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Balik urutan komentar agar yang terbaru ada di atas
        setComments(data.reverse());
      } else {
        setComments([]);
      }
    });

    return () => unsubscribe(); // Bersihkan langganan saat komponen di-unmount
  }, [songId]);

  useEffect(() => {
    // Mendapatkan nama pengguna dari Firebase Authentication dan Realtime Database
    const user = auth.currentUser;
    if (user) {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.nama) {
          setUserName(userData.nama);
        } else {
          setUserName(user.email); // Sebagai fallback jika nama tidak ditemukan
        }
      });
    }
  }, []);

  const handleSendComment = () => {
    if (!comment.trim()) return; // Jangan kirim jika komentar kosong

    const timestamp = new Date().toISOString();
    const newComment = {
      text: comment,
      timestamp,
      userName
    };

    const newComments = [...comments, newComment];
    setComments(newComments);

    // Simpan komentar ke Firebase
    const db = getDatabase();
    set(ref(db, `comments/${songId}`), newComments)
      .then(() => {
        setComment('');
      })
      .catch((error) => {
        console.error('Error saving comment:', error);
      });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <ul className="comment-list">
          {comments.map((comment, index) => (
            <li key={index}>
              <p className="comment-text">{comment.text}</p>
              <p className="comment-meta">{comment.userName} - {new Date(comment.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
        <div className="comment-input">
          <input
            type="text"
            placeholder="Tulis komentar..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleSendComment}>Kirim</button>
        </div>
      </div>
    </div>
  );
  
};

export default Comment;
