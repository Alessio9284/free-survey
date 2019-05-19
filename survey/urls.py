from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name = 'index'),
    path('log/', views.logging, name = 'log'),
    path('reg/', views.registration, name = 'reg'),
    path('add/', views.adduser, name = 'add'),
    path('list/', views.userlist, name = 'list'),
    path('list/<nickname>/', views.chat, name = 'nickname'),
    path('update/', views.updatelist, name = 'update'),
    path('update/<nickname>/', views.updatemessages, name = 'message'),
    path('message/', views.addmessage, name = 'message'),

    path('truncate/', views.truncate, name = 'truncate'),
]