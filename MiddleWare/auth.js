import jwt from 'jsonwebtoken';

const authtoken = (req, res,next) => {
  const {token} =req.headers;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
try {
    const compareToken = jwt.verify(token,process.env.JWT_SECRET_KEY)
     if(compareToken.id){
        req.body.userId = compareToken.id;
     }else {
        return res.status(403).json({ message: 'token is mismatched.' });
     }
   next();
} catch (error) {
      return res.status(403).json({ message: 'Invalid token.' });
  
}
  

}
export default authtoken;