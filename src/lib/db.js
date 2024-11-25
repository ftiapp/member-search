import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

let pool;

export async function connectToDatabase() {
  try {
    if (!pool || !pool.connected) {
      pool = await sql.connect(config);
      console.log('Database connected successfully');
    }
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}