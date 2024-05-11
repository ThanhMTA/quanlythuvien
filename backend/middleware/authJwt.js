import jwt from 'jsonwebtoken';
import config from '../config/auth.js'


const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')
  // console.log(req)
  console.log("token = " + token)
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token,
    config.secret,
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized! ",
        });
      }
      req.userId = decoded.id;
      next();
    });
};
const authJwt = {
  verifyToken: verifyToken,

};
export default authJwt;