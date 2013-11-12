#!/usr/bin/env python

import webapp2
from models.exoplanet import Planet, System, Star

class MainEndpoint(webapp2.RequestHandler):
    def get(self):
        self.response.write('Hello world!')


app = webapp2.WSGIApplication([
    ('/api/', MainEndpoint),
    ('/api/exoplanets', MainEndpoint),
], debug=True)

