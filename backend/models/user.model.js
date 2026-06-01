import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//schema ka drust dakain
//har xyz: dabeta obj w ama loy dayre dkaian dabe chbet
//custom error message yakam agar true bet duwam agar nabu awaha bret required: [true, "Name is required"]

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],

    },
    cartItems:[
        {
            quantity:{ // it's just a number that says how many of that product
                type: Number,
                default: 1,
            },
            product:{
                // it's used when you want to reference another document instead if storing whole thing
                type: mongoose.Schema.Types.ObjectId, // store only the products ID 
                ref: "Product", // link it to Product model
            }
        }
    ],
    role:{
        type: String,
        enum: ["customer", "admin"], // only these values allowed
        default: "customer", // if you don't give a role it will be customer
    },
},    
// tell us createdAt and updatedAt
{
    timestamps: true,
}
);

// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        // lera loaya = krdya ba this.password labar away pash await rasta password kay ka user nardite hash dakat
        // ballam replace naktawa lagal away ka dacheta naw database kawata labar away lanaw chaw cheway userSchemayna numna this.password awaya
        // ka lanaw db kaya yan halyan lanaw schema kaya loaya ama away nardraya hash dakain w yaksani dakain ba password pesh away save bet lonaw db
        // with this.password ensures the hashed password replaces the plain one before saving to database for more info visit E-commerce file
        this.password =  await bcrypt.hash(this.password, salt);
    } catch (error) {
        next(error);
    }

});


//la jeshka aw function bakar daynawa password ka peman draya dachita naw (password)
//w la naw function kashman ba bcrypt barawrd bkat la newan 
//aw password ka draya w away this.password la naw database kaman daya
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
    // check with await if there's error
}


const User = mongoose.model("User", userSchema);


export default User;