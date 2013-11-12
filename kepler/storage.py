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
      # sys.put()

      for planet in system['planets']:
        # pl_key = ndb.Key("Planet", planet['name'], "System", system_name)
        # pl = pl_key.get()
        pl = Planet.get_by_id(planet['name'])
        if pl is None:
          pl = Planet(id=planet['name'], parent=sys_key)
        pl.populate(**planet)
        # pl.put()

      for star in system['stars']:
        # st_key = ndb.Key("Star", star['name'], "System", system_name)
        # st = st_key.get()
        st = Star.get_by_id(star['name'])
        if st is None:
          st = Star(id=star['name'], parent=sys_key)
        st.populate(**star)
        # st.put()
      ndb.put_multi([sys, pl, st])

    # exoplanet_data = get_all_data()
    # self.response.write(len(exoplanet_data.keys()))


app = webapp2.WSGIApplication([
    (r'/.*', StorageEndpoint),
], debug=True)






            # name=planet['name'],
            # kepler_name=planet['kepler_name'],
            # koi_name=planet['koi_name'],
            # zone_class=planet['zone_class'],
            # mass_class=planet['mass_class'],
            # composition_class=planet['composition_class'],
            # atmosphere_class=planet['atmosphere_class'],
            # mass=planet['mass'],
            # radius=planet['radius'],
            # density=planet['density'],
            # gravity=planet['gravity'],
            # escape_velocity=planet['escape_velocity'],
            # min_eq_temp=planet['min_eq_temp'],
            # max_eq_temp=planet['max_eq_temp'],
            # mean_eq_temp=planet['mean_eq_temp'],
            # min_surface_temp=planet['min_surface_temp'],
            # max_surface_temp=planet['max_surface_temp'],
            # mean_surface_temp=planet['mean_surface_temp'],
            # surface_pressure=planet['surface_pressure'],
            # period=planet['period'],
            # semimajor_axis=planet['semimajor_axis'],
            # eccentricity=planet['eccentricity'],
            # inclination=planet['inclination'],
            # omega=planet['omega'],
            # star_name=planet['star_name'],
            # hz_dist=planet['hz_dist'],
            # hz_comp=planet['hz_comp'],
            # hz_atmosphere=planet['hz_atmosphere'],
            # hz_index=planet['hz_index'],
            # sph=planet['sph'],
            # int_esi=planet['int_esi'],
            # surface_esi=planet['surface_esi'],
            # name=planet['name'],
            # name=planet['name'],
