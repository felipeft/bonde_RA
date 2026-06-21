/**
 * model-controller.js
 * Adicionado: Rotação no eixo X (vertical) e correção na direção do arraste.
 */
export class ModelController {
  constructor(entitySelector, options = {}) {
    this.scaleMin = options.scaleMin ?? 0.3;
    this.scaleMax = options.scaleMax ?? 4.0;

    // Novo padrão: mais longe (z=-5) e mais baixo (y=-1) para melhor enquadramento
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

  rotate(deltaXDegrees, deltaYDegrees = 0) {
    if (!this.object3D) return;
    // O arraste horizontal (deltaX) gira o modelo no eixo Y (como um pião)
    this.object3D.rotation.y += THREE.MathUtils.degToRad(deltaXDegrees);
    
    // O arraste vertical (deltaY) gira o modelo no eixo X (tombando para frente/trás)
    this.object3D.rotation.x += THREE.MathUtils.degToRad(deltaYDegrees);
  }

  move(deltaScreenX, deltaScreenY) {
    if (!this.object3D) return;
    
    // Correção espacial: Arrastar o dedo para os lados move o objeto em X.
    // Arrastar para cima/baixo move o objeto em Y (inversamente, pois a tela cresce para baixo)
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
