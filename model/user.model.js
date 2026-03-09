import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.ispasswordmatch = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generatejwt = function() {
    return jwt.sign({ 
        email: this.email, id: this._id 
    
     }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { id: this._id }, process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
};

export const User = mongoose.model('User', userSchema);