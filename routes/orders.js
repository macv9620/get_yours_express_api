const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const secret = "my-secret-key";
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

/* GET users listing. */
// router.get('/', async function(req, res, next) {
//   try{
//     const items = await prisma.product.findMany({
//       select: {
//           id: true,
//           name: true,
//           description: true,
//           price: true,
//           sku:true,
//           image: true,
//           brand_product_brandTobrand: true,
//           status_product_statusTostatus: true,
//           category_product_categoryTocategory: true
//       },
//       orderBy:[
//         {
//           id: 'desc'
//         }
//       ],
//       where: {
//         status: 1
//       }
//     })
//     const detail = items.map((item)=> {

//       item['brand_detail'] = item['brand_product_brandTobrand'];
//       delete item['brand_product_brandTobrand'];

//       item['brand'] = item.brand_detail.name;

//       item['product_name'] = item['name'];
//       delete item['name'];

//       item['status'] = item['status_product_statusTostatus'];
//       delete item['status_product_statusTostatus'];

//       item["category_detail"] = item["category_product_categoryTocategory"]
//       delete item["category_product_categoryTocategory"]

//       item['category'] = item.category_detail.name;

//       return item;
//     })
//     res.status(200).send(detail)
//   } catch(err){
//     console.log({err})
//     res.status(500).send({"message": err.message})
//   }
// });

function validateToken(secret) {
  return (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.sendStatus(401);
      return;
    }
    const token = authorization.slice(7);
    try {
      const payload = jwt.verify(token, secret);
      req.user = payload;
      next();
    } catch (error) {
      res.status(401).send(error.message);
    }
  };
}

/* POST create order */
router.post("/", validateToken(secret), async function (req, res, next) {
  try {
    const order = await prisma.order.create({
      data: {
        user: req.body.userId,
        date: req.body.date,
      },
    });

    res
      .status(201)
      .send({ message: "Order created successfully", data: order });
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.log(err.message);
  }
});

/* POST associate products to orders */
router.post(
  "/products",
  validateToken(secret),
  async function (req, res, next) {
    //Array con objetos {productid, q, order_Id}
    const products = req.body.products;
    if(!products || products.length === 0){
        res.status(400).send({"message": "Products not sent"})
        return
    }
    products.forEach((product, index) => {
      try {
        const order_product = async () => {
          const order = await prisma.order_product.create({
            data: {
              order_id: product.orderId,
              product_id: product.productId,
              product_q: product.productQ,
            },
          });
        };
        order_product()
        if(order_product.length === index){
            res.status(201)
            .send({ message: "Product added successfully"})
        }
      } catch (err) {
        res.status(500).send({ message: err.message });
        console.log(err.message);
      }
    }

    );
  }
);


/* GET orders */
router.post("/search", validateToken(secret), async function (req, res, next) {
  try {
    const orders = await prisma.user.findMany({
      include: {
        order_order_userTouser: {
          include: {
            order_product: {
              include: {
                product: {
                  include: {
                    category_product_categoryTocategory: true
                  }
                }
              }
            }
          }
        }
      },
      where: {
        id: Number(req.body.id)
      }
    })
    if(orders.length === 0){
      res.status(200).send({
        result: 'NO-ORDERS',
        message: `No orders found for user ${req.body.id}`,
      })
      return
    }
    const response = {
      result: 'ORDERS',
      message: 'X orders found for USER',
      userInfo: [
        ...orders[0].order_order_userTouser
      ]
    }

    res
      .status(200)
      .send({ message: "Orders", data: response });
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.log(err.message);
  }
});

module.exports = router;
