from django import forms

class FormUser(forms.Form):
    nickname = forms.CharField(required = True, max_length = 255)
    password = forms.CharField(max_length = 32)