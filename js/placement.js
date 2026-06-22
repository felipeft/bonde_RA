/**
 * placement.js
 * Gerencia o estado atual de visualização do modelo na câmera
 * (Modo Histórico ancorado vs Modo Livre).
 */

export const PlacementModes = Object.freeze({
  GPS: 'gps',
  FREE: 'free',
});

export class PlacementManager {
  constructor(gpsController, { onModeChange } = {}) {
    this.gpsController = gpsController;
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
    if (this.isGPSMode()) return;
    this.currentMode = PlacementModes.GPS;
    this.gpsController.enable();
    this._notify();
  }

  enablePlacementMode() {
    if (this.isFreeMode()) return;
    this.currentMode = PlacementModes.FREE;
    this.gpsController.disable();
    this._notify();
  }

  _notify() {
    if (typeof this.onModeChange === 'function') {
      this.onModeChange(this.currentMode);
    }
  }
}
