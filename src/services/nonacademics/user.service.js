const { NonAcademicsUser, NonAcademicsUserRole } = require('../../models')

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    return NonAcademicsUser.findOne({ email });
};

const bulkUploadNonAcademicUserRoles = async (userArray, csvFilePath = []) => {
    let modifiedUseRolesrArray = userArray;
    if (csvFilePath.length) {
        modifiedUseRolesrArray = csvFilePath;
    }
    if (!modifiedUseRolesrArray || !modifiedUseRolesrArray.length) return { error: true, message: 'missing array' };
  
    const records = [];
    const dups = [];
    await Promise.all(
        modifiedUseRolesrArray.map(async (user) => {
            await NonAcademicsUserRole.updateOne({ uniqueRoleCode: user.QuestionNumber }, { $set: user }, { upsert: true });
      })
    );
  
    const duplicates = {
      totalDuplicates: dups.length ? dups.length : 0,
      data: dups.length ? dups : [],
    };
    const nonduplicates = {
      totalNonDuplicates: records.length ? records.length : 0,
      data: records.length ? records : [],
    };
    return { nonduplicates, duplicates };
};

const findUserRoleDetail = async(uniqueRoleCode) => {
    return NonAcademicsUserRole.findOne({ uniqueRoleCode });
}

module.exports = {
    getUserByEmail,
    bulkUploadNonAcademicUserRoles,
    findUserRoleDetail
}