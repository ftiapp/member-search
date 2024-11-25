import {connectToDatabase} from '../../lib/db';
import sql from 'mssql';
export default async function handler(req, res) {
    let pool; // ประกาศ pool ที่ระดับ global ของฟังก์ชัน

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        pool = await connectToDatabase(); // สร้างการเชื่อมต่อ
        console.log('Database connected successfully');

        const query = `
            WITH DistinctMembers AS (
                SELECT DISTINCT MEMBER_CODE, MEMBER_TYPE_CODE
                FROM dbo.member_search_REAL
            )
            SELECT 
                p.MEMBER_GROUP_NAME AS Industry_GROUP_NAME,
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
                dbo.Q_MEMBER_Industry_RIGHT_FTI AS p 
                ON m.MEMBER_CODE = p.MEMBER_CODE
            WHERE 
                p.MEMBER_GROUP_NAME IS NOT NULL
            GROUP BY 
                p.MEMBER_GROUP_NAME

            UNION ALL

            SELECT 
                N'รวมทั้งหมด' AS Industry_GROUP_NAME,
                ISNULL(SUM(CASE 
                    WHEN m.MEMBER_TYPE_CODE = '11' AND p.MEMBER_GROUP_NAME IS NOT NULL THEN 1 
                    ELSE 0 
                END), 0) AS Type_11,
                ISNULL(SUM(CASE 
                    WHEN m.MEMBER_TYPE_CODE = '12' AND p.MEMBER_GROUP_NAME IS NOT NULL THEN 1 
                    ELSE 0 
                END), 0) AS Type_12,
                ISNULL(SUM(CASE 
                    WHEN m.MEMBER_TYPE_CODE = '21' AND p.MEMBER_GROUP_NAME IS NOT NULL THEN 1 
                    ELSE 0 
                END), 0) AS Type_21,
                ISNULL(SUM(CASE 
                    WHEN m.MEMBER_TYPE_CODE = '22' AND p.MEMBER_GROUP_NAME IS NOT NULL THEN 1 
                    ELSE 0 
                END), 0) AS Type_22,
                ISNULL(SUM(CASE 
                    WHEN m.MEMBER_TYPE_CODE IN ('11', '12', '21', '22') 
                         AND p.MEMBER_GROUP_NAME IS NOT NULL THEN 1 
                    ELSE 0 
                END), 0) AS Total,
                1 AS IsTotalRow
            FROM 
                DistinctMembers AS m
            LEFT OUTER JOIN 
                dbo.Q_MEMBER_Industry_RIGHT_FTI AS p 
                ON m.MEMBER_CODE = p.MEMBER_CODE

            ORDER BY 
                IsTotalRow, 
                Industry_GROUP_NAME;
        `;

        const result = await pool.request().query(query);
        console.log('Query executed successfully');
        return res.status(200).json(result.recordset);

    } catch (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (pool && pool.connected) { // ตรวจสอบว่า pool เชื่อมต่ออยู่หรือไม่
            try {
                await pool.close();
                console.log('Database connection closed');
            } catch (closeError) {
                console.error('Error closing the pool:', closeError);
            }
        }
    }
}