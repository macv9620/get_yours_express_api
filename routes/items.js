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
  
      item['brand'] = item['brand_product_brandTobrand'];
      delete item['brand_product_brandTobrand'];
  
      item['product_name'] = item['name'];
      delete item['name'];
  
      item['status'] = item['status_product_statusTostatus'];
      delete item['status_product_statusTostatus'];
  
      item["category"] = item["category_product_categoryTocategory"]
      delete item["category_product_categoryTocategory"]
  
      return item;
    })
    res.status(200).send(detail)
  } catch(err){
    console.log({err})
    res.status(500).send({"message": err.message})
  }
});

module.exports = router;
