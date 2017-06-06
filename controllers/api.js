/**
 * Created by esterlingaccime on 5/31/17.
 */
var express = require("express"),
	routes = express.Router(),
	request = require("request"),
	cheerio = require("cheerio");

var getData = function (res) {
	
	request("https://www.nytimes.com/?WT.z_jog=1&hF=t&vS=undefined", function (err, response, html) {
	    var $ = cheerio.load(html);

	    var result = [];

	    $(".collection .theme-summary").each(function (i, element) {
	        var title = $(this).children(".story-heading").text().trim(),
	        	summary = $(this).children(".summary").text().trim(),
	        	link = $(this).children(".story-heading").children().attr("href");

	        result.push({
	            title: title,
	            summary:summary,
	            link:link
	        });
	        

    	});

    	res.json(result);

	})};
 


routes.get("/data", function (req, res) {
   getData(res);
});

module.exports = routes;




