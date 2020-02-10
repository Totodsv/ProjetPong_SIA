let container, w, h, scene, camera, controls, renderer, stats;
let urls;
let loop = {};
let balle, x, y, z, terrain, wall;
let collidableMeshList = [], obstacles;

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
    const materialBalle = new THREE.MeshBasicMaterial( { color: 'gold'} );

    balle = new THREE.Mesh( geometryBalle, materialBalle, );
    scene.add( balle );
    balle.position.z=0.5; // Pose la balle sur le terrain
    balle.rays = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(1, 0, 1),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(1, 0, -1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(-1, 0, -1),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(-1, 0, 1)
      ];

    balle.caster = new THREE.Raycaster();

  }

  collision() {

    const distance = 32;
    //obstacles = collidableMeshList[];

    for (i = 0; i < balle.rays.length; i += 1) {
      // We reset the raycaster to this direction
      balle.caster.set(balle.mesh.position, balle.rays[i]);
      // Test if we intersect with any obstacle mesh
      collisions = balle.caster.intersectObjects(collidableMeshList);
      // And disable that direction if we do
      if (collisions.length > 0 && collisions[0].distance <= distance) {
        // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
        if ((i === 0 || i === 1 || i === 7) && balle.direction.z === 1) {
          //balle.direction.setZ(0);
          console.log("Collision");
        }
      }
    }
  }

  mouvement() {
    //balle.collision();

    // If we're not static
  //  if (balle.direction.x !== 0 || balle.direction.z !== 0) {
      // Rotate the character
      //balle.rotate();
      // Move the character
      balle.translateY(0.05);
    //  return true;
    //}
  }
};


//Classe Terrain
class Terrain {
  initTerrain() {
    const geometryTerrain = new THREE.PlaneBufferGeometry( 15, 20 );
    const materialTerrain = new THREE.MeshBasicMaterial ();
    terrain = new THREE.Mesh(geometryTerrain, materialTerrain);
    scene.add( terrain );
  }
};

//Classe Mur

class Mur {
  initMur() {
    const wallGeometry = new THREE.CubeGeometry( 4, 3, 3, 1, 1, 1 );
  	const wallMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
  	const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );

  	const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  	wall.position.set(0, 6, 0.5);
  	scene.add(wall);
  }
};

// Initialisation du monde 3D
function init() {
  container = document.querySelector('#SIApp');
  w = container.clientWidth;
  h = container.clientHeight;

  scene = new THREE.Scene();

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

  // add Stats.js - https://github.com/mrdoob/stats.js
  stats = new Stats();
  stats.domElement.style.position	= 'absolute';
  stats.domElement.style.bottom	= '0px';
  document.body.appendChild( stats.domElement );


  // add some geometries

  var ballonTest = new Balle(1,1,1);
  ballonTest.initBalle();

  var terrain = new Terrain();
  terrain.initTerrain();

  var murTest = new Mur();
  murTest.initMur();
  collidableMeshList.push(wall);


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
  balle.translateY(0.05); // Vitesse de la balle. Au départ elle se dirige vers l'adversaire
  const distance = 32;
  //obstacles = collidableMeshList[];

  for (i = 0; i < balle.rays.length; i += 1) {
    // We reset the raycaster to this direction
    balle.caster.set(balle.position, balle.rays[i]);

    // Test if we intersect with any obstacle mesh

    collisions = balle.caster.intersectObjects(tab); // Problème ici

    // And disable that direction if we do
    if (collisions.length > 0 && collisions[0].distance <= distance) {
      // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
      if ((i === 0 || i === 1 || i === 7) && balle.direction.z === 1) {
        //balle.direction.setZ(0);
        console.log("Collision");
      }
    }
  }
  //ballon.mouvement();
  //ballon.translateY(0.05);
  // TEST DE COLLISIONS ******************
  /*
  var originPoint = balle.position.clone();
  for (var vertexIndex = 0; vertexIndex < balle.geometry.vertices.length; vertexIndex++)
  	{
  		var localVertex = balle.geometry.vertices[vertexIndex].clone();
  		var globalVertex = localVertex.applyMatrix4( balle.matrix );
  		var directionVector = globalVertex.sub( balle.position );

  		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
  		var collisionResults = ray.intersectObjects( collidableMeshList );
  		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
  		balle.translateY(-1);
	}*/
  // *************************************
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
