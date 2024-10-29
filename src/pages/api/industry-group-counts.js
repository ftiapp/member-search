
import {connectToDatabase} from '../lib/db';
import sql from 'mssql';
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const pool = await connectToDatabase();

        const query = `
            WITH DistinctMembers AS (
                SELECT DISTINCT MEMBER_CODE, MEMBER_TYPE_CODE
                FROM dbo.member_search_REAL
            )
            SELECT 
                i.MEMBER_GROUP_NAME AS Industry_GROUP_NAME,
                ISNULL(SUM(CASE WHEN m.MEMBER_TYPE_CODE = '11' THEN 1 ELSE 0 END), 0) AS Type_11,
                ISNULL(SUM(CASE WHEN m.MEMBER_TYPE_CODE = '12' THEN 1 ELSE 0 END), 0) AS Type_12,
                ISNULL(SUM(CASE WHEN m.MEMBER_TYPE_CODE = '21' THEN 1 ELSE 0 END), 0) AS Type_21,
                ISNULL(SUM(CASE WHEN m.MEMBER_TYPE_CODE = '22' THEN 1 ELSE 0 END), 0) AS Type_22,
                ISNULL(SUM(CASE 
                    WHEN m.MEMBER_TYPE_CODE IN ('11', '12', '21', '22') THEN 1 
                    ELSE 0 
                END), 0) AS Total,
                0 AS IsTotalRow
            FROM 
                DistinctMembers AS m
            LEFT OUTER JOIN 
                dbo.Q_MEMBER_INDUSTRY_RIGHT_FTI AS i 
                ON m.MEMBER_CODE = i.MEMBER_CODE
            WHERE 
                i.MEMBER_GROUP_NAME IS NOT NULL
            GROUP BY 
                i.MEMBER_GROUP_NAME

            UNION ALL

            SELECT 
                N'รวมทั้งหมด' AS Industry_GROUP_NAME,
                ISNULL(SUM(CASE 
                    WHEN m.MEMBER_TYPE_CODE = '11' AND i.MEMBER_GROUP_NAME IS NOT NULL THEN 1 
                    ELSE 0 
                END), 0) AS Type_11,
                ISNULL(SUM(CASE 
                    WHEN m.MEMBER_TYPE_CODE = '12' AND i.MEMBER_GROUP_NAME IS NOT NULL THEN 1 
                    ELSE 0 
                END), 0) AS Type_12,
                ISNULL(SUM(CASE 
                    WHEN m.MEMBER_TYPE_CODE = '21' AND i.MEMBER_GROUP_NAME IS NOT NULL THEN 1 
                    ELSE 0 
                END), 0) AS Type_21,
                ISNULL(SUM(CASE 
                    WHEN m.MEMBER_TYPE_CODE = '22' AND i.MEMBER_GROUP_NAME IS NOT NULL THEN 1 
                    ELSE 0 
                END), 0) AS Type_22,
                ISNULL(SUM(CASE 
                    WHEN m.MEMBER_TYPE_CODE IN ('11', '12', '21', '22') 
                         AND i.MEMBER_GROUP_NAME IS NOT NULL THEN 1 
                    ELSE 0 
                END), 0) AS Total,
                1 AS IsTotalRow
            FROM 
                DistinctMembers AS m
            LEFT OUTER JOIN 
                dbo.Q_MEMBER_INDUSTRY_RIGHT_FTI AS i 
                ON m.MEMBER_CODE = i.MEMBER_CODE

            ORDER BY 
                IsTotalRow, 
                Industry_GROUP_NAME;
        `;

        const result = await pool.request().query(query);
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (pool) await pool.close();
    }
}