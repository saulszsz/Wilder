const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require('express');
const admin = require("firebase-admin");
var firebase = require("firebase");
const path = require('path');
const qrcode = require('qrcode');
const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());
app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));
app.use(express.static("client/dist/Wilder"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(csrfMiddleware);

const propia = require('./apis/propia');
const fbapi = require('./apis/firebase');

app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

app.use('/', propia);
app.use('/', fbapi);

app.get('*', (req, res) => {
    res.sendFile(path.resolve('client/dist/Wilder/index.html'))
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
