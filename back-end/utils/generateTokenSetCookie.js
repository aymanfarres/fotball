import jwt from "jsonwebtoken"

export const generateTokenSetCookie=(res, userId)=>{
    const token = jwt.sign({userId}, process.env.JWT, {
        expiresIn: "7d"
    })
    res.cookie("token", token, {
        httponly: true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}