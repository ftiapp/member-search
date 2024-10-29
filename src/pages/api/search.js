
import { connectToDatabase } from '../lib/db'
import sql from 'mssql';
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const pool = await connectToDatabase();
    if (!pool) {
      return res.status(500).json({ message: 'Database connection failed' });
    }

    const q = req.query.q || '';
    const member_type_code = req.query.member_type_code || '';
    const province = decodeURIComponent(req.query.province || '');
    const industry_group_name = decodeURIComponent(req.query.industry_group_name || '');
    const province_group_name = decodeURIComponent(req.query.province_group_name || '');

    console.log('Received search query:', { q, member_type_code, province, industry_group_name, province_group_name });

    if (!q && !member_type_code && !province && !industry_group_name && !province_group_name) {
      return res.status(400).json({ message: 'At least one search parameter is required' });
    }

    const request = pool.request()
      .input('searchQuery', sql.NVarChar, q || null)
      .input('memberTypeCode', sql.NVarChar, member_type_code || null)
      .input('province', sql.NVarChar, province || null)
      .input('industryGroupName', sql.NVarChar, industry_group_name || null)
      .input('provinceGroupName', sql.NVarChar, province_group_name || null);

    const result = await request.execute('SearchMembers');

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error searching members:', error.message, error.stack);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}