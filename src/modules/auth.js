import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const comparePasswords = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

export const createJWT = (user) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET);
  return token;
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    res.status(401);
    return res.json({ message: "Not authorized." });
  }
  const [, token] = bearer.split(" ");
  if (!token) {
    res.status(401);
    return res.json({ message: "Not a valid token." });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = payload.user;
    req.user = user;
    return next();
  } catch (error) {
    res.status(401);
    return res.json({ message: "Not a valid user." });
  }
};
