import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export const signToken = (payload) =>
  jwt.sign(payload, SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};

export const getTokenFromRequest = (request) => {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/token=([^;]+)/);
    if (match) return match[1];
  }
  return null;
};

export const getUserFromRequest = (request) => {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
};

export const requireAuth = (request) => {
  const user = getUserFromRequest(request);
  if (!user) {
    throw { statusCode: 401, message: 'Unauthorized. Please login.' };
  }
  return user;
};

export const requireRole = (request, ...roles) => {
  const user = requireAuth(request);
  if (!roles.includes(user.role)) {
    throw {
      statusCode: 403,
      message:    `Access denied. Requires: ${roles.join(' or ')}`,
    };
  }
  return user;
};
