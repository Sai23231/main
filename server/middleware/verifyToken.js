// import jwt from 'jsonwebtoken';

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({
//       success: false,
//       message: 'Access token not found'
//     });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.id = decoded.id;
//     next();
//   } catch (error) {
//     return res.status(403).json({
//       success: false,
//       message: 'Invalid token'
//     });
//   }
// };

// export default verifyToken;

// import jwt from "jsonwebtoken";

// const verifyToken = async (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token)
//     return res.status(401).json({ success: false, message: "Unauthorized" });

//   try {
   
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//       if (err)
//         return res.status(403).json({ success: false, message: "Forbidden"});
//       req.id = user.id
//       req.email = user.email,
//       req.phoneNumber = user.phoneNumber

//       next();
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal Server Error" });
//   }
// };

// export default verifyToken;

import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  // const token =  req.cookies?.token || req.headers("Authorization").replace("Bearer ","");
  // const token = req.cookies?.token || req.headers["authorization"]?.replace("Bearer ", "");
  const token = req.cookies?.token;
  
  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    };
    req.id = decoded.id;
    req.email = decoded.email;
    req.phoneNumber = decoded.phoneNumber;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default verifyToken;