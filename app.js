const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: 'temperature_tracker',
  password: 'baguvixAezakmi@postgresql',
  port: 5432,
});

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/addTemperature', async (req, res) => {
  const { temperature } = req.body;
  const query = 'INSERT INTO temperature_data (temperature) VALUES ($1)';
  try {
    await pool.query(query, [temperature]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error adding temperature');
  }
});

app.get('/getTemperatures', async (req, res) => {
  const query = 'SELECT * FROM temperature_data';
  try {
    const result = await pool.query(query);
    const temperatures = result.rows;
    console.log(`data is retrieved successfully`);
    temperatures.forEach((row, index) => {
      console.log(`Row ${index + 1}:`);
      console.log(row); // Log the entire object
    });
    let temp=[],time=[];
    
    temperatures.forEach((row) => {
      temp.push(row.temperature);
      time.push(row.timestamp);
    });

    console.log(`time : ${time} and temperature :${temp}`);
    res.render("index",{temp:temp,time:time});
  } catch (err) {
    console.error(err);
    res.send('Error getting temperatures');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
