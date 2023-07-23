const express= require('express');
const router= express.Router();

const authController= require('../controllers/authControllers');

router.get('/',authController.getHomepage)

router.get('/signup',authController.getSignup)
router.post('/signup',authController.postSignup);

router.get('/signin',authController.getSignin);
router.post('/signin',authController.postSignin);

router.get('/logout', authController.getLogOut);



module.exports=router;