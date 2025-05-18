// backend/middleware/checkOwner.js
module.exports = function checkOwnerRole(req, res, next) {
    if (!req.user || req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied: owners only' });
    }
    next();
  };
  