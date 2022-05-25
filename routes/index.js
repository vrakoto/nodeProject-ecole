var express = require('express');
const authorController = require('../controllers/authorController');
const userController = require('../controllers/userController');
var router = express.Router();

router.route('/').get(userController.getArticles);
router.route('/users').get(userController.getUsers);

/* router.get('/users', function(req, res) {
    res.render('./partials/body', {
        page: "users"
    });
}); */

router.route('/user').post(userController.createUser);

module.exports = router;