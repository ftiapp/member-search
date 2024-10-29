
import sql from 'mssql';

const config = {
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  server:process.env.DB_SERVER,
  database:process.env.DB_NAME,
  options: {
    encrypt: false, // ไม่เข้ารหัส หากไม่ใช้ Azure
    enableArithAbort: true,
    trustServerCertificate: true, // เพิ่มบรรทัดนี้
    }
};

let pool;

export async function connectToDatabase() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('Database connected successfully');
    }
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}