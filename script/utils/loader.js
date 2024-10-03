import { GLTFLoader } from "GLTFLoader";
import { DRACOLoader } from "DRACOLoader";
import assets from "../../script/utils/assets.js";
import World from "../world.js";

export default class Loader { // load every assets for the scene then initialize world
    constructor(loadOverlay) {
        // loading progress
        this.manager = new THREE.LoadingManager();
        this.manager.onProgress = this.updateProgress;
        this.overlay = loadOverlay;
        // gltf draco loader
        this.loader = new GLTFLoader(this.manager);
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
        this.dracoLoader.setDecoderConfig({ type: "js" });
        this.loader.setDRACOLoader(this.dracoLoader);
        // load list
        this.queue = assets.length;
        this.loaded = 0;
        this.items = {};
    }

    load = () => { // browse all asset to load them according to their type
        console.log("%cLoading...", "color: #F5853F; font-weight: bold");
        assets.forEach(asset => {
            switch (asset.type) {
                case "gltf":
                    this.loadGltf(asset);
                    break;
                case "videoTexture":
                    this.loadVideoTexture(asset);
                    break;
                case "audio":
                    this.loadAudio(asset);
                    break;
            }
        })
    }

    loadVideoTexture = (asset) => { // load video as three texture
        const video = document.createElement("video");
        video.src = asset.path;
        video.muted = true;
        video.playsInline = true;
        video.loop = true;

        video.play()
        .then(() => playVideo(this)) // play the video when loaded
        .catch(error => { // catch any errors because one can appen randomly but dosen't matter so filter it -- https://developer.chrome.com/blog/play-request-was-interrupted/)
            playVideo(this); // try laying video regardless of the error
            const errorTxt = String(error);
            if (errorTxt.includes("https://goo.gl/LdLk22")) return;
            console.error(error); // when the error isn't recognized log it
        });
        function playVideo(that) { // that allow to use the real this from the class (this inside function won't work)
            // video html to three texture
            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.encoding = THREE.sRGBEncoding;

            that.oneLoaded(asset.name, videoTexture);
        }
    }

    loadGltf = (asset) => { // load gltf model (the scene)
        this.loader.load('../../public/my_scene2.glb', file => {
            file["objects"] = {}; // add objects to be acceded by . instead of search from array
            file.scene.traverse((node) => {
                // add shadow to object
                node.castShadow = true;
                node.receiveShadow = true;
                
                file.objects[node.name] = node;
            })
            this.oneLoaded(asset.name, file);
        });
    }

    // loadGltf = (asset) => { // load gltf model (the scene)
    //     const loader = new THREE.GLTFLoader();
    
    //     loader.load('/my_scene.glb', (gltf) => {
    //         gltf.scene.traverse((node) => {
    //             // add shadow to object
    //             node.castShadow = true;
    //             node.receiveShadow = true;
    
    //             // add objects to be accessed by . instead of search from array
    //             gltf.objects = gltf.objects || {};
    //             gltf.objects[node.name] = node;
    //         });
    
    //         scene.add(gltf.scene);
    //         this.oneLoaded(asset.name, gltf);
    //     });
    // }

    loadAudio = (asset) => { // basic load audio
        const audio = new Audio(asset.path);
        this.oneLoaded(asset.name, {
            audio,
            src: asset.path // keep src to recreate audio when plaid so we can play it right after
        });
    }

    oneLoaded = (name, file) => { // called every time somethings load -- check if everything loaded to continue or just wait
        this.items[name] = file;
        this.loaded++;
        if (this.loaded !== this.queue) return;
        console.log("%cLoaded successfully!", "color: #09814A; font-weight: bold");
        this.overlay.style.display = "none"; // hide loading overlay
        window.world = new World(this.items); // create world
    }
    
    updateProgress = (url, loaded, total) => { // update loader dot colors according to progress
        const progress = loaded / total;
        if (progress >= 0.25) this.overlay.querySelectorAll(".dot")[0].className = "dot loaded";
        if (progress >= 0.5) this.overlay.querySelectorAll(".dot")[1].className = "dot loaded";
        if (progress >= 0.75) this.overlay.querySelectorAll(".dot")[2].className = "dot loaded";
        if (progress >= 1) this.overlay.querySelectorAll(".dot")[3].className = "dot loaded";
    }
}
