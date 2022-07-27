import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Task} from "./task.js";
const userSchema = new mongoose.Schema({
    age: {
        type: Number,
        default: 0,
        validator (value) {
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw  new Error('Email is invalid')
            }
        }
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password must not contain password')
            }
        }
    },
    tokens : [{
            token: {
                type: String,
                required: true
            }
        }],
    avatar : {
        type: Buffer
    }
}, {
    timestamps: true
});
//setting up a virtual, this allows mongoose to establish a relationship

userSchema.virtual('tasks',{
    localField: '_id',
    foreignField: 'owner',
    ref: 'Task'
})
//methods are accessible on the instance
userSchema.methods.toJSON = function () {
    const user = this;

    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;
    return userObj;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
    user.tokens =   user.tokens.concat({token});
    user.save()
    return token;
}
//statics methods are accessible on the collection
userSchema.statics.findByCredentials =  async(email, password) => {

    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user;
}


//the below are called middlewares for the db
//hashing the user password
userSchema.pre('save', async  function(next) {
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()
})
//delete user tasks for a user which is deleted
userSchema.pre('remove', async function (next) {
    await Task.deleteMany({owner: this._id});
    next();
})

export const User = mongoose.model('user', userSchema)