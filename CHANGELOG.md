# PaleoCalifornia Changelog

## 1.2 (6/20/26)
The second quarter is now open! Continue on the time travelling expedition through the coastal prairie and valley oak savanna.

-   Here are some bullet pointed highlights!
    - Scene 3, the coastal prairie, is here. It features a herd of animals a few lone standouts too.
    - Scene 4, the valley oak savanna, is your next destination! While the savanna sports younger oaks, the scene is dominated by the largest of the animals that will on this ride. In contrast, the dwarf pronghorn peek out from around the buckbushes and purple needle grass. 
    - The new scenes occupy a new building that tries some new effects: the animals become the visual interest as the horizon opens up compared to the winding corridors of the preceding scenes. The illusion of distance is obtained through forced perspective and the use of differently scaled models and wall decals. (In early testing, a visitor ran right into the wall thinking that the prairie kept going. Mission accomplished!) The multitude of plants is optimized by using linked duplicates in Blender.
    - Walking mode works in the new scenes, taking you off the pre-programmed ride path! You can even make a jump to the distant hill, though it may turn out to be closer than it appeared. Info signs and maps are also there (fun fact: there are 2 map objects that warp in to the scene you are occupying)
    - Narration for all three audio tracks are re-records with a better mic! I accentuated the differences between the Adventure (fun) and Educational (ASMR) tracks and kept consistency in recording quality from Part 1 to Part 2. The developer track has fewer 'um's.
    - New button on options panel to start the ride from the beginning or with the new section
    - Using A-Frame 1.7.0 for Apple Vision Pro compatibility
    - Had to manually fix all of the lights since 1.7.0 and its ThreeJS version changed how lights work 😭
    - Hand models were at an odd angle so I removed the hand component in favor of laser-controls. 
    - Fixed double-hits when selecting buttons in VR

-   But...
    - Procedural rocks and plants are out for now as the component that did it no longer works with the version of A-Frame I'm using.

## 1.1 (12/29/23)

Added walk mode to allow free movement around the scenes. Want to spend more than 6 seconds with the shasta sloths? Perhaps actually see how their animations are randomized? Now you can comune with the sloths and everything else in the ride!

-   Many additions related to the new mode!

    - New button on instructions panel to switch between ride and walk modes
    - Naturally, new instructions depending on which mode is on
    - Use blinking teleport in VR, wasd on PC, and press-to-move on smartphones
    - Nav meshes allow for movement through the scenes
    - VR has extra movement possibilities. Hop on top of some LA skyscrapers or get deep into the nighttime scene. 
    - The loading bay scene allows for opening of the Time Tunnel to be memerized by the green glow but it cannot be entered
    - Togglable info panels (like AnVRopomotron but with different button logic) to learn about various objects in each scene. Learn about prominent LA buildings, animals of the past, and even the Time Pod itself!
    - Map panels (also like AnVRopomotron) strategically placed to warp from scene to scene.
    - Saber-toothed cat now has more animation so it is not forever pouncing while you are in walk mode. The plant around it has a new 'animation' which just holds the plant open to see the cat better.

-   Also

    -   Sound/animation desync in the last Time Tunnel fixed
    -   There was a typo in the materials setting that actually kept a bug from occurring. Fixing the typo caused some text display weirdness. It's all been resolved.

## 1.0.0 (8/15/23)

-   Public release. Hooray!
