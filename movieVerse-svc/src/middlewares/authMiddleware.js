
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {

const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.json({ message: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; 
    return next();
  } catch (err) {
    return res.json({ message: "Token is not valid, or it's expired" });//200 response,because axios put all respnses in catch apart from 200-299
  }
};

export default auth;
