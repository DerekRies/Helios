from google.appengine.ext import ndb

# Habitability is defined as the probability of liquid water
# and scored from 0-10 where 0 is absolutely not habitable
# and 10 is very likely to have liquid water.
# A positive confirmation of water on this planet would

class Planet(ndb.Model):
  disc_method = ndb.StringProperty()
  host_name = ndb.StringProperty()
  letter = ndb.StringProperty()
  orbital_period = ndb.FloatProperty()
  semimajor_axis = ndb.FloatProperty()
  eccentricity = ndb.FloatProperty()
  inclination = ndb.FloatProperty()
  mass = ndb.FloatProperty() # mass in terms of Jupiter masses
  radius = ndb.FloatProperty() # radius in terms of Jupiter's radius
  density = ndb.FloatProperty()
  discovery_year = ndb.IntegerProperty()

  confirmed = ndb.BooleanProperty()
  classification = ndb.StringProperty() # terrestrial, gas giant, hot jupiter
  class_confidence = ndb.IntegerProperty()
  habitability = ndb.IntegerProperty()

  @classmethod
  def query_system(cls, ancestor_key):
    # should return all planets for a given system


class Star(ndb.Model):
  magnitude = ndb.FloatProperty()
  distance = ndb.FloatProperty()
  temperature = ndb.FloatProperty()
  mass = ndb.FloatProperty()
  radius = ndb.FloatProperty()
  hd_name = ndb.StringProperty()
  hip_name = ndb.StringProperty()
  name = ndb.StringProperty()

  @classmethod
  def query_system(cls, ancestor_key):
    # should return all stars for a given system


class System(ndb.Model):
  distance = ndb.FloatProperty()
  name = ndb.StringProperty()
  num_planets = ndb.IntegerProperty()
  num_stars = ndb.IntegerProperty()
  eccentricity = ndb.FloatProperty()
  period = ndb.FloatProperty()
  inclination = ndb.FloatProperty()
  semimajor_axis = ndb.FloatProperty()
  ra = ndb.FloatProperty()
  dec = ndb.FloatProperty()

  @classmethod
  def get_stars(self):
    return False

  @classmethod
  def get_planets(self):
    return False

