//appele des modules
const Score = require("../model/score-model");


const gameView = (req, res) => {
    if (!req.session.misteryNum) {
        req.session.misteryNum = Math.floor(Math.random() * 100) + 1;
        req.session.counter = 0
    }
    res.render("Jeu", { misteryNum: req.session.misteryNum, counter: req.session.counter, user: req.session.user });
}

const winView = (req, res) => {
    res.render("win", { misteryNum: req.session.misteryNum, counter: req.session.counter, user: req.session.user })
}

const replayView = (req, res) => {
    req.session.misteryNum = Math.floor(Math.random() * 100) + 1;
    req.session.counter = 0
    res.redirect("/");
}

const classementView = (req, res) => {
    Score.find().sort({ score: 1, date: 1 }).then((scores) => {
        res.render("classement", { user: req.session.user, scores: scores });

    }).catch((err) => {
        console.error(err);
        res.render("classement", { user: req.session.user });
    });
}
const formNumber = (req, res) => {
    const userGuess = parseInt(req.body.number, 10);
    const randomNumber = req.session.misteryNum;

    let errors = [];

    if (isNaN(userGuess) || userGuess > 100 || userGuess < 1) {
        errors.push({ msg: "Veuillez entrer un nombre valide." });
    } else if (userGuess < randomNumber) {
        errors.push({ msg: `${userGuess} est trop petit !` });
        req.session.counter++;
    } else if (userGuess > randomNumber) {
        errors.push({ msg: `${userGuess} est trop grand !` });
        req.session.counter++;
    } else {
        req.session.counter++;
        async function classement() {
            if (req.session.user) {
                const score = new Score({

                    pseudo: req.session.user.pseudo,
                    score: req.session.counter,
                    date: Date.now()
                });
                await score.save().then(() => {
                    console.log("Score enregistré");
                }).catch((err) => {
                    console.error(err);
                });
                //tri de la base de donnée par rapport au score puis par rapport à la date
                await Score.find().sort({ score: 1, date: 1 });

            }
        }
        classement();
        return res.redirect("/win");
    }
    res.render("Jeu", { errors: errors, misteryNum: req.session.misteryNum, counter: req.session.counter, user: req.session.user })
};

module.exports = {
    gameView,
    winView,
    replayView,
    classementView,
    formNumber
}