from google.appengine.ext import ndb

class Planet(ndb.Model):
  disc_method = ndb.StringProperty()
  host_name = ndb.StringProperty()
  letter = ndb.StringProperty()
  orbital_period = ndb.FloatProperty()
  semimajor_axis = ndb.FloatProperty()
  eccentricity = ndb.FloatProperty()
  mass = ndb.FloatProperty() # mass in terms of Jupiter masses
  radius = ndb.FloatProperty() # radius in terms of Jupiter's radius
  density = ndb.FloatProperty()
  ra = ndb.FloatProperty()
  dec = ndb.FloatProperty()
  confirmed = ndb.BooleanProperty()
  classification = ndb.StringProperty() # terrestrial, gas giant, hot jupiter
  class_confidence = ndb.IntegerProperty()
  habitability = ndb.StringProperty() # no, possible, strong


class Star(ndb.Model):
  magnitude = ndb.FloatProperty()
  distance = ndb.FloatProperty()
  temperature = ndb.FloatProperty()
  mass = ndb.FloatProperty()
  radius = ndb.FloatProperty()
  hd_name = ndb.StringProperty()
  hip_name = ndb.StringProperty()
  name = ndb.StringProperty()


class System(ndb.Model):
  distance = ndb.FloatProperty()
  name = ndb.StringProperty()
  num_planets = ndb.IntegerProperty()
  num_stars = ndb.IntegerProperty()
  eccentricity = ndb.FloatProperty()
  period = ndb.FloatProperty()
  inclination = ndb.FloatProperty()
  semimajor_axis = ndb.FloatProperty()

  @classmethod
  def get_stars(self):
    return False

  @classmethod
  def get_planets(self):
    return False

