/**
 * gps.js
 * Controla a ativação dinâmica dos componentes de geolocalização do AR.js 
 * no modelo e na câmera, fazendo a transição suave entre o Modo Livre e o Modo Local.
 */
export class GPSController {
  constructor(modelController) {
    this.modelController = modelController;
    this.cameraEl = document.getElementById('ar-camera');
  }


  enable() {
    console.log('GPSController: Modo GPS ATIVADO.');

    if (this.cameraEl) {
      this.cameraEl.setAttribute('gps-new-camera', 'gpsMinDistance: 5');
    }

    if (this.modelController && this.modelController.entity) {
      const entity = this.modelController.entity;

      entity.removeAttribute('position');
      
      entity.setAttribute('scale', '0.5 0.5 0.5');
      entity.setAttribute('rotation', '0 0 0');

      entity.setAttribute('gps-new-entity-place', 'latitude: -5.120145; longitude: -38.355598');
    }
  }

  disable() {
    console.log('GPSController: Modo GPS DESATIVADO.');

    // 1. Remove o rastreamento por satélite da câmera
    if (this.cameraEl) {
      this.cameraEl.removeAttribute('gps-new-camera');
    }
    
    if (this.modelController && this.modelController.entity) {
      const entity = this.modelController.entity;

      entity.removeAttribute('gps-new-entity-place');
      
      this.modelController.reset();
    }
  }
}
