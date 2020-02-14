let container, w, h, scene, camera, controls, renderer, stats;
let urls;
let loop = {};
let x, y, z, i;
let collidableMeshList = [], tab = [], obstacles;

window.addEventListener('load', go);
window.addEventListener('resize', resize);

function go() {
  console.log("Go!");
  init();
  gameLoop();
}

// Classe Balle
class Balle {

  Balle(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
  }

  initBalle() {
    const geometryBalle = new THREE.BoxBufferGeometry(x,y,z);
    //const materialBalle = new THREE.MeshPhongMaterial( { color: 'gold'} );
    const textureBalle = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png");
    const materialBalle = new THREE.MeshBasicMaterial( { map : textureBalle} );


    this.mesh = new THREE.Mesh( geometryBalle, materialBalle, );
    scene.add( this.mesh );
    this.mesh.position.z=0.5; // Pose la balle sur le terrain
    this.rays = [
        new THREE.Vector3(0, 0, 1),
    /*    new THREE.Vector3(1, 0, 1),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(1, 0, -1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(-1, 0, -1),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(-1, 0, 1)*/
      ];
      tab = this.rays

    this.caster = new THREE.Raycaster();

  }

  collision() {

    const distance = 32;
    //obstacles = collidableMeshList[];

    //for (i = 0; i < this.rays.length; i += 1) {
    for (i = 0; i < tab.length; i += 1) {
      // We reset the raycaster to this direction
      //this.caster.set(this.mesh.position, this.tab[i]);
      // Test if we intersect with any obstacle mesh
     // collisions = this.caster.intersectObject(Wall);
      // And disable that direction if we do
      if (collisions.length > 0 && collisions[0].distance <= distance) {
        // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
        if ((i === 0 || i === 1 || i === 7) && this.mesh.direction.z === 1) {
          //balle.direction.setZ(0);
          console.log("Collision");
        }
      }
    }
  }

  coll(b1,b2){

    var hit = false;
    var dist = (w/2);

    var origin = new THREE.Vector3();
    origin = b1.mesh.position.set(intersection.x, intersection.y, intersection.z);
    //origin = b1.mesh.position.copy(b1);
    //new THREE.Vector3(b1.position.x,b1.position.y,b1.position.z);

    var direction = new THREE.Vector3( 1, 0, 0 );
    direction.applyQuaternion( b1.quaternion );

    var ray = new THREE.Raycaster(origin, direction,0,dist);
    var collisionResult = ray.intersectObject(b2);

    if(collisionResult!=0){
      console.log("Collision");
      hit = true; b1.translateX( -1 );
    }
    else{
      hit = false;
    }

    return hit;
  }

  mouvement() {
    this.mesh.translateY(0.05);
  }
  // POUR LES TEST DE COLLISIONS
  mouvementBack(){
    this.mesh.translateY(-0.05);
  }
  mouvementRight(){
    this.mesh.translateX(0.05);
  }
  mouvementLeft(){
    this.mesh.translateX(-0.05);
  }
};


//Classe Terrain
class Terrain {
  initTerrain() {
    const geometryTerrain = new THREE.PlaneBufferGeometry( 15, 20 );
    const textureTerrain = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/marche.jpg");
    const materialTerrain = new THREE.MeshBasicMaterial ({map : textureTerrain});
    this.mesh = new THREE.Mesh(geometryTerrain, materialTerrain);
    scene.add( this.mesh );
  }
};

//Classe Mur

class Mur {
  initMur() {
    const wallGeometry = new THREE.BoxBufferGeometry( 4, 3, 3, 1, 1, 1 );
  	const wallMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
  	const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );

  	this.mesh = new THREE.Mesh(wallGeometry, wallMaterial);
  	this.mesh.position.set(0, 6, 0.5);
  	scene.add(this.mesh);
  }
};

// Variables globales
var balle = new Balle(1,1,1);
var terrain = new Terrain();
var murTest = new Mur();

// Initialisation du monde 3D
function init() {
  container = document.querySelector('#SIApp');
  w = container.clientWidth;
  h = container.clientHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color('cyan');
  //scene.overrideMaterial = new THREE.MeshBasicMaterial( { color: 'green' } );

//Camera
  camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
  camera.position.set(0, -10, 5);
  camera.rotation.x=3.14/4;

  controls = new THREE.TrackballControls(camera, container);
  controls.target = new THREE.Vector3(0, 0, 0.75);
  controls.panSpeed = 0.4;

  //Render
  const renderConfig = {antialias: true, alpha: true};
  renderer = new THREE.WebGLRenderer(renderConfig);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;


//lights
  var light = new THREE.DirectionalLight( 0xdddddd, 0.8 );
  light.position.set( -80, -80, 80 );
  //light.castShadow = true;
  //light = new THREE.AmbientLight( 0x444444 );
  scene.add(light);



  // add Stats.js - https://github.com/mrdoob/stats.js
  stats = new Stats();
  stats.domElement.style.position	= 'absolute';
  stats.domElement.style.bottom	= '0px';
  document.body.appendChild( stats.domElement );


  // add some geometries

  balle.initBalle();
  terrain.initTerrain();
  murTest.initMur();
  //collidableMeshList.push(murTest); // On ajoute le mur au tableau des objets qui admettent des collisions


// Stats
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
//  loop.dt = loop.dt + Math.min(1, (loop.now - loop.last) / 100000);
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
  //const angleIncr = Math.PI * 2 * step / 5 ; // une rotation complète en 5 secondes
//  balle.translateY(0.05); // Vitesse de la balle. Au départ elle se dirige vers l'adversaire
 //balle.mouvement();

  const distance = 32;

  var xSpeed = 0.05;
  var ySpeed = 0.0001;

    var cube = scene.getObjectByName('balle');
    document.onkeydown = function(e) {
      switch (e.keyCode) {
        case 90: //z
          console.log("J'appuie sur Z");
          balle.mouvement();
          break;
        case 83: //s
          console.log("J'appuie sur s");
          balle.mouvementBack();
          break;
        case 68: //d
          console.log("J'appuie sur d");
          balle.mouvementRight();
          break;
        case 81: //q
          console.log("J'appuie sur q");
          balle.mouvementLeft();
          break;
      }
    };



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
