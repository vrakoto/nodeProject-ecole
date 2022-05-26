var express = require('express');
const authorController = require('../controllers/authorController');
const userController = require('../controllers/userController');
var router = express.Router();

router.route('/').get(userController.getArticles);
router.route('/users').get(userController.getUsers);
router.route('/user').post(userController.createUser);
router.route('/user/:id').get(userController.getUser);
router.route('/deleteUser/:id').post(userController.deleteUser);

router.route('/article/:id').get(authorController.getArticle);
router.route('/article').post(authorController.createArticle);
router.route('/editArticle/:id').post(authorController.editArticle);
router.route('/deleteArticle/:id').post(authorController.deleteArticle);

module.exports = router;