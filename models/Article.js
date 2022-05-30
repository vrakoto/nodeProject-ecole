const { Schema, model } = require('mongoose')

Article = new Schema({
    title: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const ArticleModel = model('Article', Article)

module.exports = ArticleModel