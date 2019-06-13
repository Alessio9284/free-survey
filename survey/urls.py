from django.urls import path
from . import views

urlpatterns = [
	path('', views.signin, name = 'signin'),
	path('log/', views.log, name = 'log'),
	path('reg/', views.reg, name = 'reg'),
	path('add/', views.add, name = 'add'),

	path('home/', views.home, name = 'home'),

	path('create/', views.create, name = 'add'),
	path('update/', views.update, name = 'update'),
	#path('survey/', views.userlist, name = 'userlist')
	#path('survey/<nickname>', views.surveylist, name = 'surveylist')
	path('survey/<nickname>/<int:id>', views.survey, name = 'survey'),
	path('answer/', views.answer, name = 'answer'),

	path('truncate/', views.truncate, name = 'truncate'),
]