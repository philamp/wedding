import {
  AnimationMixer,
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  VectorKeyframeTrack,
  AnimationClip,
  Quaternion,
  QuaternionKeyframeTrack,
  PlaneGeometry, DoubleSide,
  MeshBasicMaterial,
  Mesh,
  MeshLambertMaterial,
  ImageUtils,
  RepeatWrapping
} from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js";
import { CSS3DRenderer, CSS3DObject } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS3DRenderer.js";

// load a gltf and return it in a promise
// TODO: treat error cases...?
function myGLTFLoader(loader,url) {
    return new Promise((res,rej)=>loader.load(url,res,null,rej));
}

// these need to be accessed inside more than one function so we'll declare them first
let cssAnimState = {};
let glAnimState = {};

/*
function update() {
  const delta = clock.getDelta();

  mixers.forEach((mixer) => {
    mixer.update(delta);
  });
  controls.update(delta);
  
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}
*/

export default async function init(containerID) {
  const container = document.querySelector(containerID);

  // set the figure placeholder to good dimension
  const formtabs = document.getElementById("formtabs");
  const formtabsRect = formtabs.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const wInnerWidth = window.innerWidth;
  const wInnerHeight = window.innerHeight;

  
  //console.log(formtabsRect);
  //console.log(containerRect);
  //console.log(wInnerWidth);
  //console.log(wInnerHeight);

  container.style.height = (wInnerHeight - containerRect.y) + "px";
  container.style.width = (wInnerWidth - containerRect.x) + "px";

  
  //createCamera();
  //createControls();
  //createLights();
  //loadModels();
  //createRenderer();

  //CSS3D

  var content = '<div id="csssceneglobal" style="position: relative; width: 300px; height: 600px; overflow:hidden;">' +
  '<img id="rabat" src="/dist/rabat.png" style="width: 100%; height: 300px; position: absolute; bottom: 300px; transform-origin: bottom">' +
  '<img id="derriere" src="/dist/derriere.png" style="width: 100%; height: 300px; position: absolute; bottom: 0px">' +
  '<div id="formtabscontainer" style="width: 100%; height: 300px; position: absolute; top: 300px"></div>' +
  '<img id="devant" src="/dist/devant.png" style="width: 100%; height: 300px; position: absolute; bottom: 0px">' +
'</div>';

var wrapper = document.createElement('div');
wrapper.innerHTML = content;
var div = wrapper.firstChild;

var scenewidth = formtabsRect.width;

div.style.width=formtabsRect.width+"px";
//div.style.height=formtabsRect.height+(230*scenewidth/577)+"px";
div.style.height=formtabsRect.height+"px";

div.querySelector("#rabat").style.width = formtabsRect.width+"px";
div.querySelector("#derriere").style.width = formtabsRect.width+"px";
div.querySelector("#formtabscontainer").style.width = formtabsRect.width+"px";
div.querySelector("#devant").style.width = formtabsRect.width+"px";

div.querySelector("#rabat").style.height = (230*scenewidth/577)+"px";
div.querySelector("#derriere").style.height = (369*scenewidth/577)+"px";
div.querySelector("#formtabscontainer").style.height = formtabsRect.height+"px";
div.querySelector("#devant").style.height = (369*scenewidth/577)+"px";

div.querySelector("#rabat").style.bottom = (369*scenewidth/577)+"px";
div.querySelector("#derriere").style.bottom = "0px";
div.querySelector("#formtabscontainer").style.top = (230*scenewidth/577)+"px";
div.querySelector("#devant").style.bottom = "0px";




//div.style.background = new Color(Math.random() * 0xffffff).getStyle();

var divtabs = document.getElementById("formtabs");

div.querySelector("#formtabscontainer").appendChild(divtabs);

var cssobject = new CSS3DObject(div);

//console.log("test",scenewidth,formtabs.clientWidth,divtabs.clientWidth);
cssobject.position.set(-(container.clientWidth - scenewidth)/2 , (container.clientHeight - formtabsRect.height)/2 - formtabsRect.y + containerRect.y ,0);

const cssscene = new Scene();
//cssscene.background = new Color(0xcccccc);
cssscene.add(cssobject);

  const cssrenderer = new CSS3DRenderer();
  cssrenderer.setSize(container.clientWidth, container.clientHeight);
  cssrenderer.domElement.style.position = 'absolute';
  container.appendChild(cssrenderer.domElement);
  

  const csscamera = new PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    1,
    10000
  );
  csscamera.position.x = 0;
  csscamera.position.y = 0;
  csscamera.position.z = (Math.sqrt(0.75) * container.clientHeight);
  csscamera.lookAt(new Vector3(0,0,0));

  cssrenderer.render(cssscene, csscamera);
  cssAnimState.clock = new Clock();
  cssAnimState.renderer = cssrenderer;
  cssAnimState.cssobj = cssobject;
  cssAnimState.scenewidth = scenewidth;
  cssAnimState.obj = document.getElementById("csssceneglobal");  
  cssAnimState.rabat = document.getElementById("rabat");
  cssAnimState.devant = document.getElementById("devant");
  cssAnimState.derriere = document.getElementById("derriere");
  cssAnimState.envVisible = false;
  cssAnimState.envRabatZ = false;
  cssAnimState.rabat.style.display='none';
  cssAnimState.devant.style.display='none';
  cssAnimState.derriere.style.display='none';
  cssAnimState.initH = formtabsRect.height;
  cssAnimState.endH = (230+369)*scenewidth/577;
  cssAnimState.midH = cssAnimState.initH+cssAnimState.endH;

    
  const positionsKF = new VectorKeyframeTrack( '.position', [ 0, 5, 12 ], 
      [ -(container.clientWidth - scenewidth)/2 , 
	  (container.clientHeight - formtabsRect.height)/2 - formtabsRect.y + containerRect.y ,
	  0, 
	  0, 0, -Math.sqrt(0.75) * container.clientHeight,
	  0, 0, -Math.sqrt(0.75) * container.clientHeight] );

  const xAxis = new Vector3( 1, 0, 0 );
  const yAxis = new Vector3( 0, 1, 0 );
  const q0 = new Quaternion().setFromAxisAngle( xAxis, 0 );
  const q1 = new Quaternion().setFromAxisAngle( xAxis, Math.PI/3 );
  const q3 = new Quaternion().setFromAxisAngle( yAxis, -Math.PI/2 );
  const quaternionsKF = new QuaternionKeyframeTrack( '.quaternion', 
      [ 0, 3, 6, 10, 12], 
      [ q0.x, q0.y, q0.z, q0.w, 
	q1.x, q1.y, q1.z, q1.w,
	q0.x, q0.y, q0.z, q0.w,
	q0.x, q0.y, q0.z, q0.w,
	q3.x, q3.y, q3.z, q3.w ] );
  const clip = new AnimationClip( 'Action', 12, [ positionsKF, quaternionsKF ] );
  const mixer = new AnimationMixer( cssobject );
  const clipAction = mixer.clipAction( clip );
  cssAnimState.mixer = mixer;
  cssAnimState.camera = csscamera;
  cssAnimState.scene = cssscene;
  clipAction.play();

  //cssrenderer.setAnimationLoop(updateCSSScene);
  //cssAnimState.reqId = window.requestAnimationFrame(updateCSSScene);  
  window.cssAnimState = cssAnimState;
  window.updateCSSScene = updateCSSScene;
  cssAnimState.clock.start();
  cssAnimState.intvId = setInterval(updateCSSScene,50);

  const GLrenderer = new WebGLRenderer({
    antialias: true, alpha: true
  });


  const GLscene = new Scene();
  const geometry = new PlaneGeometry( scenewidth, scenewidth*369/577 );
  const texture = ImageUtils.loadTexture( "/dist/frontletter.png" );
  // assuming you want the texture to repeat in both directions:
  //texture.wrapS = RepeatWrapping; 
  //texture.wrapT = RepeatWrapping;
  //how many times to repeat in each direction; the default is (1,1),
  //which is probably why your example wasn't working
  //texture.repeat.set( 4, 4 ); 
  const material = new MeshBasicMaterial({ map : texture, color: 0xeeeeee, side: DoubleSide });
  //const material = new MeshBasicMaterial( {color: 0xeeeeee, side: DoubleSide} );
  const plane = new Mesh( geometry, material );
  plane.position.set(0,-scenewidth*230/577/2,-Math.sqrt(0.75)*scenewidth);
  GLscene.add(plane);
  glAnimState.plane = plane;
  
  const ambientLight = new HemisphereLight(0xddeeff, 0x0f0e0d, 8);
  const mainLight = new DirectionalLight(0xffffff, 3);
  mainLight.position.set(10, 10, 10);

  GLscene.add(ambientLight, mainLight);
  const GLmixers = [];
  const GLObjects = [];

  const loader = new GLTFLoader();
  const gltfPromise = myGLTFLoader(loader, "/dist/Stork.glb");  

  GLrenderer.setSize(container.clientWidth, container.clientHeight);
  GLrenderer.domElement.style.position = 'absolute';
  container.appendChild(GLrenderer.domElement);
  GLrenderer.physicallyCorrectLights = true;
  GLrenderer.setPixelRatio(window.devicePixelRatio);
  glAnimState.container = container;
  glAnimState.renderer = GLrenderer;
  glAnimState.camera = csscamera;
  glAnimState.scene = GLscene;
  glAnimState.mixers = GLmixers;
  glAnimState.objects = GLObjects;
  glAnimState.xAxis = xAxis;
  glAnimState.yAxis = yAxis;
  window.glAnimState = glAnimState;
  window.updateGLScene = updateGLScene;

  glAnimState.clock = new Clock();
  //GLscene.background = new Color(0x8fbcd4);
  //GLrenderer.render(GLscene, csscamera);

  {
    //load the bird and its animation
    const gltf = await gltfPromise;
    const bird = gltf.scene;
    const animation = gltf.animations[0];
    const mixer = new AnimationMixer(bird);
    const action = mixer.clipAction(animation);
    action.play();
    GLmixers.push(mixer);
    GLObjects.push(bird);
    // create the letter carried by the bird: its dimensions and animation are in sync
    // with the gltf bird movement
    const geometry = new PlaneGeometry( 5.77/5, 3.69/5 );
    const material = new MeshBasicMaterial( {map: texture, color: 0xeeeeee, side: DoubleSide} );
    const planeInBec = new Mesh( geometry, material );
    const planeInBecPosKF = new VectorKeyframeTrack( '.position', [ 0, 0.5, 1 ], 
      [ 0, 0.6, 2.5,
	0, 0.06, 2.5,
        0, 0.6, 2.5 ]);
    const planeInBecq0 = new Quaternion().setFromAxisAngle( xAxis, 0.51*Math.PI );
    const planeInBecq1 = new Quaternion().setFromAxisAngle( xAxis, 0.48*Math.PI );
    const planeInBecQuaternionsKF = new QuaternionKeyframeTrack( '.quaternion', 
      [ 0, 0.5, 1 ], 
      [ planeInBecq0.x, planeInBecq0.y, planeInBecq0.z, planeInBecq0.w, 
	planeInBecq1.x, planeInBecq1.y, planeInBecq1.z, planeInBecq1.w,
	planeInBecq0.x, planeInBecq0.y, planeInBecq0.z, planeInBecq0.w ] );
    const planeInBecClip = new AnimationClip( 'planeInBecAction', 1.2999999523162842, [ planeInBecPosKF, planeInBecQuaternionsKF ] );
    const planeInBecMixer = new AnimationMixer( planeInBec );
    const planeInBecClipAction = planeInBecMixer.clipAction( planeInBecClip );
    planeInBecClipAction.play();
    bird.add( planeInBec );
    GLObjects.push(planeInBec);
    GLmixers.push(planeInBecMixer);

    bird.position.set(0,0,0);
    bird.scale.set(scenewidth*500/577,scenewidth*500/577,scenewidth*500/577);
    GLscene.add(bird);

    const birdPosKF = new VectorKeyframeTrack( '.position', [ 0, 5, 10 ], 
      [ 0, 3*scenewidth, -8*scenewidth,
	0, -0.4464*scenewidth, -3.0506*scenewidth,
        0, 1.4881*scenewidth, 0.99*scenewidth ]);
    const birdq0 = new Quaternion().setFromAxisAngle( xAxis, 0.25*Math.PI );
    const birdq1 = new Quaternion().setFromAxisAngle( xAxis, -0.25*Math.PI );
    const birdQuaternionsKF = new QuaternionKeyframeTrack( '.quaternion', 
      [ 0, 10 ], 
      [ birdq0.x, birdq0.y, birdq0.z, birdq0.w, 
	birdq1.x, birdq1.y, birdq1.z, birdq1.w ] );
    const birdClip = new AnimationClip( 'BirdAction', 10, [ birdPosKF, birdQuaternionsKF ] );
    const birdMixer = new AnimationMixer( bird );
    const birdClipAction = birdMixer.clipAction( birdClip );
    birdClipAction.play();
    GLmixers.push(birdMixer);
    const plq0 = new Quaternion().setFromAxisAngle( yAxis, 0.5*Math.PI );
    const plq1 = new Quaternion().setFromAxisAngle( yAxis, 0*Math.PI );
    const plQuaternionsKF = new QuaternionKeyframeTrack( '.quaternion', 
      [ 0, 2, 10 ], 
      [ plq0.x, plq0.y, plq0.z, plq0.w, 
	plq1.x, plq1.y, plq1.z, plq1.w,
	plq1.x, plq1.y, plq1.z, plq1.w,
      ] );
    const plClip = new AnimationClip( 'PlAction', 10, [ plQuaternionsKF ] );
    const plMixer = new AnimationMixer( glAnimState.plane );
    const plClipAction = plMixer.clipAction( plClip );
    plClipAction.play();
    GLmixers.push(plMixer);
    
    const sceneq0 = new Quaternion().setFromAxisAngle( yAxis, 0*Math.PI );
    const sceneq1 = new Quaternion().setFromAxisAngle( yAxis, 0.1*Math.PI );
    const sceneq2 = new Quaternion().setFromAxisAngle( yAxis, -0.25*Math.PI );
    const sceneQuaternionsKF = new QuaternionKeyframeTrack( '.quaternion', 
      [ 0, 2, 6, 10 ], 
      [ sceneq0.x, sceneq0.y, sceneq0.z, sceneq0.w, 
	sceneq0.x, sceneq0.y, sceneq0.z, sceneq0.w, 
	sceneq1.x, sceneq1.y, sceneq1.z, sceneq1.w,
	sceneq0.x, sceneq0.y, sceneq0.z, sceneq0.w,
      ] );
    const sceneClip = new AnimationClip( 'SceneAction', 10, [ sceneQuaternionsKF ] );
    const sceneMixer = new AnimationMixer( GLscene );
    const sceneClipAction = sceneMixer.clipAction( sceneClip );
    sceneClipAction.play();
    GLmixers.push(sceneMixer);
  };
}

function updateCSSScene(myT) {
    const t = myT || cssAnimState.clock.getElapsedTime();
    // trucs automatiques
    cssAnimState.mixer.setTime(t);

    // trucs manuels
    if (t<4) {
	const adv = (t-0)/4;
	const newH = cssAnimState.initH + adv * (cssAnimState.midH - cssAnimState.initH);
	cssAnimState.obj.style.height = `${newH}px`;
    } else if (t<8) {
	if (!cssAnimState.envVisible) {
          cssAnimState.rabat.style.display='block';
          cssAnimState.devant.style.display='block';
          cssAnimState.derriere.style.display='block';
	  cssAnimState.envVisible = true;
	}
	const adv = (t-5)/3;
	const newH = cssAnimState.midH + adv * (cssAnimState.endH - cssAnimState.midH);
	cssAnimState.obj.style.height = `${newH}px`;
    } else if (t<11) {
	if (!cssAnimState.envVisible) {
          cssAnimState.rabat.style.display='block';
          cssAnimState.devant.style.display='block';
          cssAnimState.derriere.style.display='block';
	  cssAnimState.envVisible = true;
	}
	if (!cssAnimState.envRabatZ) {
	  cssAnimState.obj.style.height = `${cssAnimState.endH}px`;
          cssAnimState.rabat.style.zIndex='9999';
	  cssAnimState.envRabatZ = true;
	}
	const adv = (t-8)/3;
	const angle = 180 * adv;
	cssAnimState.rabat.style.transform = `rotateX(${angle}deg)`;
    } else if (t<12) {
    } else {
	//cssAnimState.renderer.setAnimationLoop(null);
	//window.cancelAnimationFrame(cssAnimState.reqId);
	clearInterval(cssAnimState.intvId);
	cssAnimState.obj.style.display='none';
	return startGLScene();
    }
    cssAnimState.renderer.render(cssAnimState.scene, cssAnimState.camera);
}

function startGLScene() {
   glAnimState.clock.start();
   glAnimState.renderer.setAnimationLoop(()=>updateGLScene());
}

function updateGLScene(myT) {
  const t = myT || glAnimState.clock.getElapsedTime();
  if (t>=10) {
    glAnimState.renderer.setAnimationLoop(null);
    glAnimState.container.style.display='none';
    alert("TODOOOOOOOO TADAAAAAAA!!!!!!");
    return;
  }
  glAnimState.mixers.forEach((mixer) => {
    mixer.setTime(t);
  });
  const i = Math.floor(2*t/10);
  if (i%2==0) {
      if (glAnimState.objects[1]) glAnimState.objects[1].visible=false;
      glAnimState.plane.visible=true;
  } else {
      if (glAnimState.objects[1]) glAnimState.objects[1].visible=true;
      glAnimState.plane.visible=false;
  }
  glAnimState.renderer.render(glAnimState.scene, glAnimState.camera);
}
