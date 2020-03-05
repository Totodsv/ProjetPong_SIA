let container, w, h, scene, camera, controls, renderer, stats, keyboard;
let urls;
let loop = {};
let x, y, z, i, padX, delta;
let tab = [];

window.addEventListener('load', go);
window.addEventListener('resize', resize);
window.addEventListener('keyup', onDocumentKeyDown);

function go() {
  console.log("Go!");
  init();
  gameLoop();
}

// Direction et vitesse de la balle au debut de la partie.
var ballDirX = 0;
var ballDirZ = -0.05;
var ballSpeed = 16;
var paddleDirX = 0.4;
var paddleDirNX = -0.4;
var paddleSpeedX = 1.4;
var paddleSpeedNX = 1.4;
var tailleTerrain = 88 * 0.95;
var level = 3;
var ballePosition = 0;
var paddleSize = 16
var textureScore = [];


// Classe Balle
class Balle {

  /*Balle(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
  }*/

  initBalle() {
    const geometryBalle = new THREE.BoxBufferGeometry(4,4,4);
    const textureBalle = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/tnt.png");
    const materialBalle = new THREE.MeshBasicMaterial( { map : textureBalle} );

    this.mesh = new THREE.Mesh( geometryBalle, materialBalle, );
    scene.add( this.mesh );
    this.mesh.position.set(0,2.5,0); // Pose la balle sur le terrain
    this.rays = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(1, 0, 1),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(1, 0, -1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(-1, 0, -1),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(-1, 0, 1)
      ];
      tab = this.rays

    this.caster = new THREE.Raycaster();
  }

  mouvement(padX) {
    this.mesh.translateX(ballDirX * ballSpeed); // La balle est en mouvement constant sur l'axe des x
    this.mesh.translateZ(ballDirZ * ballSpeed); // La balle est en mouvement constant sur l'axe des z

    const distance = 2; // Un pad fait 1 en z donc si on veut que la balle rebondisse de façons réaliste on prend la moitié de cette valeur pour être à la position de la face de notre objet

    for (i = 0; i < tab.length; i += 1) {
      this.caster.set(this.mesh.position, this.rays[i]); // On ajoute les raycasters sur la balle
      var obstacles = this.caster.intersectObjects(scene.children); // Collisions -> les rayons de la balle peuvent entrer en contact avec les objets de la scène
      if (obstacles.length > 0 && obstacles[0].distance <= distance) { // si la distance de collision est plus petite que celle définie alors il y a collision
        if (i === 4) {
          console.log("Collision De Face");
          ballDirZ = -ballDirZ;
        }
        else if (i === 0) {
          console.log("Collision De Dos");
          ballDirZ = -ballDirZ;
          if (this.mesh.position.x > padX + (paddleSize/3.5)){ //Si la balle entre avec le côté droite du pad alors elle part vers la droite
            ballDirX = -0.02;
            ballDirX = -ballDirX;
            console.log("Je dois partir à droite");
          }
          else if (this.mesh.position.x < padX - (paddleSize/3.5)){ //Si la balle entre avec le côté gauche du pad alors elle part vers la gauche
            ballDirX = 0.02;
            ballDirX = -ballDirX;
            console.log("Je dois partir à gauche");
          }
          if (this.mesh.position.x > padX + (paddleSize/8) && this.mesh.position.x < padX + (paddleSize/3.5)){ //Si la balle entre avec le côté droite du pad alors elle part vers la droite
            ballDirX = -0.01;
            ballDirX = -ballDirX;
            console.log("Je dois partir légèrement à droite");
          }
          else if (this.mesh.position.x < padX - (paddleSize/8) && this.mesh.position.x > padX - (paddleSize/3.5)){ //Si la balle entre avec le côté gauche du pad alors elle part vers la gauche
            ballDirX = 0.01;
            ballDirX = -ballDirX;
            console.log("Je dois partir légèrement à gauche");
          }
        }
        if (i === 1 || i === 2 || i === 3) {
          console.log("Collision De Droite");
          ballDirX = 0.05;
          ballDirX = -ballDirX;
        }
        else if (i === 5 || i === 6 || i ===7) {
          console.log("Collision De Gauche");
          ballDirX = -0.05;
          ballDirX = -ballDirX;
        }
      }
    }

    // Si le joueur a marqué un point
    if (this.mesh.position.z <= -tailleTerrain/2)
    {
      console.log("Le joueur a marqué");
      // update scoreboard
      this.reset();
    }

// if ball goes off the 'right' side (CPU's side)
    if (this.mesh.position.z >= tailleTerrain/2)
    {
      console.log("L'IA a marqué");
      // update scoreboard
      score.iaScore();
      this.reset();
    }
  }

  reset() { // Lorsqu'un des deux joueurs marque un point la balle est réinitialisé au centre
    this.mesh.position.set(0,2.5,0);
    ballDirX = 0;
  }

  positionX() {
    return this.mesh.position.x
  }


};

//Classe Terrain
class Terrain {
  initTerrain() {
    //const geometryTerrain = new THREE.BoxBufferGeometry( 15, 0, 22 );
    const geometryTerrain = new THREE.BoxBufferGeometry( 1000, -0.1, 1000 );
    const textureTerrain = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/testEau.jpg");
    const materialTerrain = new THREE.MeshBasicMaterial ({map : textureTerrain});
    this.mesh = new THREE.Mesh(geometryTerrain, materialTerrain);
    scene.add( this.mesh );
  }
};

//Classe Terrain
class Stade {
  initStade() {
    //const geometryTerrain = new THREE.BoxBufferGeometry( 15, 0, 22 );
    const geometryStade = new THREE.BoxBufferGeometry( 60, 0, 96 );
    const textureStade = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/testSol8.png");
    const materialStade = new THREE.MeshBasicMaterial ({map : textureStade});
    this.mesh = new THREE.Mesh(geometryStade, materialStade);
    scene.add( this.mesh );
  }
};

// Classe Mur
class Mur {
  initMur() {
    const murGeometry = new THREE.BoxBufferGeometry( 4, 4, 88, 1, 1, 1 );
    //const murMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
    //const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    const textureMur = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/testSol6.jpg");
    const murMaterial = new THREE.MeshBasicMaterial ({map : textureMur});

    this.mesh = new THREE.Mesh(murGeometry, murMaterial);
    this.mesh.position.set(0, 0, 0);
    scene.add(this.mesh);
  }
  positionMur(x,y,z){
    this.mesh.position.set(x, y, z);
  }
};

//Classe Pad
class Pad {
  initPad() {
    const padGeometry = new THREE.BoxBufferGeometry( 16, 4, 4, 1, 1, 1 );
  	//const padMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
  	//const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    const texturePad = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png");
    const padMaterial = new THREE.MeshBasicMaterial ({map : texturePad});
  	this.mesh = new THREE.Mesh(padGeometry, padMaterial);
  	this.mesh.position.set(0, 0, 0);
  	scene.add(this.mesh);


    this.clock = new THREE.Clock();
  }
  positionPad(x,y,z){
    this.mesh.position.set(x, y, z);
  }
  mouvementRight(){
      this.mesh.translateX(paddleDirX * paddleSpeedX);
      //console.log(this.mesh.position.x);
      if (this.mesh.position.x > tailleTerrain / 4) { // Si le pad dépasse le terrain en x
        console.log("bloqué");
        paddleDirX = 0;
        paddleSpeedX = 0;
      } else {
        paddleDirX = 0.4;
        paddleSpeedX = paddleSpeedX + 0.15;
      }
  }
  mouvementLeft(){
    this.mesh.translateX(paddleDirNX * paddleSpeedNX);
    if (this.mesh.position.x < -tailleTerrain/4) { // Si le pad dépasse le terrain en x
      console.log("bloqué");
      paddleDirNX = 0;
      paddleSpeedNX = 0;
    }
    else {
      paddleDirNX = -0.4;
      paddleSpeedNX = paddleSpeedNX + 0.15;
    }
  }
  resetX(){
   // paddleDirX = 0.5;
    paddleSpeedX = 1;
  }

  resetNX(){
    //paddleDirNX = 0;
    paddleSpeedNX = 1;
  }

  mouvementIA(x){
    if(level == 0) {
      this.mesh.position.x = x;
    }
    if(level ==1){
      this.mesh.position.x = x/1.9;
    }
    if(level ==2){
      this.mesh.position.x = x/1.7;
    }
    if(level ==3){
      this.mesh.position.x = x/1.5;
    }
  }
  positionX(){
    return this.mesh.position.x
  }
};

class Score {
  initScore() {
    const scoreGeometry = new THREE.BoxBufferGeometry( 16, 16, 16, 1, 1, 1 );
    //const padMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
    //const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    textureScore =
    [
      new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
      new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/testSol8.png")}),
      new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/testEau.jpg")}),
      new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
      new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
      new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")})
    ];
    var scoreMaterial = new THREE.MeshFaceMaterial (textureScore);
    //scoreMaterial.needsUpdate = true;
    this.mesh = new THREE.Mesh(scoreGeometry, scoreMaterial);
    this.mesh.position.set(50, 5, 0);
    this.mesh.rotation.y += 3.7;
    scene.add(this.mesh);

  }

  playerScore(){

  }

  iaScore(){
    textureScore = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/tnt.png");
    console.log("iciiiiiiiiiiiiiiiiiiii");
    //scoreMaterial.needsUpdate = true;
  }
}

class Models {
  initPirateShip() {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    //var url = 'pirateShip.mtl';
    var url = 'shipDark.mtl';
    mtlLoader.load(url , function(materialsPirate){
      materialsPirate.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsPirate);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      //objLoader.load('pirateShip.obj', function(object) {
      objLoader.load('shipDark.obj', function(object) {
        object.position.set(4, 0, -55);
        object.rotation.y += 1.5;
        scene.add(object);
      });
    });
  }
  initCaptain() {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'captain.mtl';
    mtlLoader.load(url , function(materialsCaptain){
      materialsCaptain.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsCaptain);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('captain.obj', function(objectC) {
        objectC.position.set(1, 13, -50);
        objectC.rotation.y += 3;
        scene.add(objectC);
      });
    });
  }
}

class Skybox {
  initSkyBox() {
    const skyGeometry = new THREE.BoxGeometry(1000, 1000, 1000)
    const skyMaterials = [
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/ocean_rt.jpg'), //Right
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/ocean_lf.jpg'), //Left
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/ocean_up.jpg'), //Up
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/ocean_dn.jpg'), //Down
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/ocean_bk.jpg'), //Back
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/ocean_ft.jpg'), //Front
        side: THREE.DoubleSide
      })
    ]
    const skyMaterial = THREE.MeshFaceMaterial(skyMaterials)
    this.mesh = new THREE.Mesh(skyGeometry, skyMaterial)
    scene.add(this.mesh)
  }
}

// Variables globales
//var balle = new Balle(10,10,10);
var balle = new Balle();
var terrain = new Terrain();
var stade = new Stade();
var padAdverse = new Pad();
var padJoueur = new Pad();
var murDroite = new Mur();
var murGauche = new Mur();
var score = new Score();
var ciel = new Skybox();
var bateauPirate = new Models();
var captain = new Models();

// Initialisation du monde 3D
function init() {
  container = document.querySelector('#SIApp');
  w = container.clientWidth;
  h = container.clientHeight;

  scene = new THREE.Scene();

  keyboard = new THREEx.KeyboardState();

  //Camera
  camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
  camera.position.set(0, 27.5, 60);
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

  //Lights
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
  stade.initStade();
  murDroite.initMur();
  //murDroite.positionMur(8,1,1);
  murDroite.positionMur(32,1,1);
  murGauche.initMur();
  //murGauche.positionMur(-8,1,1);
  murGauche.positionMur(-32,1,1);
  padAdverse.initPad();
  padAdverse.positionPad(0,2.5,-40);
  padJoueur.initPad();
  padJoueur.positionPad(0,2.5,40);
  score.initScore();
  ciel.initSkyBox();

  // add some objects
  bateauPirate.initPirateShip();
  captain.initCaptain();

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
  padPosition = padJoueur.positionX(); // Récupère à l'instant t la position x du pad
  balle.mouvement(padPosition); // La balle entre en mouvement et active les collisions

  ballePosition = balle.positionX(); // Récupère à l'instant t la position x de la balle
  padAdverse.mouvementIA(ballePosition); // L'IA suit la balle


  if(keyboard.pressed("Q")){
    padJoueur.mouvementLeft();
  }
  if(keyboard.pressed("D")){
    padJoueur.mouvementRight();
  }

  //Environnement
 // bateauPirate.mouvementModels();
}

function onDocumentKeyDown(){ // Une fois qu'on relâche le bouton permettant d'aller à droite ou à gauche, on réinitialise la vitesse du pad
  padJoueur.resetX();
  padJoueur.resetNX();
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
