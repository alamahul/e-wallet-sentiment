import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import StatePlaceholder from "../../components/ui/StatePlaceholder";
import Typography from "../../components/ui/Typography";
import Card from "../../components/ui/Card";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = () => {
    setLoading(true);
    setMessage("");
    setError("");

    setTimeout(() => {
      if (email) {
        setMessage(`Verification email sent to ${email}`);
      } else {
        setError("Email address not found");
      }

      setLoading(false);

      setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
    }, 1500);
  };

  if (!email && !loading) {
    return (
      <StatePlaceholder 
        type="empty" 
        title="Email Belum Terdaftar" 
        message="Silakan daftar terlebih dahulu sebelum melakukan verifikasi email."
        onAction={() => navigate("/register")}
        actionText="Daftar Sekarang"
      />
    );
  }

  if (loading) {
    return <StatePlaceholder type="loading" title="Mengirim Ulang Email..." />;
  }

  return (
    <div className="verify-container" style={{ padding: "var(--gap-xl) var(--gap-md)" }}>
      <Card radius="lg" style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        <Typography variant="h2" style={{ marginBottom: "var(--gap-lg)" }}>
          Verify Your Email
        </Typography>

        <div style={{ marginBottom: "var(--gap-lg)" }}>
          <Typography variant="body" color="neutral">
            We've sent a verification link to:
          </Typography>
          <Typography variant="body" style={{ fontWeight: "bold", margin: "var(--gap-xs) 0" }}>
            {email}
          </Typography>
          <Typography variant="body" color="neutral">
            Please check your inbox and click the verification link to activate
            your account.
          </Typography>
        </div>

        {message && (
          <div style={{ padding: "var(--gap-sm)", background: "var(--color-primary-100)", borderRadius: "var(--radius-md)", marginBottom: "var(--gap-md)" }}>
             <Typography variant="body" style={{ color: "var(--color-primary-600)" }}>
                ✅ {message}
             </Typography>
          </div>
        )}

        {error && (
          <div style={{ marginBottom: "var(--gap-md)" }}>
             <Typography variant="body" color="error">
                ⚠️ {error}
             </Typography>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-sm)" }}>
          <Button onClick={() => navigate("/login")} fluid>
            I've Verified My Email
          </Button>
          
          <Button onClick={handleResend} variant="outline" fluid>
            Resend Verification Email
          </Button>
        </div>

        <div style={{ marginTop: "var(--gap-lg)" }}>
          <Link to="/login">
             <Typography variant="body" color="neutral">Back to Login</Typography>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default VerifyEmail;
