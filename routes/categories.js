const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient()

/* GET categories listing. */
router.get('/', async function(req, res, next) {
try{
  const categories = await prisma.category.findMany()
  res.status(200).send(categories)
} catch(err){
  res.status(500).send({"message": err.message})
}
});

/* POST create categories */
router.post('/', async function(req, res, next) {
  try{
    const category = await prisma.category.create({
      data: {
        name: req.body.category_name
      }
    })
    res.status(200).send(category)
  } catch(err){
    res.status(500).send({"message": err.message})
  }
  });

module.exports = router;
