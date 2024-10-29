
import { connectToDatabase } from '../lib/db' // Adjust the import path as needed
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const pool = await connectToDatabase();
        const { COMP_PERSON_CODE } = req.query; // Ensure this matches the query parameter used

        console.log('Received COMP_PERSON_CODE:', COMP_PERSON_CODE);

        if (!COMP_PERSON_CODE) {
            return res.status(400).json({ message: 'COMP_PERSON_CODE is required' });
        }

        const queryStr = `
            SELECT [COMP_PERSON_CODE],[PRODUCT_DESC_TH]
            FROM [FTI].[dbo].[Q_MEMBER_PRODUCT_SINGLE_ROW]

            WHERE [COMP_PERSON_CODE] = @COMP_PERSON_CODE
        `;

        const request = pool.request();
        request.input('COMP_PERSON_CODE', sql.NVarChar, COMP_PERSON_CODE);

        const result = await request.query(queryStr);

        if (result.recordset.length === 0) {
            console.log(`No records found for COMP_PERSON_CODE: ${COMP_PERSON_CODE}`);
            return res.status(200).json([]);  // Return an empty array if no records are found
        }

        console.log('Records found:', result.recordset);
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching data from Q_MEMBER_INDUSTRY_GROUP_SINGLE_ROW:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}