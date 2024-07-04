import React, { useState } from "react";
import img from "../images/pricing.jpg";
import Back from "../common/Back";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import "./contact.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name field can't be empty";
        if (!formData.email) newErrors.email = "Email field can't be empty";
        if (!formData.subject) newErrors.subject = "Subject field can't be empty";
        if (!formData.message) newErrors.message = "Message field can't be empty";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/Users/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed to send contact message");
            }

            const result = await response.json();
            setSuccessMessage(result.message); // Display success message
            setFormData({ name: "", email: "", subject: "", message: "" }); // Reset form fields

            // Remove success message after 2 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 2000);
        } catch (error) {
            console.error(error);
            setSuccessMessage("Error sending contact message");
        }
    };

    return (
        <>
            <section className='contact mb'>
                <Back name='Contact Us' title='Get Help & Friendly Support' cover={img} />
                <div className='container'>
                    <form className='shadow' onSubmit={handleSubmit}>
                        <h4>Talk To Our Team</h4> <br />
                        <div>
                            <input
                                type='text'
                                name='name'
                                placeholder='Name'
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            {errors.name && <p className='error'>{errors.name}</p>}
                            <input
                                type='email'
                                name='email'
                                placeholder='Email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <p className='error'>{errors.email}</p>}
                        </div>
                        <input
                            type='text'
                            name='subject'
                            placeholder='Subject'
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                        {errors.subject && <p className='error'>{errors.subject}</p>}
                        <textarea
                            name='message'
                            cols='30'
                            rows='10'
                            placeholder='Message'
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                        {errors.message && <p className='error'>{errors.message}</p>}
                        <button type='submit'>Submit Request</button>
                    </form>
                    {successMessage && <p className='success-message'>{successMessage}</p>}
                    <div className='social-media'>
                        <h4>You can Visit us on</h4>
                        <div className='icons'>
                            <a href='https://www.facebook.com/profile.php?id=61560428962576&mibextid=LQQJ4d' target='_blank' rel='noopener noreferrer'>
                                <FontAwesomeIcon icon={faFacebook} size='2x' />
                            </a>
                            <a href='https://www.instagram.com/edu.gate2024/?igsh=MTFic3FsNTVtOHMxdQ%3D%3D&utm_source=qr' target='_blank' rel='noopener noreferrer'>
                                <FontAwesomeIcon icon={faInstagram} size='2x' />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
