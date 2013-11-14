#!/usr/bin/env python

import webapp2
import json
import urllib
from models.exoplanet import Planet, System, Star
from google.appengine.ext import ndb

class MainEndpoint(webapp2.RequestHandler):
  def get(self):
    self.response.write('Hello world!')


class APIEndpoint(webapp2.RequestHandler):
  def get_includes(self):
    includes = self.request.get('include', False)
    includes = includes.split(',') if includes else []
    return includes

  def get_query_params(self):
    qs = self.request.query_string
    qs = urllib.unquote(qs).decode('utf8').split('&')
    expressions = []
    for q in qs:
      if '=' in q:
        sides = q.split('=')
        expressions.append(sides[0] == sides[1])
      elif '>' in q:
        sides = q.split('>')
        expressions.append(sides[0] > sides[1])
      elif '<' in q:
        sides = q.split('<')
        expressions.append(sides[0] < sides[1])
    print expressions
    return expressions

  def include(self, d, params=[]):
    if not len(params):
      return d
    else:
      nd = d.copy()
      print('going ahead with it')
      for key in d:
        if key not in params:
          del nd[key]
      return nd

  def jsonify(self, models):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      len(models)
      self.response.write(json.dumps([model.to_dict() for model in models]))
    except:
      self.response.write(json.dumps(models.to_dict()))


class PlanetCollectionEndpoint(APIEndpoint):
  def get(self):
    params = self.get_query_params()
    # self.jsonify(Planet.query(**query_params).fetch(5))
    self.response.write(params)


class PlanetEndpoint(APIEndpoint):
  def get(self, planet_id):
    includes = self.get_includes()
    self.jsonify(Planet.get_with_includes(Planet.name == planet_id, includes))



class SystemCollectionEndpoint(APIEndpoint):
  def get(self):
    self.response.write('getting systems')


class StarCollectionEndpoint(APIEndpoint):
  def get(self):
    self.response.write('getting star')

app = webapp2.WSGIApplication([
    ('/api/', MainEndpoint),
    ('/api/planet', PlanetCollectionEndpoint),
    (r'/api/planet/(.+)', PlanetEndpoint),
    ('/api/system', SystemCollectionEndpoint),
    ('/api/star', StarCollectionEndpoint),
], debug=True)

