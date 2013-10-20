#!/usr/bin/env python
import requests
import json as json
import csv

# Grabs data from external sources, puts it together, and prepares it for NDB.
# Does not do the actual storing with NDB, so as to keep it independently usable away from google app engine.

exoplanet_url = 'http://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI'
columns = [
  'pl_hostname',
  'pl_discmethod',
  'pl_letter',
  'pl_orbper',
  'pl_orbsmax',
  'pl_orbeccen',
  'pl_orbincl',
  'pl_massj',
  'pl_radj',
  'pl_dens',
  'st_vj',
  'st_dist',
  'st_teff',
  'st_mass',
  'st_rad',
  'hd_name',
  'hip_name',
  'pl_disc',
  'ra',
  'dec'
]


def get_circumbinaries():
  return False

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

def get_planet_from_data(line, HEADERMAP):
  planet = {}
  planet['disc_method'] = line[HEADERMAP['pl_discmethod']]
  planet['disc_year'] = parseInt(line[HEADERMAP['pl_disc']], None)
  planet['host_name'] = line[HEADERMAP['pl_hostname']]
  planet['letter'] = line[HEADERMAP['pl_letter']]
  planet['orbital_period'] = parseFloat(line[HEADERMAP['pl_orbper']])
  planet['semimajor_axis'] = parseFloat(line[HEADERMAP['pl_orbsmax']])
  planet['eccentricity'] = parseFloat(line[HEADERMAP['pl_orbeccen']])
  planet['inclination'] = parseFloat(line[HEADERMAP['pl_orbincl']])
  planet['mass'] = parseFloat(line[HEADERMAP['pl_massj']])
  planet['radius'] = parseFloat(line[HEADERMAP['pl_radj']])
  planet['density'] = parseFloat(line[HEADERMAP['pl_dens']])
  return planet

def get_star_from_data(line, HEADERMAP):
  star = {}
  star['magnitude'] = parseFloat(line[HEADERMAP['st_vj']])
  star['distance'] = parseFloat(line[HEADERMAP['st_dist']])
  star['temperature'] = parseFloat(line[HEADERMAP['st_teff']])
  star['mass'] = parseFloat(line[HEADERMAP['st_mass']])
  star['radius'] = parseFloat(line[HEADERMAP['st_rad']])
  star['hd_name'] = line[HEADERMAP['hd_name']]
  star['hip_name'] = line[HEADERMAP['hip_name']]
  star['name'] = line[HEADERMAP['pl_hostname']]
  return star

def get_data_as_json():
  systems = {}
  r = requests.get(url=exoplanet_url, params={
    'table': 'exoplanets',
    'select': ','.join(columns)
  })
  data = r.text.split('\n')
  data = iter(data)
  headers = next(data).split(',')

  i = 0
  HEADERMAP = {}
  for header in headers:
    HEADERMAP[header] = i
    i += 1

  count = 0
  for line in data:
    if not line.strip():
      break
    line = line.split(',')
    try:
      planet = get_planet_from_data(line, HEADERMAP)
      star = get_star_from_data(line, HEADERMAP)
    except:
      print count
      print line

    if planet['host_name'] in systems:
      systems[planet['host_name']]['planets'].append(planet)
      systems[planet['host_name']]['num_planets'] += 1
    else:
      system = {}
      system['num_planets'] = 1
      system['ra'] = parseFloat(line[HEADERMAP['ra']])
      system['dec'] = parseFloat(line[HEADERMAP['dec']])
      # Inclination defined in the system is really only necessary for
      # the circumbinary planets that are going to have two stars orbiting
      # their gravitational center
      system['inclination'] = 0
      system['stars'] = []
      system['planets'] = []
      system['stars'].append(star)
      system['planets'].append(planet)
      systems[planet['host_name']] = system
    count += 1
  return systems

def run():
  circumbinaries = get_circumbinaries()
  systems = get_data_as_json()
  with open('data.json', 'w') as outfile:
    json.dump(systems, outfile, indent=4)
  print 'got your data'

if __name__ == '__main__':
  run()