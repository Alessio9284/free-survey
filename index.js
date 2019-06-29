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

	var id = new ObjectID(obj.id);

	mongo.connect(url, { useNewUrlParser: true }, function(err, db)
	{
		if (err) throw err;

		var cur = db.db(database);

		for(var i = 0; i < obj.scores.length; i++)
		{
			var search = {
				_id : id,
				"questions.question" : obj.scores[i].question,
				"questions.answers.answer" : obj.scores[i].answer
			};

			console.log(search);

			var update = { $inc : { "questions.$[element1].answers.$[element2].score" : 1 } };

			cur.collection("surveys").updateOne(search, update,
				{ "arrayFilters":
					[
						{ "element1.question.score": { "$exists": true } },
						{ "element2.answer.score": { "$exists": true } },
					]
				},
				function(err, res)
				{
					if (err) throw err;

					//console.log("Collection inserted!");*/

					console.log("1 document updated");
	    			db.close();
				}
			);
		}
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

/*
urlpatterns = [
	path('survey/<nickname>/<int:id_>', views.survey, name = 'survey'),

	#path('survey/', views.userlist, name = 'userlist')
	#path('survey/<nickname>', views.surveylist, name = 'surveylist')
	path('answer/', views.answer, name = 'answer'),
]

def home(request):

	if checkSession(request):

		nickname = request.session['nickname']
		surveys = Survey.objects.filter(user = nickname)

		return render(request, 'survey/home.html', {'surveys' : surveys})
	else:
		return HttpResponseRedirect('../')

def survey(request, nickname, id_):

	u = User.objects.get(nickname = nickname)
	s = Survey.objects.filter(id = id_, user = u)
	q = Question.objects.filter(survey = s[0])
	a = Answer.objects.filter(question = q[0])

	# per ogni richiesta delle questioni bisogna prelevare anche tutte le risposte possibili

	survey = serialize('json', s.only('name', 'description'))
	questions = serialize('json', q.only('question'))
	answers = serialize('json', a.only('answer'))

	print(survey)
	print(questions)
	print(answers)

	if checkSession(request):
		return render(request, 'survey/survey.html',
			{
				'survey' : json.dumps(survey),
				'questions' : json.dumps(questions),
				'answers' : json.dumps(answers),
				'status' : 'author'
			}
		)
	else:
		return render(request, 'survey/survey.html',
			{
				'survey' : json.dumps(survey),
				'questions' : json.dumps(questions),
				'answers' : json.dumps(answers),
				'status' : 'user'
			}
		)



def answer(request):
	'''
		if checkSession(request):

			userlist = serializers.serialize('json', User.objects.filter(active = True))

			return JsonResponse(userlist, safe = False)
		else:
	'''		
	return HttpResponseRedirect('../')
*/

function checkSession(req)
{
	return req.session.nickname;
}