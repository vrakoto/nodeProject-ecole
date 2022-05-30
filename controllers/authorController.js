const { ArticleModel } = require('../models/Article')
const { UserModel } = require('../models/User')

module.exports = {
    getArticle: (req, res) => {
        const idArticle = req.params.id
        let userFound = true

        ArticleModel.findById(idArticle, (err, article) => {
            if (err) {
                req.session.toast = {
                    status: 500,
                    message: "Internal Error récupération de l'article",
                    description: err,
                }
            }

            if (!article) {
                req.session.toast = {
                    status: 404,
                    message: "Article inexistant"
                }
            }

            // On vérifie si l'user existe dans la BDD
            UserModel.findById(article.author, (err, user) => {
                if (err) {
                    req.session.toast = {
                        status: 500,
                        message: "Internal Error récupération de l'user",
                        description: err,
                    }
                }
    
                if (!user) {
                    article = {
                        _id: article._id,
                        title: article.title,
                        description: article.description,
                        author: 'Utilisateur inexistant'
                    }
                    userFound = false
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
        const result = req.body
        const { title } = result
        const { description } = result
        const { author } = result

        let erreurs = {}

        for (const [key, value] of Object.entries(result)) {
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
                    message: "Internal Error",
                    error
                }
            } else {
                req.session.toast = "Article créé."
                return res.redirect('back')
            }
        })
    },

    editArticle: (req, res) => {
        const idArticle = req.params.id
        const {title} = req.body
        const {description} = req.body
        const {author} = req.body

        ArticleModel.findByIdAndUpdate(idArticle,
            {
                title: title,
                description: description
            },
        (err) => {
            if (err) {
                req.session.toast = {
                    status: 500,
                    general: "Internal error lors de l'update de l'article",
                    description: err
                }
            }
            req.session.toast = "Article modifié !"
            return res.redirect('back')
        })
    },

    deleteArticle: (req, res) => {
        const idArticle = req.params.id

        ArticleModel.findByIdAndDelete(idArticle, (err, result) => {
            if (err) {
                req.session.toast = {
                    status: 500,
                    general: "Internal error suppression de l'article",
                    description: err
                }
            }

            req.session.toast = "Article supprimé."
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