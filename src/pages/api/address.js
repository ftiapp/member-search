
import { connectToDatabase } from '../lib/db';
import sql from 'mssql';
import { Address } from '../type';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const pool = await connectToDatabase();
        const { member_code } = req.query;

        // SQL query to fetch member details
        const queryStr = `
            SELECT  
              [COMPANY_NAME],
              [COMPANY_NAME_NO_PREN],
              [COMP_PERSON_NAME_EN],
              [MEMBER_CODE],
              [MEMBER_MAIN_GROUP_CODE],
              [MEMBER_GROUP_CODE],
              [REGIST_CODE],
              [COMP_PERSON_CODE],
              [ADDR_CODE],
              [ADDR_TH_1],
              [ADDR_TH_2],
              [ADDR_TH_3],
              [ADDR_TH],
              [ADDR_NOTE],
              [ADDR_TELEPHONE],
              [ADDR_FAX],
              [ADDR_EMAIL],
              [ADDR_EN_1],
              [ADDR_EN_2],
              [ADDR_EN_3],
              [ADDR_EN],
              [ADDR_NOTE_EN],
              [ADDR_TELEPHONE_EN],
              [ADDR_FAX_EN],
              [ADDR_EMAIL_EN],
              [UPD_DATE],
              [ADDR_POSTCODE],
              [ADDR_POSTCODE_EN],
              [ADDR_SUB_DISTRICT],
              [ADDR_DISTRICT],
              [ADDR_PROVINCE_NAME],
              [ADDR_SUB_DISTRICT_EN],
              [ADDR_DISTRICT_EN],
              [ADDR_PROVINCE_NAME_EN],
              [ADDR_WEBSITE],
              [MEMBER_STATUS_CODE],
              [ADDR_PROVINCE_CODE],
              [MEMBER_MAIN_TYPE_CODE],
              [MEMBER_TYPE_CODE],
              [TAX_ID],
              [AR_CODE],
              [Right_MAIN_GROUP_CODE],
              [Right_STATUS_CODE],
              [Right_GROUP_CODE],
              [Right_GROUP_NAME],
              [Right_TAX_ID],
              [Right_PRENAME_TH],
              [Right_COMP_PERSON_NAME_TH],
              [Right_RIGHT],
              [Right_MAIN_TYPE_CODE],
              [Right_REPRESENT_1],
              [Right_REPRESENT_2],
              [Right_REPRESENT_3],
              [Right_TYPE_CODE],
              [Right_RUNNING],
              [Industry_MAIN_GROUP_CODE],
              [Industry_GROUP_CODE],
              [Industry_GROUP_NAME],
              [Industry_TAX_ID],
              [Industry_PRENAME_TH],
              [Industry_COMP_PERSON_NAME_TH],
              [Industry_RIGHT],
              [Industry_MAIN_TYPE_CODE],
              [Industry_REPRESENT_1],
              [Industry_REPRESENT_2],
              [Industry_REPRESENT_3],
              [Industry_TYPE_CODE],
              [Industry_RUNNING],
              [Province_MAIN_GROUP_CODE],
              [Province_GROUP_CODE],
              [Province_GROUP_NAME],
              [Province_TAX_ID],
              [Province_PRENAME_TH],
              [Province_COMP_PERSON_NAME_TH],
              [Province_RIGHT],
              [Province_MAIN_TYPE_CODE],
              [Province_REPRESENT_1],
              [Province_REPRESENT_2],
              [Province_REPRESENT_3],
              [Province_TYPE_CODE],
              [Province_RUNNING]
          FROM [FTI].[dbo].[Q_MEMBER_ALLDETAILNEXTJS]
          WHERE [MEMBER_CODE] = @member_code 
        `;

        const request = pool.request();
        request.input('member_code', sql.NVarChar, member_code);

        const result = await request.query(queryStr);

        // Log the result to see what is returned
        console.log(result.recordset);

        // Ensure the result is typed as MemberDetails[]
        const memberDetails = result.recordset;

        // If no member details found, return a 404 response
        if (!memberDetails || memberDetails.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Process the data on the server if needed
        const processedData = memberDetails.map(detail => ({
            ...detail,
            COMPANY_NAME: detail.COMPANY_NAME.toUpperCase() // Example of processing
        }));

        // Return the processed data
        res.status(200).json(processedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}