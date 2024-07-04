import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./CartPage.css";
import img from "../images/about.jpg";
import Back from "../common/Back";
import { getAuthUser } from "../../helper/Storage";

// Define the StarRating component
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
  const [location, setLocation] = useState("");
  const [type, setSchoolType] = useState("");
  const [search, setSearch] = useState("");
  const [noSchoolsFound, setNoSchoolsFound] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [schoolTypeOptions, setSchoolTypeOptions] = useState([]);
  const [fees, setfees] = useState([0, 10000]);
  const [favorites, setFavorites] = useState([]);
  const [addedToFavorites, setAddedToFavorites] = useState(false);
  const [user_id, setUserId] = useState(null);

 

  useEffect(() => {
    const loggedInUser = getAuthUser();
    if (loggedInUser && loggedInUser.user_id) {
      setUserId(loggedInUser.user_id);
    }
  }, []);
  useEffect(() => {
    const fetchfeesRange = async () => {
      try {
        const response = await fetch('http://localhost:4000/Schools/feesRange');
        const data = await response.json();
        setfees([data.minfees, data.maxfees]);
      } catch (error) {
        console.error('Error fetching fees range:', error);
      }
    };
  
    fetchfeesRange();
  }, []);
  
  
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:4000/Schools/schoollocations');
        const data = await response.json();
        setLocationOptions(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    const fetchSchoolTypes = async () => {
      try {
        const response = await fetch('http://localhost:4000/Schools/schoolTypes');
        const data = await response.json();
        setSchoolTypeOptions(data);
      } catch (error) {
        console.error('Error fetching school types:', error);
      }
    };

    fetchLocations();
    fetchSchoolTypes();
  }, []);

  const fetchSchoolsByLocation = async () => {
    try {
      const response = await fetch(`http://localhost:4000/Schools/filterByLocation/${location}`);
      const data = await response.json();

      if (!Array.isArray(data)) {
        setNoSchoolsFound(true);
        return;
      }

      if (data.length === 0) {
        setNoSchoolsFound(true);
      } else {
        setNoSchoolsFound(false);
        const schoolsWithRatings = data.map(async (school) => {
          const averageRating = await fetchAverageRatings(school.ID);
          return { ...school, averageRating };
        });

        const schoolsData = await Promise.all(schoolsWithRatings);
        setSchools(schoolsData);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  useEffect(() => {
    fetchSchoolsByLocation();
  }, [location]);

  const fetchSchoolsByType = async () => {
    try {
      const response = await fetch(`http://localhost:4000/Schools/filterByType/${type}`);
      const data = await response.json();

      if (!Array.isArray(data)) {
        setNoSchoolsFound(true);
        return;
      }

      if (data.length === 0) {
        setNoSchoolsFound(true);
      } else {
        setNoSchoolsFound(false);
        const schoolsWithRatings = data.map(async (school) => {
          const averageRating = await fetchAverageRatings(school.ID);
          return { ...school, averageRating };
        });

        const schoolsData = await Promise.all(schoolsWithRatings);
        setSchools(schoolsData);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  useEffect(() => {
    fetchSchoolsByType();
  }, [type]);

  const fetchAverageRatings = async (school_id) => {
    try {
      const response = await fetch(`http://localhost:4000/Schools/averagerating/${school_id}`);
      const data = await response.json();
      return data.averageRating;
    } catch (error) {
      console.error("Error fetching average rating:", error);
      return null;
    }
  };

  const fetchSchools = async (query = "") => {
    try {
      const response = await fetch(`http://localhost:4000/Schools/search?search=${query}&location=${location}&minfees=${fees[0]}&maxfees=${fees[1]}&type=${type}`);
      const data = await response.json();
      
  
      if (!Array.isArray(data)) { // Corrected this line
        setNoSchoolsFound(true);
        return;
      }
  
      if (data.length === 0) {
        setNoSchoolsFound(true);
      } else {
        setNoSchoolsFound(false);
        const schoolsWithRatings = data.map(async (school) => {
          const averageRating = await fetchAverageRatings(school.ID);
          return { ...school, averageRating };
        });
  
        const schoolsData = await Promise.all(schoolsWithRatings);
        setSchools(schoolsData);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };
  
  
  useEffect(() => {
    fetchSchools();
  }, [location, type, fees]);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchSchools(search);
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
      const response = await fetch('http://localhost:4000/Schools/favorites', {
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

  const handlefeesChange = (e) => {
    const minfees = e.target.value;
    const maxfees = fees[1];
    setfees([minfees, maxfees]);
  };
  

  

  return (
    <div className="cart-page">
      <Back name="" title="Search Your Next School" cover={img} />
      <form className='flex' style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '40px', backgroundColor: 'white' }} onSubmit={handleSearch}>
        <div className='box'>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'black' }}>City/Street</span>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Select Location</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div className='box'>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'black' }}>School Type</span>
          <select value={type} onChange={(e) => setSchoolType(e.target.value)}>
            <option value="">Select School Type</option>
            {schoolTypeOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className='box'>
  <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'black' }}>Budget</span>
  <input
    type="range"
    min="1000"
    max="99520"
    value={fees[0]}
    className="slider"
    id="feesRange"
    onChange={handlefeesChange}
  />
  <div className="fees-values">
    <span>{fees[0]}</span> - <span>{fees[1]}</span>
  </div>
</div>
        <div className='box'>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'black' }}>Search</span>
          <input type='text' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className='btn1' type='submit'>
          <i className='fa fa-search'></i>
        </button>
      </form>
  
      {noSchoolsFound ? (
        <div className="no-schools-found">
          <h2>No schools found</h2>
          <p>Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="school-list">
        {currentSchools.map((school) => (
          <div key={school.ID} className="school-item">
            <div className="img">
              {school.image_url && <img src={school.image_url} alt={school.school_name} />}
            </div>
            <div className="text">
              <div className="category flex">
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'black' }}>{school.location}</span>
                <i className="fa fa-heart" onClick={() => toggleFavorite(school.ID)} style={{ color: favorites.includes(school.ID) ? 'blue' : 'black', cursor: 'pointer' }}></i>
              </div>
              <h1 className="title" onClick={() => handleDetailsPageClick(school.ID)}>{school.school_name}</h1>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'black' }}>{school.fees}</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'black' }}>{school.description}</p>
              <div className="rating">
                <StarRating rating={school.averageRating} />
              </div>
              <button className="details-button" onClick={() => handleDetailsPageClick(school.ID)}>Show Details</button>
            </div>
          </div>
        ))}
      </div>
      )}
  
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
  );}


export default CartPage;
