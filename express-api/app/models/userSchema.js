import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from "validator";
import { ENUM_USER_ROLE } from '../../utils/constants/constants.js';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name filed is required']
    },
    image: {
        type: String,
        required: [true, 'Image ulr is required']
    },
    email: {
        type: String,
        required: [true, 'Email filed is required'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email.'],
    },
    password: {
        type: String,
        required: [true, 'Password filed is required'],
    },
    role: {
        type: String,
        enum: {
            values: [ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER],
            message: `Status value can not be {VALUE}, must be ${ENUM_USER_ROLE.ADMIN}/${ENUM_USER_ROLE.USER}`
        },
        default: ENUM_USER_ROLE.ADMIN
    },
}, { timestamps: true });

// checking is user exists
userSchema.methods.isUserExist = async function (param) {
    return await User.findOne({ email: param });
}

// checking is password matched
userSchema.methods.isPasswordMatched = async function (givenPassword, savedPassword) {
    return await bcrypt.compare(givenPassword, savedPassword);
}

// create or save works for both
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const password = this.password;
    const hashedPassword = await bcrypt.hashSync(password, 10);

    this.password = hashedPassword;

    next();
});

const User = model("User", userSchema);
export default User;