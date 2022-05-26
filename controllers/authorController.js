const { ArticleModel } = require('../models/Article')
const { UserModel } = require('../models/User')

module.exports = {
    getArticle: (req, res) => {
        const idArticle = req.params.id
        let userFound = true

        ArticleModel.findById(idArticle, (err, article) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Error récupération de l'article",
                    description: err,
                })
            }

            if (!article) {
                return res.status(404).json({
                    status: 404,
                    message: "Article introuvable"
                })
            }

            // On vérifie si l'user existe dans la BDD
            UserModel.findById(article.author, (err, user) => {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        message: "Internal Error récupération de l'user",
                        description: err,
                    })
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
        const userPage = `/user/${author}` // renvoie vers "getUser" du controller "userController"

        for (const [key, value] of Object.entries(result)) {
            if (value.trim() === '') {
                erreurs[key] = 'le champ est vide'
            }
        }

        req.session.toast = erreurs
        if (Object.entries(erreurs).length > 0) {
            return res.redirect(userPage)
        }

        UserModel.findById(author, (err, user) => {
            // les erreurs liés à la recherche de l'user sont déjà gérés par la méthode "getUser" du controller "userController"
            
            if (user) {
                const user = new ArticleModel({title, description, author})
                try {
                    user.save()
                    req.session.toast = "Article créé."
                } catch (error) {
                    return res.status(500).json({
                        status: 500,
                        message: "Internal Error",
                        error
                    })
                }
            }
            return res.redirect(userPage)
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
                return res.status(500).json({
                    status: 500,
                    general: "Internal error lors de l'update de l'article",
                    description: err
                })
            }
            req.session.toast = "Article modifié !"
            return res.redirect('back')
        })
    },

    deleteArticle: (req, res) => {
        const idArticle = req.params.id

        ArticleModel.findByIdAndDelete(idArticle, (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    general: "Internal error suppression de l'article",
                    description: err
                })
            }

            req.session.toast = "Article supprimé."
            return res.redirect(`/user/${result.author}`)
        })
    }
}