// import React from "react"
// import Awards from "./awards/Awards"
// import Featured from "./featured/Featured"
// import Hero from "./hero/Hero"
// import Location from "./location/Location"
// import Price from "./price/Price"
// import Recent from "./recent/Recent"
// import Team from "./team/Team"

// const Home = () => {
//   return (
//     <>
//       <Hero />
//       <Featured />
//       <Recent />
//       <Awards />
//       <Location />
//       <Team />
//       <Price />
//     </>
//   )
// }

// export default Home
import React, { useEffect } from "react";
import Awards from "./awards/Awards";
import Featured from "./featured/Featured";
import Hero from "./hero/Hero";

import Price from "./price/Price";
import Recent from "./recent/Recent";
import Team from "./team/Team";

const fetchSchools = async () => {
  try {
    const response = await fetch('http://localhost:4000/Schools/show/5'); // Assuming your API endpoint is '/api/schools/show'
    if (!response.ok) {
      throw new Error('Failed to fetch schools');
    }
    const data = await response.json();
    // Process the data as needed
    console.log(data);
  } catch (error) {
    console.error('Error fetching schools:', error);
  }
};

const Home = () => {
  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <>
    
      <Hero />
      <Featured />
      <Recent />
      <Awards />
      <Team />
      <Price />
    </>
  );
};

export default Home;
