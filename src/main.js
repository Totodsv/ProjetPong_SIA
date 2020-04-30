let container, w, h, scene, camera, controls, renderer, stats, keyboard;
let urls;
let loop = {};
let x, y, z, i, padX, delta, changement, j;
let tab = [];

window.addEventListener('load', go);
window.addEventListener('resize', resize);
window.addEventListener('keyup', onDocumentKeyDown);
window.addEventListener('keypress', fullScreen);

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
var tailleTerrain = 88 * 0.98;
var level = 0;
var ballePosition = 0;
var paddleSize = 16
var textureScore = [];
var player = 0;
var ia = 0;
var elem = document.documentElement;
var perdu = false;
//Animation entre les niveaux
var ballePause = false;
var couler = false;
var coulerX = 4;
var coulerY = -2;
var coulerZ = -60;
var pirateX = 1;
var pirateY = 12;
var pirateZ = -50;
//Animation dans les niveaux
var tir = false;
var tirX = -19;
var tirY = 3.3;
var tirZ = -0.3;
var compteurTir = 0;
//Jokers
var unJoker = false;
var joueur = false;
var rhum = false;
var hautBottle = false;
var sword = false;
var hautSword = false;
var bomb = false;
var hautBomb = false;
var barrel = false;
var hautBarrel = false;
var hautChloro = false;
var chloro = false;
var print = true;
var hPress = false;
var commencer = true;
var rebondSon;

var swordX = 5;
var swordY = 2.5;
var swordZ = 0;
var bottleX = 5;
var bottleY = 2.5;
var bottleZ = 0;
var bombX = 5;
var bombY = 2.5;
var bombZ = 0;
var barrelX = 5;
var barrelY = 2.5;
var barrelZ = 20;
var chloroX = 5;
var chloroY = 2.5;
var chloroZ = 0;



//Paramètres de l'affichage des dialogues (police, couleur etc...)
var textToDisplay = document.createElement('div');
textToDisplay.style.position = 'absolute';
//textToDisplay.style.top = '100px';
textToDisplay.style.top = '45%';
textToDisplay.style.width = '100%';
textToDisplay.style.textAlign = 'center';
textToDisplay.style.zIndex = '1';
textToDisplay.style.display = 'none';
textToDisplay.style.color = '#439DE1';
//textToDisplay.style.color = '77AED8';
textToDisplay.style.fontWeight = 'bold';
//textToDisplay.style.backgroundColor='#F1F1F1';
textToDisplay.style.backgroundColor='rgba(250,250,250,.7)';
textToDisplay.style.padding = '20px';
textToDisplay.style.letterSpacing = '5px';
textToDisplay.style.fontSize = '80px';
textToDisplay.style.fontFamily = 'myFont','Luminari', 'Helvetica', 'Arial', 'Times New Roman';
textToDisplay.style.textShadow = '-1px -1px 0px $clr-blue,\n' +
    '    3px 3px 0px $clr-blue,\n' +
    '    6px 6px 0px $clr-blue-900';




// Classe Balle
class Balle {

  initBalle(nom) {
    const geometryBalle = new THREE.BoxBufferGeometry(4,4,4);
    const textureBalle = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/tnt.png");
    const materialBalle = new THREE.MeshBasicMaterial( { map : textureBalle} );

    this.mesh = new THREE.Mesh( geometryBalle, materialBalle, );
    scene.add( this.mesh );
    this.mesh.name = nom;
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

  positionBalle(x,y,z) {
    this.mesh.position.set(x,y,z); // Pose la balle sur le terrain
  }

  mouvement(padX) {
    this.mesh.translateX(ballDirX * ballSpeed); // La balle est en mouvement constant sur l'axe des x
    this.mesh.translateZ(ballDirZ * ballSpeed); // La balle est en mouvement constant sur l'axe des z

    const distance = 2; // Un pad fait 1 en z donc si on veut que la balle rebondisse de façons réaliste on prend la moitié de cette valeur pour être à la position de la face de notre objet

    var collisionGroup = [];
    var jokerGroup = [];
    for (i=0; i<=scene.children.length-1; i++) { // On ajoute dans les objets à collisions avec le tableau collision et les objets joker dans le tableau des jokers
      if (scene.children[i].name == "BouclierJoueur") {
        collisionGroup.push(scene.children[i]);
      }
      if (scene.children[i].name == "BouclierAdverse") {
        collisionGroup.push(scene.children[i]);
      }
      if (scene.children[i].name == "BouclierInvincible") {
        collisionGroup.push(scene.children[i]);
      }
      if (scene.children[i].name == "MurDroite") {
        collisionGroup.push(scene.children[i]);
      }
      if (scene.children[i].name == "MurGauche") {
        collisionGroup.push(scene.children[i]);
      }
      if (scene.children[i].name == "PadAdverse") {
        collisionGroup.push(scene.children[i]);
      }
      if (scene.children[i].name == "PadJoueur") {
        collisionGroup.push(scene.children[i]);
      }
      if (scene.children[i].name == "Protection1") {
        collisionGroup.push(scene.children[i]);
      }
      if (scene.children[i].name == "Protection2") {
        collisionGroup.push(scene.children[i]);
      }
      if (scene.children[i].name == "Protection3") {
        collisionGroup.push(scene.children[i]);
      }
      if (scene.children[i].name == "Protection4") {
        collisionGroup.push(scene.children[i]);
      }
      if (scene.children[i].name == "Corona"){ // Ajout d'un Joker
        collisionGroup.push(scene.children[i]);
      }
      if (scene.children[i].name == "Cannon"){ // Pour ajouter un model
        for (j = scene.children[i].children.length - 1; j >= 0 ; j -- ) {
            collisionGroup.push(scene.children[i].children[j]);
        }
      }
      if (scene.children[i].name == "CannonBall"){
        for (j = scene.children[i].children.length - 1; j >= 0 ; j -- ) {
          collisionGroup.push(scene.children[i].children[j]);
        }
      }
      if (scene.children[i].name == "Bottle"){ // Ajout d'un Joker
        for (j = scene.children[i].children.length - 1; j >= 0 ; j -- ) {
          jokerGroup.push(scene.children[i].children[j]);
        }
      }
      if (scene.children[i].name == "Sword"){ // Ajout d'un Joker
        for (j = scene.children[i].children.length - 1; j >= 0 ; j -- ) {
          jokerGroup.push(scene.children[i].children[j]);
        }
      }
      if (scene.children[i].name == "Bombe"){ // Ajout d'un Joker
        for (j = scene.children[i].children.length - 1; j >= 0 ; j -- ) {
          jokerGroup.push(scene.children[i].children[j]);
        }
      }
      if (scene.children[i].name == "Barrel"){ // Ajout d'un Joker
        for (j = scene.children[i].children.length - 1; j >= 0 ; j -- ) {
          jokerGroup.push(scene.children[i].children[j]);
        }
      }
      if (scene.children[i].name == "Chloroquine"){ // Ajout d'un Joker
        for (j = scene.children[i].children.length - 1; j >= 0 ; j -- ) {
          jokerGroup.push(scene.children[i].children[j]);
        }
      }
    }

    for (i = 0; i < tab.length; i += 1) {
      this.caster.set(this.mesh.position, this.rays[i]); // On ajoute les raycasters sur la balle
      //var obstacles = this.caster.intersectObjects(scene.children); // Collisions -> les rayons de la balle peuvent entrer en contact avec les objets de la scène
      //console.log(scene);
      //console.log(rhum);
      var obstacles = this.caster.intersectObjects(collisionGroup); // Groupe des obstacles
      var obstaclesJokers = this.caster.intersectObjects(jokerGroup); // Groupe des jokers
      //Collision avec les boucliers
      var bouclierJoueur = scene.children[4];
      var bouclierAdverse = scene.children[5];

      if (obstacles.length > 0 && obstacles[0].distance <= distance) {// si la distance de collision est plus petite que celle définie alors il y a collision
        rebondSon.play();

        //Test vitesse balle
        if (ballSpeed < 30) { // On bloque la vitesse de la balle pour que ça reste jouable pour un humain
          ballSpeed += 0.1;
        } else {
          ballSpeed = 25;
        }

        //Gestion des boucliers
        if (obstacles[0].object.name == "BouclierJoueur") {
          console.log("Bouclier Joueur");
          bouclierJoueur.position.set(0, -2.5, 45);
          joueur=true;
        }
        if (obstacles[0].object.name == "BouclierAdverse") {
          console.log("Bouclier Adverse");
          bouclierAdverse.position.set(0, -2.5, -45);
          joueur=false;
        }
        //Obtenir le dernier joueur qui a touché la balle pour lui attribuer un Joker
        if (obstacles[0].object.name == "PadJoueur") {
          joueur=true;
        }
        if (obstacles[0].object.name == "PadAdverse") {
          joueur=false;
        }
        //Gestion des collisions
        if (i === 4) {
          console.log("Collision De Face");
          ballDirZ = -ballDirZ;
        } else if (i === 0) {
          console.log("Collision De Dos");
          ballDirZ = -ballDirZ;
          if (this.mesh.position.x > padX + (paddleSize / 3.5)) { //Si la balle entre avec le côté droite du pad alors elle part vers la droite
            ballDirX = -0.02;
            ballDirX = -ballDirX;
            console.log("Je dois partir à droite");
          } else if (this.mesh.position.x < padX - (paddleSize / 3.5)) { //Si la balle entre avec le côté gauche du pad alors elle part vers la gauche
            ballDirX = 0.02;
            ballDirX = -ballDirX;
            console.log("Je dois partir à gauche");
          }
          if (this.mesh.position.x > padX + (paddleSize / 8) && this.mesh.position.x < padX + (paddleSize / 3.5)) { //Si la balle entre avec le côté droite du pad alors elle part vers la droite
            ballDirX = -0.01;
            ballDirX = -ballDirX;
            console.log("Je dois partir légèrement à droite");
          } else if (this.mesh.position.x < padX - (paddleSize / 8) && this.mesh.position.x > padX - (paddleSize / 3.5)) { //Si la balle entre avec le côté gauche du pad alors elle part vers la gauche
            ballDirX = 0.01;
            ballDirX = -ballDirX;
            console.log("Je dois partir légèrement à gauche");
          }
        }
        if (i === 1 || i === 2 || i === 3) {
          console.log("Collision De Droite");
          ballDirX = 0.05;
          ballDirX = -ballDirX;
        } else if (i === 5 || i === 6 || i === 7) {
          console.log("Collision De Gauche");
          ballDirX = -0.05;
          ballDirX = -ballDirX;
        }
      }
      if (obstaclesJokers.length > 0 && obstaclesJokers[0].distance <= distance) { // Si la balle entre en collision avec un des objets joker
        //console.log("JOKKKKKERRRR");
        // Gestion des Jokers
        if (obstaclesJokers[0].object.parent.name == "Bottle") {
          console.log("Joker : Bouteille de Rhum");
          Rhum(); // Active l'effet du joker
          rhum=false;
        }
        if (obstaclesJokers[0].object.parent.name == "Sword") {
          console.log("Joker : Epée de Pirate");
          Epee(); // Active l'effet du joker
          sword=false;
        }
        if (obstaclesJokers[0].object.parent.name == "Bombe") {
          console.log("Joker : Bombe");
          Bombe(); // Active l'effet du joker
          bomb=false;
        }
        if (obstaclesJokers[0].object.parent.name == "Barrel") {
          console.log("Joker : Barile");
          Barile(); // Active l'effet du joker
          barrel=false;
        }
        if (obstaclesJokers[0].object.parent.name == "Chloroquine") {
          console.log("Joker : Chloroquine");
          Chloroquine(); // Active l'effet du joker
          chloro=false;
        }
      }
    }

    // Si le joueur marque un point
    if (this.mesh.position.z <= -tailleTerrain/2)
    {
      if (player < 3) { // Si le score du joueur est plus petit que 3
        console.log("Le joueur a marqué");
        scorePlayer.playerScore(); // Le joueur marque un point
        this.reset();// On remet la balle et les pads au centre
        bouclierJoueur.position.set(0,2.5,43.5);//On remet le shield du Joueur
        bouclierAdverse.position.set(0,2.5,-43.5);//On remet le shield de l'adversaire
        ballSpeed=16; //On réinitialise la vitesse de la balle
        if (player == 3) {
          this.pause();
        }
      }
    }

// Si l'IA marque un point
    if (this.mesh.position.z >= tailleTerrain/2)
    {
      if (ia < 3) { // Si le score de l'IA est plus petit que 3
        console.log("L'IA a marqué");
        scoreIA.iaScore(); // L'IA marque un point
        this.reset(); // On remet la balle et les pads au centre
        bouclierJoueur.position.set(0,2.5,43.5);//On remet le shield du Joueur
        bouclierAdverse.position.set(0,2.5,-43.5);//On remet le shield de l'adversaire
        ballSpeed=16; //On réinitialise la vitesse de la balle
        if (ia == 3) {
          this.pause();
          perdu=true;
          console.log("Vous avez perdu");
        }
      }
      this.reset(); // On remet la balle et les pads au centre
      corona.positionCorona(0,-10,0);//On enlève le mur du corona s'il y est.
      chloro = false;
      for (i=0; i<=scene.children.length-1; i++) {
        if (scene.children[i].name == "Chloroquine") { // on enlève la chloroquine qui ne sert plus
          removeModel(scene.children[i]);
        }
      }
    }

// Si la balle quitte les limites du terrain
    if (this.mesh.position.x >= 35 || this.mesh.position.x <= -35 ){
      this.reset();
      corona.positionCorona(0,-10,0);//On enlève le mur du corona s'il y est.
      chloro = false;
      for (i=0; i<=scene.children.length-1; i++) {
        if (scene.children[i].name == "Chloroquine") { // on enlève la chloroquine qui ne sert plus
          removeModel(scene.children[i]);
        }
      }
    }
  }

  reset() { // Lorsqu'un des deux joueurs marque un point la balle est réinitialisé au centre
    this.mesh.position.set(0,2.5,0);
    ballDirX = 0;
  }

  pause() {
    ballePause = true;
    this.mesh.position.set(0,2.5,0);
  }

  go() {
    ballePause = false;
  }

  positionX() {
    return this.mesh.position.x
  }


};

class Bouclier {
  initShield(nom) {
    //const shieldGeometry = new THREE.BoxBufferGeometry( tailleTerrain*0.72, 4, 0.5, 1, 1, 1 );
    const shieldGeometry = new THREE.BoxBufferGeometry( tailleTerrain*0.695, 4, 0.5, 1, 1, 1 );
    //const textureMur = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/testSol6.jpg");
    //const murMaterial = new THREE.MeshBasicMaterial ({map : textureMur});
    const shieldMaterial =  new THREE.MeshStandardMaterial({transparent:true, opacity:0.5});

    this.mesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
    this.mesh.position.set(0, -10, 0);
    //this.mesh.name = "Bouclier";
    scene.add(this.mesh);
    this.mesh.name=nom;
  }
  positionShield(x,y,z){
    this.mesh.position.set(x, y, z);
  }
  initInvincibleShield(nom) {
    const shieldGeometry = new THREE.BoxBufferGeometry( tailleTerrain*0.695, 4, 0.5, 1, 1, 1 );
    const shieldMaterial =  new THREE.MeshStandardMaterial({transparent:true, opacity:0.9, color: 0xE8D560});
    //const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    this.mesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
    this.mesh.position.set(0, -10, 0);
    //this.mesh.name = "Bouclier";
    scene.add(this.mesh);
    this.mesh.name=nom;
  }
}

class Protection{
  initProtection(nom){
    const protectGeometry = new THREE.BoxBufferGeometry( 6, 4, 0.5, 1, 1, 1 );
    const protectMaterial =  new THREE.MeshStandardMaterial({transparent:true, opacity:0});
    this.mesh = new THREE.Mesh(protectGeometry, protectMaterial);
    this.mesh.position.set(35, 0, 1);
    //this.mesh.name = "Bouclier";
    scene.add(this.mesh);
    this.mesh.name=nom;
  }
  positionProtection(x,y,z){
    this.mesh.position.set(x, y, z);
  }
  rotationProtection(y){
    this.mesh.rotation.y = y;
  }
}

//Classe Terrain
class Terrain {
  initTerrain(nom) {
    //const geometryTerrain = new THREE.BoxBufferGeometry( 15, 0, 22 );
    //const geometryTerrain = new THREE.BoxBufferGeometry( 1000, -0.1, 1000 );
    const geometryTerrain = new THREE.BoxBufferGeometry( 1000, -0.1, 1000 );
    const textureTerrain = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/testEau3.jpg");
    const materialTerrain = new THREE.MeshBasicMaterial ({map : textureTerrain});
    this.mesh = new THREE.Mesh(geometryTerrain, materialTerrain);
    scene.add( this.mesh );
    this.mesh.name=nom;
  }
  positionTerrain(x,y,z){
    this.mesh.position.set(x, y, z);
  }
};

//Classe Stade
class Stade {
  initStade(nom) {
    //const geometryTerrain = new THREE.BoxBufferGeometry( 15, 0, 22 );
    const geometryStade = new THREE.BoxBufferGeometry(60, 0, 96);
    const textureStade = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/testSol8.png");
    const materialStade = new THREE.MeshBasicMaterial({map: textureStade});
    this.mesh = new THREE.Mesh(geometryStade, materialStade);
    scene.add(this.mesh);
    this.mesh.name=nom;
  }
};

//Classe Ile
class Ile {
  initIle(nom) {
    //const geometryTerrain = new THREE.BoxBufferGeometry( 15, 0, 22 );
    const geometryIle = new THREE.CircleBufferGeometry(100, 10, 20);
    const textureIle = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/sand.jpg");
    const materialIle = new THREE.MeshBasicMaterial({map: textureIle});
    this.mesh = new THREE.Mesh(geometryIle, materialIle);
    scene.add(this.mesh);
    this.mesh.rotation.x=-1.57;
    this.mesh.rotation.y=-0.01;
    this.mesh.name=nom;
  }
  positionIle(x,y,z){
    this.mesh.position.set(x, y, z);
  }
};

// Classe Mur
class Mur {
  initMur(nom) {
    const murGeometry = new THREE.BoxBufferGeometry( 4, 4, 88, 1, 1, 1 );
    //const murMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
    //const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    const textureMur = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/testSol6.jpg");
    const murMaterial = new THREE.MeshBasicMaterial ({map : textureMur});

    this.mesh = new THREE.Mesh(murGeometry, murMaterial);
    this.mesh.position.set(0, 0, 0);
    scene.add(this.mesh);
    this.mesh.name=nom;
  }
  positionMur(x,y,z){
    this.mesh.position.set(x, y, z);
  }
};

//Classe Pad
class Pad {
  initPad(nom) {
    const padGeometry = new THREE.BoxBufferGeometry( 16, 4, 4, 1, 1, 1 );
  	//const padMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
  	//const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    const texturePad = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png");
    const padMaterial = new THREE.MeshBasicMaterial ({map : texturePad});
  	this.mesh = new THREE.Mesh(padGeometry, padMaterial);
  	this.mesh.position.set(0, 0, 0);
  	scene.add(this.mesh);
    this.mesh.name=nom;

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
      this.mesh.position.x = x/2.3;
    }
    if(level ==2){
      this.mesh.position.x = x/1.9;
    }
    if(level ==3){
      this.mesh.position.x = x/1.5;
    }
  }
  positionX(){
    return this.mesh.position.x
  }
  padBomb(x,y,z){
    this.mesh.scale.set(x,y,z);
  }
};

class Score {
  initScore(nom) {
    const scoreGeometry = new THREE.BoxBufferGeometry( 16, 16, 16, 1, 1, 1 );
    //const padMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
    //const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    textureScore =
    [
      new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/score0.jpg")}),
      new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
      new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
      new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
      new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
      new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")})
    ];
    var scoreMaterial = new THREE.MeshFaceMaterial (textureScore);
    this.mesh = new THREE.Mesh(scoreGeometry, scoreMaterial);
    this.mesh.position.set(50, 5, 0);
    this.mesh.rotation.y += 5.4999999;
    scene.add(this.mesh);
    this.mesh.name=nom;

  }
  initScore1(nom) {
    const scoreGeometry = new THREE.BoxBufferGeometry( 16, 16, 16, 1, 1, 1 );
    //const padMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
    //const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    textureScore =
        [
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/score1.jpg")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")})
        ];
    var scoreMaterial = new THREE.MeshFaceMaterial (textureScore);
    this.mesh = new THREE.Mesh(scoreGeometry, scoreMaterial);
    this.mesh.position.set(50, 5, 0);
    this.mesh.rotation.y += 5.4999999;
    scene.add(this.mesh);
    this.mesh.name=nom;
  }
  initScore2(nom) {
    const scoreGeometry = new THREE.BoxBufferGeometry( 16, 16, 16, 1, 1, 1 );
    //const padMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
    //const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    textureScore =
        [
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/score2.jpg")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")})
        ];
    var scoreMaterial = new THREE.MeshFaceMaterial (textureScore);
    this.mesh = new THREE.Mesh(scoreGeometry, scoreMaterial);
    this.mesh.position.set(50, 5, 0);
    this.mesh.rotation.y += 5.4999999;
    scene.add(this.mesh);
    this.mesh.name=nom;
  }
  initScore3(nom) {
    const scoreGeometry = new THREE.BoxBufferGeometry( 16, 16, 16, 1, 1, 1 );
    //const padMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
    //const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    textureScore =
        [
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/score3.jpg")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")})
        ];
    var scoreMaterial = new THREE.MeshFaceMaterial (textureScore);
    this.mesh = new THREE.Mesh(scoreGeometry, scoreMaterial);
    this.mesh.position.set(50, 5, 0);
    this.mesh.rotation.y += 5.4999999;
    scene.add(this.mesh);
    this.mesh.name=nom;
  }
  initRegles(nom) {
    const scoreGeometry = new THREE.BoxBufferGeometry( 16, 16, 16, 1, 1, 1 );
    //const padMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
    //const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    textureScore =
        [
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/reglesPong.jpg")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")})
        ];
    var scoreMaterial = new THREE.MeshFaceMaterial (textureScore);
    this.mesh = new THREE.Mesh(scoreGeometry, scoreMaterial);
    this.mesh.position.set(98, 8, 20);
    this.mesh.rotation.y += 4.7;
    scene.add(this.mesh);
    this.mesh.name=nom;
  }
  initBonus(nom) {
    const scoreGeometry = new THREE.BoxBufferGeometry( 16, 16, 16, 1, 1, 1 );
    //const padMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
    //const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    textureScore =
        [
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/bonusPong.jpg")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")}),
          new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png")})
        ];
    var scoreMaterial = new THREE.MeshFaceMaterial (textureScore);
    this.mesh = new THREE.Mesh(scoreGeometry, scoreMaterial);
    this.mesh.position.set(128, 8, 20);
    this.mesh.rotation.y += 4.7;
    scene.add(this.mesh);
    this.mesh.name=nom;
  }

  positionScore(x,y,z){
    this.mesh.position.set(x, y, z);
  }
  playerScore(){
    //this.mesh.rotation.y += -1.4;
    if(player < 3) {
      player += 1;
      if (player == 1) {
        console.log("Player : 1");
        removeEntity(scorePlayer);
        scorePlayer.initScore1("ScoreJoueur");
        scorePlayer.positionScore(-58, 5, 16);
      }
      if (player == 2) {
        console.log("Player : 2");
        removeEntity(scorePlayer);
        scorePlayer.initScore2("ScoreJoueur");
        scorePlayer.positionScore(-58, 5, 16);
      }
      if (player == 3) {
        balle.pause();
        console.log("Player : 3");
        removeEntity(scorePlayer);
        scorePlayer.initScore3("ScoreJoueur");
        scorePlayer.positionScore(-58, 5, 16);
        textToDisplay.textContent = "Félicitations vous avez détruit le bateau adverse !";
        Afficher(); // affiche le texte
        for (i=0; i<=scene.children.length-1; i++) {
          if (scene.children[i].name == "BateauPirate") { // on enlève le bateau pirate
            removeModel(scene.children[i]);
          }
        }
        brokenShip.initShipWreck("BrokenShip"); // On ajoute le bateau cassé
        couler = true;
        //BonusBalle();
        level += 1;
        console.log("Bienvenue au niveau: "+level);
        setTimeout(Intermediaire, 5000); // Enlève le bateau cassé et le pirate du niveau correspondant
        setTimeout(Cacher, 5000);
        if (level == 2) {
          setTimeout(Niveau2, 5000); // Ajoute les éléments du niveau 2 dont le bateau et le pirates

        }
        if (level==3) {
          setTimeout(Niveau3, 5000); // Ajoute les éléments du niveau 2 dont le bateau et le pirates
        }
        if (level==4) {
          textToDisplay.textContent = "Vous avez coulé les 3 plus grand pirates des Océans. Vous êtes désormais le Pirate Légendaire.";
          Afficher(); // affiche le texte
        }
      }
    }
  }

  iaScore(){
    if(ia < 3) {
      ia += 1;
      if (ia == 1) {
        console.log("IA : 1");
        removeEntity(scoreIA);
        scoreIA.initScore1("ScoreIA");
        scoreIA.positionScore(-50,5,0);
      }
      if (ia == 2) {
        console.log("IA : 2");
        removeEntity(scoreIA);
        scoreIA.initScore2("ScoreIA");
        scoreIA.positionScore(-50,5,0);
      }
      if (ia == 3) {
        console.log("IA : 3");
        removeEntity(scoreIA);
        scoreIA.initScore3("ScoreIA");
        scoreIA.positionScore(-50,5,0);
        textToDisplay.textContent = "Dommage, vous avez coulé. Pour recommencer : Appuyez sur F5";
        Afficher(); // affiche le texte
        //console.log("Vous avez perdu, voulez-vous recommencer?");
        //perdu=true;
      }
    }
  }
}

class Requin {
  initRequin(nom){

    const requinGeometry = new THREE.CircleBufferGeometry( 10, 3, 3 );
    //const padMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
    //const wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    //const texturePad = new THREE.TextureLoader().load("https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/caisse.png");
    //const padMaterial = new THREE.MeshBasicMaterial ({map : texturePad});
    const requinMaterial =  new THREE.MeshPhongMaterial( {color: 0x737373} );
    this.mesh = new THREE.Mesh(requinGeometry, requinMaterial);
    this.mesh.position.set(500, -1, -200);
    scene.add(this.mesh);
    this.mesh.name=nom;
    //this.mesh.rotation.z=5;
  }
  mouvementRequin(){
    //this.mesh.translateZ(-0.001);
    //this.mesh.translateX(-0.5);
    if(this.mesh.position.x > -500){
      this.mesh.translateX(-0.5); // Le requin est en mouvement
    }
    else if (this.mesh.position.x = -500){
      setTimeout(this.mesh.position.set(500, -1, -200),15000);
    }
  }
}

class Corona {
  initCorona(nom) {
    const murGeometry = new THREE.BoxBufferGeometry( tailleTerrain*0.695, 20, 0, 1, 1, 1 );
    const murMaterial =  new THREE.MeshStandardMaterial({transparent:true, opacity:0.5, color: 0xE8D560});
    this.mesh = new THREE.Mesh(murGeometry, murMaterial);
    this.mesh.position.set(0, -10, -8);
    scene.add(this.mesh);
    this.mesh.name=nom;
  }
  positionCorona(x,y,z){
    this.mesh.position.set(x, y, z);
  }
}

class Models {
  initPirateShip(nom) {
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
      objLoader.load('shipDark.obj', function(bateauPiratetest) {
        bateauPiratetest.position.set(4, -2, -60);
        bateauPiratetest.rotation.y += 1.5;
        scene.add(bateauPiratetest);
        bateauPiratetest.name=nom;
      });
    });
  }
  initCaptain(nom) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'pirateLvl3.mtl';
    mtlLoader.load(url , function(materialsCaptain){
      materialsCaptain.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsCaptain);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('pirateLvl3.obj', function(capitainePirate) {
        capitainePirate.position.set(1, 12, -50);
        capitainePirate.rotation.y += 3;
        scene.add(capitainePirate);
        capitainePirate.name=nom;
      });
    });
  }
  initPirate1(nom) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'pirateLvl1.mtl';
    mtlLoader.load(url , function(materialsCaptain){
      materialsCaptain.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsCaptain);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('pirateLvl1.obj', function(pirate1) {
        pirate1.position.set(1, 12, -50);
        pirate1.rotation.y += 3;
        scene.add(pirate1);
        pirate1.name=nom;
      });
    });
  }
  initPirate2(nom) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'pirateLvl2.mtl';
    mtlLoader.load(url , function(materialsCaptain){
      materialsCaptain.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsCaptain);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('pirateLvl2.obj', function(pirate2) {
        pirate2.position.set(1, 12, -50);
        pirate2.rotation.y += 3;
        scene.add(pirate2);
        pirate2.name=nom;
      });
    });
  }

  initTower(nom) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'tower.mtl';
    mtlLoader.load(url , function(materialsTower){
      materialsTower.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsTower);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('tower.obj', function(tour) {
        tour.position.set(50, 0, -20);
        tour.rotation.y += 3.5;
        scene.add(tour);
        tour.name=nom;
      });
    });
  }
  initPlant(nom) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'plant.mtl';
    mtlLoader.load(url , function(materialsPlant){
      materialsPlant.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsPlant);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('plant.obj', function(plante) {
        plante.position.set(50, 0, 30);
        plante.rotation.y += 3.5;
        scene.add(plante);
        plante.name=nom;
      });
    });
  }
  initChest(nom) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'chest.mtl';
    mtlLoader.load(url , function(materialsChest){
      materialsChest.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsChest);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('chest.obj', function(coffre) {
        coffre.position.set(50, 0, 20);
        //coffre.position.set(0, 0, 6); // Test
        coffre.rotation.y += 2;
        scene.add(coffre);
        coffre.name=nom;
      });
    });
  }
  initShovel(nom) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'shovel.mtl';
    mtlLoader.load(url , function(materialsShovel){
      materialsShovel.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsShovel);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('shovel.obj', function(pelle) {
        pelle.position.set(50, 0, 25);
        pelle.rotation.x += -2;
        scene.add(pelle);
        pelle.name=nom;
      });
    });
  }
  initPalmShort(nom) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'palmShort.mtl';
    mtlLoader.load(url , function(materialsPalmShort){
      materialsPalmShort.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsPalmShort);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('palmShort.obj', function(palmier) {
        palmier.position.set(75, 0, -10);
        //objectT.rotation.x += -2;
        scene.add(palmier);
        palmier.name=nom;
      });
    });
  }
  initShipLight(nom) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'shipLight.mtl';
    mtlLoader.load(url , function(materialsShipLight){
      materialsShipLight.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsShipLight);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('shipLight.obj', function(bateauJoueur) {
        bateauJoueur.position.set(4, -2, 72.2);
        bateauJoueur.rotation.y -= 1.6;
        scene.add(bateauJoueur);
        bateauJoueur.name=nom;
      });
    });
  }
  initShipWreck(nom) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'shipWreck.mtl';
    mtlLoader.load(url , function(materialsShipLight){
      materialsShipLight.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsShipLight);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('shipWreck.obj', function(bateauBroken) {
        bateauBroken.position.set(4, -2, -60);
        bateauBroken.rotation.y += 1.5;
        scene.add(bateauBroken);
        bateauBroken.name=nom;
      });
    });
  }
  initCannon(nom, x, y, z, rotate) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'cannon.mtl';
    mtlLoader.load(url , function(materialsShipLight){
      materialsShipLight.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsShipLight);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('cannon.obj', function(cannon) {
        cannon.position.set(x, y, z);
        cannon.scale.set(1.4, 1.4, 1.4);
        cannon.rotation.y += rotate;
        scene.add(cannon);
        cannon.name=nom;
      });
    });
  }
  initCannonBall(nom, x, y, z,) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'cannonBall.mtl';
    mtlLoader.load(url , function(materialsShipLight){
      materialsShipLight.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsShipLight);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('cannonBall.obj', function(cannonBall) {
        cannonBall.position.set(x, y, z);
        cannonBall.scale.set(2.5,2.5,2.5);
        //cannon.rotation.y += 1.5;
        scene.add(cannonBall);
        cannonBall.name=nom;
      });
    });
  }
  initBottle(nom, x, y, z) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'bottle.mtl';
    mtlLoader.load(url , function(materialsShipLight){
      materialsShipLight.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsShipLight);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('bottle.obj', function(bottle) {
        bottle.position.set(x, y, z);
        bottle.scale.set(1.3,1.3,1.3);
        scene.add(bottle);
        bottle.name=nom;
      });
    });
  }
  initSword(nom, x, y, z) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'sword_scimitar.mtl';
    mtlLoader.load(url , function(materialsShipLight){
      materialsShipLight.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsShipLight);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('sword_scimitar.obj', function(sword) {
        sword.position.set(x, y, z);
        sword.scale.set(1.1,1.1,1.1);
        sword.rotation.y = 1.5;
        scene.add(sword);
        sword.name=nom;
      });
    });
  }
  initBomb(nom, x, y, z) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'bomb.mtl';
    mtlLoader.load(url , function(materialsShipLight){
      materialsShipLight.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsShipLight);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('bomb.obj', function(bomb) {
        bomb.position.set(x, y, z);
        bomb.scale.set(10,10,10);
        //bomb.rotation.y = 1.5;
        scene.add(bomb);
        bomb.name=nom;
      });
    });
  }
  initBarrel(nom, x, y, z) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'fishBones.mtl';
    mtlLoader.load(url , function(materialsShipLight){
      materialsShipLight.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsShipLight);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('fishBones.obj', function(barrel) {
        barrel.position.set(x, y, z);
        barrel.scale.set(7,7,7);
        barrel.rotation.y = 1;
        barrel.rotation.x = 1.45;
        scene.add(barrel);
        barrel.name=nom;
      });
    });
  }
  initChloroquine(nom, x, y, z) {
    //Ajout des textures de l'objet
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
    var url = 'chloroquine.mtl';
    mtlLoader.load(url , function(materialsShipLight){
      materialsShipLight.preload();
      // Ajout de l'objet
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materialsShipLight);
      objLoader.setPath('https://raw.githubusercontent.com/Thomcarena/ProjetPong_SIA/Projet_DASILVA_Thomas/src/medias/images/');
      objLoader.load('chloroquine.obj', function(chloroquine) {
        chloroquine.position.set(x, y, z);
        chloroquine.scale.set(0.9,0.9,0.9);
        scene.add(chloroquine);
        chloroquine.name=nom;
      });
    });
  }
}

class Skybox {
  initSkyBox() {
    const skyGeometry = new THREE.BoxGeometry(1000, 1000, 1000)
    //const skyGeometry = new THREE.BoxGeometry(500, 500, 500)
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
var balle = new Balle();
var terrain = new Terrain();
var stade = new Stade();
var shieldJoueur = new Bouclier();
var shieldAdverse = new Bouclier();
var invicibleShield = new Bouclier();
var ile = new Ile();
var requin = new Requin();
var padAdverse = new Pad();
var padJoueur = new Pad();
var murDroite = new Mur();
var murGauche = new Mur();
var scoreIA = new Score();
var scorePlayer = new Score();
var ciel = new Skybox();
var corona = new Corona();
var bateauPirate = new Models();
var captain = new Models();
var pirate1 = new Models();
var pirate2 = new Models();
var tower = new Models();
var plant = new Models();
var chest = new Models();
var shovel = new Models();
var palmShort = new Models();
var shipLight = new Models();
var brokenShip = new Models();
var cannonDroite = new Models();
var cannonGauche = new Models();
var protection1 = new Protection();
var protection2 = new Protection();
var protection3 = new Protection();
var protection4 = new Protection();
var cannonBall = new Models();
var bottle = new Models();
var epee = new Models();
var bombe = new Models();
var pangolin = new Models();
var barile = new Models();
var chloroq = new Models();
var regles = new Score();
var bonus = new Score();



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

  camera2 = new THREE.PerspectiveCamera(10, w/h, 0.1, 1000);
  camera2.position.set(0, 0, 0);
  //camera2.lookAt(padJoueur.position);

  camera3 = new THREE.PerspectiveCamera(10, w/h, 0.1, 1000);
  camera3.position.set(115, 9, 200);
  //camera3.fov = 100;
  //camera3.rotation.x=3.14;

  //Controls
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
  //var light = new THREE.DirectionalLight( 0xdddddd, 0.8 );
  //var light = new THREE.DirectionalLight(0xb4e7f2, 0.8);
  var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
 // light.position.set( -80, -80, 80 );
  light.castShadow = true;
  //light = new THREE.AmbientLight( 0x444444 );
  scene.add(light);

  // AudioListener
  var listener = new THREE.AudioListener();
  camera.add( listener );
  var sound = new THREE.Audio( listener );
  var audioLoader = new THREE.AudioLoader();
  //audioLoader.load( 'https://github.com/Thomcarena/ProjetPong_SIA/blob/Projet_DASILVA_Thomas/src/medias/musiques/pirateCaraibes.mp3', function( buffer ) {
    audioLoader.load( 'src/medias/musiques/pirateCaraibes.mp3', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop( true );
    sound.setVolume( 0.5 );
    sound.name = "Caraibes";
    scene.add(sound);
  });

  var listener2 = new THREE.AudioListener();
  camera.add( listener2 );
  var sound2 = new THREE.Audio( listener2 );
  var audioLoader2 = new THREE.AudioLoader();
  //audioLoader.load( 'https://github.com/Thomcarena/ProjetPong_SIA/blob/Projet_DASILVA_Thomas/src/medias/musiques/pirateCaraibes.mp3', function( buffer ) {
  audioLoader2.load( 'src/medias/musiques/sonRebond.mp3', function( buffer2 ) {
    sound2.setBuffer( buffer2 );
    sound2.setLoop( false );
    sound2.setVolume( 0.5 );
    sound2.name = "Rebond";
    scene.add(sound2);
    rebondSon= scene.getObjectByName("Rebond");
  });


  // add Stats.js - https://github.com/mrdoob/stats.js
  stats = new Stats();
  stats.domElement.style.position	= 'absolute';
  stats.domElement.style.bottom	= '0px';
  document.body.appendChild( stats.domElement );

  // add some geometries

  balle.initBalle("Balle");
  balle.positionBalle(0,2.5,0);
  terrain.initTerrain("Terrain");
  stade.initStade("Stade");
  shieldJoueur.initShield("BouclierJoueur");
  shieldJoueur.positionShield(0,2.5,43.5);
  shieldAdverse.initShield("BouclierAdverse");
  shieldAdverse.positionShield(0,2.5,-43.5);
  invicibleShield.initInvincibleShield("BouclierInvincible");
  ile.initIle("Ile");
  ile.positionIle(88,0.5,30)
  requin.initRequin("Requin");
  murDroite.initMur("MurDroite");
  murDroite.positionMur(32,1,1);
  murGauche.initMur("MurGauche");
  murGauche.positionMur(-32,1,1);
  padAdverse.initPad("PadAdverse");
  padAdverse.positionPad(0,2.5,-40);
  padJoueur.initPad("PadJoueur");
  padJoueur.positionPad(0,2.5,40);
  scoreIA.initScore("ScoreIA");
  scoreIA.positionScore(-50,5,0);
  scorePlayer.initScore("ScoreJoueur");
  scorePlayer.positionScore(-58,5,16);
  regles.initRegles("Regles");
  bonus.initBonus("BonusRegles");
  corona.initCorona("Corona");
  ciel.initSkyBox();



  // add some models
  tower.initTower("Tour");
  plant.initPlant("Plante");
  chest.initChest("Coffre");
  shovel.initShovel("Pelle");
  palmShort.initPalmShort("Palmier");
  shipLight.initShipLight("BateauJoueur");
  bateauPirate.initPirateShip("BateauPirate");
  pirate1.initPirate1("Pirate1");
  //pangolin.initPangolin();


  //Levels
  if(level == 0){
    balle.pause();

  }
  if(level==1){
    document.body.appendChild(textToDisplay); // Affiche le texte sur la page
    //textToDisplay.textContent = "Bievenue Pirate ! Marquez 3 points pour détruire le bateau";
    //textToDisplay.textContent = "Venez à bout des 3 pirates pour obtenir le trésor légendaire !";
    textToDisplay.textContent = "~ NIVEAU 1 ~";
    Afficher();
    setTimeout(Cacher, 2500);

    balle.pause();

    setTimeout(Niveau1, 2500);
    //Activation des Jokers
    setTimeout(Joker, 5000);
  }
  if(level==2){
    bateauPirate.initShipLight("BateauPirate");
    pirate2.initPirate2("Pirate2");
  }
  if(level==3){
    bateauPirate.initPirateShip("BateauPirate");
    captain.initCaptain("Captain");
  }



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

function Intermediaire() {

  console.log(textToDisplay);
  for (i=0; i<=scene.children.length-1; i++) {
    if (scene.children[i].name == "BrokenShip") { // On enlève le bateau cassé
      console.log(scene.children[i].name);
      removeModel(scene.children[i]);
      couler = false;
    }
    if (scene.children[i].name == "Pirate1") { // On enlève le pirate du niveau 1 pour laisser le place à celui du niveau 2
      console.log(scene.children[i].name);
      removeModel(scene.children[i]);
    }
    if (scene.children[i].name == "Pirate2") { // On enlève le pirate du niveau 2 pour laisser le place à celui du niveau 3
      console.log(scene.children[i].name);
      removeModel(scene.children[i]);
    }
    if (scene.children[i].name == "Captain") { // On enlève le pirate du niveau 3 pour laisser le place à l'écran de victoire
      console.log(scene.children[i].name);
      removeModel(scene.children[i]);
    }
  }
}

function Niveau1 () {

  for (i=0; i<=scene.children.length-1; i++) {
    if (scene.children[i].name == "Caraibes") { // On active la musique de pirate des caraïbes
      scene.children[i].play();
    }
  }
    document.body.appendChild(textToDisplay); // Affiche le texte sur la page
    //textToDisplay.textContent = "Bievenue Pirate ! Marquez 3 points pour détruire le bateau";
    //textToDisplay.textContent = "Venez à bout des 3 pirates pour obtenir le trésor légendaire !";
    textToDisplay.textContent = "~ NIVEAU 1 ~";
    Afficher();
    setTimeout(Cacher, 2500);

    balle.pause();

    //setTimeout(Niveau1, 2500);
    //Activation des Jokers
    setTimeout(balleGo,2500);
    setTimeout(Joker, 5000);

}

function Niveau2() {
  textToDisplay.textContent = "~ NIVEAU 2 ~";
  Afficher(); // affiche le texte
  setTimeout(Cacher, 2500);
  setTimeout(balleGo,2500);

  removeEntity(scorePlayer); // On réinitialise les scores
  removeEntity(scoreIA);
  scorePlayer.initScore("ScoreJoueur");
  scorePlayer.positionScore(-58, 5, 16);
  scoreIA.initScore("ScoreIA");
  scoreIA.positionScore(-50,5,0);

  balle.positionBalle(0, 2.5, 0);
  ballSpeed = 18;
  bateauPirate.initPirateShip("BateauPirate");
  pirate2.initPirate2("Pirate2");
  player = 0;
  ia = 0;
  cannonDroite.initCannon("Cannon", 25, -0.5, 0, 1.55); // Ajoute des canons à droite et à gauche du terrain
  cannonGauche.initCannon("Cannon", -25, -0.5, 0, -1.55);
  //Protège du bug de collision avec les canons
  protection1.initProtection("Protection1");
  protection1.positionProtection(22, 2.5, -3);
  protection2.initProtection("Protection2");
  protection2.positionProtection(-22, 2.5, -3);
  protection3.initProtection("Protection3");
  protection3.positionProtection(-22, 2.5, 3);
  protection4.initProtection("Protection4");
  protection4.positionProtection(22, 2.5, 3);
  cannonBall.initCannonBall("CannonBall", -19, 3.3, -0.3);
  tir=true;
}

function Niveau3() {
  textToDisplay.textContent = "~ NIVEAU 3 ~";
  Afficher(); // affiche le texte
  setTimeout(Cacher, 2500);
  setTimeout(balleGo,2500);

  removeEntity(scorePlayer); // On réinitialise les scores
  removeEntity(scoreIA);
  scorePlayer.initScore("ScoreJoueur");
  scorePlayer.positionScore(-58, 5, 16);
  scoreIA.initScore("ScoreIA");
  scoreIA.positionScore(-50,5,0);

  balle.positionBalle(0, 2.5, 0);
  ballSpeed = 20;
  bateauPirate.initPirateShip("BateauPirate");
  captain.initCaptain("Captain");
  player = 0;
  ia = 0;
}

function TirCanon() {
  tir = true;
  compteurTir +=1;
}

function Afficher() {
    textToDisplay.style.display = 'block';
    console.log(textToDisplay.textContent);
}

function Cacher() {
  textToDisplay.style.display='none';
}

function balleGo() {
  balle.go();
}

function removeEntity(object) {
  var selectedObject = scene.getObjectByName(object.name);
  scene.remove( selectedObject );
}

function moveEntity(object, x, y, z) {
  var selectedObject = scene.getObjectByName(object.name);
  object.position.set(x,y,z);
}

function removeModel(id) {
  var i;
  for ( i = id.children.length - 1; i >= 0 ; i -- ) {
      scene.remove(id);
  }
}

function moveModel(id, x, y, z) {
  var i;
  for ( i = id.children.length - 1; i >= 0 ; i -- ) {
    id.position.set(x,y,z);
  }
}

function Joker(){
  var a = getRandomInt(4);
  var xRandom = getRandomIntInclusive(-20,20);
  var zRandom = getRandomIntInclusive(-35,35);
  if(a==0 && rhum!=true){
    console.log(a)
    bottleX=xRandom;
    bottleZ=zRandom;
    bottle.initBottle("Bottle", bottleX,2.5,bottleZ);
    rhum=true;
    setTimeout(function(){
      for (i=0; i<=scene.children.length-1; i++) {
        if (scene.children[i].name == "Bottle") { // on enlève le rhum au bout de 10 sec sans qu'il soit utilisé
          removeModel(scene.children[i]);
          rhum=false;
          console.log("disparition");
        }
      }
    }, 10000);
  }
  if(a==1 && sword!=true){
    console.log(a)
    swordX=xRandom;
    swordZ=zRandom;
    epee.initSword("Sword", swordX,2.5,swordZ);
    sword=true;
    setTimeout(function(){
      for (i=0; i<=scene.children.length-1; i++) {
        if (scene.children[i].name == "Sword") { // on enlève le rhum au bout de 10 sec sans qu'il soit utilisé
          removeModel(scene.children[i]);
          sword=false;
          console.log("disparition");
        }
      }
    }, 10000);
  }
  if(a==2 && bomb!=true){
    console.log(a)
    bombX=xRandom;
    bombZ=zRandom;
    bombe.initBomb("Bombe", bombX,2.5,bombZ);
    bomb=true;
    setTimeout(function(){
      for (i=0; i<=scene.children.length-1; i++) {
        if (scene.children[i].name == "Bombe") { // on enlève le rhum au bout de 10 sec sans qu'il soit utilisé
          removeModel(scene.children[i]);
          bomb=false;
          console.log("disparition");
        }
      }
    }, 10000);
  }
  if(a==3 && barrel!=true){
    console.log(a)
    barrelX=xRandom;
    if(chloro){
      barrelX=-10;
      barrelZ=20;
    }
    else{
      barrelX=xRandom;
      barrelZ=getRandomIntInclusive(20,35);
    }

    barile.initBarrel("Barrel", barrelX,2.5,barrelZ);
    barrel=true;
    setTimeout(function(){
      for (i=0; i<=scene.children.length-1; i++) {
        if (scene.children[i].name == "Barrel") { // on enlève le rhum au bout de 10 sec sans qu'il soit utilisé
          removeModel(scene.children[i]);
          barrel=false;
          console.log("disparition");
        }
      }
    }, 10000);
  }
  if(chloro){
    chloroZ=getRandomIntInclusive(5,25);
    chloroq.initChloroquine("Chloroquine", chloroX,1,chloroZ);
  }
  else{
    console.log(a);
  }
  setTimeout(Joker,5000);
}

function addJoker(){
  var a = getRandomInt(4);
  var xRandom = getRandomIntInclusive(-20,20);
  var zRandom = getRandomIntInclusive(-35,35);
  if(a==0 && rhum!=true){
    console.log(a)
    bottleX=xRandom;
    bottleZ=zRandom;
    bottle.initBottle("Bottle", bottleX,2.5,bottleZ);
    rhum=true;
    setTimeout(function(){
      for (i=0; i<=scene.children.length-1; i++) {
        if (scene.children[i].name == "Bottle") { // on enlève le rhum au bout de 10 sec sans qu'il soit utilisé
          removeModel(scene.children[i]);
          rhum=false;
          console.log("disparition");
        }
      }
    }, 10000);
  }
  if(a==1 && sword!=true){
    console.log(a)
    swordX=xRandom;
    swordZ=zRandom;
    epee.initSword("Sword", swordX,2.5,swordZ);
    sword=true;
    setTimeout(function(){
      for (i=0; i<=scene.children.length-1; i++) {
        if (scene.children[i].name == "Sword") { // on enlève le rhum au bout de 10 sec sans qu'il soit utilisé
          removeModel(scene.children[i]);
          sword=false;
          console.log("disparition");
        }
      }
    }, 10000);
  }
  if(a==2 && bomb!=true){
    console.log(a)
    bombX=xRandom;
    bombZ=zRandom;
    bombe.initBomb("Bombe", bombX,2.5,bombZ);
    bomb=true;
    setTimeout(function(){
      for (i=0; i<=scene.children.length-1; i++) {
        if (scene.children[i].name == "Bombe") { // on enlève le rhum au bout de 10 sec sans qu'il soit utilisé
          removeModel(scene.children[i]);
          bomb=false;
          console.log("disparition");
        }
      }
    }, 10000);
  }
  if(a==3 && barrel!=true){
    console.log(a)
    barrelX=xRandom;
    if(chloro){
      barrelX=-10;
      barrelZ=20;
    }
    else{
      barrelX=xRandom;
      barrelZ=getRandomIntInclusive(20,35);
    }

    barile.initBarrel("Barrel", barrelX,2.5,barrelZ);
    barrel=true;
    setTimeout(function(){
      for (i=0; i<=scene.children.length-1; i++) {
        if (scene.children[i].name == "Barrel") { // on enlève le rhum au bout de 10 sec sans qu'il soit utilisé
          removeModel(scene.children[i]);
          barrel=false;
          console.log("disparition");
        }
      }
    }, 10000);
  }
  if(chloro){
    chloroZ=getRandomIntInclusive(5,25);
    chloroq.initChloroquine("Chloroquine", chloroX,1,chloroZ);
  }
  else{
    console.log(a);
  }
  unJoker = false;
}

function animationJokers() {
  //Animation Rhum
  if(rhum) {
    //console.log(hautBottle);
    for (i = 0; i <= scene.children.length - 1; i++) {
      if (scene.children[i].name == "Bottle") { // On anime la bouteille
        //console.log(scene.children[i].position.y);
        moveModel(scene.children[i], bottleX, bottleY, bottleZ);
        if (hautBottle) { // La bouteille est en haut et doit descendre
          bottleX += 0;
          bottleY -= 0.07;
          bottleZ += 0;
          if (scene.children[i].position.y < 0.5)
            hautBottle = false;
        } else { // La bouteille est en bas et doit monter
          bottleX += 0;
          bottleY += 0.07;
          bottleZ += 0;
          if (scene.children[i].position.y > 2.5) {
            hautBottle = true;
          }
        }
      }
    }
  }
  //Animation Epée pirate
  if(sword) {
    //console.log(hautBottle);
    for (i = 0; i <= scene.children.length - 1; i++) {
      if (scene.children[i].name == "Sword") { // On anime l'épée
        //console.log(scene.children[i].position.y);
        moveModel(scene.children[i], swordX, swordY, swordZ);
        if (hautSword) { // L'épée est en haut et doit descendre
          swordX += 0;
          swordY -= 0.07;
          swordZ += 0;
          if (scene.children[i].position.y < 1.5)
            hautSword = false;
        } else { // L'épée est en haut et doit monter
          swordX += 0;
          swordY += 0.07;
          swordZ += 0;
          if (scene.children[i].position.y > 3.5) {
            hautSword = true;
          }
        }
      }
    }
  }
  if(bomb) {
    //console.log(hautBottle);
    for (i = 0; i <= scene.children.length - 1; i++) {
      if (scene.children[i].name == "Bombe") { // On anime l'épée
        //console.log(scene.children[i].position.y);
        moveModel(scene.children[i], bombX, bombY, bombZ);
        if (hautBomb) { // L'épée est en haut et doit descendre
          bombX += 0;
          bombY -= 0.07;
          bombZ += 0;
          if (scene.children[i].position.y < 1.5)
            hautBomb = false;
        } else { // L'épée est en haut et doit monter
          bombX += 0;
          bombY += 0.07;
          bombZ += 0;
          if (scene.children[i].position.y > 3.5) {
            hautBomb = true;
          }
        }
      }
    }
  }
  if(barrel) {
    //console.log(hautBottle);
    for (i = 0; i <= scene.children.length - 1; i++) {
      if (scene.children[i].name == "Barrel") { // On anime l'épée
        //console.log(scene.children[i].position.y);
        moveModel(scene.children[i], barrelX, barrelY, barrelZ);
        if (hautBarrel) { // L'épée est en haut et doit descendre
          barrelX += 0;
          barrelY -= 0.07;
          barrelZ += 0;
          if (scene.children[i].position.y < 1.7)
            hautBarrel = false;
        } else { // L'épée est en haut et doit monter
          barrelX += 0;
          barrelY += 0.07;
          barrelZ += 0;
          if (scene.children[i].position.y > 3.5) {
            hautBarrel = true;
          }
        }
      }
    }
  }
  if(chloro) {
    //console.log(hautBottle);
    for (i = 0; i <= scene.children.length - 1; i++) {
      if (scene.children[i].name == "Chloroquine") { // On anime l'épée
        //console.log(scene.children[i].position.y);
        moveModel(scene.children[i], chloroX, chloroY, chloroZ);
        if (hautChloro) { // L'épée est en haut et doit descendre
          chloroX += 0;
          chloroY -= 0.07;
          chloroZ += 0;
          if (scene.children[i].position.y < 0.5)
            hautChloro = false;
        } else { // L'épée est en haut et doit monter
          chloroX += 0;
          chloroY += 0.07;
          chloroZ += 0;
          if (scene.children[i].position.y > 2.5) {
            hautChloro = true;
          }
        }
      }
    }
  }
}

function Rhum() { // Joker Bouteille de Rhum
  for (i=0; i<=scene.children.length-1; i++) {
    if (scene.children[i].name == "Bottle") { // on enlève le bateau pirate
      removeModel(scene.children[i]);
    }
  }
  if(joueur){
    shieldJoueur.positionShield(0,2.5,43.5)
  }
  else{
    shieldAdverse.positionShield(0,2.5,-43.5)
  }
}

function Epee(){ // Joker épée pirate
  for (i=0; i<=scene.children.length-1; i++) {
    if (scene.children[i].name == "Sword") { // on enlève le joker Epée
      removeModel(scene.children[i]);
    }
  }
  if(joueur){

    shieldAdverse.positionShield(0,-2.5,-43.5);
  }
  else{
    shieldJoueur.positionShield(0, -2.5, 43.5);
  }
}

function Bombe(){ // Joker épée pirate
  for (i=0; i<=scene.children.length-1; i++) {
    if (scene.children[i].name == "Bombe") { // on enlève le joker Bombe
      removeModel(scene.children[i]);
    }
  }
  if(joueur){

    padAdverse.padBomb(0.5, 0.5, 0.5);
    setTimeout(function(){padAdverse.padBomb(1, 1, 1);}, 5000);
  }
  else{
    padJoueur.padBomb(0.5, 0.5, 0.5);
    setTimeout(function(){padJoueur.padBomb(1, 1, 1);}, 5000);
  }
}

function Barile(){ // Joker épée pirate
  for (i=0; i<=scene.children.length-1; i++) {
    if (scene.children[i].name == "Barrel") { // on enlève le joker Barile
      removeModel(scene.children[i]);
    }
  }
  chloro = true;
  corona.positionCorona(0,0,-5);
}

function Chloroquine(){
  chloro = false;
  for (i=0; i<=scene.children.length-1; i++) {
    if (scene.children[i].name == "Chloroquine") { // on enlève le joker Chloroquine
      removeModel(scene.children[i]);
    }
  }
  corona.positionCorona(0,-10,0);
  console.log("Le confinement est terminé");
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
  if(keyboard.pressed("1") || keyboard.pressed("&")){
      changement = true;
  }
  if(keyboard.pressed("0") || keyboard.pressed("à")){
    changement=false;
    hPress = false;
    balle.go();
  }

  if(changement) {
    //camera2.fov = 100;
    for (i=0; i<=scene.children.length-1; i++) {
      if (scene.children[i].name == "PadJoueur") { // On simule le bâteau qui coule
        //camera2.position.set(scene.children[i].position.x, scene.children[i].position.y, scene.children[i].position.z - 0.1);
        camera2.position.set(scene.children[i].position.x, scene.children[i].position.y, scene.children[i].position.z - 0.1);
      }
    }
    renderer.render(scene, camera2);
  }
  else {
    if(level == 0 || hPress){
      renderer.render(scene, camera3);
    }
    else{
      renderer.render(scene, camera);  // rendu de la scène
    }
  }

    loop.last = loop.now;

  requestAnimationFrame(gameLoop); // relance la boucle du jeu

  controls.update(); // Pour laisser l'utilisateur bouger la scène à la souris
  stats.update();
}

function update(step) {
  //const angleIncr = Math.PI * 2 * step / 5 ; // une rotation complète en 5 secondes
  padPosition = padJoueur.positionX(); // Récupère à l'instant t la position x du pad



  if (ballePause){
    //la balle ne bouge plus.
  }
  else {
    balle.mouvement(padPosition); // La balle entre en mouvement et active les collisions
  }

  ballePosition = balle.positionX(); // Récupère à l'instant t la position x de la balle
  padAdverse.mouvementIA(ballePosition); // L'IA suit la balle

  requin.mouvementRequin();

  //Animation entre les niveaux
  if(couler) {
    for (i=0; i<=scene.children.length-1; i++) {
      if (scene.children[i].name == "BrokenShip") { // On simule le bâteau qui coule
        moveModel(scene.children[i], coulerX, coulerY, coulerZ);
        coulerX += 0;
        coulerY -= 0.17;
        coulerZ += 0;
      }
      if (scene.children[i].name == "Pirate1") { // On enlève le bateau cassé
        moveModel(scene.children[i], pirateX, pirateY, pirateZ);
        pirateX += 0;
        pirateY -= 0.17;
        pirateZ += 0;
      }
      if (scene.children[i].name == "Pirate2") { // On enlève le bateau cassé
        moveModel(scene.children[i], pirateX, pirateY, pirateZ);
        pirateX += 0;
        pirateY -= 0.17;
        pirateZ += 0;
      }
      if (scene.children[i].name == "Captain") { // On enlève le bateau cassé
        moveModel(scene.children[i], pirateX, pirateY, pirateZ);
        pirateX += 0;
        pirateY -= 0.17;
        pirateZ += 0;
      }
    }
  }
  else {
    coulerX = 4;
    coulerY = -2;
    coulerZ = -60;
    pirateX = 1;
    pirateY = 12;
    pirateZ = -50;
  }

  if (tir) {
    for (i = 0; i <= scene.children.length - 1; i++) {
      if (scene.children[i].name == "CannonBall") { // On enlève le bateau cassé
        moveModel(scene.children[i], tirX, tirY, tirZ);
        if(compteurTir%2 != 0) { // Le boulet est dans le cannon de droite
          tirX -= 0.2;
          tirY += 0;
          tirZ += 0;
          if(scene.children[i].position.x < -25 ) {
            tir = false;
            setTimeout(TirCanon, 5000);
          }
        }
        else{ // Le boulet est dans le cannon de gauche
          tirX += 0.2;
          tirY += 0;
          tirZ += 0;
          if (scene.children[i].position.x > 25){
            tir = false;
            setTimeout(TirCanon, 5000);
          }
        }
      }
    }
  }
//Animations des Jokers
  animationJokers();

  if(keyboard.pressed("Q") || keyboard.pressed("left")){
    padJoueur.mouvementLeft();
  }
  if(keyboard.pressed("D") || keyboard.pressed("right")){
    padJoueur.mouvementRight();
  }
  if(keyboard.pressed("N")){
    scorePlayer.playerScore();
  }
  if(keyboard.pressed("K")){
    shieldAdverse.positionShield(0,-10,-43.5)
  }
  if(keyboard.pressed("I")){
    invicibleShield.positionShield(0,2.5,43.5);
    shieldJoueur.positionShield(0,-10,43.5)
  }
  if(keyboard.pressed("J")){
    addJoker();
    unJoker = true;
  }
  if(keyboard.pressed("space")){
    if(level == 0){
      Niveau1();
      level = 1;
      //console.log(commencer);
      //commencer = false;
    }
  }
  if(keyboard.pressed("H")){
    hPress = true;
    balle.pause();
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

function onDocumentKeyDown(){ // Une fois qu'on relâche le bouton permettant d'aller à droite ou à gauche, on réinitialise la vitesse du pad
  padJoueur.resetX();
  padJoueur.resetNX();
}

function fullScreen(){
  /* View in fullscreen */
  if(keyboard.pressed("F")) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }
  if(print) {
    if (keyboard.pressed("P")) {
      print = false;
      var screen = window.open('', '');
      screen.document.title = "Screenshot";
      var img = new Image();
      renderer.render(scene, camera);
      img.src = renderer.domElement.toDataURL();
      screen.document.body.appendChild(img);
    }
  }
}

/*function screenShot() {
  if(keyboard.pressed("P")) {
    var screen = window.open('', '');
    screen.document.title = "Screenshot";
    var img = new Image();
    renderer.render(scene, camera);
    img.src = renderer.domElement.toDataURL();
    screen.document.body.appendChild(img);
  }
}*/

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

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
