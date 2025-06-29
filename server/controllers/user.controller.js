import User from "../models/user.model.js";
import VendorList from "../models/vendor.model.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/accessToken.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { oauth2client } from "../utils/googleConfig.js";
import axios from "axios";

const FRONTEND_URL = process.env.FRONTEND_URL;
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587, // Change to 465 for SSL in production
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASS,
  },
});

const options = {
  httpOnly: true,
  secure: false,         // set to true for prod dev
  sameSite: "Lax",
  // sameSite: "None", // set to None for cross-site cookies
}

export const sendOtp = async (req, res) => {
  try {
    const { email, password, phoneNumber } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or phone number",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const token = jwt.sign(
      { email: email, password: password, phoneNumber: phoneNumber, otp: otp },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const response = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "DreamWedz Registration OTP Code",
      text: `Your DreamWedz Registration OTP Code is: ${otp}`,
    });

    if (!response) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }

    res
      .status(200)
      .cookie("otp_token", token, { httpOnly: true, maxAge: 300000 })
      .json({
        success: true,
        message: "OTP sent successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const otpToken = req.cookies.otp_token;

    if (!otpToken) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired or Invalid",
      });
    }

    let decoded;
    try {
      const jwtSecret = process.env.ACCESS_TOKEN_SECRET || 'your-fallback-access-token-secret-key-change-this-in-production';
      decoded = jwt.verify(otpToken, jwtSecret);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }
    if (decoded.otp !== parseInt(otp)) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    const hashPassword = await bcrypt.hash(decoded.password, 10);

    const user = new User({
      email: decoded.email,
      password: hashPassword,
      phoneNumber: decoded.phoneNumber,
    });
    await user.save();

    const data = {
      id: user._id,
      email: user.email,
    };
    // Generate token
    const token = generateAccessToken(data);

    res.status(201)
    .cookie("token", token, options)
    .json({
      success: true,
      // token,
      user: {
        id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const signup = async (req, res) => {
//   try {
//     const { email, password, phoneNumber } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({
//       $or: [{ email }, { phoneNumber }],
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists with this email or phone number",
//       });
//     }

//     const hashPassword = await bcrypt.hash(password, 10);

//     // Create new user
// const user = new User({
//   email,
//   password: hashPassword,
//   phoneNumber,
// });
// await user.save();

// const data = {
//   id: user._id,
//   email: user.email,
// };
// // Generate token
// const token = generateAccessToken(data);

// res.status(201).json({
//   success: true,
//   token,
//   user: {
//     id: user._id,
//     email: user.email,
//     phoneNumber: user.phoneNumber,
//   },
// });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or phone number
    const user = await User.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please signup first.",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is admin
    if (user.role === 'admin') {
      const data = {
        id: user._id,
        email: user.email,
        role: 'admin',
        name: user.name
      };

      const token = generateAccessToken(data);

      return res
        .cookie("token", token, { httpOnly: true })
        .json({
          success: true,
          message: 'Admin Login Successful',
          user: {
            id: user._id,
            email: user.email,
            role: 'admin',
            name: user.name
          },
        });
    }

    // Regular user login
    const data = {
      id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role || 'organizer',
      name: user.name
    };

    const token = generateAccessToken(data);

    res
      .cookie("token", token, options)
      .json({
        success: true,
        message: "Login Successful",
        user: {
          id: user._id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role || 'organizer',
          name: user.name
        },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const googleAuth = async (req, res) => {   //old
//   try {
//     const { credential } = req.body;
//     if (!credential) {
//       return res.status(400).json({
//         success: false,
//         message: "Google Credential is Required",
//       });
//     }

//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const { email } = ticket.getPayload();
//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({
//         email: email,
//       });

//       const createdUser = await User.findById(user._id);
//       if (!createdUser) {
//         return res.status(500).json({
//           success: false,
//           message: "Something went wrong while registering user",
//         });
//       }
//     }

//     const data = {
//       id: user._id,
//       email: user.email,
//     };
//     const token = generateAccessToken(data);
//     res.status(200).json({
//       success: true,
//       message: "Google Authorization Successfull",
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };

export const googleAuth = async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({
          success: false,
          message: "Authorization code is required",
      });
    }
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
    )

    const { email } = userRes.data;
    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
          email,
        });

        const createdUser = await User.findById(user._id);
        if (!createdUser) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong while registering user",
            });
        }
    }

    const data = {
      id: user._id,
      email: user.email,
    };
    const token = generateAccessToken(data);

    return res
    .status(200)
    .cookie("token", token, options)
    .json(
      {
        success: true,
        message: "Google Authorization Successful",
        // token,
        user: {
          id: user._id,
          email: user.email,
        },
      }
    );
};

export const getUser = async (req, res) => {
  const userId = req.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {}
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id; // From verifyToken middleware
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      name: user.email.split("@")[0], // Temporary name from email
      email: user.email,
      phone: user.phoneNumber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { email, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        email,
        phoneNumber: phone,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      name: updatedUser.email.split("@")[0], // Temporary name from email
      email: updatedUser.email,
      phone: updatedUser.phoneNumber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    const token = jwt.sign({ email, otp }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
    const response = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "DreamWedz Password Reset OTP Code",
      text: `Your DreamWedz Password Reset OTP Code is: ${otp}`,
    });
    if (!response) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }
    res
      .status(200)
      .cookie("otp_token", token, { httpOnly: true, maxAge: 300000 })
      .json({
        success: true,
        message: "OTP sent successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }
    const otpToken = req.cookies.otp_token;
    if (!otpToken) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired or Invalid",
      });
    }
    let decoded;
    try {
      const jwtSecret = process.env.ACCESS_TOKEN_SECRET || 'your-fallback-access-token-secret-key-change-this-in-production';
      decoded = jwt.verify(otpToken, jwtSecret);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }
    if (decoded.otp !== parseInt(otp)) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const token = generateAccessToken({ id: user._id, email: user.email });
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtpToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "User verification required",
      });
    }
    const jwtSecret = process.env.ACCESS_TOKEN_SECRET || 'your-fallback-access-token-secret-key-change-this-in-production';
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: "User verification failed",
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPass = async (req, res) => {
  try {
    const { password, token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }
    let decoded;
    try {
      const jwtSecret = process.env.ACCESS_TOKEN_SECRET || 'your-fallback-access-token-secret-key-change-this-in-production';
      decoded = jwt.verify(token, jwtSecret);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Token expired",
      });
    }
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkAuth = async (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const jwtSecret = process.env.ACCESS_TOKEN_SECRET || 'your-fallback-access-token-secret-key-change-this-in-production';
    const decoded = jwt.verify(token, jwtSecret);
    const { id, email } = decoded;

    // Check if the ID and email belong to a User
    const user = await User.findById(id).select("-password");
    if (user) {
      return res.status(200).json({ user, role: 'user' });
    }

    // Check if the ID and email belong to a Vendor
    const vendor = await VendorList.findById(id).select("-password");
    if (vendor) {
      return res.status(200).json({ vendor, role: 'vendor' });
    }

    return res.status(404).json({ message: 'User or Vendor not found' });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

export const logout = async (req,res) => {
  return res.status(200)
    .clearCookie("token", options)
    .json({ success: true, message: "Logged Out Successfully" })
}

// export const createAdmin = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }
//   const hashedPassword = await bcrypt.hash(password, 12);
//   const admin = await User.create({
//     email,
//     password: hashedPassword,
//   })
//   res.status(201).json({
//     success: true,
//     message: "Admin created successfully",
//     admin: {
//       id: admin._id,
//       email: admin.email,
//     },
//   });
// }