
class CubemapToEquirectangular {
    constructor(renderer, scene, viewer,{ width = 256, height = 128, camera = 'selector' } = {}) {
        this.renderer = renderer;
		this.scene = scene;
		this.el = viewer;
		this.COUNT = 0;
		this.data = {
			width: width,
			height: height,
			camera: camera
		};

        this.vertexShader = `
            attribute vec3 position;
            attribute vec2 uv;
            uniform mat4 projectionMatrix;
            uniform mat4 modelViewMatrix;
            varying vec2 vUv;
            void main()  {
                vUv = vec2( 1.- uv.x, uv.y );
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `;
        this.fragmentShader = `
            precision mediump float;
            uniform samplerCube map;
            varying vec2 vUv;
            #define M_PI 3.1415926535897932384626433832795
            void main()  {
                vec2 uv = vUv;
                float longitude = uv.x * 2. * M_PI - M_PI + M_PI / 2.;
                float latitude = uv.y * M_PI;
                vec3 dir = vec3(
                    - sin( longitude ) * sin( latitude ),
                    cos( latitude ),
                    - cos( longitude ) * sin( latitude )
                );
                normalize( dir );
                gl_FragColor = textureCube( map, dir );
            }
        `;
		var gl = renderer.getContext();
		this.cubeMapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
		this.material = new THREE.RawShaderMaterial({
			uniforms: {map: {type: 't', value: null}},
			vertexShader: this.vertexShader,
			fragmentShader: this.fragmentShader,
			side: THREE.DoubleSide
		});
		this.quad = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(1, 1),
			this.material
		);
		this.quad.visible = false;
		this.camera = new THREE.OrthographicCamera(-1 / 2, 1 / 2, 1 / 2, -1 / 2, -10000, 10000);
		
    
		this.scene.add(this.quad);
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.quad.scale.set(this.width, this.height, 1);
        this.camera.left = this.width / -2;
        this.camera.right = this.width / 2;
        this.camera.top = this.height / 2;
        this.camera.bottom = this.height / -2;
        this.camera.updateProjectionMatrix();
        this.output = new THREE.WebGLRenderTarget(this.width, this.height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType
        });
       
    }

    getCubeCamera(size) {
        var cubeMapSize = Math.min(this.cubeMapSize, size);
        this.cubeCamera = new THREE.CubeCamera(.1, 1000, cubeMapSize);
        var options = {
            format: THREE.RGBAFormat,
            magFilter: THREE.LinearFilter,
            minFilter: THREE.LinearFilter
        };
        this.cubeCamera.renderTarget = new THREE.WebGLRenderTargetCube(cubeMapSize, cubeMapSize, options);
        return this.cubeCamera;
    }

    attachCubeCamera(camera) {
        this.getCubeCamera();
        this.attachedCamera = camera;
    }

	checkWebGLContext() {
        const gl = this.renderer.getContext();
        const error = gl.getError();
        if (error !== gl.NO_ERROR) {
            console.error('WebGL error:', error);
        }
    }

	renderCapture(){
		var autoClear = this.renderer.autoClear;
		var el = this.el;
		var imageData;
		var output;
		var pixels;
		var renderer = el.renderer;

		// Create cube camera and copy position from scene camera.
		var cubeCamera = new THREE.CubeCamera(el.camera.near, el.camera.far,128); // tamanho 128
		// uncomment this to move the camera position into cube camera;
		//el.camera.getWorldPosition(cubeCamera.position);
		//el.camera.getWorldQuaternion(cubeCamera.quaternion);
		// Render scene with cube camera.
		cubeCamera.update(el.renderer, el.scene);
		this.quad.material.uniforms.map.value = cubeCamera.renderTarget.texture;
		var size = {width: this.data.width, height: this.data.height};
		// Use quad to project image taken by the cube camera.
		this.quad.visible = true;

		// Create rendering target and buffer to store the read pixels.
		//output = this.getRenderTarget(size.width, size.height);
		this.setSize(size.width, size.height) 
		pixels = new Uint8Array(4 * size.width * size.height);
		// Resize quad, camera, and canvas.
		this.resize(size.width, size.height);
		// Render scene to render target.
		renderer.autoClear = true;
		renderer.clear();
		renderer.setRenderTarget(this.output);
		renderer.render(el.scene, this.camera);
		renderer.autoClear = autoClear;
		// Read image pizels back.
		renderer.readRenderTargetPixels(this.output, 0, 0, size.width, size.height, pixels);
		renderer.setRenderTarget(null);
		
		imageData = new ImageData(new Uint8ClampedArray(pixels), size.width, size.height);
		// Hide quad after projecting the image.
		this.quad.visible = false;
		// return pixels into canvas.
		return imageData;
	}

	resize(width,height){
		this.quad.scale.set(width, height, 1);

		// Resize camera.
		this.camera.left = -1 * width / 2;
		this.camera.right = width / 2;
		this.camera.top = height / 2;
		this.camera.bottom = -1 * height / 2;
		this.camera.updateProjectionMatrix();

		// Resize canvas.
	}

	getRenderTarget(width,height){
		return new THREE.WebGLRenderTarget(width, height, {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			wrapS: THREE.ClampToEdgeWrapping,
			wrapT: THREE.ClampToEdgeWrapping,
			format: THREE.RGBAFormat,
			type: THREE.UnsignedByteType
		  });
	}

	flipPixelsVertically(pixels,width,height){
		var flippedPixels = pixels.slice(0);
		for (var x = 0; x < width; ++x) {
		for (var y = 0; y < height; ++y) {
			flippedPixels[x * 4 + y * width * 4] = pixels[x * 4 + (height - y) * width * 4];
			flippedPixels[x * 4 + 1 + y * width * 4] = pixels[x * 4 + 1 + (height - y) * width * 4];
			flippedPixels[x * 4 + 2 + y * width * 4] = pixels[x * 4 + 2 + (height - y) * width * 4];
			flippedPixels[x * 4 + 3 + y * width * 4] = pixels[x * 4 + 3 + (height - y) * width * 4];
		}
		}
		return flippedPixels;
	}

	getImageData(projection){
		var isVREnabled = this.renderer.vr.enabled;
		var renderer = this.renderer;
		// Disable VR.
		renderer.vr.enabled = false;
		let imgData = this.renderCapture();
		// Restore VR.
		renderer.vr.enabled = isVREnabled;
		return imgData;
		// Return the image data instead of the canvas
		//return imageData;
	}

}

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CubemapToEquirectangular;
    }
    exports.CubemapToEquirectangular = CubemapToEquirectangular;
} else {
    window.CubemapToEquirectangular = CubemapToEquirectangular;
}

export default CubemapToEquirectangular;
