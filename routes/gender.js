const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient()

/* GET gender listing. */
router.get('/', async function(req, res, next) {
try{
  const gender = await prisma.gender.findMany()
  res.status(200).send(gender)
} catch(err){
  res.status(500).send({"message": err.message})
}
});

/* POST create gender */
router.post('/', async function(req, res, next) {
  try{
    const gender = await prisma.gender.create({
      data: {
        identity: req.body.identity
      }
    })
    res.status(200).send(gender)
  } catch(err){
    res.status(500).send({"message": err.message})
  }
  });

module.exports = router;
