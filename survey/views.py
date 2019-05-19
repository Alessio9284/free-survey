from django.shortcuts import render
from .models import User, Message
from .functions import FormDati
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from hashlib import md5
from django.core import serializers
from django.db.models import Q

import random
import json

def index(request):

	if checkSession(request):

		nickname = request.session['nickname']

		# Utente inattivo
		User.objects.filter(nickname = nickname).update(active = False)

		# Distruzione della sessione
		del request.session['nickname']

	return render(request, 'survey/index.html')
   
def registration(request):

	return render(request, 'survey/registration.html')

def userlist(request):

	if checkSession(request):

		nickname = request.session['nickname']

		# Utente attivo
		User.objects.filter(nickname = nickname).update(active = True)

		return render(request, 'survey/userlist.html')
	else:
		return HttpResponseRedirect('../')

def chat(request, nickname):

	if checkSession(request):

		if User.objects.filter(nickname = nickname, active = True).exists():

			frm = request.session['nickname']

			return render(request, 'survey/private_chat.html', {'to' : nickname, 'frm' : frm} )
		else:
			return HttpResponseRedirect('../')
	else:
		return HttpResponseRedirect('../')

def adduser(request):

	if request.method == 'POST':

		# Prendo i dati del Form
		form = FormDati(request.POST)

		# Controllo che il form sia valido
		if form.is_valid():

			# Raccolgo i dati in modo da essere utilizzabili
			dati = form.cleaned_data
			nickname = dati['nickname']

			# Controllo che il nome utente non esista già
			if not (User.objects.filter(nickname = nickname).exists()):

				password =  dati['password']
				
				# Creazione dell'utente tramite un oggetto
				user = User(
					nickname = nickname,
					password = md5(password.encode()).hexdigest(),
					color = '%06x' % random.randint(0, 0xFFFFFF)
				)

				# INSERT nel database
				user.save()

				return HttpResponseRedirect('../')
			else:
				return HttpResponseRedirect('/reg/')
		else:
			return HttpResponseRedirect('/reg/')
	else:
		return HttpResponseRedirect('/reg/')

def logging(request):

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

				return HttpResponseRedirect('/list/')
			else:
				return HttpResponseRedirect('../')
		else:
			return HttpResponseRedirect('../')
	else:
		return HttpResponseRedirect('../')

def updatelist(request):

	if checkSession(request):

		userlist = serializers.serialize('json', User.objects.filter(active = True))

		return JsonResponse(userlist, safe = False)
	else:
		return HttpResponseRedirect('../')

def updatemessages(request, nickname):

	if checkSession(request):

		active = User.objects.get(nickname = nickname).active

		if int(request.POST['messages']) != Message.objects.all().count():

			frm = request.session['nickname']

			if frm == nickname:
				messages = serializers.serialize('json',
					Message.objects.filter(frm = frm, to = nickname).order_by('id')
				)
			else:
				messages = serializers.serialize('json', 
					Message.objects.filter(
						Q(frm = frm, to = nickname) | Q(frm = nickname, to = frm)
					).order_by('id')
				)

			return JsonResponse({'data' : json.loads(messages), 'active' : active}, safe = False)
		else:
			return JsonResponse({'data' : 'nochange', 'active' : active}, safe = False)
	else:
		return HttpResponseRedirect('../../')

def addmessage(request):

	if checkSession(request):

		if request.method == 'POST':

			frm = request.session['nickname']
			to = request.POST['to']

			# Creazione del messaggio tramite un oggetto
			message = Message(
				text = request.POST['message'],
				date = request.POST['date'],
				frm = User.objects.get(nickname = frm),
				to = User.objects.get(nickname = to),
			)

			# INSERT nel database
			message.save()

			return JsonResponse("add", safe = False)
		else:
			return HttpResponseRedirect('../')
	else:
		return HttpResponseRedirect('../')

def truncate(request):

	# Eliminazione di tutti i record nei modelli
	User.objects.all().delete()
	Message.objects.all().delete()

	return HttpResponseRedirect('../../')

# FUNCTIONS

def checkSession(request):
	if 'nickname' in request.session:

		return True
	else:
		return False