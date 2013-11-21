#!/usr/bin/env python

import webapp2
import json
from models.exoplanet import Planet, Star, System
from superscope import get_all_data
from google.appengine.ext import ndb

class StorageEndpoint(webapp2.RequestHandler):
  def get(self):
    exo_data = {}
    print('working')
    with open('kepler/total.json', 'r') as exoplanet_file:
      exo_data = json.loads(exoplanet_file.read())
      self.response.write(len(exo_data.keys()))
    exoplanet_file.close()
    for system_name in exo_data:
      to_put = []
      system = exo_data[system_name]

      sys_key = ndb.Key('System', system_name)
      sys = sys_key.get()
      if sys is None:
        sys = System(key=sys_key)
      system['name'] = system_name
      sys.populate(
        distance = system['distance'],
        name = system_name,
        num_planets = system['num_planets'],
        num_stars = system['num_stars'],
        eccentricity = system['eccentricity'],
        period = system['period'],
        inclination = system['inclination'],
        semimajor_axis = system['semimajor_axis'],
        ra = system['ra'],
        dec = system['dec'],
        habzone_min = system['habzone_min'],
        habzone_max = system['habzone_max'],
      )
      to_put.append(sys)
      # sys.put()

      for planet in system['planets']:
        # pl_key = ndb.Key("Planet", planet['name'], "System", system_name)
        # pl = pl_key.get()
        pl = Planet.get_by_id(planet['name'])
        if pl is None:
          pl = Planet(id=planet['name'], parent=sys_key)
        pl.populate(**planet)
        to_put.append(pl)
        # pl.put()

      for star in system['stars']:
        # st_key = ndb.Key("Star", star['name'], "System", system_name)
        # st = st_key.get()
        st = Star.get_by_id(star['name'])
        if st is None:
          st = Star(id=star['name'], parent=sys_key)
        st.populate(**star)
        to_put.append(st)
        # st.put()
      ndb.put_multi_async(to_put)

    # exoplanet_data = get_all_data()
    # self.response.write(len(exoplanet_data.keys()))


class DeleteEndpoint(webapp2.RequestHandler):
  def get(self):
    ndb.delete_multi(Planet.query().fetch(keys_only=True))
    ndb.delete_multi(Star.query().fetch(keys_only=True))
    ndb.delete_multi(System.query().fetch(keys_only=True))
    self.response.write('deleted')


app = webapp2.WSGIApplication([
  (r'/.*', StorageEndpoint),
  ('/_storeit/delete', DeleteEndpoint)
], debug=True)
