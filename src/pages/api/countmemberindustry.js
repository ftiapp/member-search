import { connectToDatabase } from '../../lib/db';
import sql from 'mssql';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const pool = await connectToDatabase();

    const result = await pool.request().query(`
      SELECT 
        ISNULL([MEMBER_TYPE_CODE], N'รวมทั้งหมด') AS MEMBER_TYPE_CODE,
        COUNT(*) AS MemberCount
      FROM 
        [FTI].[dbo].[Q_MEMBER_INDUSTRY_RIGHT_FTI]
      GROUP BY 
        [MEMBER_TYPE_CODE] WITH ROLLUP
      ORDER BY 
        MEMBER_TYPE_CODE;
    `);

    res.status(200).json(result.recordset); // ส่งข้อมูลกลับในรูปแบบ JSON
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Error retrieving data' });
  }
}