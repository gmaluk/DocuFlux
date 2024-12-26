exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'No tiene permisos para realizar esta acción'
            });
        }
        next();
    };
};