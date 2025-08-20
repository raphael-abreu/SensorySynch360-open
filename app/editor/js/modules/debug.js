/**
 * DEBUG METHODS
 */

// Adds a sphere for better visual referencing of the coordinate system
export function addIntersectSphere(scene,innerSphereSize) {
  const geometry = new THREE.SphereBufferGeometry(innerSphereSize, 30, 30);
  const wireframe = new THREE.WireframeGeometry(geometry);
  const line = new THREE.LineSegments(wireframe);
  line.material.opacity = 0.5;
  line.material.transparent = true;
  scene.add(line);
}

export function painOnMouseOver() {
  panorama.container.addEventListener("mousemove", (event) => {
    const intersects = viewer.raycaster.intersectObject(panorama, true);
    if (chekIntersection(intersects)) {
      const point = intersects[0].point.clone();
      const converter = new THREE.Vector3(-1, 1, 1); // Panorama is scaled -1 on X axis. Use this to adjust the point accordingly
      point.multiply(converter);
      const latlon = cartesianToLatLonDegree(point);
      // console.log("Current Mouse position in latLong:", latlon);
      drawRectOnCanvas("equiCanvas", latlon.lat, latlon.lon);
    }
  });
}

export function changeTab(evt, cityName) {
    let i; let tabcontent; let tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace('active', '');
    }
    document.getElementById(cityName).style.display = 'block';
    evt.currentTarget.className += ' active';
  }




/**
 * Paints every infospot point on the canves. Throwaway function.
 * @function
 * @param {panorama} pano
 */
export  function paintInfo(pano) {
    const converter = new THREE.Vector3(-1, 1, 1); // Panorama is scaled -1 on X axis. Use this to adjust the point accordingly
  
    for (infospot of pano.children) {
      if (infospot.type == 'Object3D') continue; // only stay in this loop if relly a infospot
  
      let infoColor = infospot.children[0].children[0].material.color;
      infoColor = infoColor.getHexString();
  
      // paints the vertices of the plane on the canvas
      const { geometry } = infospot.getObjectByName('boundingBox');
      const convertedVertices = geometry.vertices.map((el) => infospot
        .getObjectByName('boundingBox')
        .localToWorld(el.clone())
        .multiply(converter));
  
      const p1 = cartesianToLatLonDegree(convertedVertices[0]);
      const p2 = cartesianToLatLonDegree(convertedVertices[1]);
      const p3 = cartesianToLatLonDegree(convertedVertices[2]);
      const p4 = cartesianToLatLonDegree(convertedVertices[3]);
  
      // TODO : Tatar o caso do infospot passar pelas bordas. Ele estará com os p1 e p2 invertidos!
      // bases do topo e baixo
      for (let i = p1.lon; i > p2.lon; i--) { drawRectOnCanvas('equiCanvas', p1.lat, i, infoColor); }
      for (let i = p3.lon; i > p4.lon; i--) { drawRectOnCanvas('equiCanvas', p3.lat, i, infoColor); }
      for (let i = p1.lat, j = p1.lon; i > p3.lat; i--, j++) { drawRectOnCanvas('equiCanvas', i, j, infoColor); }
      for (let i = p2.lat, j = p2.lon; i > p3.lat; i--, j++) { drawRectOnCanvas('equiCanvas', i, j, infoColor); }
    }
  }


export function drawRectOnCanvas(canvID, lat, lon, color = 'yellow') {
    const size = 20;
  
    const c = document.getElementById(canvID);
  
    const x = Math.floor(c.width / 2.0 + (c.width / 360.0) * -lon);
    const y = Math.floor(c.height - (c.height / 2.0 + (c.height / 180.0) * lat));
  
    const ctx = c.getContext('2d');
    ctx.globalAlpha = 0.5;
  
    ctx.fillStyle = `#${color}`;
    const centeringFactor = size / 2;
    ctx.fillRect(x - centeringFactor, y - centeringFactor, size, size);
  }