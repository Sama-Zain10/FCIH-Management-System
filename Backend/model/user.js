import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20
    },
    email:{
      type: String,
      required: true,
      unique: true,
      validate :{
        validator :(value) =>{
        return value.includes('@');
      },
      message:"Email Not Valid"
    }
    },
    password:{
      type: String,
      required: true,
      minlength: 6,

    },
    age: {
      type: Number,
      required: true,
      min:5,
      max:60
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
      validate: {
        validator: (value) => {
          return value === "male" || value === "female";
        },
        message: "Invalid gender"
      }
    },
    role: {
      type: String,
      enum: ["admin", "student"],
      default: "student"
    },
    studentId: {
    type: String,
    required: function() { return this.role === "student"; }
    },
    department: {
    type: String,
    required: function() { return this.role === "student"; }
    },
    resetCode: {
  type: String
},
resetCodeExpires: {
  type: Date
}
  },
  { timestamps: true }

);
userSchema.pre("save", async function(){
  console.log("Password from model", this.password);
  const salt= await bcrypt.genSalt(10);
  const hashedpassword= await bcrypt.hash(this.password,salt)
  console.log("hashedPassword", hashedpassword);
  
  this.password = hashedpassword;
})


const UserModel = mongoose.model("User", userSchema);

export default UserModel;