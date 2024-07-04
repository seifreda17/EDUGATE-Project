import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./FavoriteList.css";
import img from "../images/about.jpg";
import Back from "../common/Back";
import { getAuthUser } from "../../helper/Storage";

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<span key={i} className="star-filled">&#9733;</span>);
    } else {
      stars.push(<span key={i} className="star">&#9733;</span>);
    }
  }
  return <div>{stars}</div>;
};

const CartPage = () => {
  const history = useHistory();
  const [schools, setSchools] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [schoolsPerPage] = useState(30);
  const [favorites, setFavorites] = useState([]);
  const [user_id, setUserId] = useState(null);

  useEffect(() => {
    const loggedInUser = getAuthUser();
    if (loggedInUser && loggedInUser.user_id) {
      setUserId(loggedInUser.user_id);
    }
  }, []);

  useEffect(() => {
    if (user_id) {
      fetchFavoriteSchools(user_id);
    }
  }, [user_id]);

  const fetchFavoriteSchools = async (user_id) => {
    try {
      const response = await fetch(`http://localhost:4000/Schools/favoritesList/${user_id}`);
      const data = await response.json();
      if (response.ok) {
        setSchools(data.schools);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching favorite schools:", error);
    }
  };

  const handleDetailsPageClick = (ID) => {
    history.push(`../DetailsPage/${ID}`);
  };

  const toggleFavorite = async (schoolId) => {
    try {
      const updatedFavorites = favorites.includes(schoolId)
        ? favorites.filter((id) => id !== schoolId)
        : [...favorites, schoolId];

      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      const method = favorites.includes(schoolId) ? 'DELETE' : 'POST';
      const response = await fetch('http://localhost:4000/Schools/favoritesList', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id_fav: user_id,
          school_id: schoolId,
        }),
      });

      if (!response.ok) {
        console.error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const indexOfLastSchool = currentPage * schoolsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
  const currentSchools = schools.slice(indexOfFirstSchool, indexOfLastSchool);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="cart-page">
      <Back name="" title="Search Your Next School" cover={img} />
      <div className="school-list">
        {currentSchools.map((school) => (
          <div key={school.id} className="school-item">
            <div className="img">
              {school.image && <img src={school.image} alt={school.name} />}
            </div>
            <div className="text">
              <div className="category flex">
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'black' }}>{school.location}</span>
                <i className="fa fa-heart" onClick={() => toggleFavorite(school.id)} style={{ color: favorites.includes(school.id) ? 'blue' : 'black', cursor: 'pointer' }}></i>
              </div>
              <h1 className="title" onClick={() => handleDetailsPageClick(school.id)}>{school.name}</h1>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'black' }}>{school.fees}</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'black' }}>{school.description}</p>
              <div className="rating">
                {/* <StarRating rating={school.averageRating} /> */}
              </div>
              <button className="details-button" onClick={() => handleDetailsPageClick(school.id)}>Show Details</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => paginate(1)} disabled={currentPage === 1}>First</button>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        {[...Array(Math.ceil(schools.length / schoolsPerPage)).keys()].map((number) => (
          <button key={number} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>
            {number + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(schools.length / schoolsPerPage)}>Next</button>
        <button onClick={() => paginate(Math.ceil(schools.length / schoolsPerPage))} disabled={currentPage === Math.ceil(schools.length / schoolsPerPage)}>Last</button>
      </div>
    </div>
  );
};

export default CartPage;
