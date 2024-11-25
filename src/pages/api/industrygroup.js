
import { connectToDatabase } from '../../lib/db';
import sql from 'mssql';
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const pool = await connectToDatabase();
        console.log('Database connected successfully');

        const query = `
            SELECT DISTINCT 
            [MEMBER_GROUP_NAME], [MEMBER_GROUP_NAME_EN]
            FROM [FTI].[dbo].[Q_MEMBER_INDUSTRY_GROUP]
            WHERE MEMBER_GROUP_NAME IS NOT NULL
            ORDER BY MEMBER_GROUP_NAME
        `;

        const result = await pool.request().query(query);

        if (!result.recordset || result.recordset.length === 0) {
            console.log('No data found in query result');
            return res.status(404).json({ message: 'No data found' });
        }

        console.log('Query executed successfully');
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error in API:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}