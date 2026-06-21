/**
 * gps.js
 * Ponto central de integração para o desenvolvedor responsável pela Geolocalização.
 */
export class GPSController {
  constructor(modelController) {
    this.modelController = modelController;
    this.isInitialized = false;
  }

  /**
   * =========================================================================
   * * GPS MODULE START
   * Desenvolvedor da geolocalização: implemente sua lógica abaixo.
   * * Dica: Utilize a biblioteca AR.js Location-based (gps-new-camera e 
   * gps-new-entity-place) ou a Geolocation API nativa do navegador.
   * Utilize `this.modelController` para interagir com o Bonde (esconder, 
   * mostrar, alterar escala conforme distância, etc).
   * * =========================================================================
   */

  initialize() {
    if (this.isInitialized) return;
    console.log('GPSController: Inicializando serviços de geolocalização...');
    // Sua lógica de setup do mapa, request de permissão de GPS e sensores aqui.
    this.isInitialized = true;
  }

  enable() {
    this.initialize();
    console.log('GPSController: Modo GPS ATIVADO.');
    // Sua lógica para começar a monitorar a posição do usuário e ancorar o modelo.
    
    // Exemplo: this.modelController.object3D.position.set(...) com base no GPS
  }

  disable() {
    console.log('GPSController: Modo GPS DESATIVADO.');
    // Sua lógica para pausar o tracking do GPS ou resetar configurações de câmera.
  }
}
