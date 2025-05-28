const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

// Inicia autenticación con Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback de Google
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure'
  }),
  (req, res) => {
    res.redirect('/auth/protected');
  }
);

// Ruta protegida: solo accesible si el usuario está autenticado
router.get('/protected', isAuthenticated, (req, res) => {
  res.send(`Hola ${req.user.displayName}, estás autenticado 🚀`);
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.send('You are now logged out.');
  });
});

// Fallback de fallo de login
router.get('/failure', (req, res) => {
  res.status(401).send('Authentication failed');
});

// Ruta de debug opcional
router.get('/debug', (req, res) => {
  res.json({ session: req.session, user: req.user });
});

// Middleware para proteger rutas
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('No autorizado');
}

module.exports = router;
