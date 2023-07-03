console.warn = console.error = () => {}; // Suppresses Three.js warnings. Remove to debug

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
            rig.setAttribute('alongpath', {curve: '#track1', dur: 75000, triggerRadius: 0.1}) // Set to #track1 dur 75000 for tour start
        })
    }}
)

AFRAME.registerComponent("tour-guide", {
    init: function() {
        var rig = document.querySelector('#rig');
        var sceneEl = document.querySelector('a-scene');
        var timetunneldoor1 = document.querySelector('#timetunnel1-outside');
        var startdoors = document.querySelector('#start-doors');
        var scene1toggle = sceneEl.querySelectorAll('.scene1');

        var scene2animations = sceneEl.querySelectorAll('.scene2anim');
        var timetunnel = document.querySelector('#timetunnel1-inside');
        var sleepyshasta = document.querySelector('#sleepy-shasta');
        var eatingshasta = document.querySelector('#eating-shasta');
        var joshuatree = document.querySelector('#joshua-tree');
        var sbc1 = sceneEl.querySelectorAll('.scene2sbc');

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
                    case "track_straight1_3":
                        AFRAME.utils.entity.setComponentProperty(timetunnel, "animation-mixer.timeScale", "1");
                        for (let each of scene2animations) {
                            AFRAME.utils.entity.setComponentProperty(each, "animation-mixer.timeScale", "1");
                        };
                        console.log('Time Tunnel undulate and scene 2 animations on');
                        break;
                    case "track_turn1_1":
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.entrance.open");
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.loop", "once");
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
                        console.log('time door open 1');
                        break;
                    case "track_turn1_3":
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.entrance.close");
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.loop", "once");
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
                        console.log('time door close 1');
                        break;
                    case "track_straight2_1a":
                        visiswitch(scene1toggle);
                        console.log('start room off');
                        break;
                    case "track_straight2_1b":
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.exit.open");
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.loop", "once");
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
                        console.log('time door open 2');
                        break;
                    case "track_turn2_2":
                        AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clip", "TimeTunnel.door.exit.close");
                         AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.loop", "once");
                         AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.clampWhenFinished", "true");
                         console.log('time door close 2');
                        break;
                    case "track_turn2_2":
                        AFRAME.utils.entity.setComponentProperty(timetunnel, "animation-mixer.timeScale", "0");
                        console.log('Time Tunnel undulate off');
                        break;
                    case "track_turn4_1":
                        for (let each of sbc1) {
                            AFRAME.utils.entity.setComponentProperty(each, "animation-mixer.timeScale", "1");
                            AFRAME.utils.entity.setComponentProperty(timetunneldoor1, "animation-mixer.loop", "once");
                            AFRAME.utils.entity.setComponentProperty(each, "animation-mixer.clampWhenFinished", "true");
                        };
                        console.log('SBC sequence');
                    break;
                }    


})

sceneEl.addEventListener("animation-loop", function(e) {
    console.log(e.target.id);
    switch(e.target.id) {
        case "sleepy-shasta":
            var rand = Math.floor(Math.random() * 10);
            console.log(rand);
            if (rand === 0) {
                AFRAME.utils.entity.setComponentProperty(sleepyshasta, "animation-mixer.clip", "shasta.waking");
                AFRAME.utils.entity.setComponentProperty(sleepyshasta, "animation-mixer.clampWhenFinished", "true");
            console.log('waking');
            } else {
                AFRAME.utils.entity.setComponentProperty(sleepyshasta, "animation-mixer.clip", "shasta.sleeping");
                AFRAME.utils.entity.setComponentProperty(sleepyshasta, "animation-mixer.clampWhenFinished", "true");
                console.log('sleeping');
            }
            break;
        case "eating-shasta":
            var rand = Math.floor(Math.random() * 10);
            console.log(rand);
            if (rand > 0) {
                AFRAME.utils.entity.setComponentProperty(eatingshasta, "animation-mixer.clip", "shasta.looking");
                AFRAME.utils.entity.setComponentProperty(eatingshasta, "animation-mixer.clampWhenFinished", "true");
                AFRAME.utils.entity.setComponentProperty(joshuatree, "animation-mixer.clip", "joshuatree.swaying");
            console.log('looking');
            } else {
                AFRAME.utils.entity.setComponentProperty(eatingshasta, "animation-mixer.clip", "shasta.eating");
                AFRAME.utils.entity.setComponentProperty(eatingshasta, "animation-mixer.clampWhenFinished", "true");
                AFRAME.utils.entity.setComponentProperty(joshuatree, "animation-mixer.clip", "joshuatree.eaten");
                console.log('eating');
            }
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

