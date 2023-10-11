import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { NextFunction } from 'connect';
import { IUser, IUserMethods } from '../interfaces/UserInterface';
import validator from "validator";
import { ENUM_USER_ROLE } from '../../utils/constants/constants';
import config from '../../utils/server/config';

const userSchema = new Schema<IUser, {}, IUserMethods>({
    name: {
        type: String,
        required: [true, 'Name filed is required']
    },
    image: String,
    email: {
        type: String,
        required: [true, 'Email filed is required'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email.'],
    },
    username: {
        type: String,
        lowercase: true,
        required: [true, 'Username filed is required'],
        unique: true,
    },
    mobile: {
        primary: {
            type: String,
            required: [true, 'Primary mobile filed is required']
        },
        secondary: String,
    },
    address: {
        city: {
            type: String,
            required: [true, 'City filed is required']
        },
        present: String,
    },
    password: {
        type: String,
        required: [true, 'Password filed is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
    },
    role: {
        name: {
            type: String,
            lowercase: true,
            required: [true, 'Role name is required'],
            enum: {
                values: [ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SUPPLIER],
                message: `Status value can not be {VALUE}, must be ${ENUM_USER_ROLE.ADMIN}/${ENUM_USER_ROLE.CUSTOMER}/${ENUM_USER_ROLE.SUPPLIER}`
            },
            default: ENUM_USER_ROLE.CUSTOMER
        },
        permissions: [String]
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive', 'banned'],
            message: "Status value can not be {VALUE}, must be inactive/inactive/banned"
        },
        default: 'active'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    rank: {
        type: String,
        enum: {
            values: ['bronze', 'platinum', 'diamond'],
            message: "Status value can not be {VALUE}, must be bronze/platinum/diamond"
        },
        default: 'bronze'
    },
    account: {
        type: Types.ObjectId,
        ref: "Account",
    },
    description: String,
    orders: [
        {
            type: Types.ObjectId,
            ref: "Order"
        },
    ],
}, { timestamps: true });

// checking is user exists
userSchema.methods.isUserExist = async function (param: string): Promise<boolean | null> {
    return await User.findOne({ email: param });
}

// checking is password matched
userSchema.methods.isPasswordMatched = async function (givenPassword: string, savedPassword: string): Promise<boolean> {
    return await bcrypt.compare(givenPassword, savedPassword);
}

// create or save works for both
userSchema.pre("save", async function (next: NextFunction) {
    if (!this.isModified("password")) {
        return next();
    }

    const password = this.password;
    const hashedPassword = await bcrypt.hashSync(password, Number(config.BYCRYPT_SALT_ROUND));

    this.password = hashedPassword;
    this.confirmPassword = undefined;

    next();
});

const User = model<IUser>("User", userSchema);
export default User;