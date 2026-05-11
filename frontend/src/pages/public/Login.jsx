import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import StatePlaceholder from "../../components/ui/StatePlaceholder";
import Typography from "../../components/ui/Typography";
import Card from "../../components/ui/Card";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("token", "dummy-token");
        navigate("/dashboard");
      } else {
        setError("Email and password are required");
      }

      setLoading(false);
    }, 1500);
  };

  if (loading) {
    return <StatePlaceholder type="loading" />;
  }

  return (
    <div className="login-container" style={{ padding: "var(--gap-xl) var(--gap-md)" }}>
      <Card className="login-card" radius="lg" style={{ maxWidth: "440px", margin: "0 auto" }}>
        <Typography variant="h2" align="center" style={{ marginBottom: "var(--gap-lg)" }}>
          Login
        </Typography>

        {error && (
          <div style={{ marginBottom: "var(--gap-md)" }}>
             <Typography variant="body" color="error" align="center">
                ⚠️ {error}
             </Typography>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "var(--gap-sm)" }}>
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "var(--gap-lg)" }}>
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" fluid>
            Login
          </Button>
        </form>

        <div style={{ marginTop: "var(--gap-xl)", textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--gap-xs)" }}>
          <Link to="/forgot-password">
            <Typography variant="body" color="primary">Forgot Password?</Typography>
          </Link>
          <Link to="/register">
             <Typography variant="body" color="primary">Create Account</Typography>
          </Link>
          <Link to="/">
             <Typography variant="body" color="neutral">Back to Home</Typography>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
