const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/all_societies", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM society`);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.get("/all_counties", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM county`);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

function reducer(accumulator, row) {
  console.log('row:', row);
  if (accumulator.county_name == null) {
    accumulator.county_name = row.county_name;
    accumulator.societies = [];
  }
  const society = {
    email: row.email,
    location: row.location,
    name: row.society_name,
    phone: row.phone,
    website: row.website,
  };
  accumulator.societies.push(society);
  console.log('accumulator:', accumulator);
  return accumulator;
}

function transformCounty(data) {
  const county = data.reduce(reducer, {});
  console.log(county);
  return county;
}

router.get("/societies", async (req, res) => {
  try {
    const countyId = req.query.county_id;
    console.log(`countyId = ${countyId}`);
    if (countyId == null) {
        return res.status(400).send('Missing county_id');
    }
    const result = await pool
      .query(`select c.county_id, c.county_name, s.society_name, s.website, s.location, s.phone, s.email from county c left join society s on c.county_id = s.county_id where c.county_id = ${countyId};`)
      .then((data) => transformCounty(data.rows));
    
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});
module.exports = router;
