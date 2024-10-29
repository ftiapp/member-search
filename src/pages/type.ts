
export interface Member {
   
    MEMBER_CODE: string;
    MEMBER_MAIN_TYPE_CODE: string;
    MEMBER_TYPE_CODE: string;
    MEMBER_TYPE_NAME: string;
    MEMBER_MAIN_GROUP_CODE: string;
    MEMBER_GROUP_CODE: string;
    REGIST_DATE: string;
    MEMBER_DATE: string;
    RETIRE_DATE: string;
    MEMBER_STATUS_CODE: string;
    COMP_PERSON_CODE: string;
    TAX_ID: string;
    COMPANY_NAME: string;
    COMP_PERSON_NAME_TH: string;
    COMP_PERSON_NAME_EN: string;
    ADDR_NO: string;
    ADDR_MOO: string;
    ADDR_SOI: string;
    ADDR_ROAD: string;
    ADDR_SUB_DISTRICT: string;
    ADDR_DISTRICT: string;
    ADDR_PROVINCE_CODE: string;
    ADDR_PROVINCE_NAME: string;
    ADDR_POSTCODE: string;
    ADDR_TELEPHONE: string;
    ADDR_EMAIL: string;
    ADDR_WEBSITE: string;
    REGIST_CAPITAL: string;
    ASSET_AMOUNT: string;
    EMPLOYEE_AMOUNT: string;
}
export interface ProvinceGroup {
    MEMBER_CODE: string;
    MEMBER_MAIN_GROUP_CODE: string;
    MEMBER_GROUP_CODE: string;
    MEMBER_GROUP_NAME: string;
    TAX_ID: string;
    PRENAME_TH: string;
    COMP_PERSON_NAME_TH: string;
    RIGHT: string;
    MEMBER_MAIN_TYPE_CODE: string;
    REPRESENT_1: string;
    REPRESENT_2: string;
    REPRESENT_3: string;
    MEMBER_TYPE_CODE: string;
  
}
export interface Address {
  MEMBER_CODE: string;
    MEMBER_GROUP_NAME: string;
    REPRESENT_1: string;
    REPRESENT_2: string;
    REPRESENT_3: string;
    COMPANY_NAME: string;
    ADDR_TH: string;
    ADDR_TELEPHONE: string;
    ADDR_FAX: string;
    ADDR_EMAIL: string;
    ADDR_EN: string;
    ADDR_WEBSITE: string;
    REGIST_DATE: string;
    COMP_PERSON_NAME_EN : string;
    Right_GROUP_NAME : string;
    Right_REPRESENT_1 : string;
    Right_REPRESENT_2 : string;
    Right_REPRESENT_3 : string;
    Industry_GROUP_NAME : string;
    Industry_REPRESENT_1  : string;
    Industry_REPRESENT_2  : string;
    Industry_REPRESENT_3 : string;
    Industry_GROUP_CODE: string;
    Province_GROUP_NAME : string;
    Province_REPRESENT_1  : string;
    Province_REPRESENT_2  : string;
    Province_REPRESENT_3 : string;
    Province_GROUP_CODE: string;
}
export interface MemberProduct {
    COMP_PERSON_CODE: string;
    PRODUCT_DESC_TH: string;
}

