from django.shortcuts import render
from .models import User, Survey, Question, Answer
from .functions import FormUser
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from hashlib import md5
from django.core import serializers

import json

# Pages
def signin(request):

	if checkSession(request):

		nickname = request.session['nickname']

		del request.session['nickname']

	return render(request, 'survey/signin.html')
   
def reg(request):

	return render(request, 'survey/signup.html')

def create(request):

	return render(request, 'survey/create.html')

def survey(request):

	return render(request, 'survey/survey.html')

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

				return HttpResponseRedirect('/create/')
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
	
	if request.method == 'POST':

		# Prendo i dati del Form
		form = FormDati(request.POST)

		# Controllo che il form sia valido
		if form.is_valid():

			# Raccolgo i dati in modo da essere utilizzabili
			dati = form.cleaned_data

			nickname = dati['nickname']
			password = md5(dati['password'].encode()).hexdigest()

			# Controllo se l'utente esiste
			user = User.objects.filter(nickname = nickname, password = password)

			if (user.exists()):

				request.session['nickname'] = nickname

				return HttpResponseRedirect('/create/')
			else:
				return HttpResponseRedirect('../')
		else:
			return HttpResponseRedirect('../')
	else:
		return HttpResponseRedirect('../')

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