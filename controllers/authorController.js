const ArticleModel = require('../models/Article')
const UserModel = require('../models/User')

module.exports = {
    getArticle: (req, res) => {
        const idArticle = req.params.id
        let userFound = ''

        ArticleModel.findById(idArticle, (err, article) => {
            if (err) {
                req.session.toast = {
                    status: 500,
                    message: "Internal Error while getting the article",
                    description: err,
                }
            }

            if (!article) {
                req.session.toast = {
                    status: 404,
                    message: "Article doesn't exist"
                }
            }

            // On vérifie si l'user existe dans la BDD
            UserModel.findById(article.author, (err, user) => {
                if (err) {
                    req.session.toast = {
                        status: 500,
                        message: "Internal Error while verifying the user's ID",
                        description: err,
                    }
                }
    
                if (!user) {
                    article = {
                        _id: article._id,
                        title: article.title,
                        description: article.description,
                        author: "User inexistant"
                    }
                } else {
                    userFound = user.username
                }

                return res.render('../views/partials/body', {
                    toast: req.session.toast ?? '',
                    page: "article",
                    article,
                    userFound
                });
            })
        })
    },

    createArticle: (req, res) => {
        const {title, description, author} = req.body

        let erreurs = {}

        for (const [key, value] of Object.entries(req.body)) {
            if (value.trim() === '') {
                erreurs[key] = 'le champ est vide'
            }
        }

        req.session.toast = erreurs
        if (Object.entries(erreurs).length > 0) {
            return res.redirect(`/user/${author}`)
        }

        const article = new ArticleModel({title, description, author})
        article.save((err) => {
            if (err) {
                req.session.toast = {
                    status: 500,
                    message: "Internal Error while creating the article",
                    error
                }
            } else {
                req.session.toast = "Article created."
                return res.redirect('back')
            }
        })
    },

    editArticle: (req, res) => {
        const idArticle = req.params.id
        const {title, description, author} = req.body

        ArticleModel.findByIdAndUpdate(idArticle,
            {
                title: title,
                description: description
            },
        (err) => {
            if (err) {
                req.session.toast = {
                    status: 500,
                    general: "Internal error while updating the article",
                    description: err
                }
            }
            req.session.toast = "Article updated."
            return res.redirect('back')
        })
    },

    deleteArticle: (req, res) => {
        const idArticle = req.params.id

        ArticleModel.findByIdAndDelete(idArticle, (err, result) => {
            if (err) {
                req.session.toast = {
                    status: 500,
                    general: "Internal error while deleting the article",
                    description: err
                }
            }

            req.session.toast = "Article deleted."
            UserModel.findById(result.author, (err, user) => {
                if (!user) {
                    return res.redirect('/')
                } else {
                    return res.redirect(`/user/${result.author}`)
                }
            })
        })
    }
}