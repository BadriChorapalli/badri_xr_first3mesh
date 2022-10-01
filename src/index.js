import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import ThreeMeshUI from '../src/three-mesh-ui.js';
import VRControl from './utils/VRControl.js';
import ShadowedLight from './utils/ShadowedLight.js';

import AdharvhImage from "../assets/adharvh.jpg";
import HomeIcon from "../assets/home.png";
import NotificationIcon from "../assets/icons8-notification-50.png";
import ChatIcon from "../assets/icons8-speech-bubble-50.png";
import ProfileIcon from "../assets/icons8-customer-50.png";
import SettingsIcon from "../assets/icons8-settings-50.png";
import sun from '../assets/sun_temple_stripe_stereo1.jpg';


import FontJSON from '../assets/Roboto-msdf.json';
import FontImage from '../assets/Roboto-msdf.png';

import mailData from '../src/data/mails.json'
import mailList from '../src/data/board.json'


const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls, vrControl;
let meshContainer, meshes, currentMesh;
let mainContailners=[]
const objsToTest = [];
const navList=['Watchlist','Portfolio','Add Fund','Withdraw','Events','News']


window.addEventListener("load", init);
window.addEventListener("resize", onWindowResize);

// Events 


// compute mouse position in normalized device coordinates
// (-1 to +1) for both directions.
// Used to raycasting against the interactive elements

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();
mouse.x = mouse.y = null;

let selectState = false;

window.addEventListener( 'pointermove', ( event ) => {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
} );

window.addEventListener( 'pointerdown', () => {
	selectState = true;
} );

window.addEventListener( 'pointerup', () => {
	selectState = false;
} );

window.addEventListener( 'touchstart', ( event ) => {
	selectState = true;
	mouse.x = ( event.touches[ 0 ].clientX / window.innerWidth ) * 2 - 1;
	mouse.y = -( event.touches[ 0 ].clientY / window.innerHeight ) * 2 + 1;
} );

window.addEventListener( 'touchend', () => {
	selectState = false;
	mouse.x = null;
	mouse.y = null;
} );

//

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x505050);

 // camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.1, 100);
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.xr.enabled = true;
  document.body.appendChild(VRButton.createButton(renderer));
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set( 0, 1.6, 0 );
  controls.target = new THREE.Vector3( 0, 1, -2.5 );
  controls.update();

  // ROOM

  const room = new THREE.LineSegments(
    new BoxLineGeometry(6, 6, 6, 15, 15, 15).translate(0, 3, 0),
    new THREE.LineBasicMaterial({ color: 0x0c81f5,emissive: 0x141A35 })
  );
  const roomMesh = new THREE.Mesh(
    new THREE.BoxGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
    new THREE.MeshBasicMaterial( { side: THREE.BackSide } )
);



 //scene.add(room);
 /*--------------------*/ 
 //camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.layers.enable( 1 );

				const geometry = new THREE.BoxGeometry( 100, 100, 100 );
				geometry.scale( 1, 1, - 1 );

				const textures = getTexturesFromAtlasFile( sun, 12 );

				const materials = [];

				for ( let i = 0; i < 6; i ++ ) {

					materials.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );

				}

				const skyBox = new THREE.Mesh( geometry, materials );
				skyBox.layers.set( 1 );
				scene.add( skyBox );


				const materialsR = [];

				for ( let i = 6; i < 12; i ++ ) {

					materialsR.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );

				}

				const skyBoxR = new THREE.Mesh( geometry, materialsR );
				skyBoxR.layers.set( 2 );
				scene.add( skyBoxR );
 /*-------------------*/


 //////////
	// Light
	//////////

	const light = ShadowedLight( {
		z: 10,
		width: 6,
		bias: -0.0001
	} );

	const hemLight = new THREE.HemisphereLight( 0x808080, 0x606060 );

	scene.add( light, hemLight );

	////////////////
	// Controllers
	////////////////

	vrControl = VRControl( renderer, camera, scene );

	scene.add( vrControl.controllerGrips[ 0 ], vrControl.controllers[ 0 ] );

	vrControl.controllers[ 0 ].addEventListener( 'selectstart', () => {

		selectState = true;

	} );
	vrControl.controllers[ 0 ].addEventListener( 'selectend', () => {

		selectState = false;

	} );

  // TEXT PANEL
  window.addEventListener( 'resize', onWindowResize );
  makeTextPanel();

  //

  renderer.setAnimationLoop(loop);
}

//

function makeTextPanel() {
    const homeMainContainer = new ThreeMeshUI.Block({
        ref: "homeMainContainer",
        padding: 0.025,
        width: 2.6,
        height: 1.5,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontColor: new THREE.Color(0xffffff),
        backgroundColor: new THREE.Color(0x243139),
        backgroundOpacity: 1,
      });
    
      homeMainContainer.position.set(0, 1.7, -1.9);
      homeMainContainer.rotation.x = 0;
      homeMainContainer.visible=true;
      const homeMainContainerTitle = new ThreeMeshUI.Block({
        ref: "homeMainContainerTitle",
        padding: 0.025,
        width: 2.6,
        height: .1,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontColor: new THREE.Color(0xffffff),
        backgroundColor: new THREE.Color(0x243139),
        backgroundOpacity: 1,
      });
      homeMainContainerTitle.add(
        new ThreeMeshUI.Text({
          content: "Message",
        })
      );
      homeMainContainer.add(homeMainContainerTitle)
      mainContailners.push(homeMainContainer)
      scene.add(homeMainContainer);
      const notificationMainContainer = new ThreeMeshUI.Block({
        ref: "notificationMainContainer",
        padding: 0.025,
        width: 2.6,
        height: 1.5,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontColor: new THREE.Color(0xffffff),
        backgroundColor: new THREE.Color(0x243139),
        backgroundOpacity: 1,
      });
    
      notificationMainContainer.position.set(0, 1.7, -1.9);
      notificationMainContainer.rotation.x = 0;
      notificationMainContainer.visible=false;
      const notificationMainContainerTitle = new ThreeMeshUI.Block({
        ref: "notificationMainContainerTitle",
        padding: 0.025,
        width: 2.6,
        height: .1,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontColor: new THREE.Color(0xffffff),
        backgroundColor: new THREE.Color(0x243139),
        backgroundOpacity: 1,
      });
      notificationMainContainerTitle.add(
        new ThreeMeshUI.Text({
          content: "Notifications",
        })
      );
      notificationMainContainer.add(notificationMainContainerTitle)
      mainContailners.push(notificationMainContainer)
      scene.add(notificationMainContainer);
      /**
       * Chat
       */
       const chatMainContainer = new ThreeMeshUI.Block({
        ref: "chatMainContainer",
        padding: 0.025,
        width: 2.6,
        height: 1.5,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontColor: new THREE.Color(0xffffff),
        backgroundColor: new THREE.Color(0x243139),
        backgroundOpacity: 1,
      });
    
      chatMainContainer.position.set(0, 1.7, -1.9);
      chatMainContainer.rotation.x = 0;
      chatMainContainer.visible=false;
      const chatMainContainerTitle = new ThreeMeshUI.Block({
        ref: "chatMainContainerTitle",
        padding: 0.025,
        width: 2.6,
        height: .1,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontColor: new THREE.Color(0xffffff),
        backgroundColor: new THREE.Color(0x243139),
        backgroundOpacity: 1,
      });
      chatMainContainerTitle.add(
        new ThreeMeshUI.Text({
          content: "Chat",
        })
      );
      chatMainContainer.add(chatMainContainerTitle)
      mainContailners.push(chatMainContainer)
      scene.add(chatMainContainer);
      /**
       * 
       */
  const container = new ThreeMeshUI.Block({
    ref: "container",
    padding: 0.025,
    width: 2.6,
    height: 1.5,
    fontFamily: FontJSON,
    fontTexture: FontImage,
    fontColor: new THREE.Color(0xffffff),
    backgroundColor: new THREE.Color(0x243139),
    backgroundOpacity: 1,
  });

  container.position.set(0, 1.7, -1.9);
  container.rotation.x = 0;
  container.visible=false;
  mainContailners.push(container)
  scene.add(container);

  //Top Container

  const topContainer = new ThreeMeshUI.Block({
    ref: "topContainer",
    padding: 0.025,
    height: .8,
    width: 3.6,
    fontFamily: FontJSON,
    fontTexture: FontImage,
    fontColor: new THREE.Color(0xffffff),
    backgroundColor: new THREE.Color(0x243139),
    backgroundOpacity:1,
    contentDirection: 'row',
  });

  topContainer.position.set(0, 2.915, -1.77);
  topContainer.rotation.x = 0.20;
  scene.add(topContainer);
  topContainer.visible=true;
  const leftContainer = new ThreeMeshUI.Block({
    ref: "leftContainer",
	height: 1.5,
    width: .9,
    padding: 0.025,
    fontFamily: FontJSON,
    fontTexture: FontImage,
    fontColor: new THREE.Color(0xffffff),
    backgroundColor: new THREE.Color(0x243139),
    backgroundOpacity: 1,
  });

  leftContainer.position.set(-1.68, 1.7, -1.5);
  leftContainer.rotation.y = 0.60;
  
  scene.add(leftContainer);

  const rightContainer = new ThreeMeshUI.Block({
    ref: "rightContainer",
	height: 1.5,
    width: .9,
    padding: 0.025,
    fontFamily: FontJSON,
    fontTexture: FontImage,
    fontColor: new THREE.Color(0xffffff),
    backgroundColor: new THREE.Color(0x243139),
    backgroundOpacity: .5,
  });

  rightContainer.position.set(1.68, 1.7, -1.5);
  rightContainer.rotation.y = -0.60;
  scene.add(rightContainer);

  const bottomContainer = new ThreeMeshUI.Block({
    ref: "bottomContainer",
    padding: 0.025,
    width: 1.5,
    height: .3,
    fontFamily: FontJSON,
    fontTexture: FontImage,
    fontColor: new THREE.Color(0xffffff),
    backgroundColor: new THREE.Color(0x0c81f5),
    backgroundOpacity: 0.9,
    borderRadius:.05,
    justifyContent: 'center',
	contentDirection: 'row',
  });

  bottomContainer.position.set(0, .75, -1.7);
  bottomContainer.rotation.x = -.45;
  scene.add(bottomContainer);
  // BUTTONS

	// We start by creating objects containing options that we will use with the two buttons,
	// in order to write less code.

	const buttonOptions = {
		width: 0.2,
		height: 0.2,
		justifyContent: 'center',
		offset: 0.05,
		margin: 0.03,
		borderRadius: 0.05
	};
    const NavButtonOptions  = {
		width: 0.8,
		height: 0.2,
		justifyContent: 'center',
		offset: 0.05,
		margin: 0.02,
		borderRadius: 0.02
	};
    const MailButtonOptions  = {
		width: 0.9,
		height: 0.20,
		justifyContent: 'center',
		offset: 0.01,
		margin: 0.001,
		borderRadius: 0.01
	};
    const BoardButtonOptions  = {
		width: 0.95,
		height: 0.20,
		justifyContent: 'center',
		offset: 0.01,
		margin: 0.015,
		borderRadius: 0.01
	};
	// Options for component.setupState().
	// It must contain a 'state' parameter, which you will refer to with component.setState( 'name-of-the-state' ).

	const hoveredStateAttributes = {
		state: 'hovered',
		attributes: {
			offset: 0.1,
			backgroundColor: new THREE.Color( 0xf50c4a ),
			backgroundOpacity: 1,
			fontColor: new THREE.Color( 0xffffff )
		},
	};

	const idleStateAttributes = {
		state: 'idle',
		attributes: {
			offset: 0.035,
			backgroundColor: new THREE.Color( 0x666666 ),
			backgroundOpacity: 0.3,
			fontColor: new THREE.Color( 0xffffff )
		},
	};
    const navIdleStateAttributes = {
		state: 'idle',
		attributes: {
			offset:  0.035,
			backgroundColor: new THREE.Color( 0x085fd1 ),
			backgroundOpacity: 0.9,
			fontColor: new THREE.Color( 0xffffff )
            
		},
	};
    const mailAttributes = {
		state: 'idle',
		attributes: {
			offset:  0.0035,
            height: .18,
            width: .9,
			backgroundColor: new THREE.Color( 0x303e47 ),
			backgroundOpacity: 0.9,
			fontColor: new THREE.Color( 0xffffff )
            
		},
	};
    const hoveredMailAttributes = {
		state: 'hovered',
		attributes: {
			offset: 0.025,
           backgroundColor: new THREE.Color( 0xf50c4a ),
			backgroundOpacity: 1,
			fontColor: new THREE.Color( 0xffffff )
		},
	};
    const boardAttributes = {
		state: 'idle',
		attributes: {
			offset:  0.0035,
            height: .48,
            width: .858,
			backgroundColor: new THREE.Color( 0x303e47 ),
			backgroundOpacity: 0.9,
			fontColor: new THREE.Color( 0xffffff )
            
		},
	};
    const hoveredBoardAttributes = {
		state: 'hovered',
		attributes: {
			offset: 0.025,
           backgroundColor: new THREE.Color( 0xffffff ),
			backgroundOpacity: 1,
			fontColor: new THREE.Color( 0x222222a )
		},
	};
    const selectedAttributes = {
		offset: 0.02,
		backgroundColor: new THREE.Color( 0x038007),
		fontColor: new THREE.Color( 0x222222 )
	};
    const loader = new THREE.TextureLoader();
    const buttonHome = new ThreeMeshUI.Block( buttonOptions );
    const iconSettings={
        height: .12,
        width: .12,
        radius:0,
        fontColor: new THREE.Color( 0xffffff )
      }
    const imageHome = new ThreeMeshUI.Block(iconSettings);

    loader.load(HomeIcon, (texture) => {
        imageHome.set({ backgroundTexture: texture });
      });
    buttonHome.add(imageHome);
    buttonHome.setupState( {
		state: 'selected',
		attributes: selectedAttributes,
		onSet: () => {
             hideAllMainContainers(homeMainContainer)
    	}
	} );
	buttonHome.setupState( hoveredStateAttributes );
	buttonHome.setupState( idleStateAttributes );
  
    const buttonNotification = new ThreeMeshUI.Block( buttonOptions );
    const imageNotification = new ThreeMeshUI.Block(iconSettings);
    loader.load(NotificationIcon, (texture) => {
        imageNotification.set({ backgroundTexture: texture });
      });
    buttonNotification.add(imageNotification);
    buttonNotification.setupState( {
		state: 'selected',
		attributes: selectedAttributes,
		onSet: () => {
            hideAllMainContainers(notificationMainContainer)
		}
	} );
	buttonNotification.setupState( hoveredStateAttributes );
	buttonNotification.setupState( idleStateAttributes );
    const buttonChat = new ThreeMeshUI.Block( buttonOptions );
    const imageChat = new ThreeMeshUI.Block(iconSettings);
    loader.load(ChatIcon, (texture) => {
        imageChat.set({ backgroundTexture: texture });
      });
    buttonChat.add(imageChat);
    buttonChat.setupState( {
		state: 'selected',
		attributes: selectedAttributes,
		onSet: () => {
            
            hideAllMainContainers(chatMainContainer)
		}
	} );
	buttonChat.setupState( hoveredStateAttributes );
	buttonChat.setupState( idleStateAttributes );
    const buttonProfile = new ThreeMeshUI.Block( buttonOptions );
    const imageprofile = new ThreeMeshUI.Block(iconSettings);
    loader.load(ProfileIcon, (texture) => {
        imageprofile.set({ backgroundTexture: texture });
      });
    buttonProfile.add(imageprofile);
    buttonProfile.setupState( {
		state: 'selected',
		attributes: selectedAttributes,
		onSet: () => {
            hideAllMainContainers(container)
           
		}
	} );
	buttonProfile.setupState( hoveredStateAttributes );
	buttonProfile.setupState( idleStateAttributes );
    const buttonSettings = new ThreeMeshUI.Block( buttonOptions );
    const imageSettings = new ThreeMeshUI.Block(iconSettings);
    loader.load(SettingsIcon, (texture) => {
        imageSettings.set({ backgroundTexture: texture });
      });
    buttonSettings.add(imageSettings);
    buttonSettings.setupState( {
		state: 'selected',
		attributes: selectedAttributes,
		onSet: () => {

		}
	} );
	buttonSettings.setupState( hoveredStateAttributes );
	buttonSettings.setupState( idleStateAttributes );
    bottomContainer.add( buttonHome ,buttonNotification,buttonChat,buttonProfile,buttonSettings);
    objsToTest.push( buttonHome,buttonNotification,buttonChat,buttonProfile,buttonSettings);
    for(var i=0;i<6;i++){
    const navButton = new ThreeMeshUI.Block( NavButtonOptions );
    navButton.add(
		new ThreeMeshUI.Text( { content:navList[i] } )
	);
    navButton.setupState( {
		state: 'selected',
		attributes: selectedAttributes,
		onSet: () => {

		}
	} );
	navButton.setupState( hoveredStateAttributes );
	navButton.setupState( navIdleStateAttributes );
    navButton.receiveShadow = true
    leftContainer.add(navButton)
    objsToTest.push(navButton);
}
for(var j=0;j<mailData.length;j++){
    const mailButton = new ThreeMeshUI.Block( MailButtonOptions );

    mailButton.add(
		new ThreeMeshUI.Text( { content:mailData[j].name } )
	);
    mailButton.add(
		new ThreeMeshUI.Text( { content:'\n'+mailData[j].subject.substring(0,30)+'...', fontSize: 0.02, } )
	);
    var testing={}
        testing.data=mailData[j]
        mailButton.userData=testing,
    mailButton.setupState( {
		state: 'selected',
		attributes: selectedAttributes,
        onSet: () => {
            console.log(mailButton)
            console.log(j)
            updateMailBox(homeMainContainerTitle,mailButton)
		}
	} );
	mailButton.setupState( hoveredMailAttributes );
	mailButton.setupState( mailAttributes );
    mailButton.receiveShadow = true
    rightContainer.add(mailButton)
    objsToTest.push(mailButton);
}
for(var k=0;k<4;k++){
    const boardButton = new ThreeMeshUI.Block( BoardButtonOptions );
    boardButton.add(
		new ThreeMeshUI.Text( { 
            content:mailList[k].label+'\n' 
        } ),
         new ThreeMeshUI.Text({
            content:mailList[k].value+'\n',
            fontColor: new THREE.Color(0x92e66c),
          }),
         new ThreeMeshUI.Text({
            content:mailList[k].present,
          })
	);
    boardButton.setupState( {
		state: 'selected',
		attributes: selectedAttributes,
		onSet: () => {

		}
	} );
	boardButton.setupState( hoveredBoardAttributes );
	boardButton.setupState( boardAttributes );
    boardButton.receiveShadow = true
    topContainer.add(boardButton)
    objsToTest.push(boardButton);
}
  const title = new ThreeMeshUI.Block({
    height: 0.2,
    width: 1.5,
    margin: 0.025,
    justifyContent: "center",
    fontSize: 0.09,
  });

  title.add(
    new ThreeMeshUI.Text({
      content: "Adharvh Chorapalli",
    })
  );

  container.add(title);
 

  //

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
    margin: 0.025,
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
      content: "You earn ",
    }),

    new ThreeMeshUI.Text({
      content: "40000",
      fontColor: new THREE.Color(0x92e66c),
    }),

    new ThreeMeshUI.Text({
      content: " Rs.",
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
  }).add(
    new ThreeMeshUI.Text({
      content:
        "Profit 40000",
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

  contentContainer.add(leftSubBlock, rightSubBlock);
  container.add(contentContainer);

  //

  new THREE.TextureLoader().load(AdharvhImage, (texture) => {
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
  updateButtons();
}
function updateButtons() {

	// Find closest intersecting object

	let intersect;

	if ( renderer.xr.isPresenting ) {

		vrControl.setFromController( 0, raycaster.ray );

		intersect = raycast();

		// Position the little white dot at the end of the controller pointing ray
		if ( intersect ) vrControl.setPointerAt( 0, intersect.point );

	} else if ( mouse.x !== null && mouse.y !== null ) {

		raycaster.setFromCamera( mouse, camera );

		intersect = raycast();

	}

	// Update targeted button state (if any)

	if ( intersect && intersect.object.isUI ) {

		if ( selectState ) {

			// Component.setState internally call component.set with the options you defined in component.setupState
			intersect.object.setState( 'selected' );

		} else {

			// Component.setState internally call component.set with the options you defined in component.setupState
			intersect.object.setState( 'hovered' );

		}

	}

	// Update non-targeted buttons state

	objsToTest.forEach( ( obj ) => {

		if ( ( !intersect || obj !== intersect.object ) && obj.isUI ) {

			// Component.setState internally call component.set with the options you defined in component.setupState
			obj.setState( 'idle' );

		}

	} );

}
function raycast() {

	return objsToTest.reduce( ( closestIntersection, obj ) => {

		const intersection = raycaster.intersectObject( obj, true );

		if ( !intersection[ 0 ] ) return closestIntersection;

		if ( !closestIntersection || intersection[ 0 ].distance < closestIntersection.distance ) {

			intersection[ 0 ].object = obj;

			return intersection[ 0 ];

		}

		return closestIntersection;

	}, null );

}


function getTexturesFromAtlasFile( atlasImgUrl, tilesNum ) {

    const textures = [];

    for ( let i = 0; i < tilesNum; i ++ ) {

        textures[ i ] = new THREE.Texture();

    }

    const loader = new THREE.ImageLoader();
    loader.load( atlasImgUrl, function ( imageObj ) {

        let canvas, context;
        const tileWidth = imageObj.height;

        for ( let i = 0; i < textures.length; i ++ ) {

            canvas = document.createElement( 'canvas' );
            context = canvas.getContext( '2d' );
            canvas.height = tileWidth;
            canvas.width = tileWidth;
            context.drawImage( imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
            textures[ i ].image = canvas;
            textures[ i ].needsUpdate = true;

        }

    } );

    return textures;

}

function hideAllMainContainers(container){
    for ( let i = 0; i < mainContailners.length; i ++ ) {
    mainContailners[i].visible=false;
    }
    container.visible=true;
}
function updateMailBox(homeMainContainerTitle ,mailButton){
    console.log(mailButton.userData.data)

    //homeMainContainerTitle.children[1].content=test;
   // loop()
    //console.log(homeMainContainerTitle)
    homeMainContainerTitle.children[1].set(
        {
          content: mailButton.userData.data.subject,
        }
      );
      loop()
}