/**
 * placement.js
 * Responsabilidade única: controlar a troca entre Modo Histórico (GPS)
 * e Modo Livre, servindo como ponto único de integração para a equipe
 * de geolocalização.
 */

export const PlacementModes = Object.freeze({
  GPS: 'gps',
  FREE: 'free',
});

export class PlacementManager {
  constructor(modelController, { onModeChange } = {}) {
    this.modelController = modelController;
    this.onModeChange = onModeChange;
    this.currentMode = PlacementModes.FREE;
  }

  getMode() {
    return this.currentMode;
  }

  isFreeMode() {
    return this.currentMode === PlacementModes.FREE;
  }

  isGPSMode() {
    return this.currentMode === PlacementModes.GPS;
  }

  enableGPSMode() {
    this.currentMode = PlacementModes.GPS;
    this.modelController.enableGPSMode();
    this._notify();
  }

  enablePlacementMode() {
    this.currentMode = PlacementModes.FREE;
    this.modelController.enablePlacementMode();
    this._notify();
  }

  _notify() {
    if (typeof this.onModeChange === 'function') {
      this.onModeChange(this.currentMode);
    }
  }
}
