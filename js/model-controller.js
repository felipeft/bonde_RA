/**
 * ModelController
 * Responsabilidade única: toda a manipulação do modelo 3D do bonde
 * (carregamento, escala, rotação, deslocamento, reset, áudio e captura).
 */
export class ModelController {
  constructor(entitySelector, options = {}) {
    this.scaleMin = options.scaleMin ?? 0.3;
    this.scaleMax = options.scaleMax ?? 4.0;

    this.defaultPosition = options.defaultPosition ?? { x: 0, y: 0, z: -3 };
    this.defaultRotationY = options.defaultRotationY ?? 0;
    this.defaultScale = options.defaultScale ?? 1;

    this.entity = document.querySelector(entitySelector);
    this.currentScale = this.defaultScale;

    if (!this.entity) {
      console.error(`ModelController: entidade "${entitySelector}" não encontrada.`);
      return;
    }

    this.entity.addEventListener('model-loaded', () => {
      console.log('ModelController: modelo carregado com sucesso.');
      this.reset();
    });

    this.entity.addEventListener('model-error', (event) => {
      console.error('ModelController: falha ao carregar o modelo GLB.', event.detail);
    });
  }

  /** Solicita o carregamento do modelo GLB na entidade gerenciada. */
  loadModel(src = 'assets/bonde.glb') {
    if (!this.entity) return;
    this.entity.setAttribute('gltf-model', `url(${src})`);
  }

  get object3D() {
    return this.entity ? this.entity.object3D : null;
  }

  /** Define a escala absoluta, respeitando os limites mínimo e máximo. */
  setScale(scale) {
    if (!this.object3D) return;
    this.currentScale = this._clamp(scale, this.scaleMin, this.scaleMax);
    this.object3D.scale.set(this.currentScale, this.currentScale, this.currentScale);
  }

  /** Aplica um fator multiplicativo à escala atual (usado pelo gesto de pinça). */
  scaleBy(factor) {
    this.setScale(this.currentScale * factor);
  }

  /** Rotaciona o modelo em torno do eixo Y. */
  rotate(deltaYDegrees) {
    if (!this.object3D) return;
    this.object3D.rotation.y += THREE.MathUtils.degToRad(deltaYDegrees);
  }

  /** Desloca o modelo no plano horizontal (modo livre). */
  move(deltaX, deltaZ) {
    if (!this.object3D) return;
    this.object3D.position.x += deltaX;
    this.object3D.position.z += deltaZ;
  }

  /** Restaura posição, rotação e escala originais. */
  reset() {
    if (!this.object3D) return;
    const { x, y, z } = this.defaultPosition;
    this.object3D.position.set(x, y, z);
    this.object3D.rotation.set(0, this.defaultRotationY, 0);
    this.currentScale = this.defaultScale;
    this.object3D.scale.set(this.currentScale, this.currentScale, this.currentScale);
  }

  /**
   * Ponto de integração com a equipe de geolocalização.
   * Ao ser chamada, o posicionamento do bonde deverá futuramente passar
   * a ser determinado por coordenadas reais (ex.: componente
   * gps-new-entity-place do AR.js) em vez do posicionamento livre.
   */
  enableGPSMode() {
    console.log('ModelController: modo histórico (GPS) ativado — aguardando integração de geolocalização.');
  }

  /** Libera o modelo para posicionamento manual pelo usuário. */
  enablePlacementMode() {
    console.log('ModelController: modo livre ativado.');
  }

  /**
   * Reproduz o áudio de narração associado ao bonde.
   * A pasta assets/audio/ está preparada para receber o arquivo final.
   */
  playNarration(src = 'assets/audio/narracao.mp3') {
    const audio = document.getElementById('narration-audio');
    if (!audio) {
      console.warn('ModelController: elemento de áudio não encontrado.');
      return;
    }

    if (audio.getAttribute('src') !== src) {
      audio.setAttribute('src', src);
    }

    audio.play().catch((err) => {
      console.warn('ModelController: reprodução bloqueada ou arquivo de áudio ainda não disponível.', err);
    });
  }

  /**
   * Estrutura preparada para captura de tela da cena AR.
   * Implementação completa fica para uma etapa futura.
   */
  takeScreenshot() {
    console.log('ModelController: takeScreenshot() preparada — implementação futura.');
  }

  _clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}
