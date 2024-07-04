import React, { useState, useEffect } from "react";
import img from "../images/pricing.jpg";
import Back from "../common/Back";
import "./ContactAdmin.css";

const ContactAdmin = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("http://localhost:4000/users/contact-messages");
        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <>
      <section className="contact mb">
        <Back name="FeedBack" title="Get Help & Friendly Support" cover={img} />
        <div className="container">
          <div className="table-container">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={index}>
                    <td>{submission.name}</td>
                    <td>{submission.email}</td>
                    <td>{submission.subject}</td>
                    <td>{submission.message}</td>
                    <td>{submission.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactAdmin;
