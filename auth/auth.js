const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
      // Aquí podrías guardar el perfil en tu base de datos si lo deseas
      return done(null, profile);
    }
  )
);

// Guardar el usuario en la sesión
passport.serializeUser((user, done) => {
  done(null, user);
});

// Obtener usuario desde la sesión
passport.deserializeUser((user, done) => {
  done(null, user);
});
