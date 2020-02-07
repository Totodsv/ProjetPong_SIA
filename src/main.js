let container, w, h, scene, camera, controls, renderer, stats;
let loop = {};
let balle;

window.addEventListener('load', go);
window.addEventListener('resize', resize);

function go() {
  console.log("Go!");
  init();
  gameLoop();
}

function init() {
  container = document.querySelector('#SIApp');
  w = container.clientWidth;
  h = container.clientHeight;

  scene = new THREE.Scene();

//Camera
  camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
  camera.position.set(0, -10, 5);
  //camera.position.x=0;
  //camera.position.y=-10;
  //camera.position.z=5;
  camera.rotation.x=3.14/4;

  //camera = new THREE.PerspectiveCamera( 5, window.innerWidth / window.innerHeight, 1, 1000 );
	//camera.position.set( 0, 75, 100 );
  //camera.position.z=5;

  controls = new THREE.TrackballControls(camera, container);
  controls.target = new THREE.Vector3(0, 0, 0.75);
  controls.panSpeed = 0.4;

//Render
  const renderConfig = {antialias: true, alpha: true};
  renderer = new THREE.WebGLRenderer(renderConfig);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);

  // add Stats.js - https://github.com/mrdoob/stats.js
  stats = new Stats();
  stats.domElement.style.position	= 'absolute';
  stats.domElement.style.bottom	= '0px';
  document.body.appendChild( stats.domElement );

  // add some geometries
  //Balle
  const geometryBalle = new THREE.SphereGeometry( 0.5, 20, 20);
  const materialBalle = new THREE.MeshNormalMaterial( );
  //const textureBalle = new THREE.TextureLoader().load('medias/images/neige.jpg');
  //textureBalle.needsUpdate = true;
  //const materialBalle = new THREE.MeshFaceMaterial( { map : textureBalle } );
  balle = new THREE.Mesh( geometryBalle, materialBalle, );
  scene.add( balle );

  //Terrain

  const geometryTerrain = new THREE.PlaneBufferGeometry( 10, 10 );
  const materialTerrain = new THREE.MeshBasicMaterial ();
  terrain = new THREE.Mesh(geometryTerrain, materialTerrain);
  scene.add( terrain );

  const fps  = 60;
  const slow = 1; // slow motion! 1: normal speed, 2: half speed...
  loop.dt       = 0,
  loop.now      = timestamp();
  loop.last     = loop.now;
  loop.fps      = fps;
  loop.step     = 1/loop.fps;
  loop.slow     = slow;
  loop.slowStep = loop.slow * loop.step;

}

function gameLoop() {

  // gestion de l'incrément du temps
  loop.now = timestamp();
  loop.dt = loop.dt + Math.min(1, (loop.now - loop.last) / 1000);
  while(loop.dt > loop.slowStep) {
    loop.dt = loop.dt - loop.slowStep;
    update(loop.step); // déplace les objets d'une fraction de seconde
  }
  renderer.render(scene, camera);  // rendu de la scène
  loop.last = loop.now;

  requestAnimationFrame(gameLoop); // relance la boucle du jeu

  controls.update();
  stats.update();
}

function update(step) {
  const angleIncr = Math.PI * 2 * step / 5 ; // une rotation complète en 5 secondes
  balle.rotateY(angleIncr);
}

function resize() {
  w = container.clientWidth;
  h = container.clientHeight;
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function timestamp() {
  return window.performance.now();
}
