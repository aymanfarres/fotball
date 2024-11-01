// auth.controller.js
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { generateTokenSetCookie } from '../utils/generateTokenSetCookie.js';
import { sendVerificationEmail } from '../mailtrap/email.js';

const prisma = new PrismaClient();

// Signup function
export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password ) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Check if user already exists
        const userAlreadyExists = await prisma.user.findUnique({ where: { email } });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(10000 + Math.random() * 900000).toString();

        // Create the user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                verificationToken,
                verificationTokenExpiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)  // Set expiration for 12 hours
            }
        });

        // Set token cookie
        generateTokenSetCookie(res, user.id);

       await sendVerificationEmail(user, verificationToken)

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user,
                password: undefined  // Exclude password from response
            }
        });

    } catch (e) {
        console.error("Error during signup:", e);
        res.status(500).json({ success: false, message: e.message });
    }
};

// Login function
export const login = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcryptjs.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        generateTokenSetCookie(res, user.id);

        res.json({
            success: true,
            message: 'Logged in successfully',
            user: {
                ...user,
                password: undefined
            }
        });

    } catch (e) {
        console.error("Error during login:", e);
        res.status(500).json({ success: false, message: e.message });
    }
};

// Logout function
export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
};
