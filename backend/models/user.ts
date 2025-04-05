import { Schema, model } from 'mongoose';

// **** Functions **** //
const userSchema = new Schema({
    googleId: { type: String },
    username: { type: String, required: false },
    email: { type: String, unique: true },
    password: { type: String, required: false }
}, { timestamps: true });



// **** Export default **** //
const UserModel = model('User', userSchema);
export default UserModel;