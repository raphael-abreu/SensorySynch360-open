/**
 * Other FUNCTIONS
 */

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function timestamp(){
  return new Date().toUTCString();
}

export function exists(obj){
  if (typeof obj === 'undefined')
    return false;
  else
    return true;
}
/**
 * MATH FUNCTIONS
 */

// from http://www.jacklmoore.com/notes/rounding-in-javascript/
// takes the number, converts to scientific notation with expoent and moves back to number
export function round(value, decimals) {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
}

export function roundToIntegerTreshold(number) {
  const threshold = 0.0001; // Adjust this threshold value as per your requirement
  
  if (Math.abs(number - Math.round(number)) < threshold) {
    return Math.round(number);
  } else {
    return number;
  }
}

// TODO: UNDERSTAND AND MAKE A FORMULA
export function cartesianToLatLonDegree(vector3) {
  const pos = vector3.clone();
  pos.normalize();
  const i = Math.acos(pos.y);
  const n = Math.atan2(pos.z, pos.x); // need to use atan2 to get the four quadrants
  const r = THREE.Math.radToDeg(n);
  return {
    lat: 90 - THREE.Math.radToDeg(i),
    lon: r,
  };
}

export function latLonDegreeToCartesian(t) {
  const e = THREE.Math.degToRad(90 - t.lat);
  const i = THREE.Math.degToRad(t.lon);
  const n = new THREE.Vector3();
  return (
    (n.x = Math.sin(e) * Math.cos(i)),
    (n.y = Math.cos(e)),
    (n.z = Math.sin(e) * Math.sin(i)),
    n
  );
}

export function findCenter(latLongObjects) {
const centerPoint = {
    lat: (latLongObjects[0].lat + latLongObjects[3].lat) / 2,
    lon: (latLongObjects[0].lon + latLongObjects[3].lon) / 2,
};
return centerPoint;
}

export function findWidthHeight(latLongObjects) {
const width = {
    lat: (latLongObjects[0].lat + latLongObjects[3].lat) / 2,
    lon: (latLongObjects[0].lon + latLongObjects[3].lon) / 2,
};
return width;
}
  

export function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


  function createLineBetweenCoordinates(latLon1, latLon2,innerSphereSize) {
    const point1 = latLonDegreeToCartesian(latLon1).multiplyScalar(innerSphereSize);
    const point2 = latLonDegreeToCartesian(latLon2).multiplyScalar(innerSphereSize);
  
    const geometry = new THREE.Geometry();
    geometry.vertices.push(point1, point2);
  
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  
    const line = new THREE.Line(geometry, material);
    return line;
  }