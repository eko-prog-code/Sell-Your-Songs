import React from 'react';
import { useLocation } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const { song } = location.state || {};

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText('901374863833');
    alert('No Rekening berhasil disalin!');
  };

  const handleWhatsAppChat = () => {
    window.open('https://wa.me/+62895600394345', '_blank');
  };

  return (
    <div className="payment-container">
      <h2>Informasi Pembayaran</h2>
      <p><strong>Bank Account:</strong> SeaBank a.n Eko Setiaji</p>
      <p><strong>No Rekening:</strong> 901374863833</p>
      <button onClick={handleCopyAccountNumber} className="copy-button">Salin No Rekening</button>

      <h3>Detail Lagu</h3>
      {song ? (
        <div>
          <p><strong>Judul Lagu:</strong> {song.title}</p>
          <p><strong>Penulis Lagu:</strong> {song.songwriter}</p>
          <p><strong>Deskripsi:</strong> {song.desc}</p>
          <p><strong>Kategori:</strong> {song.category}</p>
          <p><strong>Harga Download:</strong> {song.priceDownload}</p>
          <p><strong>Lisensi Fee:</strong> {song.licensingFee}</p>
        </div>
      ) : (
        <p>Tidak ada detail lagu yang tersedia.</p>
      )}

      <button onClick={handleWhatsAppChat} className="whatsapp-button">
        Chat Eko Setiaji
      </button>
    </div>
  );
};

export default Payment;
