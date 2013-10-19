import requests

# Grabs data from external sources, puts it together, and prepares it for NDB.
# Does not do the actual storing with NDB, so as to keep it independently usable away from google app engine.

exoplanet_url = 'http://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?'

def run():
