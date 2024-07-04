import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./CommentsTable.css";
import "./DetailsPage.css";
import "./BudgetTable.css"; // Import the BudgetTable CSS
import Back from "../common/Back";
import img from "../images/about.jpg";
import { getAuthUser } from "../../helper/Storage"; // Import the storage function

const Detailspage = () => {
  const [school, setSchool] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [user_id, setUserId] = useState(null);

  const { ID } = useParams();

  useEffect(() => {
    const loggedInUser = getAuthUser();
    if (loggedInUser && loggedInUser.user_id) {
      setUserId(loggedInUser.user_id);
    }
  }, []);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await fetch(`http://localhost:4000/Schools/show/${ID}`);
        if (!response.ok) {
          throw new Error("School not found");
        }
        const data = await response.json();
        setSchool(data[0]);
      } catch (err) {
        console.error("Error fetching school:", err);
      }
    };
    fetchSchool();
  }, [ID]);

  const handleRating = (index) => {
    setRating(index + 1);
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:4000/Schools/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          school_id: ID,
          rating,
          comment,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add rating.");
      }
      setSuccessMessage("Rating added successfully.");
      setRating(0);
      setComment("");
      fetchComments();
      setTimeout(() => {
        setSuccessMessage("");
      }, 1000);
    } catch (err) {
      console.error("Error adding rating:", err);
      alert("Failed to add rating. Please try again.");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:4000/Schools/comments/${ID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments.");
      }
      const data = await response.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ID]);

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) => (
          <FaStar key={index} className={index < rating ? "star active" : "star"} />
        ))}
      </div>
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <>
      <section className="Detailspage">
        <Back name="" title="More Details About Us - Who We Are?" cover={img} />
        <div className="container flex mtop">
          <div className="left row">
            {school ? (
              <div>
                <h2>{school.school_name}</h2>
                <img src={school.image_url} alt="" />
                <p>Certificate: {school.cert}</p>

                <p>Type: {school.type}</p>
                
                <p>Location: {school.location}</p>

               

                <p class="phone-number">{school.phone_number}</p>

                <p>{school.description_head}</p>

                <a href={school.school_link} target="_blank" class="visit-link">Visit us : {school.school_link}</a>
                {/* Stage and Price Table */}
                <div className="stage-price-table-container">
                  <h2>Fees List</h2>
                  <table className="stage-price-table">
                    <thead>
                      <tr>
                        <th>Stage</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {school.stage.split(',').map((stage, index) => (
                        <tr key={index}>
                          <td>{stage.trim()}</td>
                          <td>{school.price.split(',')[index].trim()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p>Loading school details...</p>
            )}

            <div className="rating-container">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`star ${index < rating ? "active" : ""}`}
                  onClick={() => handleRating(index)}
                />
              ))}
            </div>

            <div className="comment-container">
              <textarea
                className="comment-field"
                placeholder="Write your comment here..."
                value={comment}
                onChange={handleComment}
              ></textarea>
              <button className="comment-btn" onClick={handleSubmit}>
                Submit
              </button>
              <p className="success-message">{successMessage}</p>
            </div>
          </div>
        </div>

        <div className="right row">
          <div className="table-container">
            <table className="comments-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Comment</th>
                  <th>Rating</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, index) => (
                  <tr key={index}>
                    <td>{comment.name}</td>
                    <td>{comment.comment}</td>
                    <td>{renderStars(comment.rating)}</td>
                    <td>{formatDate(comment.timestamp)}</td>
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

export default Detailspage;