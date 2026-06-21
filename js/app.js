/**
 * app.js
 * Ponto de entrada da aplicação: inicializa o controlador do modelo,
 * o gerenciador de posicionamento, os gestos de toque e a interface.
 */
import { ModelController } from './model-controller.js';
import { PlacementManager } from './placement.js';
import { GestureController } from './gestures.js';
import { UIController } from './ui.js';

function init() {
  const scene = document.querySelector('a-scene');
  if (!scene) {
    console.error('app.js: <a-scene> não encontrada no documento.');
    return;
  }

  const modelController = new ModelController('#bonde-model');

  const placementManager = new PlacementManager(modelController, {
    onModeChange: (mode) => console.log(`app.js: modo de posicionamento alterado para "${mode}".`),
  });

  new UIController({ modelController, placementManager });

  const startGestures = () => {
    new GestureController(scene.canvas, modelController, placementManager);
  };

  if (scene.hasLoaded) {
    modelController.loadModel('assets/bonde.glb');
    startGestures();
  } else {
    scene.addEventListener('loaded', () => {
      modelController.loadModel('assets/bonde.glb');
      startGestures();
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
