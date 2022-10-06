import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import ThreeMeshUI from '../src/three-mesh-ui.js';
import VRControl from './utils/VRControl.js';
import ShadowedLight from './utils/ShadowedLight.js';

import SnakeImage from "../assets/adharvh.jpg";
import FontJSON from '../assets/Roboto-msdf.json';
import FontImage from '../assets/Roboto-msdf.png';


const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls;

window.addEventListener("load", init);
window.addEventListener("resize", onWindowResize);

//

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x004161);

  camera = new THREE.PerspectiveCamera(80, WIDTH / HEIGHT, 0.5, 100);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.xr.enabled = true;
  document.body.appendChild(VRButton.createButton(renderer));
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 1.6, 0);
  controls.target = new THREE.Vector3(0, 1, -1.8);
  controls.update();

  // ROOM

  const room = new THREE.LineSegments(
    
  );

  scene.add(room);

  // TEXT PANEL

  makeTextPanel();

  //

  renderer.setAnimationLoop(loop);
}

//

function makeTextPanel() {
  const container = new ThreeMeshUI.Block({
    ref: "container",
    padding: 0.025,
    fontFamily: FontJSON,
    fontTexture: FontImage,
    fontColor: new THREE.Color(0xffffff),
    backgroundOpacity: 0,
    backgroundColor: new THREE.Color( 0xf1c232 ),

		
   
  });

  container.position.set(0, 2, -2);
  container.rotation.x = -0.1;
  scene.add(container);

  //

  const title = new ThreeMeshUI.Block({
    height: .6,
    width: 3,
    margin: 0.025,
    justifyContent: "center",
    fontSize: 0.06,
    backgroundOpacity: 0,
    backgroundColor: new THREE.Color( 0x0c027c ),
    borderRadius: 0.05,
		borderWidth: 0.01,
		borderOpacity: .5,
    borderColor: new THREE.Color( 0x2c7da7 ),
  
  });

  title.add(
    new ThreeMeshUI.Text({
      content: "Adharvh Chorapalli",
    })
  );
  container.add(title);
  var op=["Option1","Option2","Option3","Option4"]
  const leftOptionBlock = new ThreeMeshUI.Block({
    margin: 0.15,
    backgroundOpacity: 0,
    backgroundColor: new THREE.Color( 0x0c027c ),
  });
  const rightOptionBlock = new ThreeMeshUI.Block({
    margin: 0.15,
    backgroundOpacity: 0,
    backgroundColor: new THREE.Color( 0x0c027c ),
  });
for(var i=0;i<4;i++){
 
  const option = new ThreeMeshUI.Block({
    
    height: 0.3,
    width: 1.5,
    margin: 0.025,
    justifyContent: "center",
    float:"left",
    fontSize: 0.06,
    backgroundOpacity: 0,
    backgroundColor: new THREE.Color( 0x0c027c ),
    borderRadius: 0.05,
		borderWidth: 0.01,
		borderOpacity: .5,
    borderColor: new THREE.Color( 0x2c7da7 ),
  
  });

  
  option.add(
    new ThreeMeshUI.Text({
      content: op[i],
    })
  );
 if((i+1)%2==0){
  leftOptionBlock.add(option);
 }else{
  rightOptionBlock.add(option);
 }
 
  
  //
}
  

  const leftSubBlock = new ThreeMeshUI.Block({
    height: 0.95,
    width: 1.0,
    margin: 0.025,
    padding: 0.025,
    textAlign: "left",
    justifyContent: "end",
  });

  const caption = new ThreeMeshUI.Block({
    height: 0.07,
    width: 0.37,
    textAlign: "center",
    justifyContent: "center",
  });

  caption.add(
    new ThreeMeshUI.Text({
      content: "Feature Shaper",
      fontSize: 0.04,
    })
  );

  leftSubBlock.add(caption);

  //

  const rightSubBlock = new ThreeMeshUI.Block({
    margin: 0.25,
  });

  const subSubBlock1 = new ThreeMeshUI.Block({
    height: 0.35,
    width: 0.5,
    margin: 0.025,
    padding: 0.02,
    fontSize: 0.04,
    justifyContent: "center",
    backgroundOpacity: 0,
  }).add(
    new ThreeMeshUI.Text({
      content: "I am a ",
    }),

    new ThreeMeshUI.Text({
      content: "talented",
      fontColor: new THREE.Color(0x92e66c),
    }),

    new ThreeMeshUI.Text({
      content: " person.",
    })
  );

  const subSubBlock2 = new ThreeMeshUI.Block({
    height: 0.53,
    width: 0.5,
    margin: 0.01,
    padding: 0.02,
    fontSize: 0.025,
    alignItems: "start",
    textAlign: 'justify',
    backgroundOpacity: 0,
    borderRadius: 0.05,
		borderWidth: 0.01,
		borderOpacity: 1,
    borderColor: new THREE.Color( 'white' )
  }).add(
    new ThreeMeshUI.Text({
      content:
        "I am an experienced professional seeking an opportunity to use my background in data analysis and market trend research. I am a dedicated and detail-oriented marketing specialist looking for an opportunity to expand my professional skillset and help Company X grow.",
    })
  );

  rightSubBlock.add(subSubBlock1, subSubBlock2);

  //

  const contentContainer = new ThreeMeshUI.Block({
    contentDirection: "row",
    padding: 0.02,
    margin: 0.025,
    backgroundOpacity: 0,
  });

  contentContainer.add(leftOptionBlock, rightOptionBlock);
  container.add(contentContainer);

  //

  new THREE.TextureLoader().load(SnakeImage, (texture) => {
    leftSubBlock.set({
      backgroundTexture: texture,
    });
  });
}

//

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function loop() {
  // Don't forget, ThreeMeshUI must be updated manually.
  // This has been introduced in version 3.0.0 in order
  // to improve performance
  ThreeMeshUI.update();

  controls.update();
  renderer.render(scene, camera);
}