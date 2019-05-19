from django.contrib import admin
from .models import User, Survey, Question, Answer

admin.site.register(User)
admin.site.register(Survey)
admin.site.register(Question)
admin.site.register(Answer)