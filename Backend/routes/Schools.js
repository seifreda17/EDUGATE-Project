const router=require("express").Router();
const conn= require("../db/dbConnection");
const { body, validationResult } =require( "express-validator");
// const Authorized=require("../middlewarer/Authorize");
const { query } = require("express");
const util=require("util"); //helper function
const crypto=require("crypto");
const admin = require("../middlewarer/Admin");
const authorized = require("../middlewarer/Authorize");






// CREATE schools_1
router.post(
  "/create_school",
  body("school_name").isString().withMessage("Please enter valid school_name."),
  body("type").isString().withMessage("Please enter valid type."),
  body("location").isLength().withMessage("Please enter valid location."),
  body("fees").isString().withMessage("Please enter valid fees."),
  body("image_url").optional().isString().withMessage("Please enter a valid image URL."),
  body("cert").optional().isString().withMessage("Please enter valid certification."),
  body("phone_number").optional().isString().withMessage("Please enter a valid phone number."),
  body("description_head").optional().isString().withMessage("Please enter a valid description header."),
  body("fees_list").optional().isString().withMessage("Please enter a valid fees list."),
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Prepare schools_1 object
      const schools_1 = {
        school_name: req.body.school_name,
        type: req.body.type,
        location: req.body.location,
        fees: req.body.fees,
        image_url: req.body.image_url,
        cert: req.body.cert,
        phone_number: req.body.phone_number,
        description_head: req.body.description_head,
        fees_list: req.body.fees_list,
      };

      // Insert schools_1 in database
      const query = util.promisify(conn.query).bind(conn);
      await query("INSERT INTO schools_1 SET ?", schools_1);
      res.status(200).json({ msg: "School created." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error." });
    }
  }
);


  



  // SEARCH schools_1
router.get("/search", async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    const { search: searchTerm, location, type, minfees, maxfees } = req.query;

    const conditions = [];
    if (searchTerm) {
      conditions.push(`school_name LIKE '%${searchTerm}%' OR type LIKE '%${searchTerm}%' OR location LIKE '%${searchTerm}%' OR fees LIKE '%${searchTerm}%'`);
    }
    if (location) {
      conditions.push(`location = '${location}'`);
    }
    if (type) {
      conditions.push(`type = '${type}'`);
    }
    if (minfees && maxfees) {
      conditions.push(`fees BETWEEN ${minfees} AND ${maxfees}`);
    }

    if (conditions.length > 0) {
      search = `WHERE ${conditions.join(' AND ')}`;
    }

    const schools_1 = await query(`SELECT * FROM schools_1 ${search}`);

    if (schools_1.length === 0) {
      return res.status(200).json({ msg: "No schools found." });
    }

    res.status(200).json(schools_1);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error." });
  }
});





  // Example using Express.js
// Example using Express.js
// Example using Express.js
router.get('/filterByLocation/:location', (req, res) => {
  const location = req.params.location;
  const query = `SELECT * FROM schools_1 WHERE location = '${location}'`;

  conn.query(query, (err, results) => {
    if (err) {
      console.error('Error filtering by type: ' + err.stack);
      res.status(500).send('Error filtering by Location');
      return;
    }
    res.json(results);
  });
});



router.get('/filterByType/:type', (req, res) => {
  const type = req.params.type;
  const query = `SELECT * FROM schools_1 WHERE type = '${type}'`;

  conn.query(query, (err, results) => {
    if (err) {
      console.error('Error filtering by type: ' + err.stack);
      res.status(500).send('Error filtering by type');
      return;
    }
    res.json(results);
  });
});
router.get('/feesRange', (req, res) => {
  const query = 'SELECT MIN(fees) AS minfees, MAX(fees) AS maxfees FROM schools_1';

  conn.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching fees range: ' + err.stack);
      res.status(500).send('Error fetching fees range');
      return;
    }

    const { minfees, maxfees } = results[0];
    res.json({ minfees, maxfees });
  });
});


  // Filter by school type
  


  router.get('/schoollocations', (req, res) => {
    conn.query('SELECT DISTINCT location FROM schools_1', (err, results) => {
      if (err) {
        console.error('Error fetching locations: ' + err.stack);
        res.status(500).send('Error fetching locations');
        return;
      }
      res.json(results.map((result) => result.location));
    });
  });


  
  router.get('/schoolTypes', (req, res) => {
    conn.query('SELECT DISTINCT type FROM schools_1', (err, results) => {
      if (err) {
        console.error('Error fetching school types: ' + err.stack);
        res.status(500).send('Error fetching school types');
        return;
      }
      res.json(results.map((result) => result.type));
    });
  });


  router.get('/filterByfees', (req, res) => {
    const maxfees = req.query.maxfees; 
    const minfees = req.query.minfees;// Assuming a large default value
  
    const query = `SELECT * FROM schools_1 WHERE fees BETWEEN ${minfees} AND ${maxfees}`;
  
    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error filtering by fees: ' + err.stack);
        res.status(500).send('Error filtering by fees');
        return;
      }
      res.json(results);
    });
  });
  
  
  

 // Insert a rating
router.post("/rate", async (req, res) => {
  try {
      const query = util.promisify(conn.query).bind(conn);
      const { user_id, school_id, rating, comment } = req.body;
      await query("INSERT INTO ratings (user_id, school_id, rating, comment, timestamp) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)", [user_id, school_id, rating, comment]);
      res.status(201).json({ message: "Rating added successfully." });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error." });
  }
});

// Get ratings for a school with user names
router.get("/ratings/:school_id", async (req, res) => {
  try {
      const query = util.promisify(conn.query).bind(conn);
      const ratings = await query("SELECT ratings.rating, ratings.comment, users.name FROM ratings JOIN users ON ratings.user_id = users.user_id WHERE ratings.school_id = ?", [req.params.school_id]);
      res.status(200).json(ratings);
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error." });
  }
});


// Endpoint to fetch comments for a specific school
router.get("/comments/:school_id", async (req, res) => {
  try {
      const query = util.promisify(conn.query).bind(conn);
      const comments = await query("SELECT ratings.rating, ratings.timestamp , ratings.comment, users.name FROM ratings JOIN users ON ratings.user_id = users.user_id WHERE ratings.school_id = ?", [req.params.school_id]);
      res.status(200).json({ comments });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error." });
  }
});


//Average Rating
router.get("/averagerating/:school_id", async (req, res) => {
  try {
      const query = util.promisify(conn.query).bind(conn);
      const avgRating = await query("SELECT AVG(rating) AS averageRating FROM ratings WHERE school_id = ?", [req.params.school_id]);
      res.status(200).json({ averageRating: avgRating[0].averageRating });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error." });
  }
});




 
  






  
  // SHOW schools_1
  router.get("/show/:ID", async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);
      const schools_1 = await query("SELECT * FROM schools_1 WHERE ID = ?", [req.params.ID]);
      if (!schools_1[0]) {
        return res.status(404).json({ msg: "schools_1 not found." });
      }
      res.status(200).json(schools_1);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error." });
    }
  });

  router.get("/show", async (req, res) => {
    try {
        const { location, type, minfees, maxfees } = req.query;
        let sql = "SELECT * FROM schools_1 WHERE 1=1"; // Start with a true condition

        const values = [];
        if (location) {
            sql += " AND location = ?";
            values.push(location);
        }
        if (type) {
            sql += " AND type = ?";
            values.push(type);
        }
        if (minfees && maxfees) {
            sql += " AND fees BETWEEN ? AND ?";
            values.push(minfees, maxfees);
        }

        const query = util.promisify(conn.query).bind(conn);
        const schools = await query(sql, values);
        res.status(200).json(schools);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error." });
    }
});


  






  router.post('/favorites', async (req, res) => {
    const { user_id_fav, school_id } = req.body; // Destructure user_id_fav and school_id from req.body
    try {
      if (!user_id_fav || !school_id) {
        return res.status(400).json({ error: 'user_id_fav and school_id are required' });
      }
       await conn.query('INSERT INTO favorites (user_id_fav, school_id) VALUES (?, ?)', [user_id_fav, school_id]);
      res.status(200).json({ message: 'School added to favorites' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add school to favorites' });
    }
  });
  



  const axios = require('axios');

 


router.get('/favorites/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
      const query = util.promisify(conn.query).bind(conn);

      // Fetch favorite schools for the user
      const favoriteResult = await query('SELECT * FROM favorites WHERE user_id_fav = ?', [user_id]);
      if (!Array.isArray(favoriteResult) || favoriteResult.length === 0) {
          return res.status(404).json({ error: `No favorite schools found for user with ID ${user_id}` });
      }

      const favoriteSchoolIds = favoriteResult.map(row => row.school_id);

      // Fetch school details for the favorite school IDs
      const schoolsResult = await query('SELECT * FROM schools_1 WHERE ID IN (?)', [favoriteSchoolIds]);
      if (!Array.isArray(schoolsResult)) {
          throw new Error('Query did not return an array');
      }

      const schools = schoolsResult.map(row => ({
          id: row.ID,
          name: row.school_name,
          image: row.image_url,
          fees: row.fees
          // Add other relevant fields here
      }));

      // Make a POST request to http://127.0.0.1:5000 with the school IDs
      const response = await axios.post('http://127.0.0.1:5000/recommend', {
          school_ids: favoriteSchoolIds
      });

      // Log the response data for debugging
      console.log('Recommendation service response:', response.data);

      const additionalData = response.data;

      // Modify additionalData to include image_url for each school
      additionalData.forEach((school) => {
          school.image_url = schools.find(s => s.id === school.school_id)?.image || '';
      });

      res.status(200).json({ schools, additionalData });
  } catch (err) {
      console.error('Error fetching recommended schools:', err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});
  
  



router.get('/favoritesList/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
      const query = util.promisify(conn.query).bind(conn);

      // Fetch favorite schools for the user
      const favoriteResult = await query('SELECT * FROM favorites WHERE user_id_fav = ?', [user_id]);
      if (!Array.isArray(favoriteResult) || favoriteResult.length === 0) {
          return res.status(404).json({ error: `No favorite schools found for user with ID ${user_id}` });
      }

      const favoriteSchoolIds = favoriteResult.map(row => row.school_id);

      // Fetch school details for the favorite school IDs
      const schoolsResult = await query('SELECT * FROM schools_1 WHERE ID IN (?)', [favoriteSchoolIds]);
      if (!Array.isArray(schoolsResult)) {
          throw new Error('Query did not return an array');
      }

      const schools = schoolsResult.map(row => ({
          id: row.ID,
          name: row.school_name,
          image: row.image_url,
          fees: row.fees
          // Add other relevant fields here
      }));

      res.status(200).json({ schools });
  } catch (err) {
      console.error('Error fetching favorite schools:', err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});




  router.delete('/favorites', async (req, res) => {
    const { user_id_fav, school_id } = req.body; // Destructure user_id_fav and school_id from req.body
    try {
      if (!user_id_fav || !school_id) {
        return res.status(400).json({ error: 'user_id_fav and school_id are required' });
      }
      
      // Delete the school from the favorites
      const query = util.promisify(conn.query).bind(conn);
      const result = await query('DELETE FROM favorites WHERE user_id_fav = ? AND school_id = ?', [user_id_fav, school_id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Favorite not found' });
      }

      res.status(200).json({ message: 'School removed from favorites' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to remove school from favorites' });
    }
});

  
  
  module.exports = router;

// ///////////////////////////////////////////












































