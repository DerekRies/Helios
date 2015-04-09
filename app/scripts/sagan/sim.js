'use strict';

(function () {
  var Star = window.Helios.Star;
  var Planet = window.Helios.Planet;

  var Sim = function () {};

  Sim.prototype.init = function() {
    var w = window.innerWidth,
        h = window.innerHeight;

    this.stopped = false;
    this.paused = false;
    this.speed = 1;
    this.ready = false;
    this.clock = window.Helios.clock;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, w/h, 0.1, 50000);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(w, h);
    // document.body.appendChild(this.renderer.domElement);
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.makeSkybox();
    this.camera.position.z = 500;
    this.camera.position.y = 300;
    this.camera.lookAt(this.scene.position);
  };

  Sim.prototype.setRenderTarget = function(element) {
    element.appendChild(this.renderer.domElement);
  };

  Sim.prototype.makeSkybox = function() {
    this._skyGeometry = new THREE.CubeGeometry(49999,49999,49999);
    var skyFace; //object for face
    var faceMaterialArray = [];
    
    // [right,left ,up , down , front ,back]
    var picStorage = ["img/RESkyBoxRT.png","img/RESkyBoxLF.png", "img/RESkyBoxUP.png","img/RESkyBoxDN.png","img/RESkyBoxFT.png","img/RESkyBoxBK.png"];
    for(var i=0; i<picStorage.length;i++){
    	skyFace = {
    		map: THREE.ImageUtils.loadTexture(picStorage[i]),
    		side: THREE.BackSide //using BackSide so we can view the whole cube from the inside
    	};
    	faceMaterialArray.push( new THREE.MeshBasicMaterial(skyFace));

    }

    this._skyMaterial = new THREE.MeshFaceMaterial(faceMaterialArray);

    this._skyBox = new THREE.Mesh(this._skyGeometry, this._skyMaterial);
    this.scene.add(this._skyBox);
  };

  Sim.prototype.updateSystem = function() {
    var dt = this.clock.getDelta();
    if(typeof this.star !== 'undefined') {
      this.star.update(dt);
    }
    if(typeof this.planets !== 'undefined') {
      for(var i = 0; i < this.planets.length ; i++) {
        this.planets[i].update(dt);
      }
    }
  };

  Sim.prototype.tick = function() {
    // this.camTheta += 0.05;
    // this.camPhi += 0.05;
    this.controls.update();
    this.updateSystem();
    this.renderer.render(this.scene, this.camera);
  };

  Sim.prototype.loadSystem = function(system) {
    this.system = system;
    this.makeStar(system.stars[0]);
    this.makePlanets(system.planets);
  };

  Sim.prototype.makeStar = function(star) {
    if(typeof this.star === 'undefined') {
      this.star = new Star();
      this.scene.add(this.star.drawable);
    }
    this.star.setup(star);
    return this.star;
  };

  Sim.prototype.clearPlanets = function() {
    if(typeof this.planets !== 'undefined') {
      for(var i = 0; i < this.planets.length ; i++) {
        this.scene.remove(this.planets[i].drawable);
        this.scene.remove(this.planets[i].orbit);
      }
    }
  };

  Sim.prototype.makePlanets = function(planets) {
    this.clearPlanets();
    this.planets = _.map(planets, function (planet) {
      return new Planet(planet);
    });
    for(var i = 0; i < this.planets.length ; i++) {
      this.scene.add(this.planets[i].drawable);
      this.scene.add(this.planets[i].orbit);
    }
  };

  Sim.prototype.disableOrbitLines = function() {
    for(var i = 0; i < this.planets.length ; i++) {
      this.planets[i].disableOrbitLines();
    }
  };

  window.Helios.Sim = Sim;

}());