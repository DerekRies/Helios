#!/usr/bin/env python
import requests
import json as json
import csv
import zipfile
from StringIO import StringIO
from circumbinaries import systems as circumbinaries

# Grabs data from external sources, puts it together, and prepares it for NDB.
# Does not do the actual storing with NDB, so as to keep it independently
# usable away from google app engine.

# Superscope differs from telescope in that it uses an already existing data
# called the PHL Habitable Exoplanets Catalog. It has all the same data from the
# previos API, and much more that was being collected from other sources in
# telescope. Things like a habitability index, and other data to make better
# guesses on what the planet might look like. The only problem is this data source
# exposes no API, instead only offering downloads of a zipped csv file.
# Superscope will perform much the soame function as telescope and format this data
# in an easy system-relational form.

confirmed_url = 'http://www.hpcf.upr.edu/~abel/phl/phl_hec_all_confirmed.csv.zip'
unconfirmed_url = 'http://www.hpcf.upr.edu/~abel/phl/phl_hec_all_unconfirmed.csv.zip'
kepler_candidates_url = 'http://www.hpcf.upr.edu/~abel/phl/phl_hec_all_kepler.csv.zip'

# Initialized with all Circumbinary Systems
# These are systems with more than 1 star that is being orbited by a planet
# Many systems are binary but only a few are circumbinary.
# Only circumbinary star systems will be rendered with > 2 stars.

def parseFloat(n, default=0.0):
  try:
    n = float(n)
  except:
    n = default
  return n

def parseInt(n, default=0):
  try:
    n = int(n)
  except:
    n = default
  return n



class Planet(object):
  def __init__(self, data_list, header_map):
    self.name = data_list[header_map['P. Name']]
    self.kepler_name = data_list[header_map['P. Name Kepler']]
    self.koi_name = data_list[header_map['P. Name KOI']]
    self.zone_class = data_list[header_map['P. Zone Class']]
    self.mass_class = data_list[header_map['P. Mass Class']]
    self.composition_class = data_list[header_map['P. Composition Class']]
    self.atmosphere_class = data_list[header_map['P. Atmosphere Class']]
    self.habitable_class = data_list[header_map['P. Habitable Class']]
    self.mass = parseFloat(data_list[header_map['P. Mass (EU)']])
    self.radius = parseFloat(data_list[header_map['P. Radius (EU)']])
    self.density = parseFloat(data_list[header_map['P. Density (EU)']])
    self.gravity = parseFloat(data_list[header_map['P. Gravity (EU)']])
    self.escape_velocity = parseFloat(data_list[header_map['P. Esc Vel (EU)']])
    self.min_eq_temp = parseFloat(data_list[header_map['P. Teq Min (K)']])
    self.max_eq_temp = parseFloat(data_list[header_map['P. Teq Max (K)']])
    self.mean_eq_temp = parseFloat(data_list[header_map['P. Teq Mean (K)']])
    self.min_surface_temp = parseFloat(data_list[header_map['P. Ts Min (K)']])
    self.max_surface_temp = parseFloat(data_list[header_map['P. Ts Max (K)']])
    self.mean_surface_temp = parseFloat(data_list[header_map['P. Ts Mean (K)']])
    self.surface_pressure = parseFloat(data_list[header_map['P. Surf Press (EU)']])
    self.period = parseFloat(data_list[header_map['P. Period (days)']])
    self.semi_major_axis = parseFloat(data_list[header_map['P. Sem Major Axis (AU)']])
    self.eccentricity = parseFloat(data_list[header_map['P. Eccentricity']])
    self.inclination = parseFloat(data_list[header_map['P. Inclination (deg)']])
    self.omega = parseFloat(data_list[header_map['P. Omega (deg)']])
    self.star_name = data_list[header_map['S. Name']]
    self.hz_dist = parseFloat(data_list[header_map['P. HZD']])
    self.hz_comp = parseFloat(data_list[header_map['P. HZC']])
    self.hz_atmosphere = parseFloat(data_list[header_map['P. HZA']])
    self.hz_index = parseFloat(data_list[header_map['P. HZI']])
    self.sph = parseFloat(data_list[header_map['P. SPH']])
    self.int_esi = parseFloat(data_list[header_map['P. Int ESI']])
    self.surface_esi = parseFloat(data_list[header_map['P. Surf ESI']])
    self.esi = parseFloat(data_list[header_map['P. ESI']])
    self.habitable = bool(parseInt(data_list[header_map['P. Habitable']], 0))
    self.confirmed = bool(parseInt(data_list[header_map['P. Confirmed']]))
    self.hab_moon_candidate = bool(parseInt(data_list[header_map['P. Hab Moon']]))
    self.disc_method = data_list[header_map['P. Disc. Method']]
    self.disc_year = parseInt(data_list[header_map['P. Disc. Year']])


class Star(object):
  def __init__(self, data_list, header_map):
    self.name = data_list[header_map['S. Name']]
    self.magnitude = parseFloat(data_list[header_map['S. Appar Mag']])
    self.classification = data_list[header_map['S. Type']]
    self.mass = parseFloat(data_list[header_map['S. Mass (SU)']])
    self.radius = parseFloat(data_list[header_map['S. Radius (SU)']])
    self.hd_name = data_list[header_map['S. Name HD']]
    self.hip_name = data_list[header_map['S. Name HIP']]
    self.temperature = parseFloat(data_list[header_map['S. Teff (K)']])
    self.luminosity = parseFloat(data_list[header_map['S. Luminosity (SU)']])
    self.constellation = data_list[header_map['S. Constellation']]
    self.metallicity = parseFloat(data_list[header_map['S. [Fe/H]']])
    self.age = parseFloat(data_list[header_map['S. Age (Gyrs)']])
    self.mag_from_planet = parseFloat(data_list[header_map['S. Mag from Planet']])
    self.size_from_planet = parseFloat(data_list[header_map['S. Size from Planet (deg)']])


def get_all_data():
  all_data = dict(circumbinaries)
  for sys in all_data:
    for star in all_data[sys]['stars']:
      del star['distance']
  get_data(confirmed_url, confirmed=1, systems=all_data)
  get_data(unconfirmed_url, confirmed=0, systems=all_data)
  get_data(kepler_candidates_url, confirmed=0, systems=all_data)
  return all_data

def get_header_map(headers):
  header_map = {}
  for ind, header in enumerate(headers):
    header_map[header] = ind
  return header_map

def get_data(url, confirmed=1, systems={}):
  r = requests.get(url=url)
  z = zipfile.ZipFile(StringIO(r.content))
  with z.open(z.namelist()[0]) as datafile:
    data = datafile.read().split('\n')
    header_map = get_header_map(data[0].split(','))
    for line in data[1:]:
      if not line.strip():
        break
      datum = line.split(',')
      planet = Planet(datum, header_map)
      planet.confirmed = confirmed
      star = Star(datum, header_map)
      if planet.star_name not in systems:
        system = {}
        system['planets'] = []
        system['stars'] = []
        # only systems with more than one star will care about
        # incl, ecc, period, and semi-major axis
        system['inclination'] = 0
        system['eccentricity'] = 0
        system['semimajor_axis'] = 0
        system['period'] = 0
        system['num_stars'] = 1
        system['distance'] = parseFloat(datum[header_map['S. Distance (pc)']])
        system['num_planets'] = parseInt(datum[header_map['S. No. Planets']])
        system['ra'] = parseFloat(datum[header_map['S. RA (hrs)']])
        system['dec'] = parseFloat(datum[header_map['S. DEC (deg)']])
        system['habzone_min'] = parseFloat(datum[header_map['S. Hab Zone Min (AU)']])
        system['habzone_max'] = parseFloat(datum[header_map['S. Hab Zone Max (AU)']])
        system['stars'].append(star.__dict__)
        systems[planet.star_name] = system
      systems[planet.star_name]['planets'].append(planet.__dict__)
    z.close()
    print len(systems)


def count_planets(system):
  return len(all_systems[system]['planets'])

if __name__ == '__main__':
  all_systems = dict(circumbinaries)
  for sys in all_systems:
    for star in all_systems[sys]['stars']:
      star.pop('distance', None)
  get_data(confirmed_url, confirmed=True, systems=all_systems)
  get_data(unconfirmed_url, confirmed=False, systems=all_systems)
  get_data(kepler_candidates_url, confirmed=False, systems=all_systems)

  with open('total.json', 'w') as outfile:
    json.dump(all_systems, outfile, indent=4)
  outfile.close()
  print sum(map(count_planets, all_systems))

