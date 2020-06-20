const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");
const path = require('path');

const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 3000;
const app = express();

app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));
app.use(express.static("client/dist/Wilder"));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

app.get('/app/*', (req, res) => { 
    res.sendFile(path.resolve('client/dist/Wilder/index.html')); 
});

app.get("/", function (req, res) {
    res.render("index.html");
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
