import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    firstName :{
        type:String,
        required : true,
        minLength : [3, "First name must be at least 3 characters long"]
    },
    lastName :{
        type:String,
        required : true,
        minLength : [3, "Last name must be at least 3 characters long"]
    },
    email:{
        type:String,
        required : true,
        validate : [validator.isEmail, "Please enter a valid email address"]
    },
    phone:{
        type:String,
        required : true,
        minLength : [10, "Phone number must be at least 10 digits"],
        maxLength : [11, "Phone number must be at most 11 digits"]
    },
    nic :{
        type:String,
        required : true,
        minLength : [13, "NIC must be at least 13 characters long"],
        maxLength : [13, "NIC must be at most 13 characters long"]
    },
    dob:{
        type:Date,
        required :[true, "Date of birth is required"],
    },
    gender:{
        type:String,
        required : true,
        enum : ["Male", "Female","male","female"],
    },
    password:{
        type:String,
        required : true,
        minLength : [8, "Password must be at least 8 characters long"],
        select: false
    },
    role:{
        type:String,
        required : true,
        enum : ["Admin" ,"Patient", "Doctor"],
    },
    doctorDepartment:{
        type:String,
    },
    docAvatar:{
        public_id : String,
        url : String,
    },
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
      return  next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};
export const User = mongoose.model("User", userSchema);