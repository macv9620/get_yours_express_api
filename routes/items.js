const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');
const secret = 'my-secret-key';
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try{
    const items = await prisma.product.findMany({
      select: {
          id: true,
          name: true,
          description: true,
          price: true,
          sku:true,
          image: true,
          brand_product_brandTobrand: true,
          status_product_statusTostatus: true,
          category_product_categoryTocategory: true
      },
      orderBy:[
        {
          id: 'desc'
        }
      ],
      where: {
        status: 1
      }
    })
    const detail = items.map((item)=> {
  
      item['brand_detail'] = item['brand_product_brandTobrand'];
      delete item['brand_product_brandTobrand'];

      item['brand'] = item.brand_detail.name;
  
      item['product_name'] = item['name'];
      delete item['name'];
  
      item['status'] = item['status_product_statusTostatus'];
      delete item['status_product_statusTostatus'];
  
      item["category_detail"] = item["category_product_categoryTocategory"]
      delete item["category_product_categoryTocategory"]

      item['category'] = item.category_detail.name;

  
      return item;
    })
    res.status(200).send(detail)
  } catch(err){
    console.log({err})
    res.status(500).send({"message": err.message})
  }
});

function validateToken (secret) {
  return (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization || !authorization.startsWith('Bearer ')) {
      res.sendStatus(401)
      return
    }
    const token = authorization.slice(7)
    try {
      const payload = jwt.verify(token, secret)
      req.user = payload
      next()
    } catch (error) {
      res.sendStatus(401)
    }
  }
}


/* POST create items */
router.post('/', validateToken(secret), async function(req, res, next) {
  try{
    const item = await prisma.product.create({
      data: {
        name: req.body.product_name,
        description: req.body.description,
        price: Number(req.body.price),
        category: Number(req.body.category),
        brand: Number(req.body.brand),
        sku: req.body.sku,
        image: req.body.image,
        status: 1
      }
    })
    res.status(200).send({ message: 'Item created successfully' , data: item})
  } catch(err){
    res.status(500).send({"message": err.message})
    console.log(err.message)
  }
  });


  // Eliminar un producto con base en un ID
router.delete('/', validateToken(secret), async (req, res) => {

  try {
    const { id } = req.body
    if (!id) {
      res.status(400).send({
        message: 'A product Id es required'
      })
      return
    }

    const deletedProduct = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        status: 2,
      },
    })
    
    res.send({
      message: 'Product deleted successfully',
      data: deletedProduct
    })
  } catch(err) {
    res.status(500).send(err.message)
    console.log(err.message)
  }
  
})

module.exports = router;
