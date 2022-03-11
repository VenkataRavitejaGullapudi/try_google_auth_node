const express = require('express');
const app = express();
const session = require('express-session');

// Basic Web Server Config

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.get('/', function(req, res) {
  res.send('<a href="/auth/google" class="btn btn-danger"><span class="fa fa-google"></span> SignIn with Google</a>')
});


// Passport authentication Setup
const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

var userInfo

app.get('/success', (req, res) => res.send(userInfo));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, callback) {
    callback(null, user);
  });
  passport.deserializeUser(function(obj, callback) {
    callback(null, obj);
  });



//   Google Authentication
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const GOOGLE_CLIENT_ID = '###';
const GOOGLE_CLIENT_SECRET = '####';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
      userInfo=profile;
      return done(null, userInfo);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));

