#!/usr/bin/env python

import webapp2
import json
import urllib
import re
from models.exoplanet import Planet, System, Star
from google.appengine.ext import ndb

class MainEndpoint(webapp2.RequestHandler):
  def get(self):
    self.response.write('Hello world!')


def proper_type(n):
  r = re.compile(r'\d+\.\d+')
  if r.search(n) is not None:
    try:
      return float(n)
    except:
      pass
  else:
    try:
      return int(float(n))
    except:
      return n

class APIEndpoint(webapp2.RequestHandler):
  def get_includes(self):
    includes = self.request.get('include', False)
    includes = includes.split(',') if includes else []
    return includes

  def get_limit(self):
    count = self.request.get('limit', None)
    try:
      return int(count)
    except:
      return None

  def get_planet_query_params(self):
    params = self.get_query_params(include_planets=True)
    for param in params:
      param[0] = param[0][2:]
    return params

  def get_query_params(self, include_planets=False):
    qs = self.request.query_string
    qs = urllib.unquote(qs).decode('utf8').split('&')
    expressions = []
    for q in qs:
      if include_planets:
        if q.startswith('p-') is False:
          continue
      else:
        if q.startswith('p-'):
          continue
      if '=' in q:
        sides = q.split('=')
        expressions.append([sides[0], '=', proper_type(sides[1])])
      elif '>' in q:
        sides = q.split('>')
        expressions.append([sides[0], '>', proper_type(sides[1])])
      elif '<' in q:
        sides = q.split('<')
        expressions.append([sides[0], '<', proper_type(sides[1])])
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

  def jsonify(self, models, indent=None):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      len(models)
      self.response.write(json.dumps([model.to_dict() for model in models], indent=indent))
    except:
      self.response.write(json.dumps(models.to_dict(), indent=indent))


class PlanetCollectionEndpoint(APIEndpoint):
  def get(self):
    params = self.get_query_params()
    q = Planet.filter_by_mult_params(params)
    count = self.get_limit()
    self.jsonify(q.fetch(count), indent=4)


class PlanetEndpoint(APIEndpoint):
  def get(self, planet_id):
    includes = self.get_includes()
    self.jsonify(Planet.get_with_includes(Planet.name == planet_id, includes), indent=4)


class SystemCollectionEndpoint(APIEndpoint):
  def get(self):
    params = self.get_query_params()
    planet_params = self.get_planet_query_params()
    count = self.get_limit()
    q = System.filter_by_mult_params(params)
    systems = q.fetch()
    output = []
    for system in systems:
      system_dict = system.to_dict()
      # planets = Planet.query_system(system.key).fetch()
      planet_found = Planet.filter_by_mult_params(planet_params, ancestor=system.key).get()
      if planet_found:
        planets = Planet.query_system(system.key).fetch()
        system_dict['planets'] = [planet.to_dict() for planet in planets]
        output.append(system_dict)
    self.response.headers['Content-Type'] = 'application/json'
    self.response.write(json.dumps(output[:count], indent=4))



class StarCollectionEndpoint(APIEndpoint):
  def get(self):
    params = self.get_query_params()
    q = Star.filter_by_mult_params(params)
    count = self.get_limit()
    self.jsonify(q.fetch(count), indent=4)

app = webapp2.WSGIApplication([
    ('/api/', MainEndpoint),
    ('/api/planet', PlanetCollectionEndpoint),
    (r'/api/planet/(.+)', PlanetEndpoint),
    ('/api/system', SystemCollectionEndpoint),
    ('/api/star', StarCollectionEndpoint),
], debug=True)

