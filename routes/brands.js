const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient()

/* GET brands listing. */
router.get('/', async function(req, res, next) {
try{
  const brands = await prisma.brand.findMany()
  res.status(200).send(brands)
} catch(err){
  res.status(500).send({"message": err.message})
}
});

/* POST create brand */
router.post('/', async function(req, res, next) {
  try{
    const brand = await prisma.brand.create({
      data: {
        name: req.body.brand_name
      }
    })
    res.status(200).send(brand)
  } catch(err){
    res.status(500).send({"message": err.message})
  }
  });


  /* POST delete brand */
router.delete('/', async function(req, res, next) {
  try{
    const brand = await prisma.brand.delete({
      where: {
        id: req.body.brand_id
      }
    })
    res.status(200).send(brand)
  } catch(err){
    res.status(500).send({"message": err.message})
  }
  });

module.exports = router;
