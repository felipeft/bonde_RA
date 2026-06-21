/**
 * model-controller.js
 * Aplica fisicamente os movimentos de rotação, escala e posicionamento (pan) na entidade 3D.
 */
export class ModelController {
  constructor(entitySelector, options = {}) {
    this.scaleMin = options.scaleMin ?? 0.3;
    this.scaleMax = options.scaleMax ?? 6.0;

    // Posição inicial: 1 unidade abaixo da câmera e 5 unidades pra frente.
    this.defaultPosition = options.defaultPosition ?? { x: 0, y: -1, z: -5 };
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
  }

  loadModel(src = 'assets/bonde.glb') {
    if (!this.entity) return;
    this.entity.setAttribute('gltf-model', `url(${src})`);
  }

  get object3D() {
    return this.entity ? this.entity.object3D : null;
  }

  setScale(scale) {
    if (!this.object3D) return;
    this.currentScale = this._clamp(scale, this.scaleMin, this.scaleMax);
    this.object3D.scale.set(this.currentScale, this.currentScale, this.currentScale);
  }

  scaleBy(factor) {
    this.setScale(this.currentScale * factor);
  }

  rotate(deltaXDegrees, deltaYDegrees = 0) {
    if (!this.object3D) return;
    // Arrasto horizontal gira no eixo Y
    this.object3D.rotation.y += THREE.MathUtils.degToRad(deltaXDegrees);
    // Arrasto vertical gira no eixo X (inclina pra cima e pra baixo)
    this.object3D.rotation.x += THREE.MathUtils.degToRad(deltaYDegrees);
  }

  move(deltaScreenX, deltaScreenY) {
    if (!this.object3D) return;
    // Arrasto de 2 dedos move o objeto lateralmente ou para cima/baixo na tela
    this.object3D.position.x += deltaScreenX;
    this.object3D.position.y -= deltaScreenY;
  }

  reset() {
    if (!this.object3D) return;
    const { x, y, z } = this.defaultPosition;
    this.object3D.position.set(x, y, z);
    this.object3D.rotation.set(0, this.defaultRotationY, 0);
    this.currentScale = this.defaultScale;
    this.object3D.scale.set(this.currentScale, this.currentScale, this.currentScale);
  }

  playNarration(src = 'assets/audio/narracao.mp3') {
    const audio = document.getElementById('narration-audio');
    if (!audio) return;
    if (audio.getAttribute('src') !== src) audio.setAttribute('src', src);
    audio.play().catch(err => console.warn('Áudio indisponível.', err));
  }

  takeScreenshot() {
    console.log('Implementação futura.');
  }

  _clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}
