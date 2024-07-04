import React, { useState } from "react";
import { setAuthUser } from "../../../helper/Storage";
import { useHistory } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    loading: false,
    err: [],
  });
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Set the authentication user
        setAuthUser(data);

        // Dispatch custom event to trigger authentication state update
        window.dispatchEvent(new Event("authChange"));

        // Redirect to another page
        history.push("/blog"); // Change "/blog" to the desired URL
      } else {
        // Handle registration error
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
            <h4>Fill up The Form</h4> <br />
            {formData.err.length > 0 && (
              <div style={{ color: "red" }}>
                {formData.err.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <button type="submit">Submit Request</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
