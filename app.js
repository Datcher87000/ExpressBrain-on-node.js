"use strict";
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const uuidv4 = require('uuid').v4;
const port = 3000;
const gameRouter = require('./router/game-router');
const userRouter = require('./router/user-router');
const db = require('./model/connect')
// Activation de express-validator pour valider le contenu des formulaires
const { body, validationResult } = require('express-validator');
// Activation du Path pour générer le chemin des views
const path = require('path');
app.use(express.urlencoded({ extended: true }))
// Activation du système body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
// Configurer mon système de vues ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


//gestion de session(nombre secret)
const session = require('express-session');
app.use(session({
  secret: 'misterynum',
  saveUninitialized: true,
  resave: true
}));

//Routes
app.use("/", gameRouter)
app.use("/", userRouter)

// Activation du serveur
app.listen(port, () => {
  console.log(`Mon serveur Express tourne sur le port ${port}`)
})