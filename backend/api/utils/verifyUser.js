import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const token = req.cookies['auth_token']
  if (!token) {
    return res.status(401).json({message: "Unauthorized!"});
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "forbidden" });
    req.user = user;
    next();
  });
};
