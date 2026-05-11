import React, { useState } from "react";
import Button from "./Button";
import Typography from "./Typography";
import "./StatePlaceholder.css";

const StatePlaceholder = ({ 
  type = "error", 
  code, 
  title, 
  message, 
  actionText, 
  onAction 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isError = type === "error";
  const isLoading = type === "loading";
  const isEmpty = type === "empty";

  const getErrorContent = (code) => {
    switch (String(code)) {
      case "401":
        return {
          title: "Eh, kamu siapa?",
          message: "Sepertinya kamu perlu masuk dulu untuk melihat halaman ini. Jangan khawatir, prosesnya cuma butuh sebentar kok!",
          action: "Masuk Sekarang",
          icon: "↗"
        };
      case "403":
        return {
          title: "Oops! Area Terbatas.",
          message: "Kamu tidak memiliki izin untuk masuk ke halaman ini. Kalau kamu merasa ini kesalahan, coba hubungi Admin atau pemilik proyeknya ya.",
          action: "Kembali ke Beranda",
          icon: "↗"
        };
      case "500":
        return {
          title: "Waduh, server kami lagi pusing.",
          message: "Ada sedikit kendala teknis di pihak kami. Tim kami sudah meluncur untuk memperbaikinya. Coba refresh halaman ini dalam beberapa saat lagi ya.",
          action: "Muat Ulang Halaman",
          secondaryAction: "Laporkan Masalah",
          icon: "↗"
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
          action: "Balik ke Beranda",
          icon: "↗"
        };
    }
  };

  const errorContent = isError ? getErrorContent(code) : {};

  const handlePrimaryAction = () => {
    if (code === "500") {
      window.location.reload();
    } else if (code === "503") {
      setIsConnecting(true);
      setTimeout(() => setIsConnecting(false), 3000);
    } else if (onAction) {
      onAction();
    }
  };

  const handleWhatsAppReport = () => {
    const pageName = window.location.pathname === "/" ? "Home" : window.location.pathname;
    const text = `Halo, saya ingin lapor kendala Error ${code || 'Unknown'} di halaman ${pageName}`;
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <>
      <div className="state-placeholder">
        <div className="state-content">
          <div className="state-visual">
            {isLoading && <div className="state-spinner"></div>}
            
            {isError && (
              <div className="state-code-box">
                <Typography variant="h1" color="primary" align="center">
                  {code || "404"}
                </Typography>
              </div>
            )}

            {isEmpty && <div className="state-empty-icon">📁</div>}
          </div>

          <div className="state-text">
            <Typography variant="h3" color="neutral" align="center" className="state-title">
              {title || errorContent.title || (isLoading ? "Tunggu Sebentar, Ya..." : "Datanya Kosong, Nih!")}
            </Typography>

            <Typography variant="body" color="neutral" align="center" className="state-message">
              {message || errorContent.message || (isLoading ? "Sedang memproses permintaanmu. Harap tunggu..." : "Sepertinya belum ada data yang bisa ditampilkan di sini.")}
            </Typography>
          </div>

          <div className="state-action-group">
            {(onAction || isError) && (
              <Button 
                onClick={handlePrimaryAction} 
                disabled={isConnecting}
                iconRight={errorContent.icon}
              >
                {actionText || errorContent.action || (isConnecting ? "Mencoba kembali..." : "Kembali")}
              </Button>
            )}

            {code === "500" && (
              <Button 
                variant="outline" 
                onClick={() => setShowModal(true)}
                className="btn-report-problem"
              >
                {errorContent.secondaryAction}
              </Button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <div className="modal-body">
              <div className="modal-visual">
                <img src="/modal-illustration.png" alt="Reporting" className="modal-image" />
              </div>
              <Typography variant="h4" color="neutral" align="center">
                Kasih Tahu Tim Kami!
              </Typography>
              <Typography variant="sm" color="neutral" align="center">
                Biar nggak bingung sendiri, yuk laporin eror ini ke WhatsApp biar langsung ditanganin sama ahlinya.
              </Typography>
              <Button onClick={handleWhatsAppReport}>
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
