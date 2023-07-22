const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient()

/* GET role listing. */
router.get('/', async function(req, res, next) {
try{
  const role = await prisma.role.findMany()
  res.status(200).send(role)
} catch(err){
  res.status(500).send({"message": err.message})
}
});

/* POST create role */
router.post('/', async function(req, res, next) {
  try{
    const role = await prisma.role.create({
      data: {
        type: req.body.role
      }
    })
    res.status(200).send(role)
  } catch(err){
    res.status(500).send({"message": err.message})
  }
  });

module.exports = router;
