/**
 * Created by esterlingaccime on 6/4/17.
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },

    summary:{
        type:String
    },
    note:{
        type:Schema.Types.ObjectId,
        ref:'Note'
    },
    saved:{
        type:Boolean
    }
});

var Article = mongoose.model("Articles", ArticleSchema);

module.exports = Article;