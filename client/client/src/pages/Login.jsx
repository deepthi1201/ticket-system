import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      const token = res.data.token;

      localStorage.setItem("token", token);

      alert("Login successful!");
      console.log(token);

    } catch (error) {
      alert("Login failed");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>Ticket System Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
