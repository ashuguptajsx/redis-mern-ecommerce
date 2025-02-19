import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";
import { set } from "mongoose";


const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({
        message: "User already exists",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
    });

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: " User created successfully",
    });
  } catch (error) {
    console.log("error in Signup the application", error.message)
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);

      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  } catch (error) {
    console.log("error in logging the application", error.message)
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
      await redis.del(`refreshToken:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("error in logging out the application", error.message)
    res.status(500).json({
      message: error.message,
    });
  }
};


export const refreshToken = async (req, res) =>{
  try {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
      return res.status(401).json({
        message:"NO refresh tokes found"
      })
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    const storedToken = await redis.get(`refreshToken:${decoded.userId}`);

    if(storedToken !==refreshToken){
      return res.status(401).json({message:"Invalid refresh token"})
    }

    const accessToken = jwt.sign({userId:decoded.userId}, process.env.JWT_SECRET, { expiresIn:"15m"});

    res.cookie("accessToken", accessToken, {
      httpOnly:true,
      secure: process.env.NODE_ENV === "production",
      sameSite:"strict",
      maxAge: 15*60*1000
    });

    res.json({message:"token refreshed successfully"})
  } catch (error) {
    console.log("error in refreshing the token", error.message)
    res.status(500).json({message:"server error", error:error.message});
    
  }
}


export const getProfile = async (req, res)=>{
    try {
      res.json(req.user);
    } catch (error) {
       res.status(500).json({message:"server error", error:error.message});
    }
}