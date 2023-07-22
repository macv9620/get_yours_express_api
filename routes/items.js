const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');

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

/* POST create items */
router.post('/', async function(req, res, next) {
  try{
    const item = await prisma.product.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        brand: req.body.brand,
        sku: req.body.sku,
        image: req.body.image,
        status: req.body.status
      }
    })
    res.status(200).send(item)
  } catch(err){
    res.status(500).send({"message": err.message})
  }
  });

module.exports = router;
