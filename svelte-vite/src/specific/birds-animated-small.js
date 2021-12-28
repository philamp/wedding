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
  QuaternionKeyframeTrack
} from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js";
import { CSS3DRenderer, CSS3DObject } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS3DRenderer.js";

// these need to be accessed inside more than one function so we'll declare them first
let container;

let camera;
let csscamera;

let controls;

let renderer;
let cssrenderer;

let scene;
let cssscene;

let formtabs;
let formtabsRect;
let containerRect;
let wInnerWidth;
let wInnerHeight;

let cssAnimState = {};

const mixers = [];
const clock = new Clock();

function createCamera() {
  camera = new PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    1,
    1000
  );
  camera.position.set(-1.5, 1.5, 6.5);
}

function createControls() {
  controls = new OrbitControls(camera, container);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.target.z = 2;
}

function createLights() {
  const ambientLight = new HemisphereLight(0xddeeff, 0x0f0e0d, 8);

  const mainLight = new DirectionalLight(0xffffff, 3);
  mainLight.position.set(10, 10, 10);

  scene.add(ambientLight, mainLight);
}

function loadModels() {
  const onLoad = (gltf, position) => {
    const bird = gltf.scene;
    bird.position.copy(position);

    const animation = gltf.animations[0];

    const mixer = new AnimationMixer(bird);
    mixers.push(mixer);

    const action = mixer.clipAction(animation);
    action.play();

    scene.add(bird);
  };

  const loader = new GLTFLoader();

  const parrotPosition = new Vector3(0, 0, 2.5);

  loader.load(
    "/dist/Parrot.glb",
    (gltf) => onLoad(gltf, parrotPosition),
    null,
    null
  );

  const flamingoPosition = new Vector3(7.5, 0, -10);
  loader.load(
    "/dist/Flamingo.glb",
    (gltf) => onLoad(gltf, flamingoPosition),
    null,
    null
  );

  const storkPosition = new Vector3(0, -2.5, -10);
  loader.load(
    "/dist/Stork.glb",
    (gltf) => onLoad(gltf, storkPosition),
    null,
    null
  );
}

function createRenderer() {
  // create a WebGLRenderer and set its width and height
  renderer = new WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.physicallyCorrectLights = true;
  renderer.setPixelRatio(window.devicePixelRatio);

  // add the automatically created <canvas> element to the page
  //container.appendChild(renderer.domElement);
}

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

export default function init(containerID) {
  container = document.querySelector(containerID);

  scene = new Scene();
  scene.background = new Color(0x8fbcd4);


  // set the figure placeholder to good dimension
  formtabs = document.getElementById("formtabs");
  formtabsRect = formtabs.getBoundingClientRect();
  containerRect = container.getBoundingClientRect();
  wInnerWidth = window.innerWidth;
  wInnerHeight = window.innerHeight;

  
  console.log(formtabsRect);
  console.log(containerRect);
  console.log(wInnerWidth);
  console.log(wInnerHeight);

  container.style.height = (wInnerHeight - containerRect.y) + "px";
  container.style.width = (wInnerWidth - containerRect.x) + "px";

  
  createCamera();
  createControls();
  createLights();
  loadModels();
  createRenderer();

  //CSS3D

  var content = '<div id="csssceneglobal" style="position: relative; width: 300px; height: 600px; overflow:hidden;">' +
  '<img id="rabat" src="/dist/rabat.png" style="width: 100%; height: 300px; position: absolute; bottom: 300px; transform-origin: bottom">' +
  '<img id="derriere" src="/dist/derriere.png" style="width: 100%; height: 300px; position: absolute; bottom: 0px">' +
  '<div id="formtabscontainer" style="width: 100%; height: 300px; position: absolute; top: 300px"></div>' +
  '<img id="devant" src="/dist/devant.png" style="width: 100%; height: 300px; position: absolute; bottom: 0px">></div>' +
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


cssscene = new Scene();
//cssscene.background = new Color(0xcccccc);
cssscene.add(cssobject);

  cssrenderer = new CSS3DRenderer();
  cssrenderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(cssrenderer.domElement);

  csscamera = new PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    1,
    1000
  );
  csscamera.position.x = 0;
  csscamera.position.y = 0;
  csscamera.position.z = (Math.sqrt(0.75) * container.clientHeight);
  csscamera.lookAt(new Vector3(0,0,0));

  cssrenderer.render(cssscene, csscamera);
  cssAnimState.clock = new Clock();
  cssAnimState.renderer = cssrenderer;
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
	return clearInterval(cssAnimState.intvId);
    }
    cssAnimState.renderer.render(cssAnimState.scene, cssAnimState.camera);
}
