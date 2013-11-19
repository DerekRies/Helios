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

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

var geometry = new THREE.CubeGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function render() {
  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render()


/*
What needs to happen in order to render these stars

Start with only drawing 1 star for the moment, When this is done
move into drawing both stars

1. Get scales correct
2. Draw star at scale
3. Draw planetary orbits. (Calculate the ellipse)
4. Draw planets at scale on orbits
5. Animate planetary positions according to orbit
6. Animate planetary velocity according to keplers laws
7. Draw star according to temp/color
8. Particles and Textures for stars, Shader
9. Generate Skybox
10. Generate planet texture
11. Animate between systems


 */