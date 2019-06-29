from django.shortcuts import render
from .models import User, Survey, Question, Answer
from .functions import FormUser
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from hashlib import md5
from django.core.serializers import serialize
from django.shortcuts import get_object_or_404

import json

# Pages
def signin(request):

	if checkSession(request):

		nickname = request.session['nickname']

		del request.session['nickname']

	return render(request, 'survey/signin.html')
   
def reg(request):

	return render(request, 'survey/signup.html')

def home(request):

	if checkSession(request):

		nickname = request.session['nickname']
		surveys = Survey.objects.filter(user = nickname)

		return render(request, 'survey/home.html', {'surveys' : surveys})
	else:
		return HttpResponseRedirect('../')


def create(request):

	return render(request, 'survey/create.html')

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

# Functions
def log(request):

	if request.method == 'POST':

		form = FormUser(request.POST)

		if form.is_valid():

			dati = form.cleaned_data

			nickname = dati['nickname']
			password = md5(dati['password'].encode()).hexdigest()

			user = User.objects.filter(nickname = nickname, password = password)

			if (user.exists()):

				request.session['nickname'] = nickname

				return HttpResponseRedirect('/home/')
			else:
				return HttpResponseRedirect('../')
		else:
			return HttpResponseRedirect('../')
	else:
		return HttpResponseRedirect('../')

def add(request):

	if request.method == 'POST':

		form = FormUser(request.POST)

		if form.is_valid():

			dati = form.cleaned_data
			nickname = dati['nickname']

			if not (User.objects.filter(nickname = nickname).exists()):

				password = dati['password']
				
				user = User(
					nickname = nickname,
					password = md5(password.encode()).hexdigest(),
				)

				user.save()

				return HttpResponseRedirect('../')
			else:
				return HttpResponseRedirect('/reg/')
		else:
			return HttpResponseRedirect('/reg/')
	else:
		return HttpResponseRedirect('/reg/')


def update(request):
	
	if checkSession(request):

		if request.is_ajax():

			if request.method == 'POST':

				data = json.loads(request.body)

				nickname = request.session['nickname']

				u = User.objects.get(nickname = nickname)

				print(json.dumps(data))

				s = Survey(
					name = data['name'],
					description = data['description'],
					user = u
				)

				s.save()

				for quest in data['questions']:

					q = Question(
						question = quest['question'],
						survey = s
					)

					q.save()

					for answer in quest['answers']:

						a = Answer(
							answer = answer,
							question = q
						)

						a.save()

				return JsonResponse({'status': 'saved'})

			else:
				return JsonResponse({'status': 'denied'})
		else:
			return JsonResponse({'status': 'denied'})
	else:
		return JsonResponse({'status': 'denied'})

def answer(request):
	'''
		if checkSession(request):

			userlist = serializers.serialize('json', User.objects.filter(active = True))

			return JsonResponse(userlist, safe = False)
		else:
	'''		
	return HttpResponseRedirect('../')

def truncate(request):

	# Eliminazione di tutti i record nei modelli
	User.objects.all().delete()
	Survey.objects.all().delete()
	Question.objects.all().delete()
	Answer.objects.all().delete()

	return HttpResponseRedirect('../')

# FUNCTIONS

def checkSession(request):
	if 'nickname' in request.session:

		return True
	else:
		return False