const express = require('express');
const router = express.Router();
const db = require('../src/bd/db');

/* GET users listing. */
router.get('/items', function(req, res, next) {
    console.log(db)
  res.send(db);
});

module.exports = router;
