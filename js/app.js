/**
 * app.js
 * Ponto de entrada central.
 */
import { ModelController } from './model-controller.js';
import { GPSController } from './gps.js';
import { PlacementManager } from './placement.js';
import { GestureController } from './gestures.js';
import { UIController } from './ui.js';
import { CameraVideoFix } from './camera-fix.js';

function init() {
  const scene = document.querySelector('a-scene');
  if (!scene) return;

  new CameraVideoFix();

  const modelController = new ModelController('#bonde-model');
  const gpsController = new GPSController(modelController);
  const placementManager = new PlacementManager(gpsController, {
    onModeChange: (mode) => console.log(`Modo alterado para "${mode}".`),
  });

  new UIController({ modelController, placementManager });

  const startGestures = () => {
    new GestureController(scene.canvas, modelController, placementManager);
  };

  const onSceneLoad = () => {
    modelController.loadModel('assets/bonde.glb');
    startGestures();
    
    // Pequeno atraso para garantir que a câmera e o giroscópio iniciaram, 
    // e então teletransporta o bonde para o centro da visão do usuário.
    setTimeout(() => {
      modelController.reset();
    }, 500);
  };

  if (scene.hasLoaded) {
    onSceneLoad();
  } else {
    scene.addEventListener('loaded', onSceneLoad);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
