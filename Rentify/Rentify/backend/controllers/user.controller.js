import User from "../model/user.model.js"
import bcrypt from "bcryptjs"

export const getCurrentUser = async (req,res) => {
    try {
        let user = await User.findById(req.userId).select("-password")
        .populate({
            path: 'listing',
            populate: { path: 'guest', select: 'name email phone address' }
        })
        .populate("booking")
        if(!user){
            return res.status(400).json({message:"user doesn't found"})

        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`getCurrentUser error ${error}`})
    }
    
}

export const updateUserProfile = async (req, res) => {
    try {
        const { name, email, password, phone, address, gender, dob, bio } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (phone !== undefined) updates.phone = phone;
        if (address !== undefined) updates.address = address;
        if (gender !== undefined) updates.gender = gender;
        if (dob !== undefined) updates.dob = dob;
        if (bio !== undefined) updates.bio = bio;
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(req.userId, updates, { new: true })
            .select("-password")
            .populate({
                path: 'listing',
                populate: { path: 'guest', select: 'name email phone address' }
            })
            .populate("booking");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Update user error: ${error}` });
    }
}