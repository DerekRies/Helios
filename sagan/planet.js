'use strict';

var Planet = function(planetData){
  this.possibleColors = [0x1962ED, 0x803E20];

  this.data = planetData;
  this.color = _.sample(this.possibleColors);
  this.orbitRadius = UNITS.convertAUtoThreeUnits(planetData.semi_major_axis);
  this._geometry = new THREE.SphereGeometry(UNITS.convertPlanetUnitsToThreeUnits(planetData.radius), 16, 16);
  this._material = new THREE.MeshLambertMaterial({color:this.color});
  this.drawable = new THREE.Mesh(this._geometry, this._material);
  this.theta = Math.random() * Math.PI * 2;

  this.orbitShape = this.makeOrbitShape(64);
  this.orbit = this.drawShape(this.orbitShape, 0xffffff, 0, 0, 0, (Math.PI / 180) * 90, 0, 0, 1 );
  // this.orbit.opacity = 0.5;
};

Planet.prototype.makeOrbitShape = function(segments) {
  var orbitShape = new THREE.Shape();
  var segRadians = Math.PI * 2 / segments;
  var theta = 0;
  var x = Math.cos(theta) * this.orbitRadius;
  var z = Math.sin(theta) * this.orbitRadius;
  var startX = x;
  var startZ = z;
  orbitShape.moveTo(x,z);

  for(var i = 0; i < segments ; i++) {
    theta += segRadians;
    x = Math.cos(theta) * this.orbitRadius;
    z = Math.sin(theta) * this.orbitRadius;
    orbitShape.lineTo(x,z);
  }
  orbitShape.lineTo(startX, startZ);
  return orbitShape;
};

Planet.prototype.drawShape = function(shape, color, x, y, z, rx, ry, rz, s) {
  var geometry = shape.createPointsGeometry();
  var material = new THREE.LineBasicMaterial( { linewidth: 2, color: color, transparent: true, opacity: 0.5 } );

  var orbit = new THREE.Line( geometry, material );
  orbit.position.set( x, y, z );
  orbit.rotation.set( rx, ry, rz );
  orbit.scale.set( s, s, s );
  return orbit;
};

Planet.prototype.disableOrbitLines = function() {
  this.orbit.visible = false;
};

Planet.prototype.update = function(dt) {
  this.theta += dt * 1;
  var x = Math.cos(this.theta) * this.orbitRadius;
  var z = Math.sin(this.theta) * this.orbitRadius;
  this.drawable.position.set(x, 0, z);
};

window.Helios.Planet = Planet;