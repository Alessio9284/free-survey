from django.db import models

class User(models.Model):
    nickname = models.CharField(max_length = 255, primary_key = True)
    password = models.CharField(max_length = 32)

class Survey(models.Model):
	name = models.CharField(max_length = 255)
	description = models.CharField(max_length = 255)
	date = models.DateTimeField(auto_now_add = True)
	user = models.ForeignKey(User, on_delete = models.CASCADE)

class Question(models.Model):
	question = models.CharField(max_length = 255)
	survey = models.ForeignKey(Survey, on_delete = models.CASCADE)

class Answer(models.Model):
	answer = models.CharField(max_length = 255)
	score = models.IntegerField(default = 0)
	question = models.ForeignKey(Question, on_delete = models.CASCADE)