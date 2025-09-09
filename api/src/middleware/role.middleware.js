const verifyRole = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: "No user foud",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(400).json({
          success: false,
          message: "Access Denied",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default verifyRole;
