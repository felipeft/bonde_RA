/**
 * app.js
 * Ponto de entrada da aplicação: inicializa o controlador do modelo,
 * o gerenciador de posicionamento, os gestos de toque e a interface.
 */
import { ModelController } from './model-controller.js';
import { GPSController } from './gps.js';
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
  const gpsController = new GPSController(modelController);

  const placementManager = new PlacementManager(gpsController, {
    onModeChange: (mode) => console.log(`app.js: modo de posicionamento alterado para "${mode}".`),
  });

  new UIController({ modelController, placementManager });

  const startGestures = () => {
    new GestureController(scene.canvas, modelController, placementManager);
  };

  const onSceneLoad = () => {
    modelController.loadModel('assets/bonde.glb');
    startGestures();
    
    // ATRASO CRÍTICO: Espera 800 milissegundos para o celular ligar os 
    // sensores do giroscópio e a lente da câmera antes de calcular o teletransporte.
    setTimeout(() => {
      modelController.reset();
    }, 800);
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
