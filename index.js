/* librerie */
var express = require('express');
var session = require('express-session');
var fs = require('fs');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var parser = require('body-parser');
var md5 = require('md5');
var ObjectID = require('mongodb').ObjectID;

/* variabili */
var app = express();
var database = "heroku_mb95d48d";
var url = "mongodb://" + database + ":i61csvfn7v7hb2ppr1scbun7qe@ds243897.mlab.com:43897/" + database;

/* costanti */
const PORT = process.env.PORT || 5000;

/* sessioni */
app.use(session({secret: '9284', saveUninitialized: false, resave: false}));

/* parser */
app.use(parser.json());
app.use(parser.urlencoded({ extended : true })); 

/* path grafica */
app.use(express.static(path.join(__dirname, 'public')));

/* path pagine */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* REST */
app.get('/', function(req, red)
{
	if(req.session.nickname)
	{
		delete req.session;
	}

	red.render('pages/signin');
});

app.get('/reg', (req, red) => red.render('pages/signup'));

app.get('/home', function(req, red)
{
	var nickname = req.session.nickname;

	if(!nickname)
	{
		red.redirect('/');
	}
	else
	{
		mongo.connect(url, { useNewUrlParser: true }, function(err, db)
		{
			if (err) throw err;

			var cur = db.db(database);

			cur.collection("surveys").find({user : nickname}).toArray(function(err, res)
			{
				red.render('pages/home', { surveys : res });

				db.close();
			});
		});
	}
});

app.get('/create', function(req, red)
{
	if(!req.session.nickname)
	{
		red.redirect('/');
	}
	else
	{
		red.render('pages/create');
	}
});

app.get('/survey', function(req, red)
{
	if(!req.query.user && !req.query.id)
	{
		red.redirect('/');
	}
	else
	{
		var obj = req.query;
		var user = obj.user;
		var id = new ObjectID(obj.id);

		mongo.connect(url, { useNewUrlParser: true }, function(err, db)
		{
			if (err) throw err;

			var cur = db.db(database);
			var survey = 0;

			cur.collection("surveys").find({user: user, _id : id}).toArray(function(err, res)
			{
				var user = (req.session.nickname ? "admin" : "user");

				red.render('pages/survey', { survey : res[0], user : user });

				db.close();
			});
		});
	}
});

/* login */
app.post('/log', function(req, red)
{
	var obj = req.body;
	var nickname = obj.nickname;
	var password = md5(obj.password);

	req.session.nickname = nickname;
	req.session.password = password;

	mongo.connect(url, { useNewUrlParser: true }, function(err, db)
	{
		if (err) throw err;

		var cur = db.db(database);

		cur.collection("users").find({nickname : nickname, password : password}).toArray(function(err, res)
		{
			if(res[0] == undefined)
			{
				red.redirect('/');
			}
			else
			{
				red.redirect('/home');
			}

			db.close();
		});
	});
});

/* registration */
app.post('/add', function(req, red)
{
	var obj = req.body;
	var nickname = obj.nickname;
	var password = md5(obj.password);

	mongo.connect(url, { useNewUrlParser: true }, function(err, db)
	{
		if (err) throw err;

		var user =
		{
			"nickname" : nickname,
			"password" : password
		};

		var cur = db.db(database);

		cur.collection("users").find({nickname : nickname}).toArray(function(err, res)
		{
			if(res[0] == undefined)
			{
				cur.collection("users").insertOne(user, function(err, res)
				{
					if (err) throw err;

					//console.log("Collection inserted!");
					red.redirect('/');

					db.close();
				});
			}
			else
			{
				red.redirect('/reg');
			}
			
			db.close();
		});
	});
});

/* update */
app.post('/update', function(req, red)
{
	if(!req.session.nickname)
	{
		red.redirect('/');
	}
	else
	{
		var survey = req.body;
		survey["user"] = req.session.nickname;

		mongo.connect(url, { useNewUrlParser: true }, function(err, db)
		{
			if (err) throw err;

			var cur = db.db(database);

			cur.collection("surveys").insertOne(survey, function(err, res)
			{
				if (err) throw err;

				//console.log("Collection inserted!");
				red.json({red : "/home"});

				db.close();
			});
		});
	}
});

/* answers */
app.post('/answers', function(req, red)
{
	var obj = req.body;

	var nested = {}, update = "";
	var id = new ObjectID(obj.id);

	mongo.connect(url, { useNewUrlParser: true }, function(err, db)
	{
		if (err) throw err;

		var cur = db.db(database);

		for(var i = 0; i < obj.scores.length; i++)
		{
			nested["questions." + i + ".answers." + obj.scores[i] + ".score"] = 1;

			update = { $inc : nested };

			cur.collection("surveys").updateOne({ _id : id }, update, function(err, res)
			{
				if (err) throw err;

				//console.log("1 document updated");

	    		db.close();
			});
			nested = {};
		}

		red.json({red : "/home"});
	});
});

/* reset totale */
app.get('/truncate', function(req, red)
{
	mongo.connect(url, { useNewUrlParser: true }, function(err, db)
	{
		if (err) throw err;

		var cur = db.db(database);

		cur.collection("users").drop(function(err, res)
		{
			//console.log("Collection deleted!");

			db.close();
		});

		cur.collection("surveys").drop(function(err, res)
		{
			//console.log("Collection deleted!");

			db.close();
		});
	});
	red.redirect('/');
});

/* ascolto sulla porta 5000 */
app.listen(PORT, () => console.log(`Listening on port: ${ PORT }`));

function checkSession(req)
{
	return req.session.nickname;
}