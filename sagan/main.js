'use strict';

var starColors = [0x5a73ff, 0x6e9aff, 0xc0dbff, 0xfff3a5, 0xffba78, 0xff693b];
var starColor = _.sample(starColors);
var scene,camera,clock,delta,renderer,customUniforms,customAttributes,customUniforms2,customAttributes2,controls;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 7000 );
  clock = new THREE.Clock();
  delta = clock.getDelta();

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild(renderer.domElement);
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  // scene.add( light );

  // star
  var geometry = new THREE.SphereGeometry(UNITS.STELLAR,32,32);
  // var material = new THREE.MeshLambertMaterial( { color: starColor, emissive: starColor } );
  var material = new THREE.MeshBasicMaterial( { color: starColor } );
  var star = new THREE.Mesh( geometry, material );
  scene.add( star );

  // fadeoff
  var fadeoffMaterial = new THREE.SpriteMaterial({
    map: TEXTURES.FADEOFF,
    color: starColor,
    useScreenCoordinates: false,
    alignment: THREE.SpriteAlignment.center,
    transparent: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.7
  });
  var fadeoffSprite = new THREE.Sprite(fadeoffMaterial);
  fadeoffSprite.scale.set(UNITS.STELLAR * 8, UNITS.STELLAR * 8, 1.0);
  star.add(fadeoffSprite);

  // corona
  var coronaSpriteMaterial = new THREE.SpriteMaterial({
    map: TEXTURES.CORONA,
    color: starColor,
    useScreenCoordinates: false,
    alignment: THREE.SpriteAlignment.center,
    transparent: false,
    blending: THREE.AdditiveBlending
  });
  // coronaSprite.scale.x = coronaSprite.scale.y = UNITS.STELLAR * 2;
  var coronaSprite = new THREE.Sprite(coronaSpriteMaterial);
  coronaSprite.scale.set(UNITS.STELLAR * 4, UNITS.STELLAR * 4, 1.0);
  star.add(coronaSprite);
  var cs2 = new THREE.Sprite(coronaSpriteMaterial);
  cs2.scale.set(UNITS.STELLAR * 4, UNITS.STELLAR * 4, 1.0);
  star.add(cs2);


  // Particles
  customUniforms = {
    time: {type: 'f', value: 1.0},
    texture: {type: 't', value: TEXTURES.NEBULA_PARTICLE}
  };

  customAttributes = {
    customColor: { type: 'c', value: [] },
    customFrequency: { type: 'f', value: [] }
  };
  // Particles
  customUniforms2 = {
    time: {type: 'f', value: 1.0},
    texture: {type: 't', value: TEXTURES.GLOW_PARTICLE}
  };

  customAttributes2 = {
    customColor: { type: 'c', value: [] },
    customFrequency: { type: 'f', value: [] }
  };

  // var particleGeometry = new THREE.SphereGeometry(100,16,16);
  // assign values to attributes, one for each vertex of the geometry
  // console.log(particleGeometry.vertices.length);
  // for( var v = 0; v < particleGeometry.vertices.length; v++ )
  // {
  //   customAttributes.customColor.value[ v ] = new THREE.Color(starColor);
  //   customAttributes.customFrequency.value[ v ] = 5 * Math.random() + 0.5;
  // }

  var particleGeometry = new THREE.Geometry();
  var particleGeometry2 = new THREE.Geometry();
  var particleCount = 175;
  var theta, u, rad;
  var theta2, u2;
  for(var i = 0 ; i < particleCount ; i++) {
    theta = Math.random() * Math.PI * 2;
    u = Math.random() * 2 - 1;
    theta2 = Math.random() * Math.PI * 2;
    u2 = Math.random() * 2 - 1;
    rad = UNITS.STELLAR;

    var px = rad * Math.sqrt(1-u * u) * Math.cos(theta);
    var py = rad * Math.sqrt(1-u * u) * Math.sin(theta);
    var pz = rad * u;
    var particle = new THREE.Vector3(px, py, pz);
    particleGeometry.vertices.push(particle);

    var px2 = rad * Math.sqrt(1-u2 * u2) * Math.cos(theta2);
    var py2 = rad * Math.sqrt(1-u2 * u2) * Math.sin(theta2);
    var pz2 = rad * u2;
    var particle2 = new THREE.Vector3(px2, py2, pz2);
    particleGeometry2.vertices.push(particle2);

    customAttributes.customColor.value[i] = new THREE.Color(starColor);
    customAttributes.customFrequency.value[ i ] = 6 * Math.random() + 0.5;

    customAttributes2.customColor.value[i] = new THREE.Color(starColor);
    customAttributes2.customFrequency.value[ i ] = 6 * Math.random() + 0.5;
  }

  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    attributes: customAttributes,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
    transparent: true,
    alphaTest: 0.5,
    depthTest: false,
    blending: THREE.AdditiveBlending
  });
  var shaderMaterial2 = new THREE.ShaderMaterial({
    uniforms: customUniforms2,
    attributes: customAttributes2,
    vertexShader: document.getElementById('vertexshader2').textContent,
    fragmentShader: document.getElementById('fragmentshader2').textContent,
    transparent: true,
    alphaTest: 0.5,
    depthTest: false,
    blending: THREE.AdditiveBlending
  });


  var particleSphere = new THREE.ParticleSystem(particleGeometry, shaderMaterial);
  particleSphere.dynamic = true;
  scene.add(particleSphere);

  var particleSphere2 = new THREE.ParticleSystem(particleGeometry2, shaderMaterial2);
  particleSphere2.dynamic = true;
  scene.add(particleSphere2);
  // star.scale.set(1.5, 1.5, 1.5);
  // particleSphere2.scale.set(1.5, 1.5, 1.5);
  // particleSphere.scale.set(1.5, 1.5, 1.5);


  camera.position.z = 300;
  camera.lookAt(scene.position);


  var imagePrefix = "images/dawnmountain-";
  var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
  var imageSuffix = ".png";
  var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );

  var materialArray = [];
  for (var i = 0; i < 6; i++)
    materialArray.push( new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
      side: THREE.BackSide
    }));
  // var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
  var skyMaterial = new THREE.MeshBasicMaterial({color: 0x0B1317, side: THREE.BackSide});
  var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
  scene.add( skyBox );
  render();
}

var camTheta = 0,
    camPhi = 0,
    r = 500;

function render() {
  delta = clock.getDelta();
  var ti = clock.getElapsedTime();
  customUniforms.time.value = ti;
  customUniforms2.time.value = ti;
  // camTheta += .005;
  // camPhi += 0.001;
  // camera.position.x = Math.cos(camTheta) * Math.sin(camPhi) * r;
  // camera.position.z = Math.sin(camTheta) * Math.sin(camPhi) * r;
  // camera.position.y = Math.cos(camPhi) * r;
  // console.log(camera.position);
  controls.update();
  camera.lookAt(scene.position);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
init()
