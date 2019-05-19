import os
import pymysql
import django_heroku

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

pymysql.install_as_MySQLdb()

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Directory freeSurvey
ROOT_PATH = os.path.dirname(__file__)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '3%6-$%u@&df@949i^nhe3ubp687&txqa$g8z=p^9fa)4mw22zz'

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
	'survey',
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
]

MIDDLEWARE = [
	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'freeSurvey.urls'

TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'DIRS': [],
		'APP_DIRS': True,
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.debug',
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages',
			],
		},
	},
]

WSGI_APPLICATION = 'freeSurvey.wsgi.application'


# Database
# mysql://bbdb95f15eeebe:d1971284@eu-cdbr-west-02.cleardb.net/heroku_7099bf63db32b29?reconnect=true
# username: bbdb95f15eeebe
# password: d1971284

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.mysql', 
		'NAME': 'heroku_7099bf63db32b29',
		'USER': 'bbdb95f15eeebe',
		'PASSWORD': 'd1971284',
		'HOST': 'eu-cdbr-west-02.cleardb.net',
		'PORT': '',
		#'OPTIONS': {
		#	'ssl': {
		#		'ca': 'certificates/cleardb-ca.pem',
		#		'cert': 'certificates/bbdb95f15eeebe-cert.pem',
		#		'key': 'certificates/bbdb95f15eeebe-key.pem'
		#	}
		#}
	}
}

# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
	{
		'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
	},
]


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'it-it'
#LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = [os.path.join(ROOT_PATH, 'static')]

django_heroku.settings(locals())
