/**
 * Created by esterlingaccime on 6/6/17.
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    title:{
        type: String
    },
    body:{
        type:String
    }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;