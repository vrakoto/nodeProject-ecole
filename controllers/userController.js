const {AuthorModel, ArticleModel } = require('../models/Article')
const {UserModel} = require('../models/User')

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
        const result = req.body
        const {username} = result
        const {email} = result
        const {age} = result

        let erreurs = {}
        for (let key in result) {
            const value = result[key]
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
                    message: "Internal Error",
                    description: err,
                }
            }

            req.session.toast = "User créé."
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
                    message: "Internal Error lors de la récupération de l'user",
                    description: err,
                }
                return res.redirect('/users')
            } else if (!user) {
                req.session.toast = {
                    status: 404,
                    message: "User inexistant"
                }
                return res.redirect('/users')
            }

            // articles associés à l'user
            ArticleModel.find({author: id}, (err, articles) => {
                if (err) {
                    req.session.toast = {
                        status: 500,
                        message: "Internal Error lors de la récupération des articles de cet utilisateur",
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
                    message: "Internal Error",
                    description: err,
                }
            }

            if (!user) {
                req.session.toast = {
                    status: 404,
                    message: "User introuvable"
                }
            }
            
            req.session.toast = "User supprimé."
            return res.redirect('/users')
        })
    }
}