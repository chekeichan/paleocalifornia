// console.warn = console.error = () => {}; // Suppresses Three.js warnings. Remove to debug

var podvisibility = true; // Used by button-logic and tour-start
var setAttributes = function(entity, attrs) { // Efficient way to set complex attributes (taken from StackOverflow)
    for (var key in attrs) {
        entity.setAttribute(key, attrs[key]);
    }
    
};

AFRAME.registerComponent('device-set', { // Device-specific settings
    init: function() {
        const sceneEl = document.querySelector('a-scene');
        const rig = document.querySelector('#rig');
        if (AFRAME.utils.device.isMobile() === true) { // Smartphone Mode
            sceneEl.setAttribute("vr-mode-ui", "enabled", "false");
            // rig.setAttribute("movement-controls", "speed", 0.15);
            document.querySelector('#GL-SP').object3D.visible = true;
        } else if (AFRAME.utils.device.checkHeadsetConnected() === true) { // VR Mode
            document.querySelector('#GL-VR').object3D.visible = true;
            AFRAME.utils.entity.setComponentProperty(movemodetext, "value", "Switch to Teleport Mode");
            console.log('VR detected');
            rig.setAttribute("movement-controls", "speed", 0.0); // No movement speed just to use head turning with thumbstick
        } else if (AFRAME.utils.device.checkHeadsetConnected() === false) { // PC Mode
            console.log('PC detected');
            document.querySelector('#GL-PC').object3D.visible = true;
            AFRAME.utils.entity.setComponentProperty(movemodetext, "value", "Switch to Walk Mode");
    }
}});

AFRAME.registerComponent('all-wait', { // Waits for certain models to load then makes them not visible. If models start out not visible, they will cause a pause then they are loaded
    init: function () {
        const sceneEl = document.querySelector('a-scene');
        const hideatstart = sceneEl.querySelectorAll('.hide');
        for (let each of hideatstart) {
            each.addEventListener('model-loaded', () => { // Wait for model to load.
                setTimeout(function(){
                    each.setAttribute('visible', 'false');
                }, 2000);
            });
        }
}});

AFRAME.registerComponent("tour-start", {
    init: function() {
        const el = this.el;
        const rig = document.querySelector('#rig');
        const camera = document.querySelector('#camera');
        const hands = document.querySelectorAll('.hand');
        const curvePoints = document.querySelectorAll('.curve');        
        const podplaceholder = document.querySelector('#podplaceholder');
        const pod = document.querySelector('#pod');
        const transition = document.querySelector("#transition");
        let headadjust = null;
        let y = null;
        const transitionclose = function() {
            const campos = camera.object3D.position
            headadjust = 1.6 - campos.y;
            y = campos.y - 0.55;
            transition.dispatchEvent(new CustomEvent("transitionclose"));
            setTimeout(function(){warpwarp();}, 1000);
        };
        const warpwarp = function() {
            for (let each of curvePoints) { // Sets height for ride by manipulating the curve height, using VR headset height
                each.object3D.position.y = headadjust;
            }
            pod.object3D.position.set(0, y, -0.1);
            camera.object3D.position.set(0, 1.6, 0);
            camera.components['look-controls'].yawObject.rotation.set(0,THREE.MathUtils.degToRad(0),0);
            for (let each of hands) {
                each.setAttribute('raycaster', 'far', 0); // Makes VR raycaster lines invisible during ride
            }
            podplaceholder.object3D.visible = false;
            if (podvisibility === true) {
                pod.object3D.visible = true;
            } else {
                pod.object3D.visible = false;
            };
            // if (AFRAME.utils.device.checkHeadsetConnected() === false) { // PC and mobile mode
            //     rig.components['movement-controls'].updateNavLocation();
            // }
            setTimeout(function(){transitionopen();}, 700)
        };
        
        const transitionopen = function() {
            transition.dispatchEvent(new CustomEvent("transitionopen"));
            // rig.setAttribute("movement-controls", "constrainToNavMesh", false);
            // rig.removeAttribute('movement-controls');
            rig.setAttribute('alongpath', {curve: '#track0', dur: 10000, triggerRadius: 0.001}) // Set to #track0 dur 10000 for tour start
        };

        el.addEventListener("mouseup", function(evt) {
            transitionclose();

        })
    }}
);

AFRAME.registerComponent("tour-end", {
    init: function() {
        const el = this.el;
        const rig = document.querySelector('#rig');
        const camera = document.querySelector('#camera');
        const hands = el.querySelectorAll('.hand');
        const podplaceholder = document.querySelector('#podplaceholder');
        const pod = document.querySelector('#pod');
        const transition = document.querySelector("#transition");

        const transitionclose = function() {
            transition.dispatchEvent(new CustomEvent("transitionclose"));
            setTimeout(function(){warpwarp();}, 1000);
        };

        const warpwarp = function() {
            rig.object3D.position.set(-6.5, 0.6, 5);
            camera.components['look-controls'].yawObject.rotation.set(0,THREE.MathUtils.degToRad(-90),0);
            for (let each of hands) {
                each.setAttribute('raycaster', 'far', 4); // Makes VR raycaster lines visible again after ride
            }
            podplaceholder.object3D.visible = true;
            pod.object3D.visible = false;
            setAttributes(light1, {"position": {x: -4.2, y: 3.6, z: 5}, "color": "white", "animation": {property: 'light.intensity', from: 2, to: 1.5, dur: 2000}, "decay": 1, "distance": 15})
            console.log('light1 move to end')
            setTimeout(function(){transitionopen();}, 700)
        };
        
        const transitionopen = function() {
            transition.dispatchEvent(new CustomEvent("transitionopen"));
        };

        el.addEventListener("endtour", function(evt) {
            transitionclose();
            rig.removeAttribute('alongpath'); // alongpath crashes if it is left with no instructions

        })
    }}
);

AFRAME.registerComponent("tour-mechanics", {
    init: function() {
        const rig = document.querySelector('#rig'); // Scene, rig, and lights
        const sceneEl = document.querySelector('a-scene');
        const ambilight = document.querySelector('#ambientlight');
        const light1 = document.querySelector('#light1');
        const light2 = document.querySelector('#light2');
        const timelight1 = document.querySelector('#timetunnellight');
        const timelight2 = document.querySelector('#timetunnellight2');

        const track1 = document.querySelector('#track1'); // Tracks
        const track2 = document.querySelector('#track2');
        const track3 = document.querySelector('#track3');
        
        const scene0toggle = sceneEl.querySelectorAll('.scene0'); // Scene 0 Assets
        const narration = document.querySelector('#narration');
        const countdown = document.querySelector('#countdown-s');
        const startdoors = document.querySelector('#start-doors');
        const swingingdoor = document.querySelector('#swinging-door-s');

        const scene1toggle = sceneEl.querySelectorAll('.scene1'); // Scene 1 Assets
        const timetunnel1insidesound = document.querySelector('#timetunnel1-inside-s');
        const timetunnel2insidesound = document.querySelector('#timetunnel2-inside-s');
        const timetunnel3insidesound = document.querySelector('#timetunnel3-inside-s');

        const scene2toggle = sceneEl.querySelectorAll('.scene2'); // Scene 2 Models
        const eatingshasta = document.querySelector('#eating-shasta');
        const joshuatree = document.querySelector('#joshua-tree');
        const sbc1 = sceneEl.querySelectorAll('.scene2sbc');
        const sbc1cat = document.querySelector('#sbc1a');
        const sbc1plant = document.querySelector('#sbc1-plant');
        
        const scene2sounds = sceneEl.querySelectorAll('.scene2sound'); // Scene 2 Sounds
        const scene2animations = sceneEl.querySelectorAll('.scene2anim');
        const sleepyshasta = document.querySelector('#sleepy-shasta');
        const crickets1 = document.querySelector('#crickets1-s');
        const crickets2 = document.querySelector('#crickets2-s');
        const crickets3 = document.querySelector('#crickets3-s');
        const raccoonyelp = document.querySelector('#raccoon-yelp-s');
        const sbcplants1 = document.querySelector('#sbcplants1-s');
        const sbcplants2 = document.querySelector('#sbcplants2-s');

        const timetunneldoor1 = document.querySelector('#timetunnel1-outside'); // Time Tunnels
        const timetunnel1 = document.querySelector('#timetunnel1-inside');
        const timetunneldoor1ent = document.querySelector('#timetunnel-door-1-entrance-s');
        const timetunneldoor1exit = document.querySelector('#timetunnel-door-1-exit-s');
        const timetunneldoor2 = sceneEl.querySelectorAll('.linkedtunnelout');
        const timetunnel2 = sceneEl.querySelectorAll('.linkedtunnel');
        const timetunneldoor2ent = document.querySelector('#timetunnel-door-2-entrance-s');
        const timetunneldoor3exit = document.querySelector('#timetunnel-door-3-exit-s');

        var visiswitch = function(zone, toggle) {
            for (let each of zone) {
               each.object3D.visible = toggle;
           }
        };
        
        var aniswitchdelay = function(entity, setting, detail, delay) { // Triggers animations on a timer in cases where it is not in sync with track waypoints
            setTimeout(() => {
                entity.setAttribute(setting, detail)
            }, delay);
        };

        var audiswitchdelay = function(entity, toggle, delay) { 
            console.log(toggle);
            setTimeout(() => {
                if(toggle == "play") {
                    entity.components.sound.playSound();
                } else if (toggle == "stop") {
                    entity.components.sound.stopSound();
                };
            }, delay);
        };

        sceneEl.addEventListener("alongpath-trigger-activated", function(e) { // Ride instructions to set off sounds, animations, show or hide scenes, etc. Instructions are spread out to prevent pauses, like with multiple light movements going at once
                switch(e.target.id) {
                    case "track_straight0_0":
                        audiswitchdelay(countdown, "play", 6500)
                        console.log('countdown sound');
                        break;
                    case "track_straight1_1":
                        startdoors.setAttribute('animation-mixer', {clip: 'start.door.*.open', loop: 'once', clampWhenFinished: 'true'})
                        swingingdoor.components.sound.playSound();
                        console.log('start door open');
                        break;
                    case "track_straight1_2":
                        startdoors.setAttribute('animation-mixer', {clip: 'start.door.*.close', loop: 'once', clampWhenFinished: 'true'})
                        swingingdoor.components.sound.playSound();
                        console.log('start door close');
                        break;
                    case "track_straight1_3":
                        timetunnel1.setAttribute('animation-mixer', {timeScale: '1'})
                        console.log('Time Tunnel undulate');
                        break;
                    case "track_turn1_1":
                        timetunneldoor1.setAttribute('animation-mixer', {clip: 'TimeTunnel.door.entrance.open', loop: 'once', clampWhenFinished: 'true'})
                        timetunneldoor1ent.components.sound.playSound();
                        console.log('time door open 1');
                        timetunnel1insidesound.components.sound.playSound();
                        console.log('time tunnel 1 inside sound on');
                        break;
                     case "track_turn1_3":
                        visiswitch(scene0toggle, false);
                        timetunneldoor1.setAttribute('animation-mixer', {clip: 'TimeTunnel.door.entrance.close', loop: 'once', clampWhenFinished: 'true'})
                        timetunneldoor1ent.components.sound.playSound();
                        console.log('time door close 1');
                        ambilight.setAttribute('animation', {property: 'light.intensity', to: 0.05, dur: 8000});
                        console.log('ambient light dim');
                        break;
                    case "track_straight2_1a":
                        visiswitch(scene2toggle, true);
                        for (let each of scene2animations) {
                            each.setAttribute('animation-mixer', {timeScale: '1'})
                        };
                        console.log('scene 2 animations on');
                        setAttributes(light1, {"position": {x: 31, y: 9.1, z: -29}, "color": "#6458fa", "animation": {property: 'light.intensity', from: 1.5, to: 2, dur: 2000}, "decay": 0.01, "distance": 11.9})
                        console.log('light1 move to raccoons')
                        break;
                    case "track_straight2_1b":
                        visiswitch(scene1toggle, false);
                        console.log('scene 1 off');
                        timetunneldoor1.setAttribute('animation-mixer', {clip: 'TimeTunnel.door.exit.open', loop: 'once', clampWhenFinished: 'true'})
                        timetunneldoor1exit.components.sound.playSound();
                        console.log('time door open 2');
                        crickets1.components.sound.playSound();
                        console.log('play cricket sounds')
                        break;
                    case "track_straight2_2":
                        setAttributes(light2, {"position":  {x: 49.65, y: 4.7, z: -22.5}, "color": "#fedccb", "light.intensity": 2, "decay": 0.1, "distance": 5.5})
                        console.log('light2 move to sbc dawn')
                        break;
                    case "track_turn2_1":
                        timetunneldoor1.setAttribute('animation-mixer', {clip: 'TimeTunnel.door.exit.close', loop: 'once', clampWhenFinished: 'true'})
                        timetunneldoor1exit.components.sound.playSound();
                        console.log('time door close 1-2');
                        audiswitchdelay(timetunnel1insidesound, "stop", 2000)
                        console.log('time tunnel 1 inside sound off');
                        break;
                    case "track_turn2_2":
                        crickets2.components.sound.playSound();
                        console.log('play cricket sounds')
                        raccoonyelp.components.sound.playSound();
                        console.log('play raccoon yelp')
                        break;
                    case "track_turn2_3":
                        timetunnel1.setAttribute('animation-mixer', {timeScale: '0'})
                        console.log('Time Tunnel undulate off');
                        crickets3.components.sound.playSound();
                        console.log('play cricket sounds')
                        break;
                    case "track_asympt1":
                        setAttributes(ambilight, {'animation': {property: 'light.intensity', to: 0.01, dur: 4000}})
                        console.log('ambient light dim');
                        break;
                    case "track_turn3_1":
                        raccoonyelp.components.sound.stopSound();
                        console.log('stop raccoon yelp')
                        break;
                    case "track_turn3_3":
                        timelight1.setAttribute('position', {x: 50, y: 1.6, z: -15})
                        console.log('Time Tunnel light move to position 2');
                        break;
                    case "track_turn4_1":
                        for (let each of sbc1) {
                            aniswitchdelay(each, "animation-mixer", {timeScale: "1"}, "8200");
                        };
                        audiswitchdelay(sbcplants1, "play", 8200);
                        audiswitchdelay(sbcplants2, "play", 20240);
                        console.log('SBC sequence');
                        crickets1.components.sound.stopSound();
                        console.log('stop crickets1 sound')
                    break;
                    case "track_turn4_2":
                        break;
                    case "track_turn4_3":
                        for (let each of timetunnel2) {
                            each.setAttribute('animation-mixer', {timeScale: '1'})
                        };
                        console.log('Time Tunnel 2 undulate on');
                        break;
                    case "track_straight5_1":
                        for (let each of timetunneldoor2) {
                            aniswitchdelay(each, 'animation-mixer', {clip: 'TimeTunnel.door.entrance.open', loop: 'once', clampWhenFinished: 'true'}, 2000);
                        };
                        audiswitchdelay(timetunneldoor2ent, "play", 2000);
                        console.log('time door entrance open 2');
                        audiswitchdelay(timetunnel2insidesound, "play", 2000);
                        audiswitchdelay(timetunnel3insidesound, "play", 2000);
                        console.log('time tunnel 2 inside sound on');
                    break;
                    case "track_straight5_3":
                        visiswitch(scene0toggle, true);
                        for (let each of timetunneldoor2) {
                            each.setAttribute('animation-mixer', {clip: 'TimeTunnel.door.entrance.close', loop: 'once', clampWhenFinished: 'true'})
                        };
                        timetunneldoor2ent.components.sound.playSound();
                        console.log('time door entrance 2 close');
                        light2.setAttribute('animation', {property: 'light.intensity', from: 2, to: 0, dur: 3000});
                        console.log('track 1 off')
                    break;
                    case "track_straight_end_1_1":
                        sbc1cat.removeAttribute('animation-mixer')
                        sbc1plant.removeAttribute('animation-mixer')
                        sbc1cat.setAttribute('animation-mixer', {clip: '*stalk', clampWhenFinished: 'true', loop: 'once', timeScale: '0'})
                        sbc1plant.setAttribute('animation-mixer', {clip: '*push', clampWhenFinished: 'true', loop: 'once', timeScale: '0'})
                        console.log('sbc animation reset');
                        visiswitch(scene2toggle, false);
                        console.log('scene 2 hide');
                        break;
                    case "track_straight_end_1_2":
                        visiswitch(scene1toggle, true);
                        setAttributes(light1, {"position": {x: -0.123, y: 4.9, z: 5}, "color": "white", "animation": {property: 'light.intensity', from: 2, to: 1.5, dur: 4000}, "decay": 1, "distance": 15})
                        console.log('light1 move to scene 0 for dismount')
                        for (let each of timetunneldoor2) {
                            each.setAttribute('animation-mixer', {clip: 'TimeTunnel.door.exit.open', loop: 'once', clampWhenFinished: 'true'})
                        };
                        timetunneldoor3exit.components.sound.playSound();
                        console.log('time door exit open 2');
                        for (let each of scene2animations) {
                            each.setAttribute('animation-mixer', {timeScale: '0'})
                        };
                        for (let each of scene2sounds) {
                            each.components.sound.stopSound();
                        };
                        console.log('Scene 2 looping sounds off');
                    break;
                    case "track_straight_end_1_3":
                        setAttributes(ambilight, {'animation': {property: 'light.intensity', to: 0.1, dur: 4000}})
                        console.log('ambient light back to original');
                    break;
                    case "track_straight_end_1_4":
                        visiswitch(scene2toggle, false);
                        setAttributes(light2, {"position": {x: 0, y: 5.4, z: -17.4}, "color": "white", "animation": {property: 'light.intensity', to: 0.3, dur: 4000}, "decay": 1, "distance": 11})
                        console.log('light2 move to scene1')
                        for (let each of timetunneldoor2) {
                            each.setAttribute('animation-mixer', {clip: 'TimeTunnel.door.exit.close', loop: 'once', clampWhenFinished: 'true'})
                        };
                        timetunneldoor3exit.components.sound.playSound();
                        console.log('time door exit close 2');
                        audiswitchdelay(timetunnel2insidesound, "stop", 4000)
                        audiswitchdelay(timetunnel3insidesound, "stop", 4000)
                        console.log('time tunnel 2 inside sound off');
                    break;
                    case "track_straight_end_1_5":
                        timelight1.setAttribute('position', {x: 14.4, y: 1.6, z: -20})
                        console.log('time light 1 to original position');
                        for (let each of timetunnel2) {
                            each.setAttribute('animation-mixer', {timeScale: '0'})
                        };
                        console.log('Time Tunnel 2 undulate off');
                    break;
                    case "track_straight_end_1_6":
                    break;
                    case "track_straight_dismount_1":
                    break;
                }    
            })

            sceneEl.addEventListener("alongpath-trigger-activated", function(e) { // Handlers for narration
                switch(e.target.id) {
                    case "track_straight0_0":
                        narration.flushToDOM();
                        console.log('2 '+ narration.getAttribute('sound').src)  
                        narration.components.sound.playSound();
                        console.log('Narration start');
                        break;
                }    
            })

sceneEl.addEventListener("animation-loop", function(e) {
    console.log(e.target.id);
    const raccoonscrounging = document.querySelector('#raccoon-scrounging-s');
    const shastawaking = document.querySelector('#shasta-waking-s');
    const shastaeating = document.querySelector('#shasta-eating-s');
    let rand = 0
    switch(e.target.id) {
        case "sleepy-shasta": // The sloths have randomized behavior. Each have one more common animation and one rarer one
            rand = Math.floor(Math.random() * 10);
            console.log(rand);
            if (rand < 2) {
                sleepyshasta.setAttribute('animation-mixer', {clip: 'shasta.waking', clampWhenFinished: 'true'})
                shastawaking.components.sound.playSound();
            console.log('waking');
            } else {
                sleepyshasta.setAttribute('animation-mixer', {clip: 'shasta.sleeping', clampWhenFinished: 'true'})
                console.log('sleeping');
            }
            break;
        case "eating-shasta":
            rand = Math.floor(Math.random() * 10);
            console.log(rand);
            if (rand < 3) {
                eatingshasta.setAttribute('animation-mixer', {clip: 'shasta.looking', clampWhenFinished: 'true'})
                joshuatree.setAttribute('animation-mixer', {clip: 'joshuatree.swaying', clampWhenFinished: 'true'})
            console.log('looking');
            } else {
                eatingshasta.setAttribute('animation-mixer', {clip: 'shasta.eating', clampWhenFinished: 'true'})
                joshuatree.setAttribute('animation-mixer', {clip: 'joshuatree.eaten', clampWhenFinished: 'true'})
                shastaeating.components.sound.playSound();
                console.log('eating');
            }
            break;
        case "scrounging-raccoon":
            raccoonscrounging.components.sound.playSound();
            break;
    }

})


rig.addEventListener("movingended__#track0", function(){
    rig.setAttribute('alongpath', {curve: '#track1', dur: '140000', triggerRadius: '0.1'})
})
rig.addEventListener("movingended__#track1", function(){
    rig.setAttribute('alongpath', {curve: '#track2', dur: '200000', triggerRadius: '0.1'})
})
rig.addEventListener("movingended__#track2", function(){
    rig.setAttribute('alongpath', {curve: '#track3', dur: '53000', triggerRadius: '0.1'})
})
rig.addEventListener("movingended__#track3", function(){
    rig.setAttribute('alongpath', {curve: '#trackdismount', dur: '5000', triggerRadius: '0.001'}) // This adds a delay to the stop at the exit ramp with imperceptible movement 
})
rig.addEventListener("movingended__#trackdismount", function(){
    rig.dispatchEvent(new CustomEvent("endtour"));
    console.log('dismount to starting platform');
})
    }
    })

let timetunneldoor1state = 0; // This variable has to be here I guess? It's used below.

AFRAME.registerComponent('buttonlogic', {
    init: function () {    
            const el = this.el;
            const sceneEl = document.querySelector('a-scene');
            let creditcounter = 0;
            let movemode = 0;
            
            let trackvisibility = false;
            const rig = document.querySelector('#rig');
            const walk = document.querySelectorAll(".walk");
            const walklabel = document.querySelectorAll(".walk-label");
            const ride = document.querySelectorAll(".ride");
            const hands = document.querySelectorAll('.hand');
            const creditslist = document.querySelectorAll(".credits");
            const originalColor = el.getAttribute('material').color;
            const narration = document.querySelector('#narration');
            let narrationcounter = 1; 
            const warpmap1 = document.querySelector('#warp-map1');
            const warpmap2 = document.querySelector('#warp-map2');
            const podvisibletext = document.querySelector('#podvisibletext');
            const podwarningtext = document.querySelector('#podwarningtext');
            const track = document.querySelectorAll(".track");
            const trackorbstext = document.querySelector('#trackorbstext');
            const narrationtext = document.querySelector('#narrationtext');
            const glvrtext = document.querySelector('#GL-VR');
            const glpctext = document.querySelector('#GL-PC');
            const glsptext = document.querySelector('#GL-SP');
            const boopsound = document.querySelector('#boop-s');
            const beepsound = document.querySelector('#beep-s');
            const startdoors = document.querySelector('#start-doors');
            const swingingdoor = document.querySelector('#swinging-door-s');
            const transition = document.querySelector("#transition");

            const crickets1 = document.querySelector('#crickets1-s');
            const crickets2 = document.querySelector('#crickets2-s');
            const crickets3 = document.querySelector('#crickets3-s');
            const raccoonyelp = document.querySelector('#raccoon-yelp-s');
            const scene2animations = sceneEl.querySelectorAll('.scene2anim');
            const scene2sounds = sceneEl.querySelectorAll('.scene2sound');
            const scene2toggle = sceneEl.querySelectorAll('.scene2');
            const light1 = document.querySelector('#light1');
            const light2 = document.querySelector('#light2');
            const ambilight = document.querySelector('#ambientlight');
            const sbc1cat = document.querySelector('#sbc1a');
            const sbc1plant = document.querySelector('#sbc1-plant');
            const scene2butt1 = sceneEl.querySelectorAll('.scene2raccoontext');
            const scene2butt4 = sceneEl.querySelectorAll('.scene2sbctext'); 

            const timetunnel3insidesound = document.querySelector('#timetunnel3-inside-s');
            const timetunneldoor2 = sceneEl.querySelectorAll('.linkedtunnelout');
            const timetunnel2 = sceneEl.querySelectorAll('.linkedtunnel');
            const timetunneldoor3exit = document.querySelector('#timetunnel-door-3-exit-s');

            let transitionclosewarp = function(warplocx, warplocy, warplocz, sceneswitch) {
                transition.dispatchEvent(new CustomEvent("transitionclose"));
                setTimeout(function(){warpwarp(warplocx, warplocy, warplocz, sceneswitch);}, 1000); // value has to match animation speed, I guess?!
            };
        
            let warpwarp = function(warplocx, warplocy, warplocz, sceneswitch) {
                console.log(sceneswitch);
                sceneswitch();
                rig.object3D.position.set(warplocx, warplocy, warplocz);
                if (AFRAME.utils.device.checkHeadsetConnected() === false) { // PC and mobile mode
                    rig.components['movement-controls'].updateNavLocation();
                }
                setTimeout(function(){transitionopenwarp();}, 1000)
            };
            
            let transitionopenwarp = function() {
                transition.dispatchEvent(new CustomEvent("transitionopen"));
            };
          
            
            let rideresetswitches = function() { // Resets ride mode to starting settings
                visiswitch(scene2toggle, false);
                setAttributes(light1, {"position": {x: -0.123, y: 4.9, z: 5}, "color": "white", "animation": {property: 'light.intensity', from: 2, to: 1.5, dur: 500}, "decay": 1, "distance": 15})
                setAttributes(light2, {"position": {x: 0, y: 5.4, z: -17.4}, "color": "white", "animation": {property: 'light.intensity', to: 0.3, dur: 500}, "decay": 1, "distance": 11})
                setAttributes(ambilight, {'animation': {property: 'light.intensity', to: 0.1, dur: 4000}})
                for (let each of scene2sounds) {
                    each.components.sound.stopSound();
                };
                for (let each of scene2animations) {
                    each.setAttribute('animation-mixer', {timeScale: '0'})
                };
                setAttributes(warpmap1, {"position": {x: -4.527, y: 1.237, z: 6.344}, "rotation": {x: -62.1, y: -126.72, z: 0}});
                setAttributes(warpmap2, {"position": {x: 4.83, y: 0.85, z: -20.6}, "rotation": {x: -62.1, y: -91.9, z: 0}});
                sbc1cat.removeAttribute('animation-mixer');
                sbc1plant.removeAttribute('animation-mixer');
                sbc1cat.setAttribute('animation-mixer', {clip: '*stalk', clampWhenFinished: 'true', loop: 'once', timeScale: '0'});
                sbc1cat.setAttribute('sound', {src: '#sbc-steps', autoplay: 'false', loop: 'true', distanceModel: 'linear', maxDistance: '5'});
                sbc1plant.setAttribute('animation-mixer', {clip: '*push', clampWhenFinished: 'true', loop: 'once', timeScale: '0'});
            };

            let scene2switches = function() { // Turns on Scene 2 for Walk Mode
                visiswitch(scene2toggle, true);
                crickets1.components.sound.playSound();
                setAttributes(light1, {"position": {x: 31, y: 9.1, z: -29}, "color": "#6458fa", "animation": {property: 'light.intensity', from: 1.5, to: 2, dur: 500}, "decay": 0.01, "distance": 11.9})
                setAttributes(light2, {"position":  {x: 49.65, y: 4.7, z: -22.5}, "color": "#fedccb", "light.intensity": 2, "decay": 0.1, "distance": 5.5})
                setAttributes(ambilight, {'animation': {property: 'light.intensity', to: 0.015, dur: 1000}})
                setAttributes(warpmap1, {"position": {x: 23.77, y: 0.85, z: -19.6}, "rotation": {x: -62.1, y: 90, z: 0}})
                setAttributes(warpmap2, {"position": {x: 50.44, y: 0.812, z: -23.95}, "rotation": {x: -62.1, y: 180.22, z: 0}})
                crickets2.components.sound.playSound();
                raccoonyelp.components.sound.playSound();
                crickets3.components.sound.playSound();
                for (let each of scene2animations) {
                    each.setAttribute('animation-mixer', {timeScale: '1'})
                };
                sbc1cat.setAttribute('animation-mixer', {clip: '*stalk', clampWhenFinished: 'false', loop: 'repeat', timeScale: '1'})
                sbc1cat.setAttribute('sound', {src: '#sbc-steps', autoplay: 'true', loop: 'true', distanceModel: 'linear', maxDistance: '5'})
                sbc1plant.setAttribute('animation-mixer', {clip: '*flat', clampWhenFinished: 'true', loop: 'once', timeScale: '1'})
            };

            let tunneldoorswitch = function() {
                var cent = document.getElementById("scene0-text-2");
                cent.object3D.visible = !cent.getAttribute("visible");

                if (timetunneldoor1state == 0) {
                    for (let each of timetunneldoor2) {
                        each.setAttribute('animation-mixer', {clip: 'TimeTunnel.door.exit.open', loop: 'once', clampWhenFinished: 'true'})
                    };
                    timetunneldoor3exit.components.sound.playSound();
                    console.log('time door exit open 2');
                    timetunnel3insidesound.components.sound.playSound();
                    console.log('time tunnel 3 inside sound on');
                    for (let each of timetunnel2) {
                        each.setAttribute('animation-mixer', {timeScale: '1'});
                    };
                    console.log('Time Tunnel 2 undulate on');
                    timetunneldoor1state = 1;
                } else if (timetunneldoor1state == 1) {
                    for (let each of timetunneldoor2) {
                        each.setAttribute('animation-mixer', {clip: 'TimeTunnel.door.exit.close', loop: 'once', clampWhenFinished: 'true'})
                    };
                    timetunneldoor3exit.components.sound.playSound();
                    console.log('time door exit close 2');
                    
                    console.log('time tunnel 3 inside sound off');
                    setTimeout(() => {
                    for (let each of timetunnel2) {
                        each.setAttribute('animation-mixer', {timeScale: '0'});
                    }; 
                    timetunnel3insidesound.components.sound.stopSound()}, 3000);
                    console.log('Time Tunnel 2 undulate off');
                    timetunneldoor1state = 0;
                }
            }
            
          var visiswitch = function(zone, toggle) {
            for (let each of zone) {
               each.object3D.visible = toggle;
           }
        };
        
        var aniswitchdelay = function(entity, setting, detail, delay) { // Triggers animations on a timer in cases where it is not in sync with track waypoints
            setTimeout(() => {
                entity.setAttribute(setting, detail)
            }, delay);
        };

        var audiswitchdelay = function(entity, toggle, delay) { 
            console.log(toggle);
            setTimeout(() => {
                if(toggle == "play") {
                    entity.components.sound.playSound();
                } else if (toggle == "stop") {
                    entity.components.sound.stopSound();
                };
            }, delay);
        };

          el.addEventListener('raycaster-intersected', function () {
            boopsound.components.sound.playSound();
            el.setAttribute('material', 'color', 'yellow');
          });

          el.addEventListener('mouseup', function () {
            el.setAttribute('material', 'color', 'white');
            console.log(el.id);
            switch(el.id) {
                case "movemodebutt": // This button toggles between Ride Mode and Teleport Mode

                    movemode++;
                    if (movemode > 1) { 
                        movemode = 0;
                    }
                    if (movemode === 0) { // Ride Mode
                            startdoors.setAttribute('animation-mixer', {clip: 'start.door.*.close', loop: 'once', clampWhenFinished: 'true'})
                            swingingdoor.components.sound.playSound();
                            startdoorstate = 0;

            
                            const movementgeneralride = function() {
                                for (let each of walk) {
                                    each.object3D.visible = false;
                                    each.object3D.position.y -= 3;
                                }
                                for (let each of walklabel) {
                                    each.object3D.position.y -= 3;
                                }
                                for (let each of ride) {
                                    each.object3D.visible = true;
                                    each.object3D.position.y += 3;
                                }
                                console.log(timetunneldoor1state);
                            tunneldoorswitch();
                            }
                        
                            if (AFRAME.utils.device.checkHeadsetConnected() === true) { // VR Mode
                                const transitioncloseride = function() {
                                    transition.dispatchEvent(new CustomEvent("transitionclose"));
                                    setTimeout(function(){warpwarpride();}, 1000);
                                };
                        
                                const warpwarpride = function() {
                                    movementgeneralride();
                                    rig.object3D.position.set(-6.5, 0.6, 5);
                                    camera.components['look-controls'].yawObject.rotation.set(0,THREE.MathUtils.degToRad(0),0);
                                    rig.setAttribute("movement-controls", 'enabled', true); 
                                    for (let each of hands) {
                                        each.setAttribute('raycaster', 'far', 4); // Makes VR raycaster lines long
                                        each.removeAttribute("mixin"); 
                                    }
                                    
                                    AFRAME.utils.entity.setComponentProperty(instructionsstitle, "value", "Instructions: Ride Mode");
                                    AFRAME.utils.entity.setComponentProperty(glvrtext, "value", "Turn: use headset or right thumbstick\nMove: press forward on thumbsticks to\nteleport\nSelect: point and use trigger\n\nMove around and see the scenes at your\nown pace!");
                                    AFRAME.utils.entity.setComponentProperty(movemodetext, "value", "Switch to Teleport Mode"); 
                                    console.log('setting Ride Mode')
                                    setTimeout(function(){transitionopenride();}, 700)
                                };
                                
                                const transitionopenride = function() {
                                    transition.dispatchEvent(new CustomEvent("transitionopen"));
                                };

                                transitioncloseride();
                                
                            } else if (AFRAME.utils.device.checkHeadsetConnected() === false) { // PC Mode
                                const transitioncloseride = function() {
                                    transition.dispatchEvent(new CustomEvent("transitionclose"));
                                    setTimeout(function(){warpwarpride();}, 1000);
                                };
                        
                                const warpwarpride = function() {
                                    movementgeneralride()
                                    rig.object3D.position.set(-6.5, 0.6, 5);
                                    camera.components['look-controls'].yawObject.rotation.set(0,THREE.MathUtils.degToRad(0),0);
                                    rig.setAttribute("movement-controls", 'enabled', false); 
                                    AFRAME.utils.entity.setComponentProperty(instructionsstitle, "value", "Instructions: Ride Mode");
                                    AFRAME.utils.entity.setComponentProperty(glpctext, "value", "Turn: drag with mouse\nSelect: left click\n\n1. Check options on right panel\n2. Select button on ramp to start ride!");
                                    AFRAME.utils.entity.setComponentProperty(movemodetext, "value", "Switch to Walk Mode"); 
                                    console.log('setting Ride Mode')
                                    setTimeout(function(){transitionopenride();}, 700)
                                };
                                
                                const transitionopenride = function() {
                                    transition.dispatchEvent(new CustomEvent("transitionopen"));
                                };

                                transitioncloseride();
                                
                        };

                    } else if (movemode === 1) { // Walk Mode   
                            startdoorstate = 1;
                            const movementgeneralwalk = function() {
                                for (let each of walk) {
                                    each.object3D.visible = true;
                                    each.object3D.position.y += 3;
                                }
                                for (let each of walklabel) {
                                    each.object3D.position.y += 3;
                                }
                                for (let each of ride) {
                                    each.object3D.visible = false;
                                    each.object3D.position.y -= 3;
                                }
                            }
                            if (AFRAME.utils.device.checkHeadsetConnected() === true) { // VR Mode
                                const transitionclosetele = function() {
                                    transition.dispatchEvent(new CustomEvent("transitionclose"));
                                    setTimeout(function(){warpwarptele();}, 1000);
                                };
                    
                                const warpwarptele = function() {
                                    rig.setAttribute("movement-controls", 'enabled', false); 
                                    movementgeneralwalk();
                                    if (podvisibility === false) { // Makes pod visible again for telport mode
                                        podplaceholder.object3D.visible = true;
                                        AFRAME.utils.entity.setComponentProperty(podvisibletext, "value", "TimePod: On");
                                        podvisibility = true;
                                        podwarningtext.setAttribute("visible", false); 
                                    }
                                    startdoors.setAttribute('animation-mixer', {clip: 'start.door.*.open', loop: 'once', clampWhenFinished: 'true'})
                                    swingingdoor.components.sound.playSound();
                                    for (let each of hands) {
                                        each.setAttribute('raycaster', 'far', 0.5); // Makes VR raycaster lines short
                                        each.setAttribute("mixin", "blink"); 
                                    }
                                    AFRAME.utils.entity.setComponentProperty(instructionsstitle, "value", "Instructions: Teleport Mode");
                                    AFRAME.utils.entity.setComponentProperty(glvrtext, "value", "Turn: use headset or right thumbstick\nSelect: point and use trigger\n\n1. Check options on right panel\n2. Get comfortable\n3. Center your view in VR\n4. Select button on ramp to start ride!");
                                    AFRAME.utils.entity.setComponentProperty(movemodetext, "value", "Switch to Ride Mode");
                                        console.log('setting Teleport Mode')
                                        setTimeout(function(){transitionopentele();}, 700)
                                    };
                                
                                const transitionopentele = function() {
                                    transition.dispatchEvent(new CustomEvent("transitionopen"));
                                };

                                transitionclosetele();
                                
                                 
                            } else if (AFRAME.utils.device.checkHeadsetConnected() === false) { // PC Mode
                                
                                const transitionclosewalk = function() {
                                    transition.dispatchEvent(new CustomEvent("transitionclose"));
                                    setTimeout(function(){warpwarpwalk();}, 1000);
                                };
                    
                                const warpwarpwalk = function() {
                                    movementgeneralwalk();
                                    rig.setAttribute("movement-controls", "enabled", true);
                                    rig.setAttribute("movement-controls", "speed", 0.15);
                                    rig.setAttribute("movement-controls", "constrainToNavMesh", true);
                                    
                                    if (podvisibility === false) { // Makes pod visible again for walk mode
                                        podplaceholder.object3D.visible = true;
                                        AFRAME.utils.entity.setComponentProperty(podvisibletext, "value", "TimePod: On");
                                        podvisibility = true;
                                    }
                                    startdoors.setAttribute('animation-mixer', {clip: 'start.door.*.open', loop: 'once', clampWhenFinished: 'true'})
                                    swingingdoor.components.sound.playSound();
                                    AFRAME.utils.entity.setComponentProperty(instructionsstitle, "value", "Instructions: Walk Mode");
                                    AFRAME.utils.entity.setComponentProperty(glpctext, "value", "Turn: drag with mouse\nMove: use wasd keys\nSelect: left click\n\nMove around and see the scenes at your\nown pace!");
                                    AFRAME.utils.entity.setComponentProperty(movemodetext, "value", "Switch to Ride Mode"); 
                                    console.log('setting Walk Mode')
                                    setTimeout(function(){transitionopenwalk();}, 700)
                                    };
                                
                                const transitionopenwalk = function() {
                                    transition.dispatchEvent(new CustomEvent("transitionopen"));
                                };

                                transitionclosewalk();
                                
                    }}
                    break;
                case "podvisiblebutt":
                    podplaceholder.object3D.visible = !podplaceholder.getAttribute("visible");
                    podvisibility = !podvisibility;
                    if (podvisibility === true) {
                            AFRAME.utils.entity.setComponentProperty(podvisibletext, "value", "TimePod: On");
                            if (AFRAME.utils.device.checkHeadsetConnected() === true) { 
                                podwarningtext.setAttribute("visible", false); 
                            };
                    } else {
                            AFRAME.utils.entity.setComponentProperty(podvisibletext, "value", "TimePod: Off");        
                            if (AFRAME.utils.device.checkHeadsetConnected() === true) { // Shows VR specific warning
                                podwarningtext.setAttribute("visible", true); 
                            };
                    }
                    break;
                case "trackorbsbutt":
                    if (trackvisibility === false) {
                        for (let each of track) {
                            each.object3D.visible = true;
                        };
                        AFRAME.utils.entity.setComponentProperty(trackorbstext, "value", "Track Orbs: On");
                        trackvisibility = true;
                    } else if (trackvisibility === true) {
                        for (let each of track) {
                            each.object3D.visible = false;
                        };
                        AFRAME.utils.entity.setComponentProperty(trackorbstext, "value", "Track Orbs: Off");
                        trackvisibility = false;
                    }  
                    break;
                case "scene0-butt-1":
                    var cent = document.getElementById("scene0-text-1");
                    cent.object3D.visible = !cent.getAttribute("visible");
                    break;
                case "scene0-butt-2":
                    console.log(timetunneldoor1state);
                    tunneldoorswitch();
                    break;
                case "scene1-butt-1":
                    var cent = document.getElementById("scene1-text-1");
                    cent.object3D.visible = !cent.getAttribute("visible");
                    break;
                case "scene2-butt-1":
                    for (let each of scene2butt1) {
                        each.object3D.visible = !each.getAttribute("visible");
                    }; 
                    break;
                case "scene2-butt-2":
                    var cent = document.getElementById("scene2-text-2");
                    cent.object3D.visible = !cent.getAttribute("visible");
                    break;
                case "scene2-butt-3":
                    var cent = document.getElementById("scene2-text-3");
                    cent.object3D.visible = !cent.getAttribute("visible");
                    break;
                case "scene2-butt-4":
                    for (let each of scene2butt4) {
                        each.object3D.visible = !each.getAttribute("visible");
                    }; 
                    break;

                case "scene0warpbutt1":
                case "scene0warpbutt2":
                    transitionclosewarp(-6.5, 0.6, 5, rideresetswitches);
                    break;
                case "scene1warpbutt1":
                case "scene1warpbutt2":
                    transitionclosewarp(3, 0.05, -6.85, rideresetswitches);
                    break;   
                case "scene2awarpbutt1":
                case "scene2awarpbutt2":
                    transitionclosewarp(26.5, 0.05, -20, scene2switches);
                    break;           
                case "scene2bwarpbutt1":
                case "scene2bwarpbutt2":
                    transitionclosewarp(50, 0.05, -26.2, scene2switches);
                    break; 
                    
                case "narrationbutt":
                    narrationcounter++;
                    console.log(narrationcounter);
                    if (narrationcounter > 3) { // Value is total narration tracks (plus none) minus one
                        narrationcounter = 0;
                        AFRAME.utils.entity.setComponentProperty(narrationtext, "value", "Narration: None");
                        narration.setAttribute('sound', {src: '#beep-sound'});
                        narration.setAttribute('sound', {volume: '0'});
                        narration.flushToDOM();
                        console.log("silent track set")     
                        console.log(narration.getAttribute('sound').src)
                    
                    } else if (narrationcounter === 1) {
                        narration.setAttribute('sound', {src: '#narration-adventure'})
                        narration.setAttribute('sound', {volume: '1'});
                        AFRAME.utils.entity.setComponentProperty(narrationtext, "value", "Narration: Adventure");   
                        narration.flushToDOM();
                        console.log("adventure track set");              
                    } else if (narrationcounter === 2) {
                        AFRAME.utils.entity.setComponentProperty(narrationtext, "value", "Narration: Educational");
                        narration.setAttribute('sound', {src: '#narration-education'})
                        narration.setAttribute('sound', {volume: '1'});
                        narration.flushToDOM();
                        console.log("education track set");            
                    } else if (narrationcounter === 3) {
                        AFRAME.utils.entity.setComponentProperty(narrationtext, "value", "Narration: Behind-the-Scenes");
                        narration.setAttribute('sound', {src: '#narration-commentary'})
                        narration.setAttribute('sound', {volume: '1'});
                        narration.flushToDOM();
                        console.log("commentary track set")               
                    }
                    break;
                case "creditsbutt": // Flips credit panels
                    for (let each of creditslist) {
                        each.setAttribute("visible", false);     
                    }
                    creditcounter++;
                    if (creditcounter > 6) { // Value is total panels minus one
                        creditcounter = 0;
                    }
                    creditslist[creditcounter].setAttribute("visible", true);
                    break;
                
            }
          });
          el.addEventListener('mouseup', function () {
            beepsound.components.sound.playSound(); // Beep sound for all buttons
            el.setAttribute('material', 'color', 'orange');
          });
          el.addEventListener('raycaster-intersected-cleared', function () {
            el.setAttribute('material', 'color', originalColor);
          });
        }
      });

