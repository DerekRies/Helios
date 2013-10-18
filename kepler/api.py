#!/usr/bin/env python

import webapp2

class MainEndpoint(webapp2.RequestHandler):
    def get(self):
        self.response.write('Hello world!')

app = webapp2.WSGIApplication([
    ('/api/', MainEndpoint),
    ('/api/exoplanets', MainEndpoint),
], debug=True)

