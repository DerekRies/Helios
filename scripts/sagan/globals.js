'use strict';
/*=================================================================

Units and The Relative Sizes of Objects

In the data, a stars mass and radius is measured in solar units.

A planet's mass and radius is measured in Earth Units.

Distances in the System like the semi-major axis are expressed in
AU, astronomical units.

1 Solar Radius = 110 Earth Radius
1 Solar Radius = 0.0046491 AU
1 Solar Mass = 333,060 Earth Mass

In the graphics rendering all units will be the arbitrary unit,
Helios Unit (HU). This is in reference to size alone, does not refer
to mass or luminosity

1 Solar Unit = 100 HU
1 Earth Unit = 4 HU
White Dwarf = 1 HU


1 AU = 21509 HU <-- This is what needs to be scaled appropriately
                    Some planets, may be really close, while others
                    very far away. So the scale needs to be non-linear
100 AU  = 50000 HU
 10 AU  = 30000 HU
  1 AU  = 10000 HU
.01 AU  = 500 HU
=================================================================*/

var UNITS = {};
UNITS.STELLAR = 100;
UNITS.EARTH = 7;
UNITS.GLOBAL_SCALE = 1;

UNITS.convertPlanetUnitsToThreeUnits = function (n) {
  return (Math.pow(n, 1/2) * UNITS.EARTH);
  // return n * UNITS.EARTH * UNITS.GLOBAL_SCALE;
};

UNITS.convertStarUnitsToThreeUnits = function (n) {
  return n * UNITS.STELLAR * UNITS.GLOBAL_SCALE;
};

UNITS.convertAUtoThreeUnits = function (n) {
  return ((Math.pow(n, 1/5) * 1000) - 300);
};

// var f = UNITS.convertPlanetUnitsToThreeUnits;
// console.log(f(.1));
// console.log(f(1));
// console.log(f(10));
// console.log(f(100));


var TEXTURES = {};
// TEXTURES.CORONA = THREE.ImageUtils.loadTexture('../../img/corona.png');
// TEXTURES.FADEOFF = THREE.ImageUtils.loadTexture('../../img/fadeoff.png');
// TEXTURES.GLOW_PARTICLE = THREE.ImageUtils.loadTexture('../../img/glow.png');
// TEXTURES.NEBULA_PARTICLE = THREE.ImageUtils.loadTexture('../../img/nebula2.png');
TEXTURES.CORONA = THREE.ImageUtils.loadTexture('img/corona.png');
TEXTURES.FADEOFF = THREE.ImageUtils.loadTexture('img/fadeoff.png');
TEXTURES.GLOW_PARTICLE = THREE.ImageUtils.loadTexture('img/glow.png');
TEXTURES.NEBULA_PARTICLE = THREE.ImageUtils.loadTexture('img/nebula2.png');

window.UNITS = UNITS;
window.TEXTURES = TEXTURES;
window.Helios = {};
window.Helios.clock = new THREE.Clock();