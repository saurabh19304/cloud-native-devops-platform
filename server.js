//experiment: obseve the docker bild caching 
import express  from 'express';
import {Pool} from "pg";

const app = express();
const PORT = 3000;

const pool = new Pool({
host: process.env.DB_HOST,
port: Number(process.env.DB_PORT || 5432),
user: process.env.POSTGRES_USER,
password: process.env.POSTGRES_PASSWORD,
database: process.env.POSTGRES_DB,
});

app.use(express.json());

app.get('/', (req, res) => {
  res.json({message: "serverr is running on 3000"})
})

app.get('/health', (req, res) => {
  res.status(200).json(
    {
  "status": "ok",
  "timestamp": "...",
  "uptime": 12.34
}

  )
})

app.get('/db-health', async(req, res) => {
  try {
    const result = await pool.query(
      'SELECT current_database() AS database, NOW() AS time'
    );

    res.status(200).json({message:'connection is established with the database', 
     result: result.rows[0]});

  } catch (error) {
    console.error('database connection fail:', error);
    
    res.status(500).json({error:"error", 
      message: "database health check failed" })
  }
});

app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`);
})
