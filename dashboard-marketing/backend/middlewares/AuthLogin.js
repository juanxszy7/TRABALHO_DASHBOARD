import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

const JWT_SECRET = process.env.JWT_KEY;

function authToken(req, res, next) {
  try {
    let token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ error: "Token não enviado." });
    }

    // Se o token vier no formato "Bearer xxxxx", remover o "Bearer "
    if (token.startsWith("Bearer ")){
      token = token.slice(7, token.length).trim();
    }

    // Verifica o token
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
    
    }catch (error){
        return res.status(401).json({
        error: "Token inválido ou expirado.",
        detalhe: error.message,
    });
  }
}

export { authToken }
