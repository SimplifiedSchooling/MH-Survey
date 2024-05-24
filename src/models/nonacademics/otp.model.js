const mongoose = require('mongoose');

const nonAcademicUserOTPSchema = mongoose.Schema({
    mobNumber: {
        type: Number,
        required: true
    },
    otp: {
        type: Number,
        required: true
    }
    },
    {
        timestamps: true,
    }
)

const NonAcademicUserOTP = mongoose.model('NonAcademicUserOTP', nonAcademicUserOTPSchema);
module.exports = NonAcademicUserOTP;