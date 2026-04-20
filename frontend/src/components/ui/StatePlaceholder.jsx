import React, { useState, useEffect } from "react";
import Typography from "./Typography";
import Button from "./Button";
import "./StatePlaceholder.css";

const StatePlaceholder = ({
  type,
  code,
  title,
  message,
  onAction,
  actionText
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Timer untuk 503 (Simulasi 10 menit, di demo buat 5 detik biar kelihatan)
  useEffect(() => {
    let timer;
    if (isConnecting && code === "503") {
      timer = setTimeout(() => {
        setIsConnecting(false);
      }, 5000); // Balik lagi setelah 5 detik (Demo)
    }
    return () => clearTimeout(timer);
  }, [isConnecting, code]);

  // Jika ada code, maka ini pasti error
  const isError = !!code || type === "error";
  // Loading hanya jika type memang loading ATAU tidak ada type DAN tidak ada code
  const isLoading = type === "loading" || (!type && !code);
  const isEmpty = type === "empty";

  // Dynamic Content based on Code
  const getErrorContent = (code) => {
    switch (String(code)) {
      case "401":
        return {
          title: "Eh, kamu siapa?",
          message: "Sepertinya kamu perlu masuk dulu untuk melihat halaman ini. Jangan khawatir, prosesnya cuma butuh sebentar kok!",
          action: "Masuk Sekarang"
        };
      case "403":
        return {
          title: "Oops! Area Terbatas.",
          message: "Kamu tidak memiliki izin untuk masuk ke halaman ini. Kalau kamu merasa ini kesalahan, coba hubungi Admin atau pemilik proyeknya ya.",
          action: "Kembali ke Beranda"
        };
      case "500":
        return {
          title: "Waduh, server kami lagi pusing.",
          message: "Ada sedikit kendala teknis di pihak kami. Tim kami sudah meluncur untuk memperbaikinya. Coba refresh halaman ini dalam beberapa saat lagi ya.",
          action: "Muat Ulang Halaman",
          secondaryAction: "Laporkan Masalah"
        };
      case "503":
        return {
          title: "Lagi istirahat sebentar ya.",
          message: "Kami sedang melakukan pemeliharaan sistem rutin agar pengalamanmu makin lancar. Tunggu beberapa menit, kami akan segera kembali!",
          action: isConnecting ? "Menghubungkan kembali..." : "Cek Status Sekarang"
        };
      case "404":
      default:
        return {
          title: "Halamannya Nyasar, Nih!",
          message: "Kami sudah cari ke setiap sudut, tapi halaman yang kamu tuju sepertinya sedang main petak umpet atau sudah pindah alamat. Yuk, balik ke jalan yang benar.",
          action: "Balik ke Beranda"
        };
    }
  };

  const errorContent = isError ? getErrorContent(code) : {};

  const handlePrimaryAction = () => {
    if (code === "500") {
      window.location.reload();
    } else if (code === "503") {
      setIsConnecting(true);
    } else if (onAction) {
      onAction();
    }
  };

  const handleWhatsAppReport = () => {
    const pageName = window.location.pathname;
    const waMessage = `Halo, saya ingin lapor kendala Error 500 di halaman ${pageName}`;
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <>
      <div className={`state-placeholder ${isError ? 'state-placeholder--error' : ''}`}>
        <div className="state-content">
          {/* State Visual (Icon/Code/Spinner) */}
          <div className="state-visual">
            {isError ? (
              <div className="state-code-box">
                <Typography variant="h1" color="primary" align="center">
                  {code || "404"}
                </Typography>
              </div>
            ) : isLoading ? (
              <div className="spinner"></div>
            ) : (
              <div className="empty-icon">📂</div>
            )}
          </div>

          {/* Text Content */}
          <div className="state-text">
            <Typography variant="h2" align="center" style={{ fontWeight: 800, textAlign: 'center' }}>
              {title || errorContent.title || (isLoading ? "Tunggu Sebentar, Ya..." : "Datanya Kosong, Nih!")}
            </Typography>

            <Typography variant="body" color="neutral" align="center" style={{ textAlign: 'center' }} className="state-message">
              {message || errorContent.message || (
                isLoading
                  ? "Sistem sedang menyiapkan data untukmu."
                  : "Sepertinya belum ada data yang bisa ditampilkan."
              )}
            </Typography>
          </div>

          {/* Action Button Group */}
          <div className="state-action-group">
            {(onAction || isError) && (
              <Button onClick={handlePrimaryAction} disabled={isConnecting}>
                {actionText || errorContent.action || "Kembali"}
              </Button>
            )}

            {code === "500" && (
              <Button variant="outline" onClick={() => setShowModal(true)} className="btn-report">
                {errorContent.secondaryAction}
              </Button>
            )}
          </div>

          {/* Footer Info (Khusus 503) */}
          {code === "503" && (
            <div style={{ marginTop: 'var(--gap-xl)' }}>
              <Typography variant="body" color="neutral" align="center" style={{ fontSize: '14px', opacity: 0.7 }}>
                Kami akan kembali online sekitar jam 14:00 WIB. Terima kasih sudah sabar menunggu!
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* Modal Report Problem */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <div className="modal-body">
              <div className="modal-visual">
                <span style={{ fontSize: '100px' }}>🎧</span>
              </div>
              <Typography variant="h2" align="center" style={{ fontWeight: 800, margin: 'var(--gap-md) 0' }}>
                Kasih Tahu Tim Kami!
              </Typography>
              <Typography variant="body" color="neutral" align="center" style={{ marginBottom: 'var(--gap-lg)' }}>
                Biar nggak bingung sendiri, yuk laporin eror ini ke WhatsApp biar langsung ditanganin sama ahlinya.
              </Typography>
              <Button onClick={handleWhatsAppReport} style={{ backgroundColor: '#25D366', color: 'white', border: 'none' }} fluid>
                Lapor via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatePlaceholder;
