import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Adjust path as needed

// @TODO: Move JWT_SECRET to environment variables
const JWT_SECRET = 'your_jwt_secret_key_placeholder'; // Must match the one in auth controller

// Middleware to protect routes by verifying JWT
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer scheme)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from the token payload's ID, excluding password
      // Ensure user still exists
      req.user = await User.findById(decoded.user.id).select('-password');

      if (!req.user) {
         console.log('User not found in database'); // Add this line
         return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      console.log('User found:', req.user); // Add this line

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Token verification failed:', error.message);
      // Handle specific JWT errors like TokenExpiredError if needed
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
       if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      // Generic fallback for other errors during verification
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  // If no token is found in the header
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to authorize based on user role
// Example usage: router.get('/admin-only', protect, authorize(['admin']), (req, res) => { ... });
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if req.user was set by the 'protect' middleware
    if (!req.user || !req.user.role) {
        // This should technically not happen if 'protect' runs first and succeeds
        console.error('Authorization check failed: req.user not set');
        return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next(); // Role is authorized, proceed
  };
};