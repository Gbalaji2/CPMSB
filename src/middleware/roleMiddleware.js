export const allowRoles = (...roles) => {
  // roles is now an array: ["admin"], ["admin", "tpo"], etc.
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user missing");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Access denied: insufficient permissions");
    }

    next();
  };
};