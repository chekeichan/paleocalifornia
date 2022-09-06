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

            rig.removeAttribute('movement-controls'); // Remove non-working controls
            handleft.setAttribute('smooth-locomotion', {target: '#rig', reference: '#camera'});
            handright.setAttribute('snap-turn', {target: '#rig', reference: '#camera'});
        } else if (AFRAME.utils.device.checkHeadsetConnected() === false) { // PC Mode
            console.log('PC detected');

            rig.setAttribute("movement-controls", "speed", 0.15);
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

AFRAME.registerComponent("tour-guide", {
    init: function() {
        var move = "curve: #track1; dur: 20000; rotate: true; delay: 0"
        var rig = document.querySelector('#rig');
        rig.addEventListener("movingended__#track1", function(){
                    AFRAME.utils.entity.setComponentProperty(rig, "alongpath.curve", "#track2");
                    AFRAME.utils.entity.setComponentProperty(rig, "alongpath.dur", "24000");
        })
        rig.addEventListener("movingended__#track2", function(){
            AFRAME.utils.entity.setComponentProperty(rig, "alongpath.curve", "#track3");
            AFRAME.utils.entity.setComponentProperty(rig, "alongpath.dur", "24000");
})

        
    }
    })

