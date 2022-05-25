const { Schema, model } = require('mongoose')

Author = new Schema({
    name: String
})

Article = new Schema({
    title: String,
    description: String,
    author: String
})

const ArticleModel = model('Article', Article)
const AuthorModel = model('Author', Author)

module.exports = {
    ArticleModel,
    AuthorModel
}