const express = require('express')
const User = require('../model/User');
const { registerSchema, loginSchema } = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

//register route
router.post('/register', async (req, res) => {
   //validate user
    const {error} = registerSchema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check if email already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if(emailExists) return res.status(400).send('user already exists');

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create user
   const user = new User({
       name: req.body.name,
       email: req.body.email,
       password: hashedPassword,
   });

   try {
       const savedUser = await user.save();
       res.send({user: user._id});
   } catch(err) {
       res.status(404).send(err);
   }
});

//login route
router.post('/login', async (req, res) => {
    //validate user
    const {error} = loginSchema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check if user already exists
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('email is not found');

    //check passoword
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('invalid password');

    //JWT
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    // res.send('logged in!');
    

});


module.exports = router;