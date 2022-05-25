const {AuthorModel, ArticleModel } = require('../models/Article')
const {UserModel} = require('../models/User')

module.exports = {
    getArticles: (req, res) => {
        ArticleModel.find({}, function(err, articles) {
            console.log(req.session);
            if (err) {
                return res.status(500).json({
                    message: err,
                });
            }
            var articlesMap = {};
        
            articles.forEach(function(article) {
                articlesMap[article._id] = article;
            });
        
            res.render('../views/partials/body', {
                page: "index",
                articlesMap
            });
        });
    },

    getUsers: (req, res) => {
        UserModel.find({}, function(err, users) {
            var userMap = {}
        
            users.forEach(function(user) {
              userMap[user._id] = user;
            })
        
            res.render('../views/partials/body', {
                toast: req.session.toast,
                page: "users",
                userMap
            });
        });
    },

    createUser: (req, res) => {
        const result = req.body
        const {username} = result;
        const {email} = result;
        const {age} = result;

        let erreurs = {};
        for (let key in result) {
            const value = result[key]
            if (!value) {
                erreurs[key] = 'le champ est vide'
            }
        }

        if (age < 18 || age > 80 || !Number.isInteger(age)) {
            erreurs.age = "l'utilisateur doit être majeur et moins de 80 ans"
        }

        if (Object.keys(erreurs).length > 0) {
            req.session.toast = erreurs
            return res.redirect('/users')
        }

        const user = new UserModel({username, email, age})
        user.save((err, user) => {
            if (err) {
                req.session.toast = {
                    status: 500,
                    general: "Internal Error",
                    description: err,
                }
                return res.redirect('/users')
            } else {
                req.session.toast = "User créé."
                return res.redirect('/users')
            }
        })
    },
}