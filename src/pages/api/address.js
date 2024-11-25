
import { connectToDatabase } from '../../lib/db';
import sql from 'mssql';
import { Address } from '../../types/type';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const pool = await connectToDatabase();
    if (!pool) {
      return res.status(500).json({ message: 'Database connection failed' });
    }

    const { member_code } = req.query;

    if (!member_code) {
      return res.status(400).json({ message: 'Member code is required' });
    }

    // Use async/await to minimize waiting time
    const startTime = Date.now();
    const request = pool.request().input('member_code', sql.NVarChar, member_code);
    const resultPromise = request.execute('usp_GetMemberDetails');

    // Log execution time
    const result = await resultPromise;
    const endTime = Date.now();
    console.log(`Query execution time: ${endTime - startTime}ms`);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching member details:', error.message);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
