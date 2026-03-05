import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #0a0a0f; font-family: 'DM Sans', sans-serif; color: #f0f0f5; }

  .login-bg {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background: #0a0a0f;
  }

  .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18; animation: float 8s ease-in-out infinite; }
  .orb1 { width: 400px; height: 400px; background: #43e97b; top: -100px; right: -100px; animation-delay: 0s; }
  .orb2 { width: 300px; height: 300px; background: #6c63ff; bottom: -80px; left: -80px; animation-delay: 3s; }
  .orb3 { width: 200px; height: 200px; background: #ff6584; top: 50%; left: 20%; animation-delay: 5s; }

  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-30px) scale(1.05); }
  }

  .login-card {
    position: relative; z-index: 10;
    background: rgba(17,17,24,0.85);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 48px 40px;
    width: 100%; max-width: 420px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(67,233,123,0.08);
    animation: slideUp 0.5s ease both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .login-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; justify-content: center; }
  .logo-dot { width: 12px; height: 12px; background: #43e97b; border-radius: 50%; box-shadow: 0 0 16px #43e97b; }
  .logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: #f0f0f5; }

  .login-heading { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #f0f0f5; margin-bottom: 6px; text-align: center; }
  .login-sub { font-size: 14px; color: #6b6b80; text-align: center; margin-bottom: 32px; }

  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 12px; color: #6b6b80; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; font-weight: 600; }
  .field-wrap { position: relative; }
  .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 15px; color: #6b6b80; pointer-events: none; }

  .login-input {
    width: 100%; background: #1a1a24;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px; padding: 12px 14px 12px 40px;
    color: #f0f0f5; font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .login-input:focus { border-color: #43e97b; box-shadow: 0 0 0 3px rgba(67,233,123,0.12); }
  .login-input::placeholder { color: #6b6b80; }

  .login-btn {
    width: 100%; padding: 14px;
    background: #43e97b; color: #0a0a0f;
    border: none; border-radius: 10px;
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em;
    margin-top: 8px; position: relative; overflow: hidden;
  }
  .login-btn:hover { background: #6fffa0; box-shadow: 0 0 24px rgba(67,233,123,0.4); transform: translateY(-1px); }
  .login-btn:active { transform: translateY(0); }
  .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .error-msg {
    background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.25);
    color: #f43f5e; border-radius: 8px; padding: 10px 14px;
    font-size: 13px; margin-top: 14px; text-align: center;
    animation: shake 0.3s ease;
  }
  .success-msg {
    background: rgba(67,233,123,0.1); border: 1px solid rgba(67,233,123,0.25);
    color: #43e97b; border-radius: 8px; padding: 10px 14px;
    font-size: 13px; margin-top: 14px; text-align: center;
  }

  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; }
  .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
  .divider-text { font-size: 12px; color: #6b6b80; }

  .register-link { text-align: center; font-size: 13px; color: #6b6b80; }
  .register-link span { color: #6c63ff; cursor: pointer; font-weight: 600; }
  .register-link span:hover { text-decoration: underline; }
`;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(""); setSuccess("");
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      await axios.post(
        "https://ticket-system-ashen-pi.vercel.app/api/auth/register",
        { name, email, password }
      );
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleRegister(); };

  return (
    <>
      <style>{styles}</style>
      <div className="login-bg">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />

        <div className="login-card">
          <div className="login-logo">
            <span className="logo-dot" />
            <span className="logo-text">Support Desk</span>
          </div>

          <h1 className="login-heading">Create account</h1>
          <p className="login-sub">Join Support Desk to manage your tickets</p>

          <div className="field">
            <label>Full Name</label>
            <div className="field-wrap">
              <span className="field-icon">👤</span>
              <input className="login-input" type="text" placeholder="John Doe"
                value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
          </div>

          <div className="field">
            <label>Email</label>
            <div className="field-wrap">
              <span className="field-icon">✉</span>
              <input className="login-input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="field-wrap">
              <span className="field-icon">🔒</span>
              <input className="login-input" type="password" placeholder="Min. 6 characters"
                value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
          </div>

          <button className="login-btn" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>

          {error && <div className="error-msg">⚠ {error}</div>}
          {success && <div className="success-msg">✓ {success}</div>}

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">already have an account?</span>
            <div className="divider-line" />
          </div>

          <div className="register-link">
            <span onClick={() => navigate("/")}>Sign in instead</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;