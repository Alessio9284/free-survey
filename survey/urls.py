from django.urls import path
from . import views

urlpatterns = [
	path('', views.signin, name = 'signin'),
	path('reg/', views.reg, name = 'reg'),
	path('home/', views.home, name = 'home'),
	path('create/', views.create, name = 'add'),
	path('survey/<nickname>/<int:id_>', views.survey, name = 'survey'),

	path('log/', views.log, name = 'log'),
	path('add/', views.add, name = 'add'),
	path('update/', views.update, name = 'update'),
	#path('survey/', views.userlist, name = 'userlist')
	#path('survey/<nickname>', views.surveylist, name = 'surveylist')
	path('answer/', views.answer, name = 'answer'),

	path('truncate/', views.truncate, name = 'truncate'),
]