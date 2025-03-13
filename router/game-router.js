const express = require('express');
const router = express.Router();

const { gameView, 
        winView, 
        replayView, 
        classementView, 
        formNumber } = require('../controller/game-controller')

        
router.get('/', gameView);
router.get('/win', winView)
router.get("/replay", replayView); 
router.get("/classement", classementView);
router.post("/", formNumber);


module.exports = router;