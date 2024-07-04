import React, { useState } from "react";
import { setAuthUser } from "../../../helper/Storage";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    err: [],
  });
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const { role, token , user_id} = data;
        setAuthUser({ role, token , user_id });

        // Dispatch custom event to trigger authentication state update
        window.dispatchEvent(new Event("authChange"));

        history.push("/blog");
      } else {
        if (data.errors && data.errors.length > 0) {
          const errorMessages = data.errors.map((error) => error.msg);
          setFormData({ ...formData, err: errorMessages });
        } else {
          setFormData({ ...formData, err: ["An unknown error occurred"] });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <section className="contact mb">
        <div className="container">
          <form className="shadow" onSubmit={handleSubmit}>
            <h4>Login</h4>
            {formData.err.length > 0 && (
              <div style={{ color: "red" }}>
                {formData.err.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
