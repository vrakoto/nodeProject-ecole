const { Schema, model } = require('mongoose')

Article = new Schema({
    title: String,
    description: String,
    author: String
})

const ArticleModel = model('Article', Article)

module.exports = {
    ArticleModel
}