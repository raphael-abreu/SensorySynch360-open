/* eslint-disable no-undef */
import { addIntersectSphere, painOnMouseOver, changeTab, paintInfo, drawRectOnCanvas } from "./modules/debug.js";
// REMOVE TO DEBUG
console.log = function () { };

import { Timeline } from "./modules/timeline.js";
import { InfospostList } from "./modules/objList.js";
import {
  roundToIntegerTreshold,
  sleep,
  round,
  cartesianToLatLonDegree,
  latLonDegreeToCartesian,
  findCenter,
  findWidthHeight,
  randomIntFromInterval,
  exists,
  timestamp,
} from "./modules/common.js";

import translator from "./translation.js";
import sliderAutoTip from './modules/sliderAutoTip.js';
import CubemapToEquirectangular from './modules/cubemapToEquirect.js';


window.onload = function(){
  const tip = document.getElementById('rangeTip');
  const rangeSlider = new sliderAutoTip(tip);
  rangeSlider.init();
}

//import { runStressTest } from './modules/stressTest.js';
// test50, test100...
window.runStressTest = function runStressTest(qtd = 1) {
  const a = performance.now();
  for (let i = 0; i < qtd; i++) {
    const x = randomIntFromInterval(-3000, 3000);
    const y = randomIntFromInterval(-3000, 3000);
    const z = randomIntFromInterval(-3000, 3000);
    createInfospot({
      pano: panorama,
      location: new THREE.Vector3(x, y, z),
    });
  }
  const b = performance.now();
  const duration = b - a;
  return duration;
}


function sendEmailOnError(testData){
  var data = {
    service_id: 'service_ffx65u3',
    template_id: 'template_nafbwd6',
    user_id: 'LYPQWJ1Pv4g9Tbiug',
    template_params: {
        'message': JSON.stringify(testData)
    }
};

fetch('http://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => {
    if (response.ok) {
       console.log('Your mail is sent!');
    } else {
      alert('Connection problem. Please try again');
    }
})
.catch(error => {
  alert('Connection problem. Please try again');
});

}

import { createSequenceEditEn, createSequenceAutoExtractEn, createSequenceEditPt, createSequenceAutoExtractPt } from "./walktrough.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let navLanguage = navigator.language.substring(0, 2);
var userLanguage;
const swapCheckbox = document.getElementById("languageSwap");
 
if(urlParams.get("userLanguage"))
  navLanguage = urlParams.get("userLanguage");

if (navLanguage == "pt") {
  userLanguage = "pt";
  translator.translatePageTo("pt");
  swapCheckbox.checked = true;
} else {
  userLanguage = "en";
  swapCheckbox.checked = false;
  translator.translatePageTo("en");
}

swapCheckbox.addEventListener("change", function () {
  if (swapCheckbox.checked) {
    userLanguage = "pt";
    translator.translatePageTo("pt");
  } else {
    userLanguage = "en";
    translator.translatePageTo("en");
  }
  if (G_myList) G_myList.renderList();
});

const walktrough = urlParams.get("tutorial");
if (walktrough == "edit" && userLanguage=="en") {
  createSequenceEditEn();
  document.getElementById("activateAutoExtract").style.display = "none";
} else if (walktrough == "edit" && userLanguage=="pt") {
  createSequenceEditPt();
  document.getElementById("activateAutoExtract").style.display = "none";
}else if (walktrough == "autoextract" && userLanguage=="en") {
  createSequenceAutoExtractEn();
}else if (walktrough == "autoextract" && userLanguage=="pt") {
  createSequenceAutoExtractPt();
}

// Methods for test logging
let totalClicks = 0;
document.addEventListener("click", () => {
  totalClicks++;
});
let totalButtonClicks = 0;
let allButtons = document.querySelectorAll('button');
allButtons.forEach(button => {
  button.addEventListener('click', () => {
    totalButtonClicks++;
  });
});
const addedEffects = [];
const deletedEffects = [];
const positionModificationsPerEffect = {};
const attributeModificationsPerEffect = {};
const temporalModificationsPerEffect = {};
const insertOrUpdateCounterObj = function (counterObj, id) {
  counterObj[id] = (counterObj[id] || 0) + 1;
};

const clickedToBeginAutoextract = [];
const clickedOnAssociation = [];
let effectsOnTestEnd = [];

const testingID = urlParams.get("testUserID");
const testGroup = urlParams.get("testGroup");
let startedTask;
const testTask = urlParams.get("task");
const testMediaName = urlParams.get("mediaName");
const testType = urlParams.get("testType");
if (testType === "m") {
  document.getElementById("activateAutoExtract").style.display = "none";
}
if (testingID) {
  document.getElementById("startTestBtn").classList.remove("hidden");
  document.getElementById("uploadButton").classList.add("hidden");
}

const taskDescription = urlParams.get("taskDescription");

if(taskDescription){
  const el = document.getElementById("taskDescription");
  el.classList.remove('hidden');

  el.querySelector('#taskDescriptionID').textContent = (userLanguage == "pt" ? "Tarefa " : "Task ") + testTask;
  el.querySelector('#taskDescriptionText').setAttribute('data-tip',taskDescription);
  el.querySelector('#taskDescriptionText').addEventListener("mouseover", (event) => {el.querySelector('#taskDescriptionText').classList.remove('tooltip-open');});

}


document.getElementById("startTestBtn").addEventListener("click", () => {
  alert(translator.translateForKey("alert.test.begin", userLanguage));
  startedTask = timestamp();

  loadPanorama(testMediaName);

  document.getElementById("startTestBtn").classList.add("hidden");
  document.getElementById("stopTestBtn").classList.remove("hidden");
});

const tutorialID = urlParams.get("tutorialUserID");
if(tutorialID){
  // log
  startedTask = timestamp();
}

document.addEventListener("doneTutorial", function (e){
  const scriptURL =
    "http://script.google.com/macros/s/AKfycbw3zAzQ-CYQa-uUH_dALmvR61Lab1d9eOgaHuGyD8fysEg38NSTbfk0f0l_apAelorY4Q/exec";
  const formData = new FormData();
  formData.append("userID", tutorialID);
  formData.append("task", walktrough);
  let endTask = timestamp();

  const elapsedms = new Date(endTask) - new Date(startedTask);

  formData.append("startedTask", startedTask);
  formData.append("endedTask", endTask);
  formData.append("elapsedms", elapsedms);
  formData.append("mediaName", '-');
  formData.append("testType", '-');
  formData.append("totalClicks", totalClicks);
  formData.append("totalButtonClicks", totalButtonClicks);
  formData.append("addedEffects", JSON.stringify(addedEffects));
  formData.append("deletedEffects", JSON.stringify(deletedEffects));
  formData.append("positionModificationsPerEffect", JSON.stringify(positionModificationsPerEffect));
  formData.append("attributeModificationsPerEffect", JSON.stringify(attributeModificationsPerEffect));
  formData.append("temporalModificationsPerEffect", JSON.stringify(temporalModificationsPerEffect));

  fetch(scriptURL, { method: "POST", body: formData })
.then((response) => {
  console.log("Success!", response);
})
.catch((error) => {
  let ob = {};
  formData.forEach((value, key) => ob[key] = value);
  sendEmailOnError(JSON.stringify(ob));
  console.error("Error!", error.message);
});
});

document.getElementById("stopTestBtn").addEventListener("click", () => {
  console.log("Clicks", totalClicks);
  console.log("Button Clicks", totalButtonClicks);

  console.log("Added Effects", addedEffects);
  console.log("Deleted Effects", deletedEffects);
  console.log("Position modification per Effects", positionModificationsPerEffect);
  console.log("Attribute modification per Effects", attributeModificationsPerEffect);
  console.log("Temporal modification per Effects", temporalModificationsPerEffect);

  console.log("clickedToBeginAutoextract", clickedToBeginAutoextract);
  console.log("clickedOnAssociation", clickedOnAssociation);
  
  getInfospots(panorama).forEach((infospot) => {
    effectsOnTestEnd.push([infospot.uuid, infospot.getObjectByName("properties").userData]);
  });

  console.log("Effects on test end", effectsOnTestEnd);
  document.getElementById("stopTestBtn").innerText = translator.translateForKey("wait", userLanguage);
  document.getElementById("stopTestBtn").classList.remove("bg-red-600");

  // upload to the sheet InputData
  const scriptURL =
    "http://script.google.com/macros/s/AKfycbw3zAzQ-CYQa-uUH_dALmvR61Lab1d9eOgaHuGyD8fysEg38NSTbfk0f0l_apAelorY4Q/exec";
  const formData = new FormData();
  formData.append("userID", testingID);
  formData.append("testGroup", testGroup);
  formData.append("task", testTask);
  formData.append("mediaName", testMediaName);
  formData.append("testType", testType);
  let endTask = timestamp();

  const elapsedms = new Date(endTask) - new Date(startedTask);

  formData.append("startedTask", startedTask);
  formData.append("endedTask", endTask);
  formData.append("elapsedms", elapsedms);
  formData.append("totalClicks", totalClicks);
  formData.append("totalButtonClicks", totalButtonClicks);
  formData.append("addedEffects", JSON.stringify(addedEffects));
  formData.append("deletedEffects", JSON.stringify(deletedEffects));
  formData.append("positionModificationsPerEffect", JSON.stringify(positionModificationsPerEffect));
  formData.append("attributeModificationsPerEffect", JSON.stringify(attributeModificationsPerEffect));
  formData.append("temporalModificationsPerEffect", JSON.stringify(temporalModificationsPerEffect));

  if (clickedToBeginAutoextract) {
    formData.append("clickedToBeginAutoextract", clickedToBeginAutoextract);
  } else {
    formData.append("clickedToBeginAutoextract", "null");
  }

  if (clickedToBeginAutoextract) {
    formData.append("clickedOnAssociation", clickedOnAssociation);
  } else {
    formData.append("clickedOnAssociation", "null");
  }

  formData.append("effectsOnTestEnd", JSON.stringify(effectsOnTestEnd));

  fetch(scriptURL, { method: "POST", body: formData })
    .then((response) => {
      console.log("Success!", response);
      alert(translator.translateForKey("alert.test.end", userLanguage));
      document.getElementById("stopTestBtn").innerText = translator.translateForKey("close", userLanguage);
    })
    .catch((error) => {
      let ob = {};
      formData.forEach((value, key) => ob[key] = value);
      sendEmailOnError(JSON.stringify(ob));
      console.error("Error!", error.message);
      alert(translator.translateForKey("alert.test.error", userLanguage));
    });
});

const panoConteiner = document.querySelector("#panoPanel");
sessionStorage.removeItem("autoExtractResponse");

let panorama;
window.clickedInfospot = null;
window.draggedInfospotToIgnore = null;
let isTimelineCreated = false;
let timeline;
let timelineConteiner;
window.videoDuration = null;
let G_myList;

var minimap;

const panoSize = 5000;
const innerSphereSize = panoSize - 20;

// var panorama = new PANOLENS.VideoPanorama('./media/1941-battle-low.mp4');

function removeObject3D(object3D) {
  if (!(object3D instanceof THREE.Object3D)) return false;

  if (object3D.geometry) object3D.geometry.dispose();

  if (object3D.material) {
    if (object3D.material instanceof Array) {
      object3D.material.forEach((material) => material.dispose());
    } else {
      object3D.material.dispose();
    }
  }
  object3D.parent.remove(object3D); // the parent might be the scene or another Object3D, but it is sure to be removed this way
  return true;
}

const viewer = new PANOLENS.Viewer({
  container: panoConteiner,
  autoHideInfospot: false,
  viewIndicator: false,
  controlBar: false,
  output: "none", // or console
});
let fov = 75;
viewer.camera.fov = fov;
viewer.camera.updateProjectionMatrix();
viewer.OrbitControls.minFov = fov; 
viewer.OrbitControls.maxFov = fov; 
viewer.OrbitControls.momentumDampingFactor = 0.70;
viewer.OrbitControls.momentumScalingFactor = -0.005;
viewer.OrbitControls.momentumKeyDownFactor = 20;
viewer.OrbitControls.rotateSpeed = -0.5;



const base64media = { image: null, video: null };

function clearInfospots(pano) {
  while (pano.children.length > 0) {
    deleteInfospot(pano.children[0]);
  }
  if (typeof G_myList !== "undefined") G_myList.clearAll();
}

function changeContainerSize(width, height) {
  viewer.container.style.width = width + "px";
  viewer.container.style.height = height + "px";
  viewer.onWindowResize(width, height);
}

const infospotHistory = {
  past: [],
  present: [],
  future: [],
  addToHistory(infospotList) {
    this.future = []; // Clear future history. If we changed something, our future is no longer valid
    this.past.push(this.present); // push current state to past history
    this.present = [...infospotList]; // Save new state to present history. Dont need to push.
  },
  undo() {
    if (this.past.length > 0) {
      this.future.push(this.present); // push current state to future history
      this.present = this.past.pop(); // pop past state and place it in the present state
      return [...this.present]; // Return a copy of the present state so we can show the infos.
    }
    return null; // No more history to undo
  },
  redo() {
    if (this.future.length > 0) {
      this.past.push(this.present); // push current state to past history
      this.present = this.future.pop(); // pop future state and place it in the present state
      return [...this.present]; // Return a copy of the present state
    }
    return null; // No more history to redo
  },
  clear() {
    this.future = [];
    this.present = [];
    this.future = [];
  },
};

function doUndo(pano) {
  const infoList = infospotHistory.undo();
  if (infoList == null) return;
  clearInfospots(pano);
  setInfospots(pano, infoList);
}

function doRedo(pano) {
  const infoList = infospotHistory.redo();
  if (infoList == null) return;
  clearInfospots(pano);
  setInfospots(pano, infoList);
}

/** INFOSPOT MANAGEMENT FUNCTIONS */

// TODO: Experiment with functional programming
export function checkIntersection(intersects) {
  if (intersects.length <= 0) return false;
  let isInfo;
  let isPano = false;
  for (const el of intersects) {
    if (el.object.type == "Mesh" || el.object.type == "Infospot" || el.object.type == "infospot") {
      isInfo = true;
    }
    if (el.object.type == "panorama") isPano = true;
  }
  return isInfo ^ isPano;
}

function createSphericalPlane({ init = { lat, lon }, width, height }) {
  // Converte os ângulos em radianos
  let phi = (init.lat * Math.PI) / 180;
  let theta = ((-init.lon + 90) * Math.PI) / 180; // negative because we are seeing the sphere from inside out
  const phiLength = (width * Math.PI) / 180;
  const thetaLength = (height * Math.PI) / 180;
  // console.log(init.lat, init.lon, '****', width, height);
  // console.log('phi', phi, phiLength);
  // console.log('thetha', theta, thetaLength);
  if (theta - thetaLength / 2 <= 0 || theta + thetaLength / 2 >= Math.PI) {
    console.log("Warning! This action will overlap the Y axis of the panorama.");
  }

  // offset the plane to the upper right side, so the infospot is centered
  phi -= phiLength / 2;
  theta -= thetaLength / 2;

  const geometry = new THREE.SphereGeometry(innerSphereSize, 14, 14, phi, phiLength, theta, thetaLength);

  // Cria um material básico com cor aleatória
  const material = new THREE.MeshBasicMaterial({
    color: 0x88888,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4,
  });
  material.depthWrite = false;

  const sphere = new THREE.Mesh(geometry, material);
  sphere.addEventListener("click", function () {
    const infoClicked = this.parent.parent;
    console.log("Clicked on infospot boundingBox", infoClicked);
    toggleInfoAsClicked(infoClicked);
  });
  return sphere;
}

function addPropagationBorderToBbox(bBox, border, propagationSize, borderColor = 0xff0000) {
  if (propagationSize <= 1) {
    return;
  }
  // Converte os ângulos em radianos
  const propagationInradians = Number(propagationSize) * (Math.PI / 180);

  const phi = bBox.geometry.parameters.phiStart - propagationInradians / 2;
  let theta = bBox.geometry.parameters.thetaStart - propagationInradians / 2;
  let phiLength = bBox.geometry.parameters.phiLength + propagationInradians; // lateral increase
  let thetaLength = bBox.geometry.parameters.thetaLength + propagationInradians; // upwards increase

  // checks to avoid the border wrapping up the 360 image
  // that is, the propagation size can be up to 180 degrees, but does not wrap up on the panorama.
  if (theta <= 0) {
    theta = 0;
  }
  if (theta + thetaLength >= Math.PI) {
    thetaLength = Math.PI - theta;
  }

  if (phiLength >= Math.PI * 2) {
    phiLength = Math.PI * 2;
  }

  const geometry = new THREE.SphereGeometry(innerSphereSize, 9, 9, phi, phiLength, theta, thetaLength);
  const borderMaterial = new THREE.LineBasicMaterial({
    color: borderColor,
    transparent: true,
    opacity: 0.5,
  });
  // 20 is the threshold so that we do not show the innermost edges.
  const edgesGeometry = new THREE.EdgesGeometry(geometry, 1);

  const propagationBorder = new THREE.LineSegments(edgesGeometry, borderMaterial);
  propagationBorder.renderOrder = -1; // Make sure border is rendered after plane
  propagationBorder.name = "propagationBorder";
  border.add(propagationBorder); // Add border to the already existing border
}

function hideInfospot(infospot) {
  infospot.visible = false;

  infospot.traverse((child) => {
    child.visible = false;
  });
}

function showInfospot(infospot) {
  infospot.visible = true;

  infospot.traverse((child) => {
    child.visible = true;
  });
}

function deleteInfospot(infospot) {
  if (infospot == undefined) return;
  // log
  deletedEffects.push([timestamp(), infospot.uuid, infospot.getObjectByName("properties").userData.effectType]);

  removeObject3D(infospot);
  console.log("Infospost deleted");
  infospotHistory.addToHistory(getInfospots(panorama));
  if (G_myList) {
    const listItem = G_myList.findItemByData(infospot);
    if (listItem) G_myList.deleteItem(listItem.id);
  }
  if (timeline) {
    timeline.clear();
  }

  togglePanel("basePanel");
}

/**
 *
 *  This will UPDATE the current infospot and its data
 * Changes relative parameters of the currently selected infosPot
 * The parameter values are relative, that is, >0 will increase such value and < 0 will decrease.
 * Use this function only to make infospots travel trough the screen at small intervals.
 * @function
 * @param {infospot} infospot
 * @param {object} properties
 *
 */
/** */
function changeInfospot({ infospot, lat = 0, lon = 0, width = 0, height = 0 }) {
  const pano = infospot.parent;
  try {
    let currKeyFrameSec = 0;
    // trows error if there is no trim selected
    if (timeline) currKeyFrameSec = timeline.getCurrentClickedSecond();

    const position = infospot.getWorldPosition(new THREE.Vector3());
    const converter = new THREE.Vector3(-1, 1, 1); // Remember that the panorama is on direction -1 on X axis
    position.multiply(converter);

    // it is more convenient to work on spherical coordinates. Since it already constraints the movement in the XYZ plane along a sphere.
    const latLon = cartesianToLatLonDegree(position);
    latLon.lat += lat;
    latLon.lon += lon;
    const newPosition = latLonDegreeToCartesian(latLon).multiplyScalar(innerSphereSize);
    console.log("Position changed to", latLon);

    infospot.position.copy(newPosition);

    const properties = infospot.getObjectByName("properties").userData;
    const keyframes = getKeyFramesDataFromProperties(properties);
    const currentKeyframeProp = getKeyframeData(keyframes, currKeyFrameSec);

    currentKeyframeProp.centerPoint = latLon;

    if (!properties.isAmbient) {
      if (width) {
        currentKeyframeProp.size.width = parseInt(currentKeyframeProp.size.width) + parseInt(width);
        currentKeyframeProp.size.width = fixBetween(currentKeyframeProp.size.width, 1, 360);
      }
      if (height) {
        currentKeyframeProp.size.height = parseInt(currentKeyframeProp.size.height) + parseInt(height);
        currentKeyframeProp.size.height = fixBetween(currentKeyframeProp.size.height, 1, 180);
      }
      // log
      insertOrUpdateCounterObj(positionModificationsPerEffect, infospot.uuid);
      const boundingBox = infospot.getObjectByName("boundingBox");
      if (boundingBox) {
        // infospot.children[0].remove(boundingBox);
        removeObject3D(boundingBox);
        const returnObj = addBoundingBoxToInfospot(
          infospot,
          currentKeyframeProp.size.width,
          currentKeyframeProp.size.height
        );
        setBboxColor(returnObj, properties.effectType);
        addSelectionBorderToBbox(returnObj);
      }
    }
    properties.keyframes[currKeyFrameSec] = currentKeyframeProp;

    setEffectsKeyframeToForm(infospot, currKeyFrameSec);
    updateInfospotPosAndBbox(infospot, currKeyFrameSec);
  } catch (e) {
    alert(e);
  } finally {
    return infospot; // return the infospot to be marked to selection again.
  }
}

/**
 * Updates the infospot Bbox with the specified properties.
 *
 * @param {Infospot} infospot - The infospot to be updated.
 * @param {Object} properties - The new properties to apply to the infospot.
 *
 * @description This function updates the specified infospot with the provided properties.
 * The properties include latitude, longitude, width, and height, which are used to modify the infospot's position and size.
 * The latitude and longitude values are relative changes, where positive values increase the respective coordinate and negative values decrease it.
 * The width and height values are also relative changes, allowing the infospot's size to be adjusted.
 * The infospot's position is updated based on the new latitude and longitude values, while the size is updated using the width and height values.
 * The properties are applied relative to the current infospot's position and size.
 *
 * Note: This function does not update the keyframe properties of the infospot.
 * Use this function to make the infospot update whenever you changed the properties of the infospot.
 */

function updateInfospotPosAndBbox(infospot, currKeyFrameSec, prop = null) {
  let currentKeyframeProp = null;
  const properties = infospot.getObjectByName("properties").userData;
  const keyframes = getKeyFramesDataFromProperties(properties);
  if (!prop) {
    currentKeyframeProp = getKeyframeData(keyframes, currKeyFrameSec);
  } else {
    currentKeyframeProp = prop;
  }

  // position
  const position = infospot.getWorldPosition(new THREE.Vector3());
  const converter = new THREE.Vector3(-1, 1, 1);
  position.multiply(converter);
  const newPosition = latLonDegreeToCartesian(currentKeyframeProp.centerPoint).multiplyScalar(innerSphereSize);
  infospot.position.copy(newPosition);

  // bbox
  if (!properties.isAmbient) {
    const boundingBox = infospot.getObjectByName("boundingBox");
    const isSelected = !!infospot.getObjectByName("border");

    if (boundingBox) {
      // infospot.children[0].remove(boundingBox);
      removeObject3D(boundingBox);
      const returnObj = addBoundingBoxToInfospot(
        infospot,
        currentKeyframeProp.size.width,
        currentKeyframeProp.size.height
      );
      const color = setBboxColor(returnObj, properties.effectType, currentKeyframeProp.intensity);

      if (isSelected) {
        const border = addSelectionBorderToBbox(returnObj);
        const atenuationIntensity = currentKeyframeProp.propagation;
        addPropagationBorderToBbox(returnObj, border, atenuationIntensity,color);
        addMovementPathToBbox(border, properties.keyframes);
      }
    }
  }

  return infospot;
}

/**
 * Adds a movement path to a bounding box object by creating lines between keyframe coordinates.
 *
 * @param {THREE.Object3D} obj - The bounding box object to add the movement path to.
 * @param {Object} keyframes - The keyframes containing the coordinates for the movement path.
 */
function addMovementPathToBbox(obj, keyframes) {
  const keys = Object.keys(keyframes);
  for (let i = 0; i < keys.length - 1; i++) {
    const currentKey = keys[i];
    const nextKey = keys[i + 1];
    const currentElement = keyframes[currentKey];
    const nextElement = keyframes[nextKey];
    const line = createLineBetweenCoordinates(currentElement.centerPoint, nextElement.centerPoint);
    obj.add(line);
  }
}

/**
 *
 *  This will only make changes to the visual representation of the current infospot
 * Used for interpolating between two properties on the screen
 * @function
 * @param {infospot} infospot
 *
 */
/** */
function interpolateInfospot(infospot, currentSecond) {
  const pano = infospot.parent;
  const properties = infospot.getObjectByName("properties").userData;

  const { prevKeyframe, nextKeyframe } = getPrevNextKeyframeNumber(infospot, currentSecond);
  const keyframes = getKeyFramesDataFromProperties(properties);
  const start = prevKeyframe;
  const end = nextKeyframe;
  const firstProp = getKeyframeData(keyframes, start);
  const lastProp = getKeyframeData(keyframes, end);

  const duration = end - start;
  // represents how much the current second is in the effect timeline
  const currentSecondInDuration = currentSecond - start;

  // if the currenct secon is negative or it has passed the duration of the effect
  // we know that are not looking at the effect.
  if (currentSecondInDuration <= 0 || currentSecondInDuration > duration || properties["isAmbient"]) {
    //console.log('Ignoring interpolation');
    return;
  }
  let isObjsEqual =
    firstProp.intensity == lastProp.intensity &&
    firstProp.propagation == lastProp.propagation &&
    firstProp.centerPoint.lat == lastProp.centerPoint.lat &&
    firstProp.centerPoint.lon == lastProp.centerPoint.lon &&
    firstProp.size.width == lastProp.size.width &&
    firstProp.size.height == lastProp.size.height;
  if (isObjsEqual) {
    //console.log('Ignoring interpolation');
    return;
  }

  const stepProperties = calculateKeyframeInterpolation(firstProp, lastProp, duration, currentSecondInDuration);

  // use the below function to update the bbox.
  updateInfospotPosAndBbox(infospot, 0, stepProperties);

  return infospot; // return the infospot to be marked to selection again.
}

/**
 * The Missile Knows Where It Is...
 * Calculates the interpolation between two keyframe properties.
 *
 * @param {object} firstProp - The properties of the first keyframe.
 * @param {object} lastProp - The properties of the last keyframe.
 * @param {number} totalDuration - The total duration of the interpolation.
 * @param {number} desiredInterpolationSecond - The desired second of the interpolation.
 *
 * @returns {object} - The interpolated properties at the desired second.
 *
 * @description
 * This function calculates the delta (variation) between the properties of the first and last keyframes.
 * It applies the step function to each property, dividing the delta by the total duration to obtain the step for each duration second.
 * Then, it multiplies this step by the desired second to determine the interpolated value at that moment.
 *
 * For example, if the delta between keyframePropertyDelta.size.width is 5, the total duration is 3, and the desired second is 2,
 * the calculated step would be 5/3 = 1.6, and the interpolated width at the second 2 would be 1.6 * 2 = 3.2.
 * Thus, at the second 2, we must add 3.2 to the original width value.
 */

function calculateKeyframeInterpolation(firstProp, lastProp, totalDuration, desiredInterpolationSecond) {
  if (Math.abs(lastProp.centerPoint.lon - firstProp.centerPoint.lon) > 180)
    if (lastProp.centerPoint.lon > firstProp.centerPoint.lon) firstProp.centerPoint.lon += 360;
    else lastProp.centerPoint.lon += 360;

  const keyframePropertyDelta = {
    intensity: Number(lastProp.intensity) - Number(firstProp.intensity),
    centerPoint: {
      lat: lastProp.centerPoint.lat - firstProp.centerPoint.lat,
      lon: lastProp.centerPoint.lon - firstProp.centerPoint.lon,
    },
  };

  if (firstProp.size != undefined) {
    keyframePropertyDelta.size = {
      width: lastProp.size.width - firstProp.size.width,
      height: lastProp.size.height - firstProp.size.height,
    };
    keyframePropertyDelta.propagation = Number(lastProp.propagation) - Number(firstProp.propagation);
  }

  for (const prop in keyframePropertyDelta) {
    if (typeof keyframePropertyDelta[prop] === "object") {
      for (const nestedProp in keyframePropertyDelta[prop]) {
        keyframePropertyDelta[prop][nestedProp] =
          (keyframePropertyDelta[prop][nestedProp] / totalDuration) * desiredInterpolationSecond;
      }
    } else {
      keyframePropertyDelta[prop] = (keyframePropertyDelta[prop] / totalDuration) * desiredInterpolationSecond;
    }
  }

  // create the properties to be applied in this moment.
  const stepProperties = {};
  for (const prop in firstProp) {
    if (typeof firstProp[prop] === "object") {
      stepProperties[prop] = {};
      for (const nestedProp in firstProp[prop]) {
        stepProperties[prop][nestedProp] =
          Number(firstProp[prop][nestedProp]) + Number(keyframePropertyDelta[prop][nestedProp] || 0);
      }
    } else {
      stepProperties[prop] = Number(firstProp[prop]) + Number(keyframePropertyDelta[prop]);
    }
  }
  return stepProperties;
}

function fixBetween(v, min, max) {
  return Math.min(Math.max(parseInt(v), min), max);
}

function addSelectionBorderToBbox(bBox, borderColor = 0xffcc00) {
  if (bBox === undefined) {
    return;
  }
  // Create material for the border
  const borderMaterial = new THREE.LineBasicMaterial({ color: borderColor });
  // Create edges geometry for the spherical plane
  // 20 is the threshold so that we do not show the innermost edges.
  const edgesGeometry = new THREE.EdgesGeometry(bBox.geometry, 20);
  const border = new THREE.LineSegments(edgesGeometry, borderMaterial);
  border.renderOrder = 1; // Make sure border is rendered after plane
  border.name = "border";
  bBox.add(border); // Add border to plane
  return border;
}

function removeBoundingBoxFromInfospost(infospot) {
  // Get border object from plane
  const boundingBox = infospot.getObjectByName("boundingBox");

  const properties = infospot.getObjectByName("properties").userData;

  if (boundingBox) {
    
    // Assume infospot is an Object3D instance
    infospot.children.forEach((child) => {
      // child.remove(boundingBox); // Remove boundingBox from plane
      removeObject3D(boundingBox);

    });

    // infospot.children[0].remove(boundingBox); // Remove boundingBox from plane
  }
}

function addBoundingBoxToInfospot(infospot, width, height) {
  const latLon = cartesianToLatLonDegree(infospot.position);
  const returnObj = createSphericalPlane({
    init: { lat: latLon.lon, lon: latLon.lat },
    width,
    height,
  });
  returnObj.name = "boundingBox";
  infospot.children[0].attach(returnObj);
  // addBorderToPlane(infospot.getObjectByName('boundingBox'));
  /* returnObj.addEventListener('click', function () {
    const infoClicked = this.parent.parent;
    console.log('Clicked on infospot boundingBox', infoClicked);
    toggleInfoAsClicked(infoClicked);
  }); */
  return returnObj;
}

/**
 * Adds size properties to all keyframes of the specified infospot.
 *
 * @param {Infospot} infospot - The infospot to add size properties to.
 * @param {number} width - The width to be added to each keyframe's size property.
 * @param {number} height - The height to be added to each keyframe's size property.
 *
 * @description This function adds the specified width and height values to the size property of each keyframe of the infospot.
 * The width and height values are added to the existing size values of each keyframe, resulting in a relative change in size.
 * This function is useful when you want to increase or decrease the size of the infospot across all keyframes.
 * The changes are applied to each keyframe's size property, and the updated properties are stored within the infospot.
 * Note that this function does not update the actual size of the infospot in the scene.
 */
function addSizeAndPropagationToKeyframes(infospot, width, height) {
  const properties = infospot.getObjectByName("properties").userData;
  const keyframes = getKeyFramesDataFromProperties(properties);

  for (const keyframeSec in keyframes) {
    const keyframe = keyframes[keyframeSec];
    keyframe.size = {};
    keyframe.size.width = width;
    keyframe.size.height = height;
    keyframe.propagation = 0;
  }
}

function removeSelectionBorderFromBbox(plane) {
  if (plane === undefined) {
    return;
  }
  // Get border object from plane
  const border = plane.getObjectByName("border");

  if (border) {
    // plane.remove(border); // Remove border from plane
    removeObject3D(border);
  }
}

function getIconUrlFromEffectName(name) {
  return document.getElementById(name).getElementsByTagName("img")[0].src;
}

// this function is used to enable the panel and disable others.
function togglePanel(panelIdToShow) {
  if(document.getElementById("autoExtractResultsPanel").classList.contains("sticky"))
    return;
  const sidePanels = document.getElementById("panelContainer").children;
  Array.from(sidePanels).forEach((panel) => {
    panel.classList.add("hidden");
  });
  const panel = document.getElementById(panelIdToShow);
  panel.classList.remove("hidden");
  const btn = panel.querySelector('.btn-enabled');
  if(btn){
    btn.classList.remove('btn-enabled');
    btn.classList.add('btn-disabled');
  }

}
document.querySelector("#activateAutoExtract").addEventListener("click", () => {
  const savedResponseString = sessionStorage.getItem("autoExtractResponse");
  if (savedResponseString) {
    const useSavedResponse = confirm(translator.translateForKey("alert.confirm", userLanguage));
    if (useSavedResponse) {
      let response = JSON.parse(savedResponseString);
      showLabelsModal(response);
      togglePanel("autoExtractResultsPanel");
      document.getElementById("autoExtractResultsPanel").classList.add("sticky");
      return;
    }
  }
  togglePanel("autoExtractPanel");
});
// If we clicked on the infospost, it will toggle the effect properties.

async function setInfospotIconAndName(infospot, effectType,baseIntensity= 50) {
  let texture;
  const iconUrl = getIconUrlFromEffectName(effectType);
  texture = new THREE.TextureLoader().load(iconUrl);
  await sleep(500);

  infospot.material.map = texture;
  infospot.addHoverText(`${effectType}`, 50);
  const bBox = infospot.getObjectByName("boundingBox"); 
  if (bBox) {
    setBboxColor(bBox, effectType,baseIntensity);
  }
}

function setBboxColor(bBox, effectType, intensity = null) {
  let newColor;
  switch (effectType) {
    case "Wind":
      newColor = new THREE.Color(0, 1, 0);
      break;
    case "Heat":
      newColor = new THREE.Color(1, 0, 0);
      break;
    case "Cold":
      newColor = new THREE.Color(0, 0, 1);
      break;
    case "Aroma":
      newColor = new THREE.Color(0, 0.5, 1);
      break;
    case "Vibration":
      newColor = new THREE.Color(0.5, 0, 1);
      break;
    case "Light":
      newColor = new THREE.Color(0.8, 1, 1);
      break;
    default:
      throw new Error("Unexpected infospot name");
  }
  bBox.material.color = newColor;
  // setting the opacity based on the intensity
  if (intensity !== "undefined") bBox.material.opacity = 0.1 + (Number(intensity) / 100) * 0.7;
  return newColor;
}

// clicks or unclicks an infospot
function toggleInfoAsClicked(infospot) {
  if (window.clickedInfospot == infospot) {
    removeSelectionBorderFromBbox(window.clickedInfospot.getObjectByName("boundingBox"));
    if (timeline) {
      timeline.clear();
    }
    togglePanel("basePanel");
    window.clickedInfospot = null;
    if (G_myList) G_myList.clearActiveItems();
    return;
  }

  infospot.focus();
  if (window.clickedInfospot) {
    removeSelectionBorderFromBbox(window.clickedInfospot.getObjectByName("boundingBox"));
  }

  const border = addSelectionBorderToBbox(infospot.getObjectByName("boundingBox"));
  window.clickedInfospot = infospot;

  if (timeline) {
    const infospotDuration = getInfospotDuration(infospot);
    timeline.setTrimTime(infospotDuration.start, infospotDuration.end);
    const properties = infospot.getObjectByName("properties").userData;
    let keyframes = getKeyFramesDataFromProperties(properties);
    keyframes = Object.keys(keyframes).map((key) => Number(key));
    timeline.clearKeyframes();
    timeline.setKeyframesTimes(keyframes);
    timeline.clearClickedTrim();
    timeline.clearClickedKeyframe();

    if (border) addMovementPathToBbox(border, properties.keyframes);
    clearEffectPropertiesFromForm();
    if (timeline.trimSelector.style.display === "none") timeline.showTrimBar();
  }
  if (G_myList) G_myList.setItemActiveByData(infospot);

  setBasePropertiesToForm(infospot);
  togglePanel("effectPropertiesPanel");
}

export function createInfospot({ pano, location: rayCastLocation, properties, effectType, isAmbient, initSecond }) {

  let initialKfSecond = initSecond || 0;
  let returnObj;
  const latlon = cartesianToLatLonDegree(rayCastLocation);
  // Because it's Equirectangular Projection the latlong maps directy to image coordinates (x, y)

  console.log("RaycastLocation on the outer sphere", rayCastLocation);
  // project the cartesian points 2000units before the panorama mesh, so they dont intersect
  const cart = latLonDegreeToCartesian(latlon).clone().multiplyScalar(innerSphereSize);

  const infospot = new PANOLENS.Infospot(500, PANOLENS.DataImage.Info, false);
  console.log("(creating infospot): ", infospot);

  infospot.position.set(cart.x, cart.y, cart.z);

  const prop = new THREE.Object3D();
  const endTime = videoDuration;
  prop.name = "properties";
  if (properties) {
    prop.userData = properties;
  } else {
    prop.userData = {
      effectType: effectType || "Wind",
      isAmbient: isAmbient || false,
      keyframes: {},
    };

    const kf = {
      intensity: 50,
      centerPoint: latlon,
    };
    if (!isAmbient) {
      kf.size = { width: 20, height: 20 };
      kf.propagation = 0;
    }

    prop.userData.keyframes[initialKfSecond] = kf;
    ;
    prop.userData.keyframes[endTime] = structuredClone(kf); // this clones kf into a new obj...Fucking js...
  }

  if (optsToEffects[effectType]) {
    prop.userData.opts = {
      [optsToEffects[effectType]]: "",
    };
  }

  infospot.addHoverText(prop.userData.effectType, -50);

  pano.add(infospot);
  const group = new THREE.Group();
  group.attach(prop);

  const keyframes = getKeyFramesDataFromProperties(prop.userData);
  const firstKey = Object.keys(keyframes)[0];
  const firstKeyframeProp = keyframes[firstKey];

  if (firstKeyframeProp.size) {
    // returnObj = createPlane(cart);
    returnObj = createSphericalPlane({
      init: { lat: latlon.lon, lon: latlon.lat },
      width: firstKeyframeProp.size.width,
      height: firstKeyframeProp.size.height,
    });
    returnObj.name = "boundingBox";
    group.attach(returnObj);
  }

  infospot.attach(group);

  infospot.addEventListener("click", function () {
    const infoClicked = this;
    console.log("Clicked on infospot", infoClicked);
    toggleInfoAsClicked(infoClicked);
  });

  setInfospotIconAndName(infospot, prop.userData.effectType);
  infospot.show();
  if (G_myList) {
    const itemData = infospot;
    G_myList.addElement(itemData);
  }

  // log
  addedEffects.push([timestamp(), infospot.uuid, prop.userData.effectType]);

  return infospot;
}

function getInfospots(pano) {
  return pano.children.filter((child) => child instanceof PANOLENS.Infospot);
}

function setInfospots(pano, infoList) {
  infoList.forEach((info) => {
    pano.add(info);
  });
}

function startDrag(event) {
  const container = event.target.closest(".draggable-icon");
  window.draggedObj = container;
}
// Attach event listeners for mobile and desktop drag functionality
const draggableElements = document.querySelectorAll(".draggable-icon");
draggableElements.forEach((element) => {
  element.addEventListener("dragstart", startDrag);

  // For mobile, use touch events
  element.addEventListener("touchstart", (event) => {
    startDrag(event);
    const touch = event.targetTouches[0];

    // Store the initial touch position as data on the element
    element.dataset.touchStartX = touch.clientX;
    element.dataset.touchStartY = touch.clientY;
  });

  element.addEventListener("touchmove", (event) => {
    event.preventDefault(); // Prevent scrolling during dragging on mobile

    const touch = event.targetTouches[0];

    // Calculate the distance moved from the initial touch position
    const deltaX = touch.clientX - element.dataset.touchStartX;
    const deltaY = touch.clientY - element.dataset.touchStartY;

    // Move the element based on the distance moved
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  });

  element.addEventListener("touchend", (event) => {
    element.style.transform = "";

    // Clear the stored touch position data
    delete element.dataset.touchStartX;
    delete element.dataset.touchStartY;
    // Trigger the drop event programmatically on panoConteiner
    const dropEvent = new MouseEvent("drop", {
      bubbles: true,
      clientX: event.changedTouches[0].clientX,
      clientY: event.changedTouches[0].clientY,
    });
    panoConteiner.dispatchEvent(dropEvent);
  });
});

panoConteiner.addEventListener("dragover", (e) => {
  e.preventDefault();
});


let clickStartTime;

panoConteiner.addEventListener("mousedown", (downEvent) => {
  clickStartTime = performance.now();

  const containerRect = panoConteiner.getBoundingClientRect();
  const startX = downEvent.clientX;
  const startY = downEvent.clientY;

  const handleMouseUp = (upEvent) => {
    const clickDuration = performance.now() - clickStartTime;
    
    const endX = upEvent.clientX;
    const endY = upEvent.clientY;

    const distance = Math.sqrt((startX - endX) ** 2 + (startY - endY) ** 2);

    if (clickDuration < 400 && distance < 5) {
      console.log("Fast click on the panorama");
      upEvent.preventDefault();

      const dropX = ((endX - containerRect.left) / containerRect.width) * 2 - 1;
      const dropY = (-(endY - containerRect.top) / containerRect.height) * 2 + 1;
      viewer.raycaster.setFromCamera(new THREE.Vector2(dropX, dropY), viewer.camera);
      const intersects = viewer.raycaster.intersectObject(panorama, true);

      if (checkIntersection(intersects)) {
        if (window.clickedInfospot)
          toggleInfoAsClicked(window.clickedInfospot);
      }
    }

    // Remove the mouseup event listener after it's handled
    window.removeEventListener("mouseup", handleMouseUp);
  };

  window.addEventListener("mouseup", handleMouseUp);
});

panoConteiner.addEventListener("drop", (e) => {
  console.log("dropped", window.draggedObj);
  if (window.draggedObj == null) throw new Error("Invalid dropped object");

  e.preventDefault();

  // Calculate the normalized device coordinates (NDC) of the drop position
  const containerRect = panoConteiner.getBoundingClientRect();
  const dropX = ((e.clientX - containerRect.left) / containerRect.width) * 2 - 1;
  const dropY = (-(e.clientY - containerRect.top) / containerRect.height) * 2 + 1;
  // Set the raycaster's origin and direction based on the drop position
  viewer.raycaster.setFromCamera(new THREE.Vector2(dropX, dropY), viewer.camera);
  const intersects = viewer.raycaster.intersectObject(panorama, true);
  if (checkIntersection(intersects)) {
    const point = intersects[0].point.clone();
    console.log(point);
    // Panorama is scaled -1 on X axis. Use this to adjust the point accordingly
    const converter = new THREE.Vector3(-1, 1, 1);
    point.multiply(converter);
    const latlon = cartesianToLatLonDegree(point);

    const currentSecond = Math.floor(panorama.getVideoElement().currentTime)

    const ret = createInfospot({
      pano: panorama,
      location: point,
      effectType: window.draggedObj.id,
      initSecond : currentSecond
    });
    toggleInfoAsClicked(ret);
    infospotHistory.addToHistory(getInfospots(panorama));
    window.draggedObj = null;
  }
});

function initPano(type = "image") {
  if (panorama) {
    clearInfospots(panorama);
    removeObject3D(panorama);
  }
  if (type == "video") {
    panorama = new PANOLENS.VideoPanorama({ loop: false });
  } else if (type == "image") {
    panorama = new PANOLENS.ImagePanorama();
  } else {
    alert("Error! Panorama media type not identified");
    return;
  }
  
  

  panorama.addEventListener("load", (e) => {

    setTimeout(function() {
      
      
      const planeDistance = -10;
      const fovDegrees = viewer.camera.fov; // Vertical field of view in degrees
      const vFOV = fovDegrees * (Math.PI / 180); // Convert   const distance = -10; 
      const visibleHeight = 2 * Math.tan(vFOV / 2) * planeDistance;
      const visibleWidth = visibleHeight * viewer.camera.aspect;
      const geometry = new THREE.PlaneGeometry( visibleWidth-5, visibleHeight-5 );
      const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0,
      });
      planeMaterial.depthWrite = false;
      const plane = new THREE.Mesh( geometry, planeMaterial );
      viewer.camera.add( plane );
      viewer.scene.add(viewer.camera)
      plane.position.set(0,0,planeDistance);
      addSelectionBorderToBbox(plane,0xff0000);


      const canvas = document.getElementById("miniView");
      let ctx = canvas.getContext('2d');
      var cm = new CubemapToEquirectangular(viewer.renderer,viewer.scene,viewer);
      setInterval(function() {
        //console.log("rendered");
        //TODO!!!
        let imageData = cm.getImageData('equirectangular');
        ctx.putImageData(imageData, 0, 0);
      }, 100);
      
  },1000);

    let animationFrameId = null;
    const videoEl = panorama.getVideoElement();

    let lastTimestamp = 0;
    const frameInterval = 1000 / 25; // frames per second

    console.log("Carregando panorama");
    viewer.setPanorama(panorama);
    viewer.add(panorama);

    sessionStorage.removeItem("autoExtractResponse");
 

    if (panorama.material.map.image.playsinline !== undefined) {
      isTimelineCreated = true;
      console.log("é um vídeo. Iniciando timeline");

      timelineConteiner = document.getElementById("timelineConteiner");
      timelineConteiner.replaceChildren();
      videoDuration = panorama.material.map.image.duration;
      timeline = new Timeline(timelineConteiner, videoDuration);
      timeline.hideTrimBar();

      // quick fix for a black bar on the panorama when loaded. The cause is bad DOM ordering
      changeContainerSize(panoConteiner.offsetWidth, panoConteiner.offsetHeight);

      timeline.addEventListener("needlePositionChangedClick", (position) => {
        panorama.setVideoCurrentTime({ percentage: position });
        console.log('Needle changed by click to ', position);
        updateInfospotsVisibility(panorama, position, videoDuration,G_myList);
        if (window.clickedInfospot) {
          togglePanel("effectPropertiesPanel");
        }
      });

      timeline.addEventListener("needlePositionChangedDrag", (position) => {
        panorama.setVideoCurrentTime({ percentage: position });
        console.log('Needle changed by drag to ', position);
        updateInfospotsVisibility(panorama, position, videoDuration,G_myList);
      });

      timeline.addEventListener("double-click", (clickedSecond, clickedPercentage) => {
        console.log("double click on s", clickedSecond, "pos", clickedPercentage);
        if(!window.clickedInfospot)
          return;
        if (isKeyFrameActive(window.clickedInfospot, clickedSecond)) {
          alert(`Keyframe ${clickedSecond} ${translator.translateForKey("alert.keyframeCreated", userLanguage)}`);
        } else {
          const res = getInfospotDuration(window.clickedInfospot);
          if (clickedSecond < res.start || clickedSecond > res.end) return;
          timeline.addKeyframe(clickedPercentage, clickedSecond);
          addKeyframeToInfospot(window.clickedInfospot, clickedSecond);
          timeline.keyframeClickByTime(clickedSecond);
        }
      });

      timeline.addEventListener("keyframe-click", (keyframeSecond) => {
        // change the timeline needle so we can see the infospot

        const position = keyframeSecond / videoDuration;
        timeline.updateNeedlePositionToKeyframe(position);
        panorama.setVideoCurrentTime({ percentage: position });
        updateInfospotsVisibility(panorama, position, videoDuration,G_myList);
        setEffectsKeyframeToForm(window.clickedInfospot, keyframeSecond);
        updateInfospotPosAndBbox(window.clickedInfospot, keyframeSecond);
        togglePanel("keyframePropertiesPanel");
      });
      timeline.addEventListener("keyframe-unclick", () => {
        togglePanel("effectPropertiesPanel");
      });
      timeline.addEventListener("trim-dragging",(position) => {
        
        window.draggedInfospotToIgnore = window.clickedInfospot;
        position = position / 100;
        timeline.updateNeedlePositionToKeyframe(position);
        // for some reason panolens does not update the video if percentage is 1. We need to update the video!
        if (position == 1) {
          position = 0.999;
        }
        panorama.setVideoCurrentTime({ percentage: position });
      });
      timeline.addEventListener("trim-drag-end", (obj) => {
        window.draggedInfospotToIgnore = null;
        const oldKeyframeTime = obj.initialKeyframe;
        const newKeyframeTime = obj.endKeyframe;
        const needlePos = timeline.getNeedlePosition();

        updateKeyframeKey(window.clickedInfospot, oldKeyframeTime, newKeyframeTime);
        // log
        insertOrUpdateCounterObj(temporalModificationsPerEffect, window.clickedInfospot.uuid);

        removeKeyframesBetweenTimes(window.clickedInfospot, oldKeyframeTime, newKeyframeTime);
        updateInfospotsVisibility(panorama, needlePos, videoDuration,G_myList);
      });

      timeline.addEventListener("trim-click", (selectedKeyframeSecond) => {
        console.log("Event! clicked second", selectedKeyframeSecond);

        // change the timeline needle so we can see the infospot
        let position = selectedKeyframeSecond / videoDuration;
        timeline.updateNeedlePositionToKeyframe(position);
        // for some reason panolens does not update the video if percentage is 1. We need to update the video!
        if (position == 1) {
          position = 0.999;
        }
        panorama.setVideoCurrentTime({ percentage: position });
        updateInfospotsVisibility(panorama, position, videoDuration,G_myList);

        setEffectsKeyframeToForm(window.clickedInfospot, selectedKeyframeSecond);
        updateInfospotPosAndBbox(window.clickedInfospot, selectedKeyframeSecond);
        togglePanel("keyframePropertiesPanel");
      });

      function updateElapsedTime(videoEl, timestamp) {
        if (timestamp - lastTimestamp >= frameInterval) {
          lastTimestamp = timestamp;

          const videoProgress = videoEl.duration >= 0 ? videoEl.currentTime / videoEl.duration : 0;
          const position = videoProgress;
          timeline.updateNeedlePosition(position);
          updateInfospotsVisibility(panorama, position, videoDuration);
        }

        animationFrameId = requestAnimationFrame((timestamp) => updateElapsedTime(videoEl, timestamp));
      }

      timeline.addEventListener("play", () => {
        panorama.playVideo();
        timeline.clearClickedTrim();
        // Get the video texture
        console.log("Video duration:", videoDuration);
        if (window.clickedInfospot) {
          togglePanel("effectPropertiesPanel");
        }
        // note that we can only get away with this because our video never stops
        // and this event only fires once per click

        // Call the updateElapsedTime function initially
        animationFrameId = requestAnimationFrame((timestamp) => updateElapsedTime(videoEl, timestamp));
      });

      timeline.addEventListener("pause", () => {
        panorama.pauseVideo();
        cancelAnimationFrame(animationFrameId);
      });

      // removing the timeline if it was already created for video.
    } else if (panorama.material.map.image.playsinline === undefined && isTimelineCreated) {
      isTimelineCreated = false;
      const timelineConteiner = document.getElementById("timelineConteiner");
      timelineConteiner.replaceChildren();
    }

    // initializing effectList
    G_myList = new InfospostList("listContainer", timeline);

    // Custom event handler for list item click event
    G_myList.addEventListener("itemClick", (obj) => {
      // change the timeline needle so we can see the infospot
      const res = getInfospotDuration(obj);
      if (timeline && window.clickedInfospot != obj) {
        const position = res.start / videoDuration;
        timeline.updateNeedlePosition(position);
        panorama.setVideoCurrentTime({ percentage: position});
        updateInfospotsVisibility(panorama, position, videoDuration,G_myList);
        //setEffectsKeyframeToForm(window.clickedInfospot, selectedKeyframeSecond);
        //updateInfospotPosAndBbox(window.clickedInfospot, selectedKeyframeSecond);
        togglePanel("effectPropertiesPanel");
      } else {
        togglePanel("basePanel");
      }
      toggleInfoAsClicked(obj);
    });


  });

  //const light = new THREE.AmbientLight();
  //viewer.scene.add(light);
  // addIntersectSphere(viewer.scene,innerSphereSize);

  window.viewer = viewer;

  // handle the update click
  const pform = document.getElementById("keyframe-properties-form");
  const submitButtonp = pform.querySelector('#btn-keyframe-form');
  pform.onkeypress = function (evt) { 
    var btn = 0 || evt.keyCode || evt.charCode; 
    if (btn == 13) { 
        evt.preventDefault(); 
    } 
  } 
  pform.addEventListener('change', () => {
      submitButtonp.classList.remove('btn-disabled');
      submitButtonp.classList.add('btn-enabled');
    });

  if (pform.addEventListener) {
    pform.addEventListener(
      "submit",
      () => {
        submitButtonp.classList.add('btn-disabled');

        const keyframeProperties = getKeyframePropertiesFromForm();

        let currKeyFrameSec = 0;

        try {
          currKeyFrameSec = timeline.getCurrentClickedSecond();
          setEffectKeyframeProperties(window.clickedInfospot, keyframeProperties, currKeyFrameSec);
          updateInfospotPosAndBbox(window.clickedInfospot, currKeyFrameSec);
          if (G_myList) {
            G_myList.renderList();
          }
        } catch (e) {
          alert(e);
        }
      },
      false
    );
  }

  const copyKeyframeButton = document.getElementById("copy-keyframe");

  copyKeyframeButton.addEventListener("click", () => {
    setbuttonChange();

    let infospot = window.clickedInfospot;
    const currKeyFrameSec = timeline.getCurrentClickedSecond();
    const { prevKeyframe, nextKeyframe } = getPrevNextKeyframeNumber(infospot, currKeyFrameSec);
    const { start, end } = getInfospotDuration(infospot);
    const properties = infospot.getObjectByName("properties").userData;

    if (start == currKeyFrameSec) {
      alert(translator.translateForKey("alert.keyframeCopy", userLanguage));
      return;
    }
    const keyframes = getKeyFramesDataFromProperties(properties);
    const prevProp = getKeyframeData(keyframes, prevKeyframe);
    properties.keyframes[currKeyFrameSec] = { ...prevProp };

    const border = infospot.getObjectByName("border");
    addMovementPathToBbox(border, properties.keyframes);

    const position = currKeyFrameSec / videoDuration;

    updateInfospotsVisibility(panorama, position, videoDuration,G_myList);
    setEffectsKeyframeToForm(infospot, currKeyFrameSec);
    updateInfospotPosAndBbox(infospot, currKeyFrameSec);

    // log
    insertOrUpdateCounterObj(temporalModificationsPerEffect, infospot.uuid);
  });

  const deleteKeyframeButton = document.getElementById("delete-keyframe");
  deleteKeyframeButton.addEventListener("click", () => {
    if (timeline.getClickedTrim() != null) {
      alert(translator.translateForKey("alert.keyframeDelete", userLanguage));
      return;
    }
    const currKeyFrameSec = timeline.getCurrentClickedSecond();
    deleteKeyframe(window.clickedInfospot, currKeyFrameSec);
    timeline.removeKeyframeByTime(currKeyFrameSec);
    updateInfospotsVisibility(panorama, position, videoDuration,G_myList);
    togglePanel("effectPropertiesPanel");
  });

    // handle the update click for bform
    const bform = document.getElementById("base-properties-form");
    const submitButton = bform.querySelector('button[type="submit"]');

    bform.addEventListener('change', () => {
      submitButton.classList.remove('btn-disabled');
      submitButton.classList.add('btn-enabled');
    });
    bform.addEventListener("submit", () => {
      submitButton.classList.add('btn-disabled');
      const properties = window.clickedInfospot.getObjectByName("properties").userData;
      const baseProperties = getBasePropertiesFromForm();
      // log
      insertOrUpdateCounterObj(attributeModificationsPerEffect, window.clickedInfospot.uuid);
      // ????updateInfospotPosAndBbox(window.clickedInfospot, 0);
      if (baseProperties.isAmbient) {
        removeSizeAndPropagationFromKeyframes(properties);
        removeBoundingBoxFromInfospost(window.clickedInfospot);
        // this means that the effect stopped being ambient.
      } else if (properties.isAmbient == true) {
        let returnObj = addBoundingBoxToInfospot(window.clickedInfospot, 20, 20);
        addSelectionBorderToBbox(returnObj);
        addSizeAndPropagationToKeyframes(window.clickedInfospot, 20, 20);
      }
      
      setInfospotIconAndName(window.clickedInfospot, baseProperties.effectType);
      // update
      properties.isAmbient = baseProperties.isAmbient;
      properties.effectType = baseProperties.effectType;
      properties.opts = baseProperties.opts;
      // update the form based on the recently changed properties
      if (G_myList) {
        G_myList.renderList();
      }
      setBasePropertiesToForm(window.clickedInfospot);
      
    });

  setupKeyControls(false);

  /* const undoButton = document.getElementById('undoButton');
  undoButton.addEventListener('click', () => {
    doUndo(panorama);
  });

  const redoButton = document.getElementById('redoButton');
  redoButton.addEventListener('click', () => {
    doRedo(panorama);
  }); */
}

function printToOutput(obj, textBoxID) {
  const pretty = JSON.stringify(obj, undefined, 4);
  document.getElementById(textBoxID).value = pretty;
}

function readOutPut(textBoxID) {
  const text = document.getElementById(textBoxID).value;
  if (text == "") {
    console.error("No json data on element");
    return null;
  }
  const jsonObj = JSON.parse(text);
  return jsonObj;
}

/**
 * Exports infospots to Json
 * @function
 * @param {panorama} pano
 */
function exportMarkup(pano) {
  const converter = new THREE.Vector3(-1, 1, 1); // Panorama is scaled -1 on X axis. Use this to adjust the point accordingly
  const effectList = [];
  for (const infospot of pano.children) {
    // jsonObj[infospot.id] = [];
    if (infospot.type == "Object3D") continue; // only stay in this loop if relly a infospot
    const infoData = infospot.getObjectByName("properties").userData;

    // consult positions on runTime
    // infoData.centerPoint = cartesianToLatLonDegree(infospot.position);

    

    effectList.push(infoData);
  }

  printToOutput(effectList, "textBoxJson");


  return effectList;
}


function download(file, text) {
  var element = document.createElement('a');
  element.setAttribute('href',
      'data:text/plain;charset=utf-8, '
      + encodeURIComponent(text));
  element.setAttribute('download', file);
  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
}

function importMarkup(panorama) {
  const jsonObj = readOutPut("textBoxJson");
  console.group("Importing infospots");
  for (const effect of jsonObj) {
    console.log("Curent obj", effect);

    const keyframes = getKeyFramesDataFromProperties(effect);
    let centerPoint = Object.values(keyframes)[0]['centerPoint'];

    if (!centerPoint) {
      centerPoint = {
        lat: randomIntFromInterval(-20, 20),
        lon: randomIntFromInterval(-60, -120),
      };
      Object.values(keyframes)[0]['centerPoint'] = centerPoint;
      Object.values(keyframes)[Object.keys(keyframes).length-1]['centerPoint'] = centerPoint;
    }
    const point = latLonDegreeToCartesian(centerPoint);
    console.log(centerPoint, "becomes", point);
    createInfospot({
      pano: panorama,
      location: point,
      properties: effect,
    });
    console.groupEnd();
  }
  infospotHistory.addToHistory(getInfospots(panorama));
  if (timeline != "undefined") {
    // if needleposition is 0 the effects aren`t added correctly
    let lp = timeline.getNeedlePosition() || 0.01;

    panorama.setVideoCurrentTime({ percentage: lp });
    updateInfospotsVisibility(panorama, lp, videoDuration,G_myList);
  }
  console.groupEnd();
}

function stringToBool(str) {
  if (str.toLowerCase() === "true") {
    return true;
  }
  if (str.toLowerCase() === "false") {
    return false;
  }
  throw new Error(`Invalid input data: ${str}`);
}

/**
 * Retrieves the start and end duration of the infospot based on its keyframes.
 *
 * @param {infospot} infospot - The infospot object.
 * @returns {Object} An object containing the start and end duration of the infospot.
 *                   The start and end values are the keyframe seconds.
 */

function getInfospotDuration(infospot) {
  const properties = infospot.getObjectByName("properties").userData;
  const keyframes = getKeyFramesDataFromProperties(properties);
  const keyframeKeys = Object.keys(keyframes);
  const start = Number(keyframeKeys[0]);
  const end = Number(keyframeKeys[keyframeKeys.length - 1]);
  return { start, end };
}

function getPrevNextKeyframeNumber(infospot, currentSecond) {
  const properties = infospot.getObjectByName("properties").userData;
  const keyframes = getKeyFramesDataFromProperties(properties);
  const keyframeKeys = Object.keys(keyframes);

  let prevKeyframe = null;
  let nextKeyframe = null;

  if (Number(keyframeKeys[0]) == currentSecond) {
    prevKeyframe = Number(keyframeKeys[0]);
    nextKeyframe = Number(keyframeKeys[1]);
    return { prevKeyframe, nextKeyframe };
  }
  if (Number(keyframeKeys[keyframeKeys.length - 1]) == currentSecond) {
    prevKeyframe = Number(keyframeKeys[keyframeKeys.length - 2]);
    nextKeyframe = Number(keyframeKeys[keyframeKeys.length - 1]);
    return { prevKeyframe, nextKeyframe };
  }
  for (let i = 0; i < keyframeKeys.length; i++) {
    const keyframeTime = Number(keyframeKeys[i]);

    if (keyframeTime === currentSecond) {
      // prev Keyframe the the key saved in the previous iteration. no need to update
      // nextKeyframe the the following
      nextKeyframe = Number(keyframeKeys[i + 1]);
      break;
    }

    if (keyframeTime > currentSecond) {
      nextKeyframe = keyframeTime;
      if (i > 0) {
        prevKeyframe = Number(keyframeKeys[i - 1]);
      }
      break;
    }

    prevKeyframe = keyframeTime;
  }

  return { prevKeyframe, nextKeyframe };
}

function getKeyFramesDataFromProperties(infospotProperties) {
  const keyframes = {};
  if ("keyframes" in infospotProperties) {
    for (const key in infospotProperties.keyframes) {
      keyframes[key] = infospotProperties.keyframes[key];
    }
  } else {
    if (!("intensity" in infospotProperties)) {
      throw new Error("Unexpected properties data");
    }
    keyframes["0"].intensity = infospotProperties.intensity;
    keyframes["0"].propagation = infospotProperties.propagation;
    keyframes["0"].size = infospotProperties.size;
    keyframes["0"].centerPoint = infospotProperties.centerPoint;
  }
  return keyframes;
}

function getKeyframeData(keyframes, selectedKeyframeSecond) {
  if (selectedKeyframeSecond in keyframes) return keyframes[selectedKeyframeSecond];
  throw new Error("This moment does not exist in the keyframes");
}


/**
 * Updates the visibility of infospots in a panorama based on the current position of the video playback.
 *
 * @param {Object} panorama - The panorama object containing the infospots.
 * @param {number} needlePosition - The current normalized position of the video playback (0-1).
 * @param {number} videoDuration - The total duration of the video in seconds.
 *
 * This function iterates over each infospot in the panorama. If the current second of the video playback
 * falls within the start and end duration of the infospot, it shows the infospot and interpolates it based on the current second.
 * Otherwise, it hides the infospot. If `myList` is defined, it also renders the list.
 */

function updateInfospotsVisibility(panorama, needlePosition, videoDuration,myList = null) {
  const currentInfospots = getInfospots(panorama);
  if(window.draggedInfospotToIgnore){
    const index = currentInfospots.indexOf(draggedInfospotToIgnore);
    currentInfospots.splice(index, 1);
    showInfospot(draggedInfospotToIgnore);
  }
  const currentSecond = round(needlePosition * videoDuration,3); // assume float seconds. Format is S.Ms !!!
  currentInfospots.forEach((infospot) => {
    const infospotDuration = getInfospotDuration(infospot);
    if (currentSecond >= infospotDuration.start && currentSecond <= infospotDuration.end) {
      showInfospot(infospot);
      interpolateInfospot(infospot, currentSecond);
    } else {
      hideInfospot(infospot);
    }
  });
  if (myList) {
    myList.renderList();
  }
}

/**
 * Sets the effect properties to the form for the clicked infospot
 *
 * @param {Infospot} clickedInfospot - The infospot that was clicked.
 *
 * @description This function sets the effect properties of the clicked infospot to the corresponding form elements.
 * The form elements are identified by their respective IDs:
 * - effect type checkboxes: ID is the effect type name (e.g., "Wind").
 * - ambient checkbox: ID is "isAmbient".
 *
 * Note: The form elements should already exist in the HTML document.
 */

function setBasePropertiesToForm(clickedInfospot) {
  const properties = clickedInfospot.getObjectByName("properties").userData;
  const effectName = properties.effectType;
  const { isAmbient } = properties; // is possible that this will be string? is so, use stringToBool()

  const checkBox = document.querySelector(`[id$=check${effectName}]`); // ex ids: checkWind, checkHeat...
  if(checkBox)
    checkBox.checked = true;
  showAndSetHiddenEffectProperties(properties);

  const isAmbientCheckbox = document.querySelector("input[name=isAmbient]");
  isAmbientCheckbox.checked = isAmbient; // true/false
}

/**
 * Sets the effect to the form for the clicked infospot and selected keyframe.
 *
 * @param {Infospot} clickedInfospot - The infospot that was clicked.
 * @param {number} selectedKeyframeSecond - The selected keyframe time in seconds.
 *
 * @description This function sets the effect properties of the clicked infospot to the corresponding form elements.
 * It updates the intensity range, propagation range, effect width, and effect height.
 * The form elements are identified by their respective IDs:
 * - intensity range: ID is "intensityRange".
 * - propagation range: ID is "propagationRange".
 * - effect width: ID is "effectWidth".
 * - effect height: ID is "effectHeight".
 * * effect lat: ID is "effectLat".
 * - effect lon: ID is "effectLon".
 *
 * Note: The form elements should already exist in the HTML document.
 */

function setEffectsKeyframeToForm(clickedInfospot, selectedKeyframeSecond) {
  const properties = clickedInfospot.getObjectByName("properties").userData;
  const keyframes = getKeyFramesDataFromProperties(properties);

  const currentKeyframeProperties = getKeyframeData(keyframes, selectedKeyframeSecond);

  if (!properties.isAmbient) {
    document.getElementById("effectLat").value = currentKeyframeProperties.centerPoint.lat;
    document.getElementById("effectLon").value = currentKeyframeProperties.centerPoint.lon;
    document.getElementById("effectWidth").disabled = false;
    document.getElementById("effectHeight").disabled = false;
    document.getElementById("propagationRange").disabled = false;
    document.getElementById("intensityRange").value = currentKeyframeProperties.intensity;

    document.getElementById("propagationRange").value = currentKeyframeProperties.propagation;

    document.getElementById("effectWidth").value = currentKeyframeProperties.size.width;
    document.getElementById("effectHeight").value = currentKeyframeProperties.size.height;
    document.getElementById("effectSizeConteiner").removeAttribute("style");
    document.getElementById("propagationRangeConteiner").removeAttribute("style");
  } else {
    document.getElementById("effectWidth").disabled = true;
    document.getElementById("effectHeight").disabled = true;
    document.getElementById("propagationRange").disabled = true;
    document.getElementById("effectSizeConteiner").style.display = "none";
    document.getElementById("propagationRangeConteiner").style.display = "none";
  }
  document.getElementById("intensityRange").value = currentKeyframeProperties.intensity;
}

function removeSizeAndPropagationFromKeyframes(properties) {
  const { keyframes } = properties;

  for (const idx of Object.keys(keyframes)) {
    if (keyframes[idx].size) delete keyframes[idx].size;
    if (keyframes[idx].propagation !== undefined && keyframes[idx].propagation !== null) {
      delete keyframes[idx].propagation;
    }
  }
}

function getBasePropertiesFromForm() {
  const properties = {
    effectType: "Wind",
    isAmbient: false,
  };
  const radioButtons = document.getElementsByName("sensoryEffects");
  radioButtons.forEach((el) => {
    if (el.checked) properties.effectType = el.value;
  });
  const isAmbientCheckbox = document.querySelector("input[name=isAmbient]");
  if (!isAmbientCheckbox.checked) {
    properties.isAmbient = false;
  } else {
    properties.isAmbient = true;
  }
  if (optsToEffects[properties.effectType]) {
    const input = document.getElementById(optsToEffects[properties.effectType]).getElementsByTagName("input")[0];
    properties.opts = {
      [optsToEffects[properties.effectType]]: input.value,
    };
  }
  return properties;
}

/*
Gets the properties from the form. This function only gets the data.
Other functions must validade if this keyframe has size or not
*/

function getKeyframePropertiesFromForm() {
  function getValueFromElement(elementId) {
    const element = document.getElementById(elementId);
    return element && element.disabled ? 0 : Number(element?.value || 0);
  }
  function isDisabled(elementId) {
    const element = document.getElementById(elementId);
    return element.disabled;
  }

  const keyframeProp = {
    intensity: getValueFromElement("intensityRange"),
    centerPoint: {
      lat: getValueFromElement("effectLat"),
      lon: getValueFromElement("effectLon"),
    },
    size: {
      width: getValueFromElement("effectWidth"),
      height: getValueFromElement("effectHeight"),
    },
  };
  if (!isDisabled("effectWidth")) {
    keyframeProp.size = {
      width: getValueFromElement("effectWidth"),
      height: getValueFromElement("effectHeight"),
    };
  }
  if (!isDisabled("propagationRange")) {
    keyframeProp.propagation = getValueFromElement("propagationRange");
  }

  return keyframeProp;
}

function clearEffectPropertiesFromForm() {
  const pform = document.getElementById("keyframe-properties-form");
  pform.reset();
}

function setEffectKeyframeProperties(infospot, newKeyframeProperties, keyframeSec) {
  const properties = infospot.getObjectByName("properties").userData;
  // log
  insertOrUpdateCounterObj(attributeModificationsPerEffect, infospot.uuid);

  if (!properties.isAmbient) {
    newKeyframeProperties.size.width = fixBetween(newKeyframeProperties.size.width, 1, 360);
    newKeyframeProperties.size.height = fixBetween(newKeyframeProperties.size.height, 1, 180);
  } else {
    delete newKeyframeProperties.size;
    delete newKeyframeProperties.propagation;
  }
  properties.keyframes[keyframeSec] = newKeyframeProperties;
}

/**
 * Updates the key of the selected keyframe of the specified infospot with a new key.
 *
 * @param {Infospot} infospot - The infospot to update.
 * @param {string} selectedKeyframeTime - The key of the selected keyframe.
 * @param {string} newKeyframeKey - The new key for the selected keyframe.
 *
 * @description This function updates the key of the selected keyframe of the infospot with the specified new key.
 * It is useful when you want to change the key of a specific keyframe within an infospot's timeline.
 * The function retrieves the keyframes from the infospot's properties, finds the selected keyframe, and updates its key.
 * After updating the keyframe, the properties are stored within the infospot.
 */
function updateKeyframeKey(infospot, selectedKeyframeKey, newKeyframeKey) {
  const properties = infospot.getObjectByName("properties").userData;
  const keyframes = getKeyFramesDataFromProperties(properties);

  const selectedKeyframe = keyframes[selectedKeyframeKey];

  if (selectedKeyframe) {
    delete keyframes[selectedKeyframeKey];
    keyframes[newKeyframeKey] = selectedKeyframe;
    properties.keyframes = keyframes;
  }
}

function isKeyFrameActive(infospot, selectedKeyframeSecond) {
  const properties = infospot.getObjectByName("properties").userData;
  const keyframes = getKeyFramesDataFromProperties(properties);

  if (selectedKeyframeSecond in keyframes) return true;
  return false;
}

function removeKeyframesBetweenTimes(infospot, oldKeyframeTime, newKeyframeTime) {
  const properties = infospot.getObjectByName("properties").userData;
  const keyframes = getKeyFramesDataFromProperties(properties);
  let initialTime = oldKeyframeTime;
  let endTime = newKeyframeTime;
  if (initialTime > endTime) {
    const temp = initialTime;
    initialTime = endTime;
    endTime = temp;
  }
  for (const [keyframeTime, _] of Object.entries(keyframes)) {
    const keyframeSecond = Number(keyframeTime);
    if (keyframeSecond >= initialTime && keyframeSecond <= endTime) {
      // if the keyframe is the same as the trim, we just remove for the timeline
      if (keyframeSecond != newKeyframeTime) {
        deleteKeyframe(infospot, keyframeSecond);
      }
      timeline.removeKeyframeByTime(keyframeSecond);
    }
  }
}
function deleteKeyframe(infospot, selectedKeyframeSecond) {
  // log
  insertOrUpdateCounterObj(temporalModificationsPerEffect, infospot.uuid);

  const properties = infospot.getObjectByName("properties").userData;
  const keyframes = getKeyFramesDataFromProperties(properties);
  if (selectedKeyframeSecond in keyframes) {
    delete properties.keyframes[selectedKeyframeSecond];
  } else {
    throw new Error("This moment does not exist in the keyframes");
  }
}

function addKeyframeToInfospot(infospot, selectedKeyframeSecond) {
  // log
  insertOrUpdateCounterObj(temporalModificationsPerEffect, infospot.uuid);

  const { prevKeyframe, nextKeyframe } = getPrevNextKeyframeNumber(infospot, selectedKeyframeSecond);
  const { start, end } = getInfospotDuration(infospot);
  const properties = infospot.getObjectByName("properties").userData;

  const keyframes = getKeyFramesDataFromProperties(properties);
  const prevProp = getKeyframeData(keyframes, prevKeyframe);
  const nextProp = getKeyframeData(keyframes, nextKeyframe);

  const duration = nextKeyframe - prevKeyframe;
  if (selectedKeyframeSecond in keyframes) {
    throw new Error("Keyframe Already Exists");
  }
  if (selectedKeyframeSecond < start || selectedKeyframeSecond > end) {
    throw new Error(translator.translateForKey("alert.keyframeout", userLanguage));
  }

  // interpolate beteen the prev and nex props.
  const selectedKeyframeSecondInDuration = selectedKeyframeSecond - prevKeyframe; // Brugael
  const stepProperties = calculateKeyframeInterpolation(prevProp, nextProp, duration, selectedKeyframeSecondInDuration);

  properties.keyframes[selectedKeyframeSecond] = stepProperties;
}

/**
 * Keyboard movement
 */
// TODO: Apenas liberar isso se o mouse estiver em cima da tela do 360
function setupKeyControls(debug = false) {
  const { camera } = viewer;
  let isMouseOverPanorama = false;

  panoConteiner.addEventListener("mouseenter", () => {
    isMouseOverPanorama = true;
  });

  panoConteiner.addEventListener("mouseleave", () => {
    isMouseOverPanorama = false;
  });
  document.onkeydown = function (e) {
    const { target } = e;
    if (target.tagName == "INPUT" || !isMouseOverPanorama) {
      return;
    }
    if (debug == true) {
      switch (e.code) {
        case "ShiftLeft":
          camera.position.z -= 30;
          break;
        case "ControlLeft":
          camera.position.z += 30;
          break;
        case "KeyA":
          camera.position.x -= 30;
          break;
        case "KeyD":
          camera.position.x += 30;
          break;
        case "KeyW":
          camera.position.y += 30;
          break;
        case "KeyS":
          camera.position.y -= 30;
          break;
        default:
          break;
      }
    }
    if (e.ctrlKey && e.key === "z") {
      doUndo(panorama);
    } else if (e.ctrlKey && e.key === "y") {
      doRedo(panorama);
    }

    if (window.clickedInfospot) {
      switch (e.keyCode) {
        case 46:
          deleteInfospot(window.clickedInfospot);
          break;
        default:
          break;
      }
    }
  };
}


function buildHeaders() {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  //headers.append('credentials','include');
  return headers;
}

function buildJsonFormData(form) {
  const formData = new FormData(form);
  const jsonFormData = {};
  for (const [key, value] of formData.entries()) {
    jsonFormData[key] = value;
  }
  return jsonFormData;
}

async function performPostHttpRequest(url, headers, jsonFormData) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(jsonFormData),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function submitAutoExtract(e, form) {
  let response = {};
  e.preventDefault();
  const baseJsonFormData = {};
  const headers = buildHeaders();
  const currentIPAddress = window.location.hostname; // This gets the current hostname (which can be an IP address)
  const route =   `http://${currentIPAddress}/api/upload_video`;
  
  /* going to use video only for now */
  if (base64media.image) {
    baseJsonFormData.image = base64media.image;
    // route += 'upload_image';
  } else if (base64media.video) {
    baseJsonFormData.video = base64media.video;
    // route += 'upload_video';
  } else {
    throw new Error("Media not loaded");
  }

  const activeModules = Object.keys(buildJsonFormData(form)); // effectLocalizationCheck, sceneUnderstandingCheck, sunLocalizationCheck, fireLocalizationCheck
  const activeModulesNames = activeModules.map((moduleName) => modulesDOMdata[moduleName].divId); // effectLocalization, sceneUnderstanding, sunLocalization, fireLocalization

  /* Perfoms the recognition and returns the labels in the entire duration of the
  scene for each module* */

  response = performPostHttpRequest(route, headers, { ...baseJsonFormData, ...{ modules: activeModulesNames } });
  return response;
}

async function pollProgressUpdates(job_uid, selectedModules) {
  
  // Function to continuously poll for progress updates
  const currentIPAddress = window.location.hostname; // This gets the current hostname (which can be an IP address)

  try {
    const intervalId = setInterval(async function () {
      const progressResponse = await fetch(
        `http://${currentIPAddress}/api/get_modules_status?` +
        new URLSearchParams({
            user_id: job_uid,
          })
      );
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        console.log("Progress:", progressData);

        document.querySelector("#modal-loading-modules").checked = true;
        let modalBody = document.getElementById("body-modal-loading-modules");
        selectedModules.forEach((moduleName) => {
          const moduleDiv = modalBody.querySelector(`[data-progress-${moduleName}]`);
          moduleDiv.classList.remove("hidden");
        });

        for (const moduleName in progressData) {
          let status = progressData[moduleName].status;
          let isNum = parseFloat(status);
          const moduleDiv = modalBody.querySelector(`[data-progress-${moduleName}]`);
          if (!isNaN(isNum)) {
            moduleDiv.querySelector("progress").classList.remove("hidden");
            moduleDiv.querySelector("span").classList.add("hidden");

            moduleDiv.querySelector("progress").value = isNum;
          } else {
            moduleDiv.querySelector("progress").classList.add("hidden");
            moduleDiv.querySelector("span").classList.remove("hidden");
            moduleDiv.querySelector("span").innerHTML = status;
          }
        };

        const isFinished = Object.values(progressData).reduce((accumulator, currentValue) => {
          if (!accumulator) return false;
          return currentValue.response !== null;
        }, true);
        if (isFinished) {
          clearInterval(intervalId);

          const doneEvt = new CustomEvent("doneModules");
          document.dispatchEvent(doneEvt);

          document.querySelector("#modal-loading-modules").checked = false;
          let modalBody = document.getElementById("body-modal-loading-modules");
          selectedModules.forEach((moduleName) => {
            const moduleDiv = modalBody.querySelector(`[data-progress-${moduleName}]`);
            moduleDiv.classList.add("hidden");
          });

          selectedModules.forEach((moduleName) => {
            if(progressData[moduleName].status == "error"){
              alert("There was an error processing your request. Reload the page and try again.");
              return;
            }
          });
          let newResponse = {}
          selectedModules.forEach((moduleName) => {
            newResponse[moduleName] = progressData[moduleName].response;
          });


          sessionStorage.setItem("autoExtractResponse", JSON.stringify(newResponse));
          console.log(newResponse);
          showLabelsModal(newResponse);
          initAutoExtractResultsPanel(newResponse);

          timeline.pause();

        }
      } else {
        console.error("Error fetching progress:", progressResponse.status);
        clearInterval(intervalId);
      }
    }, 3000);
  } catch (error) {
    console.error("Error occurred during progress polling:", error);
  }
}

/**
 * EVENT LISTENERS
 */
const optsToEffects = {
  Aroma: "aromaType",
  Light: "lightColor",
};

function showAndSetHiddenEffectProperties(properties) {
  Object.keys(optsToEffects).forEach((inputId) => {
    document.getElementById(optsToEffects[inputId]).classList.add("hidden");
    document.getElementById(optsToEffects[inputId]).value = "";
  });

  if (properties.effectType in optsToEffects) {
    const optsName = optsToEffects[properties.effectType];
    const div = document.getElementById(optsName);
    div.querySelector("input").value = properties.opts[optsName];
    div.classList.remove("hidden");
    return true;
  }
  return false;
}
// this animates the interactivity that when we select a module that has options, its options should show below
const checkboxes = document.querySelectorAll("input[name=sensoryEffects]");
for (let i = 0; i < checkboxes.length; i++) {
  const checkBox = checkboxes[i];
  checkBox.addEventListener("click", () => {
    Object.keys(optsToEffects).forEach((inputId) => {
      document.getElementById(optsToEffects[inputId]).classList.add("hidden");
      document.getElementById(optsToEffects[inputId]).value = "";
    });
    const val = checkBox.value;
    if (val in optsToEffects) {
      const div = document.getElementById(optsToEffects[val]);
      div.classList.remove("hidden");
      return true;
    }
  });
}

/*

Code responsible for handling the autoextraction

*/

// module checkbox Id, the module Div ID, the module form id
const modulesDOMdata = {
  effectLocalizationCheck: {
    divId: "effectLocalization",
    formId: "form-control-labels-localization",
    animation: "effect_localization_animation_icon",
  },
  sceneUnderstandingCheck: {
    divId: "sceneUnderstanding",
    formId: "form-control-labels-understanding",
    animation: "scene_understanding_animation_icon",
  },
  sunLocalizationCheck: {
    divId: "sunLocalization",
    formId: "form-control-labels-sun",
    animation: "sun_localization_animation_icon",
  },
  fireLocalizationCheck: {
    divId: "fireLocalization",
    formId: "form-control-labels-fire",
    animation: "fire_localization_animation_icon",
  },
};

// this function animates the modules selector on the first step of the autoextract
Object.entries(modulesDOMdata).forEach(([checkboxId, moduleData]) => {
  document.getElementById(checkboxId).onchange = function () {
    const checkbox = this;
    const animationItem = document.getElementById(moduleData.animation);
    const parentElement = document.getElementById(checkboxId).parentNode;
    const labelSuccess = parentElement.querySelector("label.text-success");
    const labelError = parentElement.querySelector("label.text-error");

    if (checkbox.checked) {
      animationItem.classList.add("st0");
      animationItem.classList.remove("st1");
      labelSuccess.classList.remove("hidden");
      labelError.classList.add("hidden");
    } else {
      animationItem.classList.remove("st0");
      animationItem.classList.add("st1");
      labelSuccess.classList.add("hidden");
      labelError.classList.remove("hidden");
    }
  };
});

// this handles the first part of the autoexctract. the modules selection.
const autoExtractForm = document.querySelector("#beginAutoExtract");
if (autoExtractForm) {
  autoExtractForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const btnSubmit = document.getElementById("beginAutoExtractBtn");
    btnSubmit.disabled = true;
    const activeModules = Object.keys(buildJsonFormData(this));
    const activeModulesNames = activeModules.map((moduleName) => modulesDOMdata[moduleName].divId);
    
    try {
      addVideoUploadLoadingGif();
      let response = await submitAutoExtract(e, this);
     

      // log
      clickedToBeginAutoextract.push([timestamp(), activeModulesNames, JSON.stringify(response)]);
      if (!response.error) {
        console.log("Sucess!!");  
        btnSubmit.disabled = false;
        pollProgressUpdates(response.job_uid, Object.values(activeModulesNames));
        timeline.play();
        } else {
        alert(response.error);
      }

    } catch (e) {
      alert(e);
    } finally {
      btnSubmit.disabled = false;
      clearVideoUploadLoadingGif();
      
    }
  });
}

// gets only the UNIQUE label names for each module
function extractLabels(obj) {
  const result = {};

  for (const [moduleName, moduleData] of Object.entries(obj)) {
    result[moduleName] = [];
    const labelCounts = {}; // Object to store label counts
    let imagesForLabels = {}; // 'labels':[images]

    for (const [key, value] of Object.entries(moduleData)) {
      const containsObjects = value.some((item) => typeof item === "object");
      let labels;
      if (!containsObjects) {
        labels = value;
      } else {
        labels = value.map((item) => Object.keys(item)[0]);
        let keys_and_sample_images = value
          .map((item) =>
            Object.values(item)[0]["sample_image"]
              ? [Object.keys(item)[0], Object.values(item)[0]["sample_image"]]
              : null
          )
          .filter((item) => item !== null);
        for (const [keyName, sampleImageBase64] of keys_and_sample_images) {
          if (keyName in imagesForLabels) {
            imagesForLabels[keyName].push(sampleImageBase64);
          } else {
            imagesForLabels[keyName] = [sampleImageBase64];
          }
        }
      }
      result[moduleName].push(...labels);
      labels.forEach((label) => {
        labelCounts[label] = (labelCounts[label] || 0) + 1;
      });
    }
    // Get unique label names and their counts
    result[moduleName] = [...new Set(result[moduleName])].map((label) => ({
      name: label,
      count: labelCounts[label] || 0,
      sample_images: imagesForLabels[label],
    }));
  }

  return result;
}

// this function opens the panel, shows only the selected modules and populates the modules with the labels as options.
function initAutoExtractResultsPanel(data) {
  const labelsForEachModule = extractLabels(data);
  togglePanel("autoExtractResultsPanel");


  document.getElementById("autoExtractResultsPanel").classList.add("sticky");

  // reset all to hidden
  for (const moduleData in modulesDOMdata) {
    const { divId } = modulesDOMdata[moduleData];
    const moduleDiv = document.getElementById(divId);
    if (divId in labelsForEachModule) {
      moduleDiv.classList.remove("hidden");
      // populate module options
      let labelSelectElement = moduleDiv.querySelector('select[name="labelThatMatches"]');
      labelSelectElement.innerHTML = "";
      labelsForEachModule[divId].forEach((label) => {
        const option = document.createElement("option");
        option.text = label.name;
        option.value = label.name;
        labelSelectElement.appendChild(option);
      });
    } else {
      moduleDiv.classList.add("hidden");
    }
  }
}

// initAutoExtractResultsPanel(tempbj);

function showLabelsModal(data) {
  const labelsForEachModule = extractLabels(data);
  document.querySelector("#labelsResponseModal").checked = true;

  for (const moduleData in modulesDOMdata) {
    const moduleName = modulesDOMdata[moduleData].divId;
    const moduleElement = document.querySelector(`[data-${moduleName}]`);
    const divLabelsElement = document.querySelector(`[data-${moduleName}Labels]`);

    if (labelsForEachModule[moduleName]) {
      const labels = labelsForEachModule[moduleName];
      moduleElement.classList.remove("hidden");
      divLabelsElement.innerHTML = "";

      Object.values(labels).forEach((label) => {
        divLabelsElement.classList.add("p-2");
        const p = document.createElement("p");
        p.textContent = label.name + " (x" + label.count + ")";
        divLabelsElement.appendChild(p);
        p.classList.add("flex");
        // we are just using one image. But the sample_images returns a list for each second.
        if (label["sample_images"]) {
          let singleLabelImage = label["sample_images"][0];
          let labelImage = document.createElement("img");
          labelImage.src = "data:image/png;base64," + singleLabelImage;
          labelImage.classList.add("p-2");
          p.appendChild(labelImage);
        }
      });
    } else {
      divLabelsElement.innerHTML = "";
      moduleElement.classList.add("hidden");
    }
  }
}
// showLabelsModal(tempbj);



// for each div in my list
Object.entries(modulesDOMdata).forEach(([checkboxId, moduleData]) => {
  const effectDiv = document.getElementById(moduleData.divId);
  const baseSelectElement = effectDiv.querySelector('select[name="effectToActivate"]');
  baseSelectElement.addEventListener("change", (e) => {
    showOptsInAutoExtract(e.target);
  });
});

function showOptsInAutoExtract(select) {
  const name = select.options[select.selectedIndex].getAttribute("name");
  // go to the parent above, that is, the main DIV
  const aromaEl = select.closest(".addLabelToEffectComponent").querySelector('[data-opts="Aroma"]');
  const lightEl = select.closest(".addLabelToEffectComponent").querySelector('[data-opts="Light"]');

  aromaEl.classList.add("hidden");
  lightEl.classList.add("hidden");
  aromaEl.parentElement.querySelector("input").value = "";
  lightEl.parentElement.querySelector("input").value = "";

  if (name == "Aroma") {
    aromaEl.classList.remove("hidden");
    aromaEl.parentElement.querySelector("input").value = "";
  } else if (name == "Light") {
    lightEl.classList.remove("hidden");
    lightEl.parentElement.querySelector("input").value = "";
  }
}


document.getElementById("form-control-labels-localization").addEventListener('submit',handleAssociation);
document.getElementById("form-control-labels-understanding").addEventListener('submit',handleAssociation);
document.getElementById("form-control-labels-sun").addEventListener('submit',handleAssociation);
document.getElementById("form-control-labels-fire").addEventListener('submit',handleAssociation);

document.getElementById("makeAssociation").addEventListener('click',(e)=>{
  document.getElementById("autoExtractResultsPanel").classList.remove("sticky");
  togglePanel("basePanel");

});


async function handleAssociation(e){
  const labels2effectDict = {};
  const inputGroup = e.target;
  const selectElement = inputGroup.querySelector('[name="effectToActivate"]');
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const sensoryEffect = selectedOption.getAttribute("name");
  if(sensoryEffect == null)
    return
  
  let btn = inputGroup.getElementsByTagName("button")[0];
  btn.classList.add('btn-disabled');

  const label = inputGroup.querySelector('[name="labelThatMatches"]').value;
  const intensity = inputGroup.querySelector('[name="intensityToActivate"]').value;
  const propagation = (inputGroup.querySelector('[name="propagationToActivate"]') || {}).value || false;
  let opts = {};
  if (optsToEffects[sensoryEffect]) {
    const optsName = optsToEffects[sensoryEffect];
    const inputVal = inputGroup
      .querySelector(`[data-opts=${sensoryEffect}`)
      .querySelector(`[name=${optsName}]`).value;
    opts[optsName] = inputVal;
  } else {
    opts = null;
  }

  let parentId = e.target.name;

  if (!labels2effectDict[parentId]) {
    labels2effectDict[parentId] = {};
  }
  if (!labels2effectDict[parentId][sensoryEffect]) {
    labels2effectDict[parentId][sensoryEffect] = {};
  }
  const tempObj = {};
  if (intensity) {
    tempObj.intensity = intensity;
  }
  if (propagation) {
    tempObj.propagation = Number(propagation);
  }
  if (opts) {
    tempObj.opts = opts;
  }
  labels2effectDict[parentId][sensoryEffect][label] = tempObj;

  console.log("labels2SensoryEffects Dict:", labels2effectDict);
  const autoExtractReponse = JSON.parse(sessionStorage.getItem("autoExtractResponse"));
  const response = await submitEffectsGeneration(autoExtractReponse, labels2effectDict);
  btn.classList.remove('btn-disabled');

  if(!response) {
    alert(`Error...`);
    return;
  }

  // LOG
  clickedOnAssociation.push([timestamp(), parentId, sensoryEffect, label, JSON.stringify(tempObj)]);

  printToOutput(response, "textBoxJson");
  importMarkup(panorama);
}

async function submitEffectsGeneration(recognizedLabels, labels2effectDict, selectFilterAndCombinePreset = null) {
  let response = {};
  const headers = buildHeaders();
  const currentIPAddress = window.location.hostname;
  const route = `http://${currentIPAddress}/api/labels_2_sensory_effects`;
  
    response = await performPostHttpRequest(route, headers, {
      labels: recognizedLabels,
      labels2effectDict,
      "select-filter-combine-preset": selectFilterAndCombinePreset,
    });  
  return response;
}


// this handles the LAST part of the autoexctract.The LABELS2EFFECTS
const generateSensoryEffectsForm = document.querySelector("#autoExtractResult");
if (generateSensoryEffectsForm) {
  generateSensoryEffectsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const labels2effectDict = {};
    //const selectFilterAndCombinePreset = document.getElementById("select-filter-combine-preset").value;
    //TODO
    //TODO
    //TODO
    //TODO
    //TODO
    //TODO
    //TOFDO
  });
}

document.getElementById("fileInput").addEventListener("change", (event) => {
  const reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);
  reader.onloadend = function (e) {
    if (!initialized) {
      let mimeType = e.target.result.slice(0, 100); // removing unneeded parts just to make it faster.
      mimeType = mimeType.split(",")[0].split(":")[1];

      if (mimeType.startsWith("image")) {
        initPano("image");
        base64media.image = reader.result;
      } else if (mimeType.startsWith("video")) {
        initPano("video");
        addVideoUploadLoadingGif();

        const videoEl = panorama.getVideoElement();
        videoEl.src = reader.result;
        videoEl.addEventListener("loadeddata", () => {
          base64media.video = reader.result;
        });

        // clear loading bar on the video. This loading bar is added by the needlePositionChanged event
        videoEl.addEventListener("timeupdate", () => {
          clearVideoUploadLoadingGif();
        });
      } else {
        alert("The file is neither an image nor a video.");
      }
      var initialized = true;
    }
    infospotHistory.clear();

    panorama.load(reader.result);
    panorama.src = reader.result;
  };
});

function setbuttonChange(){
  const pform = document.getElementById("keyframe-properties-form");
  const submitButtonp = pform.querySelector('#btn-keyframe-form');
  submitButtonp.classList.remove('btn-disabled');
  submitButtonp.classList.add('btn-enabled');
}

window.moveLeft = function () {
  changeInfospot({ infospot: window.clickedInfospot, lon: 1 });
  setbuttonChange();
};
window.moveUp = function () {
  changeInfospot({ infospot: window.clickedInfospot, lat: 1 });
  setbuttonChange();
};
window.moveRight = function () {
  changeInfospot({ infospot: window.clickedInfospot, lon: -1 });
  setbuttonChange();
};
window.moveDown = function () {
  changeInfospot({ infospot: window.clickedInfospot, lat: -1 });
  setbuttonChange();
};
window.scaleY = function () {
  changeInfospot({ infospot: window.clickedInfospot, height: 1 });
  setbuttonChange();
};
window.scaleX = function () {
  changeInfospot({ infospot: window.clickedInfospot, width: 1 });
  setbuttonChange();
};
window.shrinkX = function () {
  changeInfospot({ infospot: window.clickedInfospot, width: -1 });
  setbuttonChange();
};
window.shrinkY = function () {
  changeInfospot({ infospot: window.clickedInfospot, height: -1 });
  setbuttonChange();
};
window.deleteInfo = function (info = window.clickedInfospot) {
  deleteInfospot(info);
};

const editButtons = document.querySelectorAll(".editButtons");
editButtons.forEach((button) => {
  button.addEventListener("mousedown", function () {
    const buttonId = this.id;
    window[buttonId]();
    // window.clickedInfospot = newInfo;
    const intervalId = setInterval(() => {
      window[buttonId]();
    }, 50);
    button.addEventListener("mouseup", () => {
      clearInterval(intervalId);
    });
    button.addEventListener("mouseleave", () => {
      clearInterval(intervalId);
    });
  });
});

document.getElementById("importMarkupBtn").addEventListener("click", () => {
  let input = document.getElementById("importFileInput")
  input.addEventListener("change", (event) => {
    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onloadend = function (e) {
      document.getElementById("textBoxJson").value = e.target.result;
      importMarkup(panorama);
    }
  });
  input.click();
});


document.getElementById("exportMarkupBtn").addEventListener("click", () => {
  exportMarkup(panorama);
  let text = document.getElementById("textBoxJson").value;
  let filename = "output.json";
  download(filename, text);
});

document.getElementById("delete-all-effects").addEventListener("click", () => {
  clearInfospots(panorama);
});

function addVideoUploadLoadingGif() {
  const panoPanel = document.getElementById("panoPanel");

  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.classList.remove("hidden");

  // Calculate the top and left offsets
  const rect = panoPanel.getBoundingClientRect();
  loadingOverlay.style.top = `${rect.top}px`;
  loadingOverlay.style.left = `${rect.left}px`;

  // Set the width and height based on the panoPanel dimensions
  loadingOverlay.style.width = `${panoPanel.offsetWidth}px`;
  loadingOverlay.style.height = `${panoPanel.offsetHeight}px`;
}

function clearVideoUploadLoadingGif() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.classList.add("hidden");
}

function createLineBetweenCoordinates(latLon1, latLon2) {
  const point1 = latLonDegreeToCartesian(latLon1).multiplyScalar(innerSphereSize);
  const point2 = latLonDegreeToCartesian(latLon2).multiplyScalar(innerSphereSize);
  const converter = new THREE.Vector3(-1, 1, 1);
  point1.multiply(converter);
  point2.multiply(converter);
  const geometry = new THREE.Geometry();
  geometry.vertices.push(point1, point2);

  const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  const line = new THREE.Line(geometry, material);
  return line;
}

// tutorial functions

window.loadPanorama = function (mediaName = "snowman.mp4") {
  const videoUrl = `./media/testes/20s/${mediaName}`;
  fetch(videoUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.addEventListener(
        "load",
        () => {
          initPano("video");
          addVideoUploadLoadingGif();
          const videoEl = panorama.getVideoElement();
          videoEl.src = reader.result;
          videoEl.addEventListener("loadeddata", () => {
            base64media.video = reader.result;
          });
          // clear loading bar on the video. This loading bar is added by the needlePositionChanged event
          videoEl.addEventListener("timeupdate", () => {
            clearVideoUploadLoadingGif();
          });
          const initialized = true;
          panorama.load(reader.result);
          panorama.src = reader.result;
        },
        false
      );
    })
    .catch((error) => console.error(error));
};

window.addSampleInfospot = function (lat, lon) {
  const point = latLonDegreeToCartesian({ lat, lon });

  const properties = {
    effectType: "Vibration",
    isAmbient: false,
    keyframes: {
      0: {
        intensity: 100,
        centerPoint: {
          lat: 0,
          lon: 0,
        },
        size: {
          width: 20,
          height: 20,
        },
        propagation: 0,
      },
      5: {
        intensity: 100,
        centerPoint: {
          lat: 0,
          lon: 0,
        },
        size: {
          width: 20,
          height: 20,
        },
        propagation: 0,
      },
    },
  };
  const ret = createInfospot({
    pano: panorama,
    location: point,
    properties,
  });
  toggleInfoAsClicked(ret);
};



window.addSampleInfospotAmbient = function (lat, lon) {
  const point = latLonDegreeToCartesian({ lat, lon });

  const properties = {
    effectType: "Vibration",
    isAmbient: true,
    keyframes: {
      0: {
        intensity: 100,
        centerPoint: {
          lat: 0,
          lon: 0,
        },
        propagation: 0,
      },
      5: {
        intensity: 100,
        centerPoint: {
          lat: 0,
          lon: 0,
        },
        propagation: 0,
      },
    },
  };
  const ret = createInfospot({
    pano: panorama,
    location: point,
    properties,
  });
};

window.addSampleInfospotAnimated = function (lat, lon) {
  const point = latLonDegreeToCartesian({ lat, lon });

  const properties = {
    effectType: "Heat",
    isAmbient: false,
    keyframes: {
      1: {
        intensity: 50,
        centerPoint: {
          lat: -3,
          lon: -71,
        },
        size: {
          width: 20,
          height: 20,
        },
        propagation: 0,
      },
      4: {
        intensity: 100,
        centerPoint: {
          lat: 8,
          lon: -80,
        },
        size: {
          width: 30,
          height: 30,
        },
        propagation: 0,
      },
    },
  };
  const ret = createInfospot({
    pano: panorama,
    location: point,
    properties,
  });
  toggleInfoAsClicked(ret);
};
window.playTimeline = function () {
  timeline.play();
};
window.pauseTimeline = function () {
  timeline.pause();
};
window.doExport = function () {
  exportMarkup(panorama);
};
window.getEffectBeginEndTime = function () {
  const { prevKeyframe, nextKeyframe } = getPrevNextKeyframeNumber(window.clickedInfospot, 2);
  return { prevKeyframe, nextKeyframe }
}

window.doSetEffectTime = function (beg, end) {
  const { prevKeyframe, nextKeyframe } = getPrevNextKeyframeNumber(window.clickedInfospot, 2);
  updateKeyframeKey(window.clickedInfospot, prevKeyframe, beg);
  updateKeyframeKey(window.clickedInfospot, nextKeyframe, end);

  if (timeline) {
    const infospotDuration = getInfospotDuration(window.clickedInfospot);
    timeline.setTrimTime(infospotDuration.start, infospotDuration.end);
    const properties = window.clickedInfospot.getObjectByName("properties").userData;
    let keyframes = getKeyFramesDataFromProperties(properties);
    keyframes = Object.keys(keyframes).map((key) => Number(key));
    timeline.clearKeyframes();
    timeline.setKeyframesTimes(keyframes);
    timeline.clearClickedTrim();
    timeline.clearClickedKeyframe();

    clearEffectPropertiesFromForm();
    if (timeline.trimSelector.style.display === "none") timeline.showTrimBar();
  }
};

window.getTrimClickedId = function () {
  return timeline.getClickedTrim();
};
window.clickStartTrim = function () {
  const el = document.getElementById("left-handle-trim");
  timeline.clickOnTrim(el);
};
window.clickEndingTrim = function () {
  const el = document.getElementById("right-handle-trim");
  timeline.clickOnTrim(el);
};

window.enableAllModules = function () {
  const sunCheck = document.querySelector('input[name="sunLocalizationCheck"]');
  const fireCheck = document.querySelector('input[name="fireLocalizationCheck"]');
  const localizationCheck = document.querySelector('input[name="effectLocalizationCheck"]');
  const understandingCheck = document.querySelector('input[name="sceneUnderstandingCheck"]');

  //sunCheck.checked = true;
  //fireCheck.checked = true;
  localizationCheck.checked = true;
  understandingCheck.checked = true;
};

window.enableEffectLocalization = function () {
  const effectLocalizationCheck = document.querySelector('input[name="effectLocalizationCheck"]');
  effectLocalizationCheck.checked = !effectLocalizationCheck.checked;
  const event = new Event("change");
  effectLocalizationCheck.dispatchEvent(event);
};

window.clickBtnLabelsLocalization = function () {
  const btnLabelsLocalization = document.getElementById("btn-modal-labels-localization");
  btnLabelsLocalization.click();
};

window.closeModalLabelsLocalization = function () {
  const modalData = document.querySelector("#modal-localization-data");
  modalData.click();
};

window.openAromaInEffectLocalization = function () {
  const aromaEffectLocalizationCheck = document.querySelector('input[name="check-labels-localization-Aroma"]');
  aromaEffectLocalizationCheck.checked = !aromaEffectLocalizationCheck.checked;
  const event = new Event("change");
  aromaEffectLocalizationCheck.dispatchEvent(event);
};

window.setFirstAromaAssociation = function () {
  const aromaForm = document.querySelector("#labels-localization-Aroma").querySelector(".addLabelToEffectComponent");
  aromaForm.querySelector("input[name=labelThatMatches]").value = "plant";
  aromaForm.querySelector("input[name=intensityToActivate]").value = 50;
  aromaForm.querySelector("input[name=aromaNameToActivate]").value = "three";
  aromaForm.querySelector("input[name=propagationToActivate]").value = 90;
};

window.setSecondAromaAssociation = function () {
  const aromaForm = document
    .querySelector("#labels-localization-Aroma")
    .querySelectorAll(".addLabelToEffectComponent")[1];
  aromaForm.querySelector("input[name=labelThatMatches]").value = "person";
  aromaForm.querySelector("input[name=intensityToActivate]").value = 20;
  aromaForm.querySelector("input[name=aromaNameToActivate]").value = "perfume";
  aromaForm.querySelector("input[name=propagationToActivate]").value = 1;
};

window.enableSceneUnderstanding = function () {
  const sceneUnderstandingCheck = document.querySelector('input[name="sceneUnderstandingCheck"]');
  sceneUnderstandingCheck.checked = !sceneUnderstandingCheck.checked;
  const event = new Event("change");
  sceneUnderstandingCheck.dispatchEvent(event);
};

window.clickBtnLabelsUnderstanding = function () {
  const btnLabelsUnderstanding = document.getElementById("btn-modal-labels-understanding");
  btnLabelsUnderstanding.click();
};

window.closeModalLabelsUnderstanding = function () {
  const modalData = document.querySelector("#modal-understanding-data");
  modalData.click();
};

window.openAromaInSceneUnderstanding = function () {
  const aromaSceneUnderstandingCheck = document.querySelector('input[name="check-labels-understanding-Aroma"]');
  aromaSceneUnderstandingCheck.checked = !aromaSceneUnderstandingCheck.checked;
  const event = new Event("change");
  aromaSceneUnderstandingCheck.dispatchEvent(event);
};

window.setThirdAromaAssociation = function () {
  const aromaForm = document.querySelector("#labels-understanding-Aroma").querySelector(".addLabelToEffectComponent");
  aromaForm.querySelector("input[name=labelThatMatches]").value = "tree";
  aromaForm.querySelector("input[name=intensityToActivate]").value = 70;
  aromaForm.querySelector("input[name=aromaNameToActivate]").value = "tree";
};

window.clickAutoExtractBtn = function () {
  document.getElementById("activateAutoExtract").click();
};

window.clickAutoExtractBeginBtn = function () {
  document.getElementById("beginAutoExtractBtn").click();
};

window.closeAutoExtractResponseModal = function () {
  document.getElementById("labelsResponseModal").checked = false;
};

window.clickAromaBtn = function () {
  document.getElementById("Aroma").click();
};
