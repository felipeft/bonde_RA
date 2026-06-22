/**
 * gps.js
 */
export class GPSController {
  constructor(modelController) {
    this.modelController = modelController;
  }

  enable() {
    console.log('GPSController: Modo GPS ATIVADO.');

    if (this.modelController && this.modelController.entity) {
      const entity = this.modelController.entity;

      entity.removeAttribute('position');
      
      entity.setAttribute('scale', '0.5 0.5 0.5');
      entity.setAttribute('rotation', '0 0 0');

      // as coordenadas devem ser colocadas aqui
      entity.setAttribute('gps-new-entity-place', 'latitude: -4.9687434; longitude: -39.0117863');
    }
  }

  disable() {
    console.log('GPSController: Modo GPS DESATIVADO.');

    if (this.modelController && this.modelController.entity) {
      const entity = this.modelController.entity;

      entity.removeAttribute('gps-new-entity-place');
      
      this.modelController.reset();
    }
  }
}
