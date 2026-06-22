/**
 * model-controller.js
 * Modificado: A função reset() agora teletransporta o bonde dinamicamente 
 * para onde a câmera do celular estiver apontando no mundo real.
 */
export class ModelController {
  constructor(entitySelector, options = {}) {
    this.scaleMin = options.scaleMin ?? 0.3;
    this.scaleMax = options.scaleMax ?? 6.0;

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
    this.object3D.rotation.y += THREE.MathUtils.degToRad(deltaXDegrees);
    this.object3D.rotation.x += THREE.MathUtils.degToRad(deltaYDegrees);
  }

  move(deltaScreenX, deltaScreenY) {
    if (!this.object3D) return;
    this.object3D.position.x += deltaScreenX;
    this.object3D.position.y -= deltaScreenY;
  }

  /**
   * Pega a posição e rotação atual da câmera e joga o bonde 
   * exatamente 5 metros para a frente do usuário.
   */
  reset() {
    if (!this.object3D) return;
    
    const cameraEl = document.querySelector('a-camera') || document.querySelector('[camera]');
    
    if (cameraEl && cameraEl.object3D) {
      const camera3D = cameraEl.object3D;

      // Cria um vetor apontando 5 metros para frente no eixo Z
      const forwardVector = new THREE.Vector3(0, 0, -5);
      
      // Aplica a rotação do giroscópio do celular a este vetor
      forwardVector.applyQuaternion(camera3D.quaternion);

      // Soma a posição da câmera para obter a posição final no mundo
      const targetPosition = camera3D.position.clone().add(forwardVector);

      // Abaixa 1 metro para não ficar flutuando na altura do olho
      targetPosition.y -= 1;

      // Move o bonde para essa nova posição em frente à câmera
      this.object3D.position.copy(targetPosition);

      // Zera a rotação para ficar de frente
      this.object3D.rotation.set(0, 0, 0);
    }

    // Reseta o tamanho
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
