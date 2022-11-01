console.warn = console.error = () => {}; // Suppresses Three.js warnings. Remove to debug

// PC Look Preference Switcher
AFRAME.registerComponent("look-switch", {
    init: function() {
        var sceneEl = this.el.sceneEl;
        var canvasEl = sceneEl.canvas;
        var camera = document.querySelector('#camera');
        var PCmode = 0;
        window.addEventListener("keydown", function(e){ // Mouselook toggle
            if(e.keyCode === 77 && PCmode == 0) { // Swipe to FPS
                camera.setAttribute('look-controls', {enabled: false});
                camera.setAttribute('fps-look-controls', 'userHeight', 0);
                PCmode = 1;
            } else if (e.keyCode === 77 && PCmode == 1) { // FPS to swipe
                camera.removeAttribute('fps-look-controls');
                camera.setAttribute('look-controls', {enabled: true});
                canvasEl.onclick = null; // Removes FPS components taking mouse on click
                document.exitPointerLock();

                document.querySelector('#crosshair').object3D.visible = false;
                PCmode = 0;
    
            }
        });
    }
    })

AFRAME.registerComponent('device-set', { // Device-specific settings
    init: function() {
        var sceneEl = document.querySelector('a-scene');
        var tablestand = sceneEl.querySelectorAll('.table');
        var standup = sceneEl.querySelectorAll('.standup');
        var grabbable = sceneEl.querySelectorAll('.grabbable');
        var rig = document.querySelector('#rig');
        var camera = document.querySelector('#camera');
        var handleft = document.querySelector('#lefthand');
        var handright = document.querySelector('#righthand');
        var state = "stand";
        if (AFRAME.utils.device.isMobile() === true) { // Smartphone Mode
            sceneEl.setAttribute("vr-mode-ui", "enabled", "false");
            rig.setAttribute("movement-controls", "speed", 0.15);
            document.querySelector('#GL-SP').object3D.visible = true;
            document.querySelector('#SMH-SP').object3D.visible = true;
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
            console.log('VR detected');
            
            // rig.removeAttribute('movement-controls'); // Remove non-working controls

        } else if (AFRAME.utils.device.checkHeadsetConnected() === false) { // PC Mode
            console.log('PC detected');

            rig.setAttribute("movement-controls", "speed", 0.3);
            for (let each of grabbable) {
                each.removeAttribute('dynamic-body');
                each.removeAttribute('grabbable');
                each.setAttribute('static-body');
                each.object3D.position.y +=0.25;
            }
            for (let each of tablestand) {
                let poss = each.getAttribute('position');
                each.object3D.position.y += 0.25;
            }
            for (let each of standup) { // Stands up small objects
                each.removeAttribute('dynamic-body');
                each.removeAttribute('grabbable');
                each.setAttribute('static-body');
                each.setAttribute('rotation', {z: 90});
                each.object3D.position.y += 0.15;
            }
            window.addEventListener("keydown", function(e){ // Crouch key for PC
                if(e.keyCode === 67 && state == "stand") { 
                    camera.setAttribute('position', {y: 1.0});
                    state = "crouch";
                } else if (e.keyCode === 67 && state == "crouch") {
                    camera.setAttribute('position', {y: 1.6});
                    state ="stand";
        
                }
            });
    }
}})

AFRAME.registerComponent("tour-start", {
    init: function() {
        var el = this.el;
        var rig = document.querySelector('#rig');
        var pod = document.querySelector('#pod');

        el.addEventListener("grab-start", function(evt) {
            pod.object3D.visible = true;
            rig.object3D.position.set(0, 0, 0);
            rig.setAttribute('rotation', {y: 1.5708});
            rig.setAttribute("movement-controls", "constrainToNavMesh", false);
            rig.removeAttribute('movement-controls');
            rig.setAttribute('alongpath', {curve: '#track1', dur: 55000, triggerRadius: 0.1})
        })
    }}
)

AFRAME.registerComponent("tour-guide", {
    init: function() {
        var rig = document.querySelector('#rig');
        var sceneEl = document.querySelector('a-scene');
        var timetunneldoor1 = document.querySelector('#timetunnel1-outside');
        var startdoors = document.querySelector('#start-doors');
        var starttoggle = sceneEl.querySelectorAll('.starttoggle');

        var visiswitch = function(zone) {
            console.log(starttoggle);
            for (let each of zone) {
               each.object3D.visible = false;
           }
           }

        sceneEl.addEventListener("alongpath-trigger-activated", function(e) {
            console.log(e.target);

                switch(e.target.id) {
                    case "track_straight1_1":
                        AFRAME.utils.entity.setComponentProperty(startdoors, "animation-mixer.clip", "start.door.*.open");
                        AFRAME.utils.entity.setComponentProperty(startdoors, "animation-mixer.loop", "once");
                        AFRAME.utils.entity.setComponentProperty(startdoors, "animation-mixer.clampWhenFinished", "true");
                        console.log('start door open');
                        break;
                    case "track_turn1_1":
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.entrance.*open");
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.loop", "once");
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
                        console.log('time door open 1');
                        break;
                    case "track_turn1_3":
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.entrance.*close");
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.loop", "once");
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
                        console.log('time door close 1');
                        break;
                    case "track_straight2_1a":
                        visiswitch(starttoggle);
                        console.log('start room off');
                        break;
                    case "track_straight2_1b":
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.exit.*open");
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.loop", "once");
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
                        console.log('time door open 2');
                        break;
                }    


})
        
        rig.addEventListener("movingended__#track1", function(){
                    AFRAME.utils.entity.setComponentProperty(rig, "alongpath.curve", "#track2");
                    AFRAME.utils.entity.setComponentProperty(rig, "alongpath.dur", "80000");
                    AFRAME.utils.entity.setComponentProperty(rig, "alongpath.triggerRadius", "0.1");
                    
        })
        rig.addEventListener("movingended__#track2", function(){
            AFRAME.utils.entity.setComponentProperty(rig, "alongpath.curve", "#track3");
            AFRAME.utils.entity.setComponentProperty(rig, "alongpath.dur", "35000");
            AFRAME.utils.entity.setComponentProperty(rig, "alongpath.triggerRadius", "0.1");
        })

        
    }
    })

