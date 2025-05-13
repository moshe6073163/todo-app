const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    profile: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
})

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();
        // Hash the password before saving
        const passwordSalt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, passwordSalt);
        next();
    } catch (err) {
        next(err);
    }
})

module.exports = mongoose.model("User", userSchema);