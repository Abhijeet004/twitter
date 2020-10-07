const router = require("express").Router();
const User = require('../models/user-model');
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "https://second-twit.herokuapp.com/";

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with twitter
router.get("/twitter", passport.authenticate("twitter"));

// redirect to home page after successfully login via twitter
router.get(
  "/twitter/redirect",
  passport.authenticate("twitter", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);


router.get('/', (req, res) => {
  var todayDate = new Date();
  let tdd = todayDate.getDate();
  let tmm = todayDate.getMonth() + 1;
  if (tmm < 10) tmm = '0' + tmm;
  if (tdd < 10) tdd = '0' + tdd;
  let tyyyy = todayDate.getFullYear();

  var last7Date = new Date();
  last7Date.setDate(last7Date.getDate() - 7);

  let ldd = last7Date.getDate();
  let lmm = last7Date.getMonth() + 1;
  if (lmm < 10) lmm = '0' + lmm;
  if (ldd < 10) ldd = '0' + ldd;
  let lyyyy = last7Date.getFullYear();

  client.get(
    'search/tweets',
    {
      q: `a since:${lyyyy + '-' + lmm + '-' + ldd} until:${
        tyyyy + '-' + tmm + '-' + tdd
      }`,
      count: 100,
    },
    (error, data, response) => {
      if (error) res.send(error);
      const tweets = data;
      User.remove({});
      let postTweets = new User({ tweets });
      postTweets.save();

      res.send(postTweets);
    }
  );
});

module.exports = router;
