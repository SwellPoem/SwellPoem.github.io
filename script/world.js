import { InteractionManager } from 'threeInteractive';
import Environment from './script/utils/environment.js';
import Resizer from "./script/utils/resize.js";

const animations = {};
const interactions = [];
let interacted = false;

export default class World { // World is everithing regarding 3D world after initialization (set the room, add some light updating etc)
    constructor(assets) {
        this.assets = assets;
        this.fullRoom = assets.room;
        this.room = assets.room.objects;

        this.interactionManager = new InteractionManager(renderer, camera, renderer.domElement); // handle click/hover etc event
        this.environment = new Environment(); // light fog etc
        this.mixer = new THREE.AnimationMixer(this.fullRoom.scene); // animations
        this.setRoom();
        this.updateClock();
        this.timer = new THREE.Clock(); // create Three clock to get delta time
        this.update();
        new Resizer(renderer, camera);
    }

    setRoom = () => { // add room to scene + set up
        scene.add(this.fullRoom.scene);
        // add screen texture
        this.room["screen-video"].material = new THREE.MeshStandardMaterial({
            map: this.assets["screen-animation"],
            emissive: 0x999999,
            emissiveMap: this.assets["screen-animation"],
            emissiveIntensity: 0.5,
        });
        // add lights
        const deskLight = this.environment.addSpotLight(this.room["desk_lamp"].position, this.room.Body);
        const bedLight = this.environment.addPointLight(this.room["lamp"].position);
        // add Interactions
        this.setInteractions("screen-video", "mousedown", () => openModal("projects"));
        // this.setInteractions("letter", "mousedown", () => openModal("contact"));
        this.setInteractions("letter-box", "mousedown", () => openModal("contact"));
        this.setInteractions("letter", "mousedown", () => openModal("aboutme"));

        this.setInteractions("lamp", "click", () => this.environment.toggleLight(bedLight));
        this.setInteractions("desk_lamp", "click", () => this.environment.toggleLight(deskLight));

        this.setInteractions("keyboard", "click", () => this.assets.typing.audio = playAudio(this.assets.typing));
        this.setInteractions("sax", "click", () => this.assets.sax.audio = playAudio(this.assets.sax));
        this.setInteractions("radio", "click", () => this.assets.oof.audio = playAudio(this.assets.radio));
        this.setInteractions("mouse", "click", () => this.Animate("mouse-anim", 2, "repeat"));
        this.setInteractions("chair", "click", () => this.Animate("chair-anim", 2, "both-way"));
        this.setInteractions("drawer", "click", () => this.Animate("drawer-anim", 0.5, "both-way"));
        this.setInteractions("aboutMe", "click", () => this.Animate("aboutMeAction", 3, "repeat"));
        this.setInteractions("book5", "click", () => this.Animate("book5-anim", 1, "both-way"));

        this.setInteractions("Head", "click", () => {
            this.Animate("head_CubeAction", 3, "both-way");
            this.Animate("LowerArm_Cube.006Action.001", 3, "both-way");
        });

        this.setInteractions("LowerArm2", "click", () => {
            this.Animate("head_CubeAction", 3, "both-way");
            this.Animate("LowerArm_Cube.006Action.001", 3, "both-way");
        });

        this.setInteractions("Link1", "click", () => {
            this.Animate("Link1-animation", 7, "reset-after");
            this.Animate("Link2-animation", 7, "reset-after");
            this.Animate("Link3-animation", 7, "reset-after");
            this.Animate("end-eff-animation", 7.5, "reset-after");
        });
        this.setInteractions("Link2", "click", () => {
            this.Animate("Link1-animation", 7, "reset-after");
            this.Animate("Link2-animation", 7, "reset-after");
            this.Animate("Link3-animation", 7, "reset-after");
            this.Animate("end-eff-animation", 7.5, "reset-after");
        });
        this.setInteractions("Link3", "click", () => {
            this.Animate("Link1-animation", 7, "reset-after");
            this.Animate("Link2-animation", 7, "reset-after");
            this.Animate("Link3-animation", 7, "reset-after");
            this.Animate("end-eff-animation", 7.5, "reset-after");
        });
        this.setInteractions("end_eff", "click", () => {
            this.Animate("Link1-animation", 6, "reset-after");
            this.Animate("Link2-animation", 6, "reset-after");
            this.Animate("Link3-animation", 6, "reset-after");
            this.Animate("end-eff-animation", 7.5, "reset-after");
        });
        // this.setInteractions("letter", "mouseover", () => this.Animate("letter-top-anim", 1, "forward"));
        // this.setInteractions("letter", "mouseout", () => this.Animate("letter-top-anim", 1, "backward"));


        const texture = new THREE.TextureLoader().load('./public/assets/images/SW.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(-1, 1);
        const meshName = "Plane";
        if (this.room[meshName]) {
            this.room[meshName].material = new THREE.MeshStandardMaterial({map: texture});
        } else {
            console.error(`Mesh ${meshName} not found`);
        }

        const texture2 = new THREE.TextureLoader().load('./public/assets/images/AI.jpg');
        texture2.wrapS = THREE.RepeatWrapping;
        texture2.wrapT = THREE.RepeatWrapping;
        texture2.repeat.set(-1, 1);
        const meshName2 = "Plane2";
        if (this.room[meshName2]) {
            this.room[meshName2].material = new THREE.MeshStandardMaterial({map: texture2});
        } else {
            console.error(`Mesh ${meshName2} not found`);
        }

        const texture3 = new THREE.TextureLoader().load('./public/assets/images/matlab.jpg');
        texture3.wrapS = THREE.RepeatWrapping;
        texture3.wrapT = THREE.RepeatWrapping;
        texture3.repeat.set(1, -1);
        const meshName3 = "Plane3";
        if (this.room[meshName3]) {
            this.room[meshName3].material = new THREE.MeshStandardMaterial({map: texture3});
        } else {
            console.error(`Mesh ${meshName3} not found`);
        }

        const texture4 = new THREE.TextureLoader().load('./public/assets/images/CV.jpg');
        texture4.wrapS = THREE.RepeatWrapping;
        texture4.wrapT = THREE.RepeatWrapping;
        texture4.repeat.set(1, -1);
        const meshName4 = "letter";
        if (this.room[meshName4]) {
            const material = new THREE.MeshStandardMaterial({map: texture4});
            material.color.set('gray'); // Change this to adjust the color
            material.emissive.set('black'); // Change this to adjust the emissive color
            this.room[meshName4].material = material;
        } else {
            console.error(`Mesh ${meshName4} not found`);
        }

    };

    setInteractions = (target, type, action) => { // create interaction for elements
        if (!this.interactionManager.interactiveObjects.find(interaction => interaction.name == target)) { // if object is not arleady animated add all prior need (add to interaction manager, add hover cursor, add to interaction hint)
            this.interactionManager.add(this.room[target]);
            // hover cursor change
            this.room[target].addEventListener("mouseover", () => document.body.style.cursor = "pointer");
            this.room[target].addEventListener("mouseout", () => document.body.style.cursor = "initial");
            // add element to interaction list for color change hint
            this.room[target].traverse((node) => {
                interactions.push({
                    name: target,
                    object: node,
                    originalMaterial: node.material
                })
            })
        }
        // listen for wanted interaction
        this.room[target].addEventListener(type, () => {
            action();
            interacted = true;
        });
    }

    hint = () => { // change color of every interactible elements for 2s then revert back to original
        const hintMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF0000
        });

        interactions.forEach(interaction => interaction.object.material = hintMaterial);
        setTimeout(() => {
            interactions.forEach(interaction => interaction.object.material = interaction.originalMaterial);
        }, 2000);
    }

    Animate = (animation, speed, mode) => { // manage all animation
        // animation mode: "forward" "backward" "infinite" "both-way" "reset-after" "repeat" (repeat = default so anything unrecognized will repeat)
        if (!animations[animation]) { // if animation not initialized create it
            const clip = this.fullRoom.animations.find(element => element.name === animation);
            animations[animation] = this.mixer.clipAction(clip);
            if (mode == "backward") animations[animation].setDuration(-speed); // backward mode 
            else animations[animation].setDuration(speed);
            if (mode != "infinite") animations[animation].setLoop(THREE.LoopOnce); // infinite mode
            animations[animation].clampWhenFinished = true;
        } else { // if arleady exist
            animations[animation].paused = false;
            switch (mode) {
                case "both-way": // revert animation
                    animations[animation].timeScale = -animations[animation].timeScale;
                    break;
                case "forward": // reset the timing for if same animation is used forward and backward
                    animations[animation].timeScale = Math.abs(animations[animation].timeScale);
                    break;
                case "backward":
                    animations[animation].timeScale = -Math.abs(animations[animation].timeScale);
                    break;
                default:
                    animations[animation].reset();
            }
        }
        animations[animation].play();
        if (mode == "reset-after") { // reset annimation 5sec after its end
            setTimeout(() => {
                animations[animation].reset();
                animations[animation].paused = true;
            }, speed*1000 + 10000);
        }
    }

    updateClock = () => { // update the clock time to the user local time
        const date = new Date();
        const time = [ date.getHours(), date.getMinutes(), date.getSeconds() ];
        const angle = {
            h: (time[0] + time[1]/60) * 30, // 12 hours, 360° => 30° steps -- add minutes as 0.something hours to make angle right
            m: time[1]*6, // 60 minutes, 360° => 6° steps
        };
        this.room["clock-h"].rotation.z = - toRadian(angle.h);
        this.room["clock-m"].rotation.z = - toRadian(angle.m);
        setTimeout(() => {
            this.updateClock();
        }, (60 - time[2])*1000);
    }

    frameRequest; // make accessible from class instance so possible to stop updating on modal oppening (for perf)
    update = () => { // update rendering
        const deltaTime = this.timer.getDelta();
        this.interactionManager.update(); // update interactions
        this.mixer.update(deltaTime); // update animation
        renderer.render(scene, camera); // render new frame
        this.frameRequest = requestAnimationFrame(this.update);
    }
}
