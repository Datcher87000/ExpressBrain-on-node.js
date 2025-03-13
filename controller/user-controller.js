const { validationResult } = require('express-validator');
const User = require('../model/user-model');

const loginView = (req, res) => {
    res.render("login", { errors: [], user: req.session.user });
}
const logoutView = (req, res) => {
    req.session.destroy();
    res.redirect("/login");
}
const registerView = (req, res) => {
    res.render("register", { errors: [], user: req.session.user });
}
const formRegister = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Erreurs détectées:", errors.array());
        return res.render("register", {
            errors: errors.array(),
            email: req.body.email,
            pseudo: req.body.pseudo
        });
    }

    try {
        // Vérifie si l'email est déjà utilisé
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.render("register", {
                errors: [{ msg: "Un compte existe déjà avec cet email.", param: "email" }],
                email: req.body.email,
                pseudo: req.body.pseudo
            });
        }

        // Création du nouvel utilisateur
        const user = new User({
            pseudo: req.body.pseudo,
            email: req.body.email,
            password: req.body.password,
            role: "user"
        });

        await user.save();
        res.redirect("/login");
    } catch (err) {
        console.error("Erreur lors de l'inscription :", err);
        res.render("register", {
            errors: [{ msg: "Une erreur est survenue. Veuillez réessayer." }],
            email: req.body.email,
            pseudo: req.body.pseudo
        });
    }
};

const formLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("login", {
            errors: errors.array(),
            email: req.body.email,
            password: req.body.password
        });
    }
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.render("login", {
                errors: [{ msg: "Email ou mot de passe incorrect." }],
                email: req.body.email,
                password: req.body.password
            });
        }
        if (req.body.password !== user.password) {
            return res.render("login", {
                errors: [{ msg: "Email ou mot de passe incorrect." }],
                email: req.body.email,
                password: req.body.password
            });
        }
        console.log(user)
        req.session.user = user;

        res.redirect("/");
    }
    catch (err) {
        console.error("Erreur lors de la connexion :", err);
        res.render("login", {
            errors: [{ msg: "Une erreur est survenue. Veuillez réessayer." }],
            email: req.body.email,
            password: req.body.password
        });
    }
};
const teamView = (req, res) => {
    res.render("team", { user: req.session.user });
}

module.exports = {
    loginView,
    formRegister,
    registerView,
    formLogin,
    teamView,
    logoutView
}