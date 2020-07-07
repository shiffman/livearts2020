var canvas = document.getElementById("renderCanvas");

        var engine = null;
        var scene = null;
        var sceneToRender = null;
        var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
        
        var createScene = function () {
            var scene = new BABYLON.Scene(engine);
            var camera = new BABYLON.ArcRotateCamera("cam", -Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero());
            var anchor = new BABYLON.TransformNode("");
        
            camera.wheelDeltaPercentage = 0.01;
            camera.attachControl(canvas, true);
        
            // Create the 3D UI manager
            var manager = new BABYLON.GUI.GUI3DManager(scene);
        
            var panel = new BABYLON.GUI.SpherePanel();
            panel.margin = 0.2;
         
            manager.addControl(panel);
            panel.linkToTransformNode(anchor);
            panel.position.z = -1.5;
        
            // Let's add some buttons!
            var addButton = function() {
                var button = new BABYLON.GUI.HolographicButton("orientation");
                panel.addControl(button);
        
                button.text = "Button #" + panel.children.length;
            }
        
            panel.blockLayout = true;
            for (var index = 0; index < 60; index++) {
                addButton();    
            }
            panel.blockLayout = false;
        
            return scene;
        
        };
        
var engine;
try {
    engine = createDefaultEngine();
} catch(e) {
    console.log("the available createEngine function failed. Creating the default engine instead");
    engine = createDefaultEngine();
}
        if (!engine) throw 'engine should not be null.';
        scene = createScene();;
        sceneToRender = scene

        engine.runRenderLoop(function () {
            if (sceneToRender) {
                sceneToRender.render();
            }
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });