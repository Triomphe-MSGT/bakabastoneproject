import dotenv from 'dotenv';
dotenv.config();

const basicAuth = (req, res, next) => {
  const authheader = req.headers.authorization;
 
  if (!authheader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Administration Sécurisée"');
    return res.status(401).send('Authentification serveur requise');
  }
 
  const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];
 
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="Administration Sécurisée"');
    return res.status(403).send('Accès refusé');
  }
};

export default basicAuth;
