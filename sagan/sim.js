'use strict';

var Star = window.Helios.Star;

var Sim = function () {};

Sim.prototype.init = function() {
  var w = window.innerWidth,
      h = window.innerHeight;

  this.paused = false;
  this.speed = 1;
  this.ready = false;
  this.clock = window.Helios.clock;

  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(70, w/h, 0.1, 6000);
  this.renderer = new THREE.WebGLRenderer({antialias: true});
  this.renderer.setSize(w, h);
  document.body.appendChild(this.renderer.domElement);
  this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  this.makeSkybox();
  this.camera.position.z = 300;
  this.camera.lookAt(this.scene.position);
};

Sim.prototype.makeSkybox = function() {
  this._skyGeometry = new THREE.CubeGeometry(5000,5000,5000);
  this._skyMaterial = new THREE.MeshBasicMaterial({color: 0x0B1317, side: THREE.BackSide});
  this._skyBox = new THREE.Mesh(this._skyGeometry, this._skyMaterial);
  this.scene.add(this._skyBox);
};

Sim.prototype.updateSystem = function() {
  if(typeof this.star !== 'undefined') {
    this.star.update();
  }
};

Sim.prototype.tick = function() {
  this.controls.update();
  this.updateSystem();
  this.renderer.render(this.scene, this.camera);
};

Sim.prototype.loadSystem = function(system) {
  this.system = system;
  this.makeStar(system.stars[0]);
  // this.makePlanets(system.planets);
};

Sim.prototype.makeStar = function(star) {
  if(typeof this.star === 'undefined') {
    this.star = new Star();
    this.scene.add(this.star.drawable);
  }
  this.star.setup(star);
  return this.star;
};

Sim.prototype.makePlanets = function(planets) {
  this.planets = _.map(planets, function (planet) {
    return new Planet(planet);
  });
};

var s = new Sim();
s.init();

function tick() {
  requestAnimationFrame(tick);
  s.tick();
}
tick();
// var si = 0;
// var systemNames = _.map(systems, function (val, key) {
//   return key;
// });
// setInterval(function () {
//   si++
//   s.loadSystem(systems[systemNames[si % systemNames.length]]);
// }, 3000);

s.loadSystem(systems['KOI-3554']);