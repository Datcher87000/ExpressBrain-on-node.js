const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
const { body, validationResult } = require('express-validator');

const { loginView, registerView, formRegister, teamView, formLogin, logoutView } = require('../controller/user-controller')

router.get("/login", loginView)

router.get("/register", registerView)

router.get("/team", teamView)

router.get("/logout", logoutView)

router.post("/register",
    body('email').isEmail().withMessage('Veuillez entrer un email valide.'),
    body('pseudo').isLength({ min: 3 }).withMessage('Le pseudo doit contenir au moins 3 caractères.'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            console.log('test')
            throw new Error('Les mots de passe ne correspondent pas.')
        }
        return true;
    }).withMessage('Les mots de passe ne correspondent pas.')
    , formRegister);

router.post("/login",
    body('email').isEmail().withMessage('Veuillez entrer un email valide.'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
    formLogin);


module.exports = router;