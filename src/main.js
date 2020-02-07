
//let container, w, h, scene, camera, controls, renderer, stats;
//let loop = {};
//let torus;
let container, w, h, scene, camera, controls, renderer;
let materialArray
let texture_ft, texture_bk, texture_up, texture_dn, texture_lf, texture_rt;
let skybox, skyboxGeo;

window.addEventListener('load', go);
//window.addEventListener('resize', resize);

function go() {
  console.log("Go!");
  init();
  gameLoop();
}

function render() {
  requestAnimationFrame( render );
  //controls.update();
  renderer.render( scene, camera );
}

function init() {
  container = document.querySelector('#SIApp');
  w = container.clientWidth;
  h = container.clientHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, w/h, 0.001, 100);
  camera.position.set(0, 0, -30);

  const renderConfig = {antialias: true, alpha: true};
  renderer = new THREE.WebGLRenderer(renderConfig);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera);
  controls.addEventListener('change', render());

  // Skybox

  materialArray = [];
  texture_ft = new THREE.TextureLoader().load('/medias/images/arid2_ft.jpg');
  texture_bk = new THREE.TextureLoader().load('/medias/images/arid2_bk.jpg');
  texture_up = new THREE.TextureLoader().load('/medias/images/arid2_up.jpg');
  texture_dn = new THREE.TextureLoader().load('/medias/images/arid2_dn.jpg');
  texture_lf = new THREE.TextureLoader().load('/medias/images/arid2_lf.jpg');
  texture_rt = new THREE.TextureLoader().load('/medias/images/arid2_rt.jpg');

  materialArray.push(new THREE.MeshBasicMeterial({map: texture_ft}));
  materialArray.push(new THREE.MeshBasicMeterial({map: texture_bk}));
  materialArray.push(new THREE.MeshBasicMeterial({map: texture_up}));
  materialArray.push(new THREE.MeshBasicMeterial({map: texture_dn}));
  materialArray.push(new THREE.MeshBasicMeterial({map: texture_lf}));
  materialArray.push(new THREE.MeshBasicMeterial({map: texture_rt}));

  skyboxGeo = new THREE.BoxGeometry(100000, 100000, 100000);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}

function gameLoop() {
  renderer.render(scene,camera);
  requestAnimationFrame(gameLoop);
}
/*
function init() {
  container = document.querySelector('#SIApp');
  w = container.clientWidth;
  h = container.clientHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, w/h, 0.001, 100);
  camera.position.set(0, 0, -30);

  controls = new THREE.TrackballControls(camera, container);
  controls.target = new THREE.Vector3(0, 0, 0.75);
  controls.panSpeed = 0.4;

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
  const geometry = new THREE.TorusGeometry( 10, 3, 16, 100, );
  const material = new THREE.MeshNormalMaterial( );
  torus = new THREE.Mesh( geometry, material, );
  scene.add( torus );

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
  torus.rotateY(angleIncr);
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
*/
