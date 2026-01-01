import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from 'validator';

//User Registration API
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Fill the required fields" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be of minimum 8 characters" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and Confirm Password should be same" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const role =
            email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
                ? "admin"
                : "user";

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


//User Login API
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Fill the required fields" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            user: {
                name: user.name,
                role: user.role
            },
            accessToken
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get All Users (Admin only, Paginated)
export const getAllUsers = async (req, res) => {
    try {
        const { userRole } = req.user;

        if (userRole !== "admin") {
            return res.status(403).json({ message: "Only admins can see all users" });
        }

        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [users, totalUsers] = await Promise.all([
            User.find()
                .select("_id name")
                .skip(skip)
                .limit(limit),

            User.countDocuments()
        ]);

        return res.status(200).json({
            users,
            pagination: {
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

//Api for refresh token
export async function refreshAccessToken(req, res) {
    try {
        console.log('refresh token called');

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded?.id) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const user = await userModel.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ message: "User not found or token mismatch" });
        }

        const newAccessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        return res.status(200).json({ accessToken: newAccessToken });

    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token", error: err.message });
    }
};

//Verify Access token
export function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw createError.Unauthorized('Access token is required');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw createError.Unauthorized('Access token is required');
        }

        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            return res.status(200).json({
                success: true,
                message: 'Token is valid',
            });

        } catch (err) {

            if (err.name === 'TokenExpiredError') {
                throw createError.Unauthorized('Token has expired');
            } else if (err.name === 'JsonWebTokenError') {
                throw createError.Unauthorized('Invalid token');
            } else {
                throw createError.InternalServerError();
            }
        }
    } catch (error) {
        next(error);
    }
};