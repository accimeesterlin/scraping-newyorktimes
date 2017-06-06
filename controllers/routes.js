/**
 * Created by esterlingaccime on 5/31/17.
 */
var express = require("express"),
    routes = express.Router()
    request = require("request"),
    cheerio = require("cheerio");


var Article = require("../models/Article.js");
var Note = require("../models/Note.js");



routes.get("/scrape", function (req, res) {
    var result = {};
    var arr = [];
    request("https://www.nytimes.com/?WT.z_jog=1&hF=t&vS=undefined", function (err, response, html) {
        var $ = cheerio.load(html);

        $(".collection .theme-summary").each(function (i, element) {
                result.title = $(this).children(".story-heading").text().trim();
                result.summary = $(this).children(".summary").text().trim()
                result.link = $(this).children(".story-heading").children().attr("href");
                result.saved = false;

                arr.push({
                    title:result.title,
                    summary: result.summary,
                    link:result.link
                });

                if(result.title !== '' && result.summary !== '' && result.link !== ''){
                    var entry = new Article(result);

                    entry.save(function (err, doc) {
                        if(err) throw err;
                        //console.log(doc);

                    });
                }
        });

        //console.log(arr);
        res.json(arr);

    });





});

routes.get("/", function (req, res) {
  res.render("home");
});


routes.get("/articles", function (req, res) {
    Article.find({saved: false}, function (err, doc) {
        if(err) throw err;
        else{
            //console.log(doc);
            res.render("articles", {result:doc});
        }
    });
});


routes.get("/articles/:id", function (req, res) {
   Article.findOne({
       "_id": req.params.id
   })
       .populate("note")
       .exec(function (err, doc) {
           if(err)throw err;
           res.json(doc);
       });


});

routes.get("/saved", function (err, res) {
    Article.find({
        saved: true
    }, function (err, doc) {
        if(err) throw err;
        res.render("saved", {data: doc});

    });
});

routes.get("api/saved", function (req, res) {
    Article.find({saved: true}, function (err, doc) {
        if(err) throw err;
        res.json(doc);
    });
});


routes.post("/saved/:id", function (req, res) {
    var id = req.params.id;
    console.log(id);
    Article.findOneAndUpdate({"_id": id}, {saved: true}, function (err, doc) {
        if(err) throw err;
        res.redirect("/articles");

    });
});

routes.post("/articles/:id", function (req, res) {
    var newNote = new Note(req.body);
    console.log(newNote);
    newNote.save(function (err, doc) {
        if(err) throw err;
        Article.findOneAndUpdate({"_id": req.params.id}, {"note": doc._id})
            .exec(function (err, doc) {
                if(err) throw err;
                console.log("Data has successfully inserted into the Note!!");
                res.redirect("/saved");

            });
    });
});
module.exports = routes;