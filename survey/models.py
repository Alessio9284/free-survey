from django.db import models

class User(models.Model):
    nickname = models.CharField(max_length = 255, primary_key = True)
    password = models.CharField(max_length = 32)
    color = models.CharField(max_length = 6)
    active = models.BooleanField(default = False)

class Message(models.Model):
    text = models.TextField()
    date = models.CharField(max_length = 255)
    frm = models.ForeignKey('User', related_name = 'frm', on_delete = models.CASCADE)
    to = models.ForeignKey('User', related_name = 'to', on_delete = models.CASCADE)