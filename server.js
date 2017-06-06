var express = require("express"),
    handlebars = require("express-handlebars"),
    mongoose = require("mongoose"),
    logger = require("morgan"),
    bodyParser = require("body-parser");




var app = express(),
    PORT = process.env.PORT || 8080;

app.use(logger("dev"));
mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({
    extended: false
}));



if(process.env.MONGO_URI){
    mongoose.connect(process.env.MONGO_URI);
} else{
    mongoose.connect("mongodb://localhost/nytimes");
}

var db = mongoose.connection;
db.on("error", function (err) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function () {
    console.log("Mongoose connection successful.");
});


app.use(express.static('public'));

var routes = require("./controllers/routes.js"),
    api = require("./controllers/api.js");

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//app.use(express.static("./app/public"));

app.use("/", routes);

app.listen(PORT, function () {
    console.log("App's listening at PORT ", PORT);
});




