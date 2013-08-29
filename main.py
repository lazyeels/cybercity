#!/usr/bin/env python
import cgi
import os
from time import strftime
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db
from google.appengine.ext.webapp import template
from google.appengine.api import mail

class MainPage(webapp.RequestHandler):
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__), 'Game.html')
        self.response.out.write(template.render(path, template_values)) 

class About(webapp.RequestHandler):
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__), 'about.html')
        self.response.out.write(template.render(path, template_values)) 

class Controls(webapp.RequestHandler):
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__), 'controls.html')
        self.response.out.write(template.render(path, template_values)) 


application = webapp.WSGIApplication(
	[('/', MainPage),
     ('/about', About),
     ('/controls', Controls)
	 ], debug=True)



def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
