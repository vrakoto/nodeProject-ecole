const ArticleModel = require('../models/Article')
const UserModel = require('../models/User')

module.exports = {

    // pour la page home
    getArticles: (req, res) => {
        ArticleModel.find({}, function(err, articles) {
            if (err) {
                req.session.toast = {
                    message: err,
                }
            }
        
            res.render('../views/partials/body', {
                toast: req.session.toast ?? '',
                page: "index",
                articles
            });
        });
    },

    getUsers: (req, res) => {
        UserModel.find({}, function(err, users) {
            var userMap = {}
        
            users.forEach(function(user) {
              userMap[user._id] = user
            })
        
            res.render('../views/partials/body', {
                toast: req.session.toast ?? '',
                page: "users",
                userMap
            });
        });
    },

    createUser: (req, res) => {
        const {username, email, age} = req.body

        let erreurs = {}
        for (let key in req.body) {
            const value = req.body[key]
            if (!value) {
                erreurs[key] = 'le champ est vide'
            }
        }

        if (age < 18 || age > 80) {
            erreurs.age = "l'utilisateur doit être majeur et moins de 80 ans"
        }

        if (Object.keys(erreurs).length > 0) {
            req.session.toast = erreurs
            return res.redirect('/users')
        }

        const user = new UserModel({username, email, age})
        user.save((err) => {
            if (err) {
                req.session.toast = {
                    status: 500,
                    message: "Internal Error while creating the user",
                    description: err,
                }
            }

            req.session.toast = "User created."
            return res.redirect('/users')
        })
    },


    // contient également les articles associés
    getUser: (req, res) => {
        const id = req.params.id

        UserModel.findById(id, (err, user) => {
            if (err) {
                req.session.toast ={
                    status: 500,
                    message: "Internal Error while getting the user",
                    description: err,
                }
                return res.redirect('/users')
            } else if (!user) {
                req.session.toast = {
                    status: 404,
                    message: "User doesn't exist"
                }
                return res.redirect('/users')
            }

            // articles associés à l'user
            ArticleModel.find({author: id}, (err, articles) => {
                if (err) {
                    req.session.toast = {
                        status: 500,
                        message: "Internal Error while getting the user's articles",
                        description: err
                    }
                }

                return res.render('../views/partials/body', {
                    toast: req.session.toast ?? '',
                    page: "user",
                    user,
                    articles
                })
            })
        })
    },

    deleteUser: (req, res) => {
        const id = req.params.id

        UserModel.findByIdAndDelete(id, (err, user) => {
            if (err) {
                req.session.toast = {
                    status: 500,
                    message: "Internal Error while deleting the user",
                    description: err,
                }
            }

            if (!user) {
                req.session.toast = {
                    status: 404,
                    message: "User doesn't exist"
                }
            }
            
            req.session.toast = "User deleted."
            return res.redirect('/users')
        })
    }
}