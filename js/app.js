/**
 * app.js
 * Ponto de entrada central. Orquestra as dependências e inicializa
 * os módulos da aplicação de AR.
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

  // 1. Inicializa o controlador do modelo 3D
  const modelController = new ModelController('#bonde-model');

  // 2. Inicializa o controlador do GPS (preparado para a equipe de geolocalização)
  const gpsController = new GPSController(modelController);

  // 3. O Placement Manager passa a gerenciar a troca de estados (Free vs GPS)
  const placementManager = new PlacementManager(gpsController, {
    onModeChange: (mode) => console.log(`app.js: Modo de posicionamento atualizado para "${mode}".`),
  });

  // 4. Conecta a Interface e os Gestos
  new UIController({ modelController, placementManager });

  const startGestures = () => {
    new GestureController(scene.canvas, modelController, placementManager);
  };

  // 5. Inicia o carregamento e os listeners da cena
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
