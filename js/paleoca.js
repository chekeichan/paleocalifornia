console.warn = console.error = () => {}; // Suppresses Three.js warnings. Remove to debug

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
        var el = this.el;
        var rig = document.querySelector('#rig');
        var podplaceholder = document.querySelector('#podplaceholder');
        var pod = document.querySelector('#pod');

        el.addEventListener("grab-start", function(evt) {
            podplaceholder.object3D.visible = false;
            pod.object3D.visible = true;
            rig.object3D.position.set(0, 0, 0);
            rig.setAttribute('rotation', {y: 1.5708});
            // rig.setAttribute("movement-controls", "constrainToNavMesh", false);
            // rig.removeAttribute('movement-controls');
            rig.setAttribute('alongpath', {curve: '#track1', dur: 80000, triggerRadius: 0.1}) // Set to #track1 dur 75000 for tour start
        })
    }}
)

AFRAME.registerComponent("tour-guide", {
    init: function() {
        var rig = document.querySelector('#rig');
        var sceneEl = document.querySelector('a-scene');
        var ambilight = document.querySelector('#ambientlight');
        var light1 = document.querySelector('#light1');
        var light2 = document.querySelector('#light2');
        var timelight = document.querySelector('#timetunnellight');
        var timelight2 = document.querySelector('#timetunnellight2');
        
        var scene0toggle = sceneEl.querySelectorAll('.scene0');
        var startdoors = document.querySelector('#start-doors');
        var swingingdoor = document.querySelector('#swinging-door');

        var scene1toggle = sceneEl.querySelectorAll('.scene1');

        var scene2toggle = sceneEl.querySelectorAll('.scene2');
        var scene2animations = sceneEl.querySelectorAll('.scene2anim');
        var sleepyshasta = document.querySelector('#sleepy-shasta');
        var crickets1 = document.querySelector('#crickets1');
        var crickets2 = document.querySelector('#crickets2');
        var crickets3 = document.querySelector('#crickets3');
        var raccoonyelp = document.querySelector('#raccoon-yelp');
        var eatingshasta = document.querySelector('#eating-shasta');
        var joshuatree = document.querySelector('#joshua-tree');
        var sbc1 = sceneEl.querySelectorAll('.scene2sbc');

        var timetunneldoor1 = document.querySelector('#timetunnel1-outside');
        var timetunnel1 = document.querySelector('#timetunnel1-inside');
        var timetunneldoor1ent = document.querySelector('#timetunnel-door-1-entrance');
        var timetunneldoor1exit = document.querySelector('#timetunnel-door-1-exit');
        var timetunneldoor2 = sceneEl.querySelectorAll('.linkedtunnelout');
        var timetunnel2 = sceneEl.querySelectorAll('.linkedtunnel');
        var timetunneldoor2ent = document.querySelector('#timetunnel-door-2-entrance');
        var timetunneldoor3exit = document.querySelector('#timetunnel-door-3-exit');

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
                    case "track_straight2_2":
                        aniswitch(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.exit.open");
                        aniswitch(timetunneldoor1, "animation-mixer.loop", "once");
                        aniswitch(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
                        timetunneldoor1exit.components.sound.playSound();
                        console.log('time door open 2');
                        aniswitch(light2, "position", {x: 49.65, y: 4.7, z: -22.5});
                        aniswitch(light2, "color", "#fedccb");
                        aniswitch(light2, "intensity", 2);
                        aniswitch(light2, "decay", 0.1);
                        aniswitch(light2, "distance", 5.5);
                        console.log('light2 move to sbc dawn')
                        crickets1.components.sound.playSound();
                        console.log('play cricket sounds')
                        break;
                    case "track_turn2_2":
                        aniswitch(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.exit.close");
                        aniswitch(timetunneldoor1, "animation-mixer.loop", "once");
                        aniswitch(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
                        console.log('time door close 2');
                        aniswitch(timetunnel1, "animation-mixer.timeScale", "0");
                        console.log('Time Tunnel undulate off');
                        crickets2.components.sound.playSound();
                        console.log('play cricket sounds')
                        raccoonyelp.components.sound.playSound();
                        console.log('play raccoon yelp')
                        break;
                    case "track_turn2_3":
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
                    break;
                    case "track_straight5_3":
                        visiswitch(scene0toggle, "true");
                        for (let each of timetunneldoor2) {
                            aniswitch(each, "animation-mixer.clip", "TimeTunnel.door.entrance.close");
                            aniswitch(each, "animation-mixer.loop", "once");
                            aniswitch(each, "animation-mixer.clampWhenFinished", "true");
                        };
                        timetunneldoor2ent.components.sound.playSound();
                        console.log('time door entrance open 2');
                        aniswitch(light2, 'animation', {property: 'light.intensity', from: 2, to: 0, dur: 3000});
                    break;
                    case "track_straight_end_1_2":
                        aniswitch(light1, "position", {x: -0.123, y: 4.9, z: 5});
                        aniswitch(light1, "color", "white");
                        aniswitch(light1, 'animation', {property: 'light.intensity', from: 2, to: 1.5, dur: 2000});
                        aniswitch(light1, "decay", 1);
                        aniswitch(light1, "distance", 15);
                        console.log('light1 move to end')
                        for (let each of timetunneldoor2) {
                            aniswitch(each, "animation-mixer.clip", "TimeTunnel.door.exit.open");
                            aniswitch(each, "animation-mixer.loop", "once");
                            aniswitch(each, "animation-mixer.clampWhenFinished", "true");
                        };
                        console.log('time door exit open 2');
                        for (let each of scene2animations) {
                            aniswitch(each, "animation-mixer.timeScale", "0");
                        };
                        console.log('Scene 2 looping animations off');
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
                    break;
                }    


})

/* aniswitch(light1, "position", {x: -4.2, y: 3.6, z: 5});
                        aniswitch(light1, "color", "white");
                        aniswitch(light1, 'animation', {property: 'light.intensity', from: 2, to: 1.5, dur: 2000});
                        aniswitch(light1, "decay", 1);
                        aniswitch(light1, "distance", 15);
                        console.log('light1 move to end') */

sceneEl.addEventListener("animation-loop", function(e) {
    console.log(e.target.id);
    switch(e.target.id) {
        case "sleepy-shasta":
            var rand = Math.floor(Math.random() * 10);
            console.log(rand);
            if (rand === 0) {
                aniswitch(sleepyshasta, "animation-mixer.clip", "shasta.waking");
                aniswitch(sleepyshasta, "animation-mixer.clampWhenFinished", "true");
            console.log('waking');
            } else {
                aniswitch(sleepyshasta, "animation-mixer.clip", "shasta.sleeping");
                aniswitch(sleepyshasta, "animation-mixer.clampWhenFinished", "true");
                console.log('sleeping');
            }
            break;
        case "eating-shasta":
            var rand = Math.floor(Math.random() * 10);
            console.log(rand);
            if (rand > 0) {
                aniswitch(eatingshasta, "animation-mixer.clip", "shasta.looking");
                aniswitch(eatingshasta, "animation-mixer.clampWhenFinished", "true");
                aniswitch(joshuatree, "animation-mixer.clip", "joshuatree.swaying");
            console.log('looking');
            } else {
                aniswitch(eatingshasta, "animation-mixer.clip", "shasta.eating");
                aniswitch(eatingshasta, "animation-mixer.clampWhenFinished", "true");
                aniswitch(joshuatree, "animation-mixer.clip", "joshuatree.eaten");
                console.log('eating');
            }
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
          var el = this.el;
          var originalColor = el.getAttribute('material').color;
          var vignette = document.querySelector('#vignette');
          var vignettetext = document.querySelector('#vignettetext');
          var trackorbstext = document.querySelector('#trackorbstext');
          var track = document.querySelectorAll('.track');
          var track1 = document.querySelector('#track1');

          el.addEventListener('raycaster-intersected', function () {
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
            }
          });
          el.addEventListener('mouseup', function () {
            el.setAttribute('material', 'color', 'orange');
          });
          el.addEventListener('raycaster-intersected-cleared', function () {
            el.setAttribute('material', 'color', originalColor);
          });
        }
      });
    
  