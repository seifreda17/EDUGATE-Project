// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getAuthUser } from "../../../helper/Storage"; // Import the storage function

// const RecommendedSchools = () => {
//   const [userId, setUserId] = useState(null);
//   const [recommendedSchools, setRecommendedSchools] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loggedInUser = getAuthUser();
//     if (loggedInUser && loggedInUser.user_id) {
//       setUserId(loggedInUser.user_id);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchRecommendedSchools = async () => {
//       try {
//         if (!userId) return;
  
//         const response = await axios.get(`http://localhost:4000/Schools/favorites/${userId}`);
//         const { schools, additionalData } = response.data;
  
//         // Assuming additionalData contains recommended schools
//         // Modify additionalData to include image_url for each school
//         additionalData.forEach((school) => {
//           school.image_url = schools.find(s => s.id === school.school_id)?.image || '';
//         });
  
//         setRecommendedSchools(additionalData);
//       } catch (err) {
//         setError(err.message);
//       }
//     };
  
//     fetchRecommendedSchools();
//   }, [userId]);
  
//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
      
//       <div className="content grid3 mtop">
//         {recommendedSchools && recommendedSchools.length > 0 && recommendedSchools.map((school, index) => {
//           const {  name,category, location, school_name, fees, type, image_url } = school;
//           return (
//             <div className="box shadow" key={index}>
//               {/* <div className="img">
//                 <img src={image_url} alt={image_url} />
//               </div> */}
//               <div className="text">
//                 <div className="category flex">
//                     </div>
//                 <h4>{school_name}</h4>
//                 <p>
//                   <i className="fa fa-location-dot"></i> {location}
//                 </p>
//               </div>
//               <div className="button flex">
//                 <div>
//                   <button className="btn2">{fees}</button>
//                 </div>
//                 {/* <span>{type}</span> */}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default RecommendedSchools;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthUser } from "../../../helper/Storage"; // Import the storage function
import "./RecommendedSchools.css"; // Import your CSS file

const RecommendedSchools = () => {
  const [userId, setUserId] = useState(null);
  const [recommendedSchools, setRecommendedSchools] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loggedInUser = getAuthUser();
    if (loggedInUser && loggedInUser.user_id) {
      setUserId(loggedInUser.user_id);
    }
  }, []);

  useEffect(() => {
    const fetchRecommendedSchools = async () => {
      try {
        if (!userId) return;

        const response = await axios.get(`http://localhost:4000/Schools/favorites/${userId}`);
        const { schools, additionalData } = response.data;

        // Assuming additionalData contains recommended schools
        // Modify additionalData to include image_url for each school
        additionalData.forEach((school) => {
          school.image_url = schools.find(s => s.id === school.school_id)?.image || '';
        });

        setRecommendedSchools(additionalData);
      } catch (err) {
        console.error('Error fetching recommended schools:', err);
        setError("No recommended schools");
      }
    };

    fetchRecommendedSchools();
  }, [userId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <div className="content grid3 mtop">
        {recommendedSchools && recommendedSchools.length > 0 ? (
          recommendedSchools.map((school, index) => {
            const { name, category, location, school_name, fees, type, image_url } = school;
            return (
              <div className="box shadow" key={index}>
                {/* <div className="img">
                  <img src={image_url} alt={image_url} />
                </div> */}
                <div className="text">
                  <div className="category flex">
                  </div>
                  <h4>{school_name}</h4>
                  <p>
                    <i className="fa fa-location-dot"></i> {location}
                  </p>
                </div>
                <div className="button flex">
                  <div>
                    <button className="btn2">{fees}</button>
                  </div>
                  {/* <span>{type}</span> */}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-schools-message">No recommended schools</div>
        )}
      </div>
    </div>
  );
};

export default RecommendedSchools;
