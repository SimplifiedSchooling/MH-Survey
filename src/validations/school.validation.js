const Joi = require('joi');

const schoolValidationSchema = Joi.object({
  ac_year: Joi.string().required(),
  district_cd: Joi.number().required(),
  District: Joi.string().required(),
  Division: Joi.string().required(),
  Budget_district_seq: Joi.number().required(),
  block_cd_1: Joi.number().required(),
  Block_Name: Joi.string().required(),
  MNC_SR: Joi.number().required(),
  MNC_Desc: Joi.string().required(),
  block_cd_2: Joi.number().required(),
  vill_ward_cd: Joi.number().required(),
  Village_Name: Joi.string().required(),
  cluster_cd: Joi.number().required(),
  Cluster_Name: Joi.string().required(),
  udise_sch_code: Joi.number().required(),
  school_name: Joi.string().required(),
  address: Joi.string().required(),
  pincode: Joi.number().required(),
  Establishment: Joi.number().required(),
  sch_loc_r_u: Joi.number().required(),
  sch_category_id: Joi.number().required(),
  School_category: Joi.string().required(),
  sch_type: Joi.number().required(),
  sch_mgmt_id: Joi.number().required(),
  Mgt_desc: Joi.string().required(),
  state_mgt_3: Joi.string().required(),
  state_mgt_4: Joi.string().required(),
  class_frm: Joi.number().required(),
  class_to: Joi.number().required(),
  medinstr1: Joi.number().required(),
  medium_desc: Joi.string().required(),
  medium_state: Joi.string().required(),
  medinstr2: Joi.number().required(),
  medinstr3: Joi.number().required(),
  medinstr4: Joi.number().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  ppsec_yn: Joi.number().required(),
  stdcode: Joi.number().required(),
  mobile: Joi.string().required(),
  stdcode_resp: Joi.number().required(),
  phone_resp: Joi.number().required(),
  mobile_resp: Joi.string().required(),
  website: Joi.string().required(),
  email: Joi.string().required(),
  resp_name: Joi.string().required(),
  cwsn_sch_yn: Joi.number().required(),
  shift_sch_yn: Joi.number().required(),
  resi_sch_type: Joi.number().required(),
  resi_sch_type_Desc: Joi.string().required(),
  minority_yn: Joi.number().required(),
  minority_type: Joi.number().required(),
  Minority_desc: Joi.string().required(),
  anganwadi_yn: Joi.number().required(),
  anganwadi_code: Joi.string().required(),
  anganwadi_stu_b: Joi.number().required(),
  anganwadi_stu_g: Joi.number().required(),
  anganwadi_tch_trained: Joi.number().required(),
  board_sec: Joi.number().required(),
  Board_Desc_Sec: Joi.string().required(),
  board_sec_no: Joi.string().required(),
  board_sec_oth: Joi.string().required(),
  board_hsec: Joi.number().required(),
  Board_Hseco_Desc: Joi.string().required(),
  board_hsec_no: Joi.string().required(),
  board_hsec_oth: Joi.string().required(),
  prevoc_yn: Joi.number().required(),
  eduvoc_yn: Joi.number().required(),
  cpp_b: Joi.number().required(),
  cpp_g: Joi.number().required(),
  cpp_t: Joi.number().required(),
  c1_b: Joi.number().required(),
  c1_g: Joi.number().required(),
  c1_t: Joi.number().required(),
  c2_b: Joi.number().required(),
  c2_g: Joi.number().required(),
  c2_t: Joi.number().required(),
  c3_b: Joi.number().required(),
  c3_g: Joi.number().required(),
  c3_t: Joi.number().required(),
  c4_b: Joi.number().required(),
  c4_g: Joi.number().required(),
  c4_t: Joi.number().required(),
  c5_b: Joi.number().required(),
  c5_g: Joi.number().required(),
  c5_t: Joi.number().required(),
  c6_b: Joi.number().required(),
  c6_g: Joi.number().required(),
  c6_t: Joi.number().required(),
  c7_b: Joi.number().required(),
  c7_g: Joi.number().required(),
  c7_t: Joi.number().required(),
  c8_b: Joi.number().required(),
  c8_g: Joi.number().required(),
  c8_t: Joi.number().required(),
  c9_b: Joi.number().required(),
  c9_g: Joi.number().required(),
  c9_t: Joi.number().required(),
  c10_b: Joi.number().required(),
  c10_g: Joi.number().required(),
  c10_t: Joi.number().required(),
  c11_b: Joi.number().required(),
  c11_g: Joi.number().required(),
  c11_t: Joi.number().required(),
  c12_b: Joi.number().required(),
  c12_g: Joi.number().required(),
  c12_t: Joi.number().required(),
  c1to5b: Joi.number().required(),
  c1to5g: Joi.number().required(),
  c1to5t: Joi.number().required(),
  c6to8b: Joi.number().required(),
  c6to8g: Joi.number().required(),
  c6to8t: Joi.number().required(),
  c1to8b: Joi.number().required(),
  c1to8g: Joi.number().required(),
  c1to8t: Joi.number().required(),
  c9to10b: Joi.number().required(),
  c9to10g: Joi.number().required(),
  c9to10t: Joi.number().required(),
  c11to12b: Joi.number().required(),
  c11to12g: Joi.number().required(),
  c11to12t: Joi.number().required(),
  c9to12b: Joi.number().required(),
  c9to12g: Joi.number().required(),
  c9to12t: Joi.number().required(),
  c1to12b: Joi.number().required(),
  c1to12g: Joi.number().required(),
  c1to12t: Joi.number().required(),
  Enr_range_school_grant: Joi.string(),
});

const getAllSchools = {
  query: Joi.object().keys({
    search: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  schoolValidationSchema,
  getAllSchools,
};
