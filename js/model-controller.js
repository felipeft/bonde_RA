/**
 * model-controller.js
 * Responsabilidade única: encapsular e expor todas as operações de manipulação 
 * exclusivas do modelo 3D (Bonde).
 */
export class ModelController {
  constructor(entitySelector, options = {}) {
    this.scaleMin = options.scaleMin ?? 0.3;
    this.scaleMax = options.scaleMax ?? 4.0;

    // Posição ajustada para enquadrar perfeitamente no novo setup de câmera
    this.defaultPosition = options.defaultPosition ?? { x: 0, y: -0.5, z: -4 };
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

  rotate(deltaYDegrees) {
    if (!this.object3D) return;
    this.object3D.rotation.y += THREE.MathUtils.degToRad(deltaYDegrees);
  }

  move(deltaX, deltaZ) {
    if (!this.object3D) return;
    this.object3D.position.x += deltaX;
    this.object3D.position.z += deltaZ;
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
    if (!audio) {
      console.warn('ModelController: elemento de áudio não encontrado.');
      return;
    }

    if (audio.getAttribute('src') !== src) {
      audio.setAttribute('src', src);
    }

    audio.play().catch((err) => {
      console.warn('ModelController: reprodução bloqueada ou arquivo indisponível.', err);
    });
  }

  takeScreenshot() {
    console.log('ModelController: screenshot pronta para implementação futura.');
  }

  _clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}
