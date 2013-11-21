'use strict';

var Star = function () {
  // star container
  this.drawable = new THREE.Object3D();

  // star sphere
  this._starGeometry = new THREE.SphereGeometry(UNITS.STELLAR, 32, 32);
  this._starMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
  this._starDrawable = new THREE.Mesh(this._starGeometry, this._starMaterial);
  this.drawable.add(this._starDrawable);

  // star corona
  this._coronaSpriteMaterial = new THREE.SpriteMaterial({
    map: TEXTURES.CORONA,
    color: 0xffffff,
    useScreenCoordinates: false,
    alignment: THREE.SpriteAlignment.center,
    transparent: false,
    blending: THREE.AdditiveBlending
  });
  var scaleFactor = 4;
  this._coronaSprite = new THREE.Sprite(this._coronaSpriteMaterial);
  this._coronaSprite.scale.set(UNITS.STELLAR * scaleFactor, UNITS.STELLAR * scaleFactor, 1.0);
  this.drawable.add(this._coronaSprite);
  this._coronaSprite2 = new THREE.Sprite(this._coronaSpriteMaterial);
  this._coronaSprite2.scale.set(UNITS.STELLAR * scaleFactor, UNITS.STELLAR * scaleFactor, 1.0);
  this.drawable.add(this._coronaSprite2);

  // star fadeoff glow
  this._fadeoffMaterial = new THREE.SpriteMaterial({
    map: TEXTURES.FADEOFF,
    color: 0xffffff,
    useScreenCoordinates: false,
    alignment: THREE.SpriteAlignment.center,
    transparent: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.7
  });
  this._fadeoffSprite = new THREE.Sprite(this._fadeoffMaterial);
  this._fadeoffSprite.scale.set(UNITS.STELLAR * 8, UNITS.STELLAR * 8, 1.0);
  this.drawable.add(this._fadeoffSprite);

  this._averages = [
  // [temp, color, glowColor] // Spectral Class
      [0,0xff693b,0xFF8E61],       // M
      [3500,0xffba78,0xFF8E61],   // K
      [5000,0xfff3a5,0xffeb6c],   // G
      [6000,0xc0dbff,0x83b0ff],   // F
      [7500,0x6e9aff,0x5085ff],   // A
      [10000,0x5a73ff,0x425fff],  // B
      [25000,0x5a73ff,0x425fff]  // O
  ];



  ///////////////
  // Particles //
  ///////////////
  this.customUniforms = {
    time: {type: 'f', value: 1.0},
    texture: {type: 't', value: TEXTURES.NEBULA_PARTICLE}
  };

  this.customAttributes = {
    customColor: { type: 'c', value: [] },
    customFrequency: { type: 'f', value: [] }
  };

  this.customUniforms2 = {
    time: {type: 'f', value: 1.0},
    texture: {type: 't', value: TEXTURES.GLOW_PARTICLE}
  };

  this.customAttributes2 = {
    customColor: { type: 'c', value: [] },
    customFrequency: { type: 'f', value: [] }
  };

  this.nebulaParticles = 135;
  this.glowParticles = 135;
  var nebulaParticleGeometry = makeParticleGeometry(this.nebulaParticles,this.customAttributes),
      glowParticleGeometry = makeParticleGeometry(this.glowParticles,this.customAttributes2);

  function makeParticleGeometry(count, cAttrs) {
    var theta, u, px, py, pz, particle;
    var r = UNITS.STELLAR;
    var particleGeometry = new THREE.Geometry();
    for(var i = 0 ; i < count; i++){
      theta = Math.random() * Math.PI * 2;
      u = Math.random() * 2 - 1;

      px = r * Math.sqrt(1-u * u) * Math.cos(theta);
      py = r * Math.sqrt(1-u * u) * Math.sin(theta);
      pz = r * u;
      particle = new THREE.Vector3(px, py, pz);
      particleGeometry.vertices.push(particle);

      cAttrs.customColor.value[i] = new THREE.Color(0x00ffff);
      cAttrs.customFrequency.value[i] = 6 * Math.random() + 0.5;

    }
    return particleGeometry;
  }

  var nebulaShaderMaterial = new THREE.ShaderMaterial({
    uniforms: this.customUniforms,
    attributes: this.customAttributes,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
    transparent: true,
    alphaTest: 0.5,
    depthTest: false,
    blending: THREE.AdditiveBlending
  });
  var glowShaderMaterial = new THREE.ShaderMaterial({
    uniforms: this.customUniforms2,
    attributes: this.customAttributes2,
    vertexShader: document.getElementById('vertexshader2').textContent,
    fragmentShader: document.getElementById('fragmentshader2').textContent,
    transparent: true,
    alphaTest: 0.5,
    depthTest: false,
    blending: THREE.AdditiveBlending
  });

  this.nebulaParticleSphere = new THREE.ParticleSystem(nebulaParticleGeometry, nebulaShaderMaterial);
  this.glowParticleSphere = new THREE.ParticleSystem(glowParticleGeometry, glowShaderMaterial);
  this.nebulaParticleSphere.dynamic = true;
  this.glowParticleSphere.dynamic = true;

  this.drawable.add(this.glowParticleSphere);
  this.drawable.add(this.nebulaParticleSphere);
}

Star.prototype.update = function() {
  var ti = window.Helios.clock.getElapsedTime();
  this.customUniforms.time.value = ti;
  this.customUniforms2.time.value = ti;
};

Star.prototype.setup = function(starData) {
  // body...
  console.log(starData);
  this.color = this.determineColor(starData.temperature);
  this.starData = starData;
  this._fadeoffSprite.material.color.setHex(this.color);
  this._coronaSprite.material.color.setHex(this.color);
  this._starDrawable.material.color.setHex(this.color);
  this.setParticleColor(this.color);
  this.scale(starData.radius);
  // this.drawable.scale.set(starData.radius, starData.radius, starData.radius);
};

Star.prototype.setParticleColor = function(color) {
  var c = new THREE.Color(color);
  for(var i = 0; i < this.nebulaParticles ; i++) {
    this.customAttributes.customColor.value[i] = c;
  }
  for(var i = 0; i < this.glowParticles ; i++) {
    this.customAttributes2.customColor.value[i] = c;
  }
};

Star.prototype.scale = function(n) {
  // this._coronaSprite.scale.set()
  // this.drawable.scale.set(n,n,n);
  var nu = n * UNITS.STELLAR * 4;
  this._starDrawable.scale.set(n,n,n);
  this.glowParticleSphere.scale.set(n,n,n);
  this.nebulaParticleSphere.scale.set(n,n,n);
  this._fadeoffSprite.scale.set(nu * 2.5,nu * 2.5,nu * 2.5);
  this._coronaSprite.scale.set(nu,nu,nu);
  this._coronaSprite2.scale.set(nu,nu,nu);
};

Star.prototype.determineColor = function(temperature) {
  for(var i = 1; i < this._averages.length ; i++) {
    if(temperature <= this._averages[i][0]){
      console.log(i, temperature, this._averages[i][1]);
      return this._averages[i-1][1];
    }
  }
};

window.Helios.Star = Star;