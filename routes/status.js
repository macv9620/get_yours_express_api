const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient()

/* GET brands listing. */
router.get('/', async function(req, res, next) {
try{
  const status = await prisma.status.findMany()
  res.status(200).send(status)
} catch(err){
  res.status(500).send({"message": err.message})
}
});

/* POST create status */
router.post('/', async function(req, res, next) {
  try{
    const status = await prisma.status.create({
      data: {
        name: req.body.status_name
      }
    })
    res.status(200).send(status)
  } catch(err){
    res.status(500).send({"message": err.message})
  }
  });

module.exports = router;
