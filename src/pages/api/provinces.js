
import { connectToDatabase } from '../../lib/db'
import sql from 'mssql';
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const pool = await connectToDatabase();
        
        const query = `
            SELECT DISTINCT [ADDR_PROVINCE_NAME]
            FROM [FTI].[dbo].[Q_MEMBER_SEARCH]
            WHERE [ADDR_PROVINCE_NAME] IS NOT NULL
            ORDER BY [ADDR_PROVINCE_NAME]
        `;

        const result = await pool.request().query(query);
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching provinces:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}