const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient()

/* GET users listing. */
router.get('/', async function(req, res, next) {
try{
  const users = await prisma.user.findMany({
    select: {
        id: true,
        first_name:true,
        last_name: true,
        gender:true,
        email:true,
        role: true
    }
  })
  res.status(200).send(users)
} catch(err){
  res.status(500).send({"message": err.message})
}
});

function validateEmail (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

/* POST user */
router.post('/', async function(req, res, next) {
  try{

    let {
        first_name,
        last_name,
        gender,
        email,
        password,
        role,
      } = req.body

      if (!email || !password || !first_name || !last_name || !role || (gender !== 'M' && gender !== 'F')) {
        res.status(400).send({"message": "Any field can be empty"})
        return
      }

      if (!validateEmail(email)) {
        res.status(400).send({ message: 'Invalid email format' })
        return
      }

      const getEmails = async ()=> {
        const emails = await prisma.user.findMany({
            select: {
                email: true
            }
        })
        const emailExists = emails.find((dbEmail) => dbEmail.email === email)
        if (!emailExists) {

            if(gender === "M"){
                gender = 1
            } else if(gender === "F"){
                gender = 2
            }

            if(role === "CUSTOMER"){
                role = 1
            } else if(role === "ADMIN"){
                role = 2
            }
            bcrypt.hash(password, 10, (err, hashedPassword) => {
              if (err) { console.log(err.stack) }

                const createUser = async ()=> {
                    try {
                        const user = await prisma.user.create({
                            data: {
                              first_name: first_name,
                              last_name: last_name,
                              gender: gender,
                              role: role,
                              email: email,
                              password: hashedPassword
                            }
                          })
                          res.status(201).send(user)
                    } catch(err){
                        res.status(500).send({"message": err.message})
                    }

                }
                createUser()
            })
          } else {
            res.status(403).send({ message: 'Duplicated email' })
          }
      }

      getEmails()



  } catch(err){
    res.status(500).send({"message": err.message})
  }
  });


//   /* POST delete brand */
// router.delete('/', async function(req, res, next) {
//   try{
//     const brand = await prisma.brand.delete({
//       where: {
//         id: req.body.brand_id
//       }
//     })
//     res.status(200).send(brand)
//   } catch(err){
//     res.status(500).send({"message": err.message})
//   }
//   });

module.exports = router;
