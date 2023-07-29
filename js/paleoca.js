// console.warn = console.error = () => {}; // Suppresses Three.js warnings. Remove to debug

AFRAME.registerComponent('device-set', { // Device-specific settings
    init: function() {
        var sceneEl = document.querySelector('a-scene');
        var tablestand = sceneEl.querySelectorAll('.table');
        var standup = sceneEl.querySelectorAll('.standup');
        var grabbable = sceneEl.querySelectorAll('.grabbable');

        if (AFRAME.utils.device.isMobile() === true) { // Smartphone Mode
            sceneEl.setAttribute("vr-mode-ui", "enabled", "false");
            // rig.setAttribute("movement-controls", "speed", 0.15);
            document.querySelector('#GL-SP').object3D.visible = true;
            for (let each of tablestand) {
                each.object3D.position.y += 0.25;
            }
            for (let each of grabbable) {
                each.removeAttribute('dynamic-body');
                each.removeAttribute('grabbable');
                each.setAttribute('static-body');
                each.object3D.position.y += 0.245;
            }
            for (let each of standup) {
                each.setAttribute('rotation', {z: 90});
                each.object3D.position.y += 0.2;
            }
        } else if (AFRAME.utils.device.checkHeadsetConnected() === true) { // VR Mode
            document.querySelector('#GL-VR').object3D.visible = true;
            console.log('VR detected');
            
            // rig.removeAttribute('movement-controls'); // Remove non-working controls

        } else if (AFRAME.utils.device.checkHeadsetConnected() === false) { // PC Mode
            console.log('PC detected');
            document.querySelector('#GL-PC').object3D.visible = true;
    }
}})

AFRAME.registerComponent("tour-start", {
    init: function() {
        const el = this.el;
        const rig = document.querySelector('#rig');
        const camera = document.querySelector('#camera');
        const podplaceholder = document.querySelector('#podplaceholder');
        const pod = document.querySelector('#pod');
        const transition = document.querySelector("#transition");
        let x = null;
        let y = null;
        const transitionclose = function() {
            const campos = camera.object3D.position
            const rigpos = rig.object3D.position
            console.log(campos.y);
            console.log(rigpos.y);
            x = 1.7 - campos.y;
            y = campos.y - 0.55;
            console.log(x+', '+y);
            transition.dispatchEvent(new CustomEvent("transitionclose"));
            setTimeout(function(){warpwarp();}, 700); // value has to match animation speed, I guess?!
        };

        const warpwarp = function() {
            rig.object3D.position.set(0, x, 0);
            pod.object3D.position.set(0, y, 0);
            camera.object3D.position.set(0, 1.6, 0);
            camera.components['look-controls'].yawObject.rotation.set(0,THREE.MathUtils.degToRad(0),0);
            podplaceholder.object3D.visible = false;
            pod.object3D.visible = true;
            // if (AFRAME.utils.device.checkHeadsetConnected() === false) { // PC and mobile mode
            //     rig.components['movement-controls'].updateNavLocation();
            // }
            setTimeout(function(){transitionopen();}, 700)
        };
        
        const transitionopen = function() {
            transition.dispatchEvent(new CustomEvent("transitionopen"));
            // rig.setAttribute("movement-controls", "constrainToNavMesh", false);
            // rig.removeAttribute('movement-controls');
            rig.setAttribute('alongpath', {curve: '#track1', dur: 80000, triggerRadius: 0.1}) // Set to #track1 dur 80000 for tour start
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
        const podplaceholder = document.querySelector('#podplaceholder');
        const pod = document.querySelector('#pod');
        const transition = document.querySelector("#transition");

        const transitionclose = function() {
            transition.dispatchEvent(new CustomEvent("transitionclose"));
            setTimeout(function(){warpwarp();}, 700); // value has to match animation speed, I guess?!
        };

        const warpwarp = function() {
            rig.object3D.position.set(-6.5, 0.6, 5);
            // rig.object3D.rotation.set(0, -1.5, 0);
            camera.components['look-controls'].yawObject.rotation.set(0,THREE.MathUtils.degToRad(-90),0);
            podplaceholder.object3D.visible = true;
            pod.object3D.visible = false;
            AFRAME.utils.entity.setComponentProperty(light1, "position", {x: -4.2, y: 3.6, z: 5});
            AFRAME.utils.entity.setComponentProperty(light1, "color", "white");
            AFRAME.utils.entity.setComponentProperty(light1, 'animation', {property: 'light.intensity', from: 2, to: 1.5, dur: 2000});
            AFRAME.utils.entity.setComponentProperty(light1, "decay", 1);
            AFRAME.utils.entity.setComponentProperty(light1, "distance", 15);
            console.log('light1 move to end')
            // if (AFRAME.utils.device.checkHeadsetConnected() === false) { // PC and mobile mode
            //     rig.components['movement-controls'].updateNavLocation();
            // }
            setTimeout(function(){transitionopen();}, 700)
        };
        
        const transitionopen = function() {
            transition.dispatchEvent(new CustomEvent("transitionopen"));
            // rig.setAttribute("movement-controls", "constrainToNavMesh", false);
            // rig.removeAttribute('movement-controls');
        };

        el.addEventListener("endtour", function(evt) {
            transitionclose();
            rig.removeAttribute('alongpath');

        })
    }}
);

AFRAME.registerComponent("tour-mechanics", {
    init: function() {
        const rig = document.querySelector('#rig');
        const sceneEl = document.querySelector('a-scene');
        const ambilight = document.querySelector('#ambientlight');
        const light1 = document.querySelector('#light1');
        const light2 = document.querySelector('#light2');
        const timelight = document.querySelector('#timetunnellight');
        const timelight2 = document.querySelector('#timetunnellight2');
        
        const scene0toggle = sceneEl.querySelectorAll('.scene0');
        const startdoors = document.querySelector('#start-doors');
        const swingingdoor = document.querySelector('#swinging-door-s');

        const scene1toggle = sceneEl.querySelectorAll('.scene1');
        const timetunnel1insidesound = document.querySelector('#timetunnel1-inside-s');
        const timetunnel2insidesound = document.querySelector('#timetunnel2-inside-s');
        const timetunnel3insidesound = document.querySelector('#timetunnel3-inside-s');

        const scene2toggle = sceneEl.querySelectorAll('.scene2');
        const scene2sounds = sceneEl.querySelectorAll('.scene2sound');
        const scene2animations = sceneEl.querySelectorAll('.scene2anim');
        const sleepyshasta = document.querySelector('#sleepy-shasta');
        const crickets1 = document.querySelector('#crickets1-s');
        const crickets2 = document.querySelector('#crickets2-s');
        const crickets3 = document.querySelector('#crickets3-s');
        const raccoonyelp = document.querySelector('#raccoon-yelp-s');
        const sbcplants1 = document.querySelector('#sbcplants1-s');
        const sbcplants2 = document.querySelector('#sbcplants2-s');

        const eatingshasta = document.querySelector('#eating-shasta');
        const joshuatree = document.querySelector('#joshua-tree');
        const sbc1 = sceneEl.querySelectorAll('.scene2sbc');

        const timetunneldoor1 = document.querySelector('#timetunnel1-outside');
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

        var aniswitch = function(entity, setting, detail) {
            AFRAME.utils.entity.setComponentProperty(entity, setting, detail);
        };
        
        var aniswitchdelay = function(entity, setting, detail, delay) {
            setTimeout(() => {
                AFRAME.utils.entity.setComponentProperty(entity, setting, detail);
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

        sceneEl.addEventListener("alongpath-trigger-activated", function(e) {
                switch(e.target.id) {
                    case "track_straight1_1":
                        aniswitch(startdoors, "animation-mixer.clip", "start.door.*.open");
                        aniswitch(startdoors, "animation-mixer.loop", "once");
                        aniswitch(startdoors, "animation-mixer.clampWhenFinished", "true");
                        swingingdoor.components.sound.playSound();
                        console.log('start door open');
                        break;
                    case "track_straight1_2":
                        aniswitch(startdoors, "animation-mixer.clip", "start.door.*.close");
                        aniswitch(startdoors, "animation-mixer.loop", "once");
                        aniswitch(startdoors, "animation-mixer.clampWhenFinished", "true");
                        swingingdoor.components.sound.playSound();
                        console.log('start door close');
                        break;
                    case "track_straight1_3":
                        visiswitch(scene2toggle, "true");
                        aniswitch(timetunnel1, "animation-mixer.timeScale", "1");
                        for (let each of scene2animations) {
                            aniswitch(each, "animation-mixer.timeScale", "1");
                        };
                        console.log('Time Tunnel undulate, scene 2 animations on');
                        break;
                    case "track_turn1_1":
                        visiswitch(scene0toggle, "false");
                        aniswitch(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.entrance.open");
                        aniswitch(timetunneldoor1, "animation-mixer.loop", "once");
                        aniswitch(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
                        timetunneldoor1ent.components.sound.playSound();
                        console.log('time door open 1');
                        timetunnel1insidesound.components.sound.playSound();
                        console.log('time tunnel 1 inside sound on');
                        break;
                     case "track_turn1_3":
                        aniswitch(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.entrance.close");
                        aniswitch(timetunneldoor1, "animation-mixer.loop", "once");
                        aniswitch(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
                        timetunneldoor1ent.components.sound.playSound();
                        console.log('time door close 1');
                        aniswitch(ambilight, 'animation', {property: 'light.intensity', to: 0.05, dur: 8000});
                        console.log('ambient light dim');
                        break;
                    case "track_straight2_1a":
                        visiswitch(scene1toggle, "false");
                        console.log('scene 1 off');
                        aniswitch(light1, "position", {x: 31, y: 9.1, z: -29});
                        aniswitch(light1, "color", "#6458fa");
                        aniswitch(light1, 'animation', {property: 'light.intensity', from: 1.5, to: 2, dur: 2000});
                        aniswitch(light1, "decay", 0.01);
                        aniswitch(light1, "distance", 11.9);
                        console.log('light1 move to raccoons')
                        break;
                    case "track_straight2_1b":
                        aniswitch(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.exit.open");
                        aniswitch(timetunneldoor1, "animation-mixer.loop", "once");
                        aniswitch(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
                        timetunneldoor1exit.components.sound.playSound();
                        console.log('time door open 2');
                        crickets1.components.sound.playSound();
                        console.log('play cricket sounds')
                        break;
                    case "track_straight2_1":
                        aniswitch(light2, "position", {x: 49.65, y: 4.7, z: -22.5});
                        aniswitch(light2, "color", "#fedccb");
                        aniswitch(light2, "intensity", 2);
                        aniswitch(light2, "decay", 0.1);
                        aniswitch(light2, "distance", 5.5);
                        console.log('light2 move to sbc dawn')
                        break;
                    case "track_turn2_1":
                        aniswitch(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.exit.close");
                        aniswitch(timetunneldoor1, "animation-mixer.loop", "once");
                        aniswitch(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
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
                        aniswitch(timetunnel1, "animation-mixer.timeScale", "0");
                        console.log('Time Tunnel undulate off');
                        crickets3.components.sound.playSound();
                        console.log('play cricket sounds')
                        break;
                    case "track_asympt1":
                        aniswitch(ambilight, 'animation', {property: 'light.intensity', to: 0.01, dur: 4000});
                        console.log('ambient light dim');
                        break;
                    case "track_turn3_1":
                        raccoonyelp.components.sound.stopSound();
                        console.log('stop raccoon yelp')
                        break;
                    case "track_turn3_3":
                        aniswitch(timelight, "position", {x: 50, y: 1.6, z: -15});
                        console.log('Time Tunnel light move to position 2');
                        break;
                    case "track_turn4_1":
                        for (let each of sbc1) {
                            aniswitchdelay(each, "animation-mixer.timeScale", "1", "5200");
                            aniswitch(each, "animation-mixer.loop", "once");
                            aniswitch(each, "animation-mixer.clampWhenFinished", "true");
                        };
                        audiswitchdelay(sbcplants1, "play", 5200);
                        audiswitchdelay(sbcplants2, "play", 17740);
                        console.log('SBC sequence');
                    break;
                    case "track_turn4_2":
                        aniswitch(timelight2, "visible", "true");
                        console.log('Time Tunnel light 2 activate');
                        break;
                    case "track_turn4_3":
                        for (let each of timetunnel2) {
                            aniswitch(each, "animation-mixer.timeScale", "1");
                        };
                        console.log('Time Tunnel 2 undulate on');
                        break;
                    case "track_straight5_1":
                        for (let each of timetunneldoor2) {
                            aniswitch(each, "animation-mixer.clip", "TimeTunnel.door.entrance.open");
                            aniswitch(each, "animation-mixer.loop", "once");
                            aniswitch(each, "animation-mixer.clampWhenFinished", "true");
                        };
                        timetunneldoor2ent.components.sound.playSound();
                        console.log('time door entrance open 2');
                        timetunnel2insidesound.components.sound.playSound();
                        timetunnel3insidesound.components.sound.playSound();
                        console.log('time tunnel 2 inside sound on');
                    break;
                    case "track_straight5_3":
                        visiswitch(scene0toggle, "true");
                        for (let each of timetunneldoor2) {
                            aniswitch(each, "animation-mixer.clip", "TimeTunnel.door.entrance.close");
                            aniswitch(each, "animation-mixer.loop", "once");
                            aniswitch(each, "animation-mixer.clampWhenFinished", "true");
                        };
                        timetunneldoor2ent.components.sound.playSound();
                        console.log('time door entrance 2 close');
                        aniswitch(light2, 'animation', {property: 'light.intensity', from: 2, to: 0, dur: 3000});
                    break;
                    case "track_straight_end_1_1":
                    visiswitch(scene2toggle, "false");
                    console.log('scene 2 hide');
                        break;
                    case "track_straight_end_1_2":
                        aniswitch(light1, "position", {x: -0.123, y: 4.9, z: 5});
                        aniswitch(light1, "color", "white");
                        aniswitch(light1, 'animation', {property: 'light.intensity', from: 2, to: 1.5, dur: 2000});
                        aniswitch(light1, "decay", 1);
                        aniswitch(light1, "distance", 15);
                        console.log('light1 move to scene 0 for dismount')
                        for (let each of timetunneldoor2) {
                            aniswitch(each, "animation-mixer.clip", "TimeTunnel.door.exit.open");
                            aniswitch(each, "animation-mixer.loop", "once");
                            aniswitch(each, "animation-mixer.clampWhenFinished", "true");
                        };
                        timetunneldoor3exit.components.sound.playSound();
                        console.log('time door exit open 2');
                        for (let each of scene2animations) {
                            aniswitch(each, "animation-mixer.timeScale", "0");
                        };
                        console.log('Scene 2 looping sounds off');
                        for (let each of scene2sounds) {
                            each.components.sound.stopSound();
                        };
                    break;
                    case "track_straight_end_1_3":
                        aniswitch(ambilight, 'animation', {property: 'light.intensity', to: 0.1, dur: 4000});
                        console.log('ambient light back to original');
                    break;
                    case "track_straight_end_1_4":
                        visiswitch(scene1toggle, "true");
                        visiswitch(scene2toggle, "false");
                        aniswitch(light2, "position", {x: 0, y: 5.4, z: -17.4});
                        aniswitch(light2, "color", "white");
                        aniswitch(light2, 'intensity', "0.3");
                        aniswitch(light2, "decay", 1);
                        aniswitch(light2, "distance", 11);
                        console.log('light2 move to scene1')
                        for (let each of timetunneldoor2) {
                            aniswitch(each, "animation-mixer.clip", "TimeTunnel.door.exit.close");
                            aniswitch(each, "animation-mixer.loop", "once");
                            aniswitch(each, "animation-mixer.clampWhenFinished", "true");
                        };
                        timetunneldoor3exit.components.sound.playSound();
                        console.log('time door exit close 2');
                        audiswitchdelay(timetunnel2insidesound, "stop", 2000)
                        audiswitchdelay(timetunnel3insidesound, "stop", 2000)
                        console.log('time tunnel 2 inside sound off');

                    break;
                    case "track_straight_end_1_6":
                        aniswitch(timelight, "position", {x: 14.4, y: 1.6, z: -20});
                        console.log('time light 1 to original position');
                        for (let each of timetunnel2) {
                            aniswitch(each, "animation-mixer.timeScale", "0");
                        };
                        console.log('Time Tunnel 2 undulate off');
                        rig.dispatchEvent(new CustomEvent("endtour"));
                        console.log('dismount to starting platform');
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
        case "sleepy-shasta":
            rand = Math.floor(Math.random() * 10);
            console.log(rand);
            if (rand < 3) {
                aniswitch(sleepyshasta, "animation-mixer.clip", "shasta.waking");
                aniswitch(sleepyshasta, "animation-mixer.clampWhenFinished", "true");
                shastawaking.components.sound.playSound();
            console.log('waking');
            } else {
                aniswitch(sleepyshasta, "animation-mixer.clip", "shasta.sleeping");
                aniswitch(sleepyshasta, "animation-mixer.clampWhenFinished", "true");
                console.log('sleeping');
            }
            break;
        case "eating-shasta":
            rand = Math.floor(Math.random() * 10);
            console.log(rand);
            if (rand > 8) {
                aniswitch(eatingshasta, "animation-mixer.clip", "shasta.looking");
                aniswitch(eatingshasta, "animation-mixer.clampWhenFinished", "true");
                aniswitch(joshuatree, "animation-mixer.clip", "joshuatree.swaying");
            console.log('looking');
            } else {
                aniswitch(eatingshasta, "animation-mixer.clip", "shasta.eating");
                aniswitch(eatingshasta, "animation-mixer.clampWhenFinished", "true");
                aniswitch(joshuatree, "animation-mixer.clip", "joshuatree.eaten");
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
    aniswitch(rig, "alongpath.curve", "#track1");
    aniswitch(rig, "alongpath.dur", "80000");
    aniswitch(rig, "alongpath.triggerRadius", "0.1");
    
})
rig.addEventListener("movingended__#track1", function(){
    aniswitch(rig, "alongpath.curve", "#track2");
    aniswitch(rig, "alongpath.dur", "151000");
    aniswitch(rig, "alongpath.triggerRadius", "0.1");
                    
        })
rig.addEventListener("movingended__#track2", function(){
    aniswitch(rig, "alongpath.curve", "#track3");
    aniswitch(rig, "alongpath.dur", "53000"); // 30000
    aniswitch(rig, "alongpath.triggerRadius", "0.1");
})

        
    }
    })

    AFRAME.registerComponent('buttonlogic', {
        init: function () {    
          const el = this.el;
          let counter = 0;
          const creditslist = document.querySelectorAll(".credits");
          const originalColor = el.getAttribute('material').color;
          const vignette = document.querySelector('#vignette');
          const vignettetext = document.querySelector('#vignettetext');
          const trackorbstext = document.querySelector('#trackorbstext');
          const track = document.querySelectorAll('.track');
          const track1 = document.querySelector('#track1');
          const boopsound = document.querySelector('#boop-s');
          const beepsound = document.querySelector('#beep-s');

          el.addEventListener('raycaster-intersected', function () {
            boopsound.components.sound.playSound();
            el.setAttribute('material', 'color', 'yellow');
          });

          el.addEventListener('mouseup', function () {
            el.setAttribute('material', 'color', 'white');
            console.log(el.id);
            switch(el.id) {
                case "vignettebutt":
                    vignette.object3D.visible = !vignette.getAttribute("visible");
                    console.log('vignette toggle '+vignette.object3D.visible);
                    if (vignette.object3D.visible === true) {
                            AFRAME.utils.entity.setComponentProperty(vignettetext, "value", "Vignette: On");
                    } else {
                            AFRAME.utils.entity.setComponentProperty(vignettetext, "value", "Vignette: Off");               
                    }
                    break;
                case "trackorbsbutt":
                    for (let each of track) {
                        each.object3D.visible = !each.getAttribute("visible");
                        console.log('track toggle '+each.object3D.visible);
                    };
                        if (track1.object3D.visible === true) {
                                AFRAME.utils.entity.setComponentProperty(trackorbstext, "value", "Track Orbs: On");
                        } else {
                                AFRAME.utils.entity.setComponentProperty(trackorbstext, "value", "Track Orbs: Off");
                        }
                    break;
                case "creditsbutt":
                    for (let each of creditslist) {
                        each.setAttribute("visible", false);     
                    }
                    counter++;
                    if (counter > 5) { // Value is total panels minus one
                        counter = 0;
                    }
                    creditslist[counter].setAttribute("visible", true);
                    break;
                
            }
          });
          el.addEventListener('mouseup', function () {
            beepsound.components.sound.playSound();
            el.setAttribute('material', 'color', 'orange');
          });
          el.addEventListener('raycaster-intersected-cleared', function () {
            el.setAttribute('material', 'color', originalColor);
          });
        }
      });

    
  