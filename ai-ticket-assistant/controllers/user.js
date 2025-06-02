import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import { inngest } from "../inngest/client.js"

export const signup = async(req, res) => {
    const { email, password, skills = [] } = req.body;
    try {
        const hashed = bcrypt.hash(password, 10);
        const user = await User.create({email, password: hashed, skills});

        // Fire inngest event

        await inngest.send({
            name: "user/signup",
            data: {
                email,
            },
        });

        const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET);

        res.json({user, token});

    } catch (error) {
        res.status(500).json({error: "Signup failed", details: error.message});
    }
};

export const login = async (req, res) => {
    // get email and password from body
    // find user and match password
    // And Sign Token

    const {email, password} = req.body;
    
    try {
        const user = User.findOne({email});
        if(!user) return res.status(401).json({error: "User not found"});

        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({error: "Invalid credentials"});

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET
          );
      
          res.json({ user, token });
    } catch (error) {
        res.status(500).json({error: "login failed", details: error.message});
    }
};

export const logout = async (req, res) => {

    // Till the point someone has JWT, he will be logged in and we generally pass it through cookie, so in order to logout the user, we should remove the JWT from cookie.

    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token) return res.status(401).json({error: "Unauthorized"});
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) return res.status(401).json({error: "Unauthorized"});
        })
        res.json({message: "Logout successful"});

    } catch (error) {
        res.status(500).json({ error: "Logout failed", details: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { skills = [], email, role } = req.headers;
    try {
        if(role !== "admin"){
            return res.status(403).json({error: "Forbidden"});
        }
    
        const user = await User.findOne({email});
        if(!user) return res.status(401).json({error: "User not found"});
    
        await User.updateOne(
            { email },
            { skills: skills.length ? skills: user.skills, role }
        );
        return res.json({message: "User updated successfully"})
    } catch (error) {
        res.status(500).json({ error: "Update failed", details: error.message });
    }
}

export const getUsers = async (req, res) => {
    try {
        if(role !== "admin"){
            return res.status(403).json({error: "Forbidden"});
        }
        const users = await User.find().select("-password");
        return res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Getting Users failed", details: error.message });
    }
}