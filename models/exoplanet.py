from google.appengine.ext import ndb


class BaseModel(ndb.Model):
  reserved_params = ['include', 'limit', 'orderBy']
  @classmethod
  def get_by_name(cls, name):
    return cls.query(cls.name == name).get()

  @classmethod
  def get_with_includes(cls, expr, includes):
    if len(includes):
      return cls.query(expr).get(projection=includes)
    else:
      return cls.query(expr).get()

  @classmethod
  def fetch_with_includes(cls, expr, count=0, includes=[]):
    if len(includes):
      return cls.query(expr).fetch(count, projection=includes)
    else:
      if count > 0:
        return cls.query(expr).fetch(count)
      else:
        return cls.query(expr).fetch()

  @classmethod
  def filter_by_mult_params(cls, params, ancestor=None):
    q = cls.query(ancestor=ancestor)
    if len(params) == 0:
      return q
    for param in params:
      if param[0] in cls.reserved_params:
        continue
      if param[1] == '=':
        q = q.filter(getattr(cls, param[0]) == param[2])
      elif param[1] == '>':
        q = q.filter(getattr(cls, param[0]) > param[2])
      elif param[1] == '<':
        q = q.filter(getattr(cls, param[0]) < param[2])
    return q


class Planet(BaseModel):
  name = ndb.StringProperty(required=True)
  kepler_name = ndb.StringProperty()
  koi_name = ndb.StringProperty()
  zone_class = ndb.StringProperty()
  mass_class = ndb.StringProperty()
  composition_class = ndb.StringProperty()
  atmosphere_class = ndb.StringProperty()
  habitable_class = ndb.StringProperty()
  mass = ndb.FloatProperty()
  radius = ndb.FloatProperty()
  density = ndb.FloatProperty()
  gravity = ndb.FloatProperty()
  escape_velocity = ndb.FloatProperty()
  min_eq_temp = ndb.FloatProperty()
  max_eq_temp = ndb.FloatProperty()
  mean_eq_temp = ndb.FloatProperty()
  min_surface_temp = ndb.FloatProperty()
  max_surface_temp = ndb.FloatProperty()
  mean_surface_temp = ndb.FloatProperty()
  surface_pressure = ndb.FloatProperty()
  period = ndb.FloatProperty()
  semi_major_axis = ndb.FloatProperty()
  eccentricity = ndb.FloatProperty()
  inclination = ndb.FloatProperty()
  omega = ndb.FloatProperty()
  star_name = ndb.StringProperty()
  hz_dist = ndb.FloatProperty()
  hz_comp = ndb.FloatProperty()
  hz_atmosphere = ndb.FloatProperty()
  hz_index = ndb.FloatProperty()
  sph = ndb.FloatProperty()
  esi = ndb.FloatProperty()
  int_esi = ndb.FloatProperty()
  surface_esi = ndb.FloatProperty()
  habitable = ndb.BooleanProperty()
  confirmed = ndb.BooleanProperty(required=True)
  hab_moon_candidate = ndb.BooleanProperty()
  disc_method = ndb.StringProperty()
  disc_year = ndb.IntegerProperty()

  @classmethod
  def query_system(cls, ancestor_key):
    # should return all planets for a given system
    return cls.query(ancestor=ancestor_key)


class Star(BaseModel):
  name = ndb.StringProperty()
  magnitude = ndb.FloatProperty()
  classification = ndb.StringProperty()
  mass = ndb.FloatProperty()
  radius = ndb.FloatProperty()
  hd_name = ndb.StringProperty()
  hip_name = ndb.StringProperty()
  temperature = ndb.FloatProperty()
  luminosity = ndb.FloatProperty()
  constellation = ndb.StringProperty()
  metallicity = ndb.FloatProperty()
  age = ndb.FloatProperty()
  mag_from_planet = ndb.FloatProperty()
  size_from_planet = ndb.FloatProperty()

  @classmethod
  def query_system(cls, ancestor_key):
    # should return all stars for a given system
    return cls.query(ancestor=ancestor_key)


class System(BaseModel):
  distance = ndb.FloatProperty()
  name = ndb.StringProperty()
  num_planets = ndb.IntegerProperty(default=1)
  num_stars = ndb.IntegerProperty(default=1)
  eccentricity = ndb.FloatProperty()
  period = ndb.FloatProperty()
  inclination = ndb.FloatProperty()
  semimajor_axis = ndb.FloatProperty()
  ra = ndb.FloatProperty()
  dec = ndb.FloatProperty()
  habzone_min = ndb.FloatProperty()
  habzone_max = ndb.FloatProperty()