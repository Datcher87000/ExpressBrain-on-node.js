"use strict"

const express = require('express')
const app = express();
const port = 3000;
// Activation de express-validator pour valider le contenu des formulaires
const {body, validationResult} = require('express-validator');
// Activation du Path pour générer le chemin des views
const path = require('path');
app.use(express.urlencoded({extended : true}))
// Activation du système body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
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


app.get('/', (req, res) => {
  if(!req.session.misteryNum){
  req.session.misteryNum = Math.floor(Math.random()*100)+1;
  req.session.counter=0
 }
   res.render("Jeu",{misteryNum:req.session.misteryNum, counter:req.session.counter})
})

app.post("/", (req, res) => {
  const userGuess = parseInt(req.body.number, 10);
  const randomNumber = req.session.misteryNum;
 
  let errors = [];

  if (isNaN(userGuess)|| userGuess>100||userGuess<1) {
    errors.push({ msg: "Veuillez entrer un nombre valide." });
  } else if (userGuess < randomNumber) {
    errors.push({ msg: "Trop petit !" });
    req.session.counter++;
  } else if (userGuess > randomNumber) {
    errors.push({ msg: "Trop grand !" });
    req.session.counter++;
  } else {
       req.session.counter++;

    return res.redirect("/win");
  }

  res.render("Jeu", { number: userGuess, errors:errors, misteryNum:req.session.misteryNum, counter:req.session.counter });
});

app.get('/win',(req,res)=>{
  res.render("win",{misteryNum:req.session.misteryNum, counter:req.session.counter})
})

//rejouer
app.get("/replay", (req, res) => {
  req.session.misteryNum = Math.floor(Math.random()*100)+1;
  req.session.counter=0
  res.redirect("/");  
})

app.get("/register", (req, res) => {
  res.render("register", {errors:[]});
})

app.post("/register", [

  body('email').isEmail().normalizeEmail(),
  body('password').isLength({min: 6}),
  body('password2').custom((value, {req}) => {
    if(value !== req.body.password){
      throw new Error('Les mots de passe ne correspondent pas');
    }
    return true;
  })
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render("register", {errors: errors.array()});
  }
  res.redirect("/");
})

app.get("/classement", (req, res) => {
  res.render("classement");
})

app.get("/team", (req, res) => {
  res.render("team");
})
// Activation du serveur
 app.listen(port, () => {
    console.log(`Mon serveur Express tourne sur le port ${port}`)
})