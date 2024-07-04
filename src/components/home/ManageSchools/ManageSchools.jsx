import React, { useState } from "react";
import Back from "../../common/Back";
import "./ManageSchools.css";
import axios from "axios";

const ManageSchools = () => {
  const [formData, setFormData] = useState({
    school_name: "",
    type: "",
    location: "",
    fees: "",
    image_url: "",
    cert: "",
    phone_number: "",
    description_head: "",
    fees_list: "",
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/Schools/create_school", formData);
      console.log(response.data);
      setMessage("School created successfully!");
      setTimeout(() => {
        setMessage(null);
      }, 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error("There was an error creating the school!", error);
      setMessage("There was an error creating the school.");
      setTimeout(() => {
        setMessage(null);
      }, 1000); // Hide message after 3 seconds
    }
  };

  return (
    <>
      <section className="contact mb">
        <Back
          name="Manage your School"
          title="Create an optimal learning environment for students"
        />
      </section>
      <section className="contact mb">
        <div className="container">
          <form className="shadow" onSubmit={handleSubmit}>
            <h4>Fillup The Form</h4> <br />
            <div>
              <input
                type="text"
                name="school_name"
                placeholder="Name of School"
                value={formData.school_name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="type"
                placeholder="Type"
                value={formData.type}
                onChange={handleChange}
              />
            </div>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />
            <input
              type="text"
              name="fees"
              placeholder="Fees"
              value={formData.fees}
              onChange={handleChange}
            />
            <input
              type="text"
              name="image_url"
              placeholder="Image URL"
              value={formData.image_url}
              onChange={handleChange}
            />
            <input
              type="text"
              name="cert"
              placeholder="Certification"
              value={formData.cert}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
            />
            <input
              type="text"
              name="description_head"
              placeholder="Description Header"
              value={formData.description_head}
              onChange={handleChange}
            />
            <textarea
              name="fees_list"
              placeholder="Fees List"
              value={formData.fees_list}
              onChange={handleChange}
            />
            <button type="submit">Submit Request</button>
            {message && <p>{message}</p>}
          </form>
        </div>
      </section>
    </>
  );
};

export default ManageSchools;
