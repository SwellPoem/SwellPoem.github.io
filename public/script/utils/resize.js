import { controls } from "../index.js";

export default class Resizer { // set render and camera size / aspect ratio to be 100% of available and update it when necessary
    constructor(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;
        this.aspectBufferTimeout = false;
        this.controlsMaxDistance = controls.maxDistance;
        window.addEventListener("resize", this.resize);
        window.addEventListener("orientationchange", this.resize); 
        this.resize();
    }
    resize = () => { 
        // update size aspect ratio etc to matches viewport
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / height;
        const pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(pixelRatio);
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        clearTimeout(this.aspectBufferTimeout);
        this.aspectBufferTimeout = setTimeout(this.checkAspectRatio, 100);
    }
    
    checkAspectRatio = () => { 
        const mobileAgents = [ /android/i, /webos/i, /iphone/i, /ipad/i, /ipod/i, /blackberry/i, /windows phone/i ];
        const aspect = window.innerWidth/window.innerHeight;
        const userAgent = navigator.userAgent;
        if (aspect < 1) { 
            controls.maxDistance = 15; // allow to zoom out a bit more so we can see everithing
            caroussel.container.removeAttribute('auto-hover');
            return;
        }
        controls.maxDistance = this.controlsMaxDistance; // restore normal zoom
        if (!mobileAgents.find(agent => userAgent.match(agent))) {
            caroussel.container.removeAttribute('auto-hover');
            return;
        } 
        caroussel.container.setAttribute('auto-hover', "");
        openModal("mobile-alert");
    }
}
