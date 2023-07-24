const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'my-secret-key'
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient()

/* POST login */
router.post('/', async function(req, res, next) {
  try{
    const { email, password } = req.body

  if (!email || !password) {
    res.status(401).send({"message": "Invalid email or password"})
    return
  }

  const users = await prisma.user.findMany({
        include: {
            role_user_roleTorole: true,
            gender_user_genderTogender: true
    }
  })

  const user = users.find((user) => user.email === email)

  if (user) {
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ id: user.id, role: user.role_user_roleTorole.type, email: user.email, gender: user.gender_user_genderTogender.identity, first_name: user.first_name, last_name: user.last_name }, secret)
        res.status(200).send({ token })
      } else {
        res.status(401).send({"message": "Invalid Email or Password"})
      }
    })
  } else {
    res.status(401).send({"message": "Invalid Email or Password"})
  }

  } catch(err){
    res.status(500).send({"message": err.message})
  }
  });

module.exports = router;
