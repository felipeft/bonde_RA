/**
 * gps.js
 * Como a câmera já está rastreando o GPS via HTML, este arquivo agora foca
 * exclusivamente em "ancorar" o bonde no mundo real ou soltá-lo para o Modo Livre.
 */
export class GPSController {
  constructor(modelController) {
    this.modelController = modelController;
  }

  enable() {
    console.log('GPSController: Modo GPS ATIVADO.');

    if (this.modelController && this.modelController.entity) {
      const entity = this.modelController.entity;

      // 1. Remove a posição livre do A-Frame para não haver conflito
      entity.removeAttribute('position');
      
      // 2. Aplica a escala e rotação padronizada do ambiente de rua (passada pelos colegas)
      entity.setAttribute('scale', '0.5 0.5 0.5');
      entity.setAttribute('rotation', '0 0 0');

      // 3. Ancora o modelo na coordenada GPS real informada pelos seus colegas
      entity.setAttribute('gps-new-entity-place', 'latitude: -5.120145; longitude: -38.355598');
    }
  }

  disable() {
    console.log('GPSController: Modo GPS DESATIVADO.');

    if (this.modelController && this.modelController.entity) {
      const entity = this.modelController.entity;

      // 1. Solta o bonde das coordenadas geográficas
      entity.removeAttribute('gps-new-entity-place');
      
      // 2. Aciona a função que teleporta o bonde de volta para a frente da câmera (Modo Livre)
      this.modelController.reset();
    }
  }
}
