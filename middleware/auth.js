// middleware/auth.js
const authMiddleware = {
    // Проверка аутентификации
    requireAuth: (req, res, next) => {
        if (!req.session.userId) {
            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
        }
        next();
    },

    // Проверка, что пользователь аутентифицирован (но не обязательно)
    optionalAuth: (req, res, next) => {
        if (req.session.userId) {
            req.isAuthenticated = true;
        } else {
            req.isAuthenticated = false;
        }
        next();
    },

    // Проверка владельца записи (если нужно)
    checkOwnership: (modelName) => {
        return async (req, res, next) => {
            try {
                const item = await req.db.collection(modelName).findOne({
                    _id: new require('mongodb').ObjectId(req.params.id)
                });
                
                if (!item) {
                    return res.status(404).json({ error: 'Not found' });
                }
                
                // Если у записи есть поле userId, проверяем владельца
                if (item.userId && item.userId.toString() !== req.session.userId.toString()) {
                    return res.status(403).json({ error: 'Forbidden' });
                }
                
                next();
            } catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        };
    }
};

module.exports = authMiddleware;

