/**
 * ModelController
 * Responsabilidade única: manipulação 3D do bonde.
 * Com teletransporte dinâmico baseado na direção da câmera do celular.
 */
export class ModelController {
  constructor(entitySelector, options = {}) {
    this.scaleMin = options.scaleMin ?? 0.05;
    this.scaleMax = options.scaleMax ?? 4.0;
    this.defaultRotationY = options.defaultRotationY ?? 0;
    
    // Tamanho inicial mais delicado para não estourar a tela com o zoom do CSS
    this.defaultScale = options.defaultScale ?? 0.3;

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

    const radX = THREE.MathUtils.degToRad(deltaXDegrees);
    const radY = THREE.MathUtils.degToRad(deltaYDegrees);

    const axisY = new THREE.Vector3(0, 1, 0);
    const axisX = new THREE.Vector3(1, 0, 0);

    const quaternionY = new THREE.Quaternion().setFromAxisAngle(axisY, radX);
    const quaternionX = new THREE.Quaternion().setFromAxisAngle(axisX, radY);

    const totalRotation = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX);
    this.object3D.quaternion.premultiply(totalRotation);
  }

  move(deltaX, deltaY) {
    if (!this.object3D) return;
    this.object3D.position.x += deltaX;
    this.object3D.position.y -= deltaY; 
  }

  /**
   * MÁGICA DO TELETRANSPORTE:
   * Lê a direção exata para onde o celular está apontando e posiciona
   * o bonde a 4 metros de distância bem no centro da visão do usuário.
   */
  reset() {
    if (!this.object3D) return;

    // Remove qualquer rotação torta anterior
    this.object3D.quaternion.identity();

    const cameraEl = document.querySelector('a-camera') || document.querySelector('[camera]');
    
    if (cameraEl && cameraEl.object3D) {
      const camera3D = cameraEl.object3D;

      // Cria um vetor apontando 4 metros para frente
      const forwardVector = new THREE.Vector3(0, 0, -4);
      
      // Aplica a inclinação/rotação atual do celular nesse vetor
      forwardVector.applyQuaternion(camera3D.quaternion);

      // Soma a posição da câmera para obter o ponto final no espaço
      const targetPosition = camera3D.position.clone().add(forwardVector);
      
      // Abaixa um pouco para não ficar exatamente na linha do olho
      targetPosition.y -= 0.5;

      // Move o bonde para essa coordenada dinâmica
      this.object3D.position.copy(targetPosition);
    } else {
      // Fallback seguro caso a câmera não seja encontrada
      this.object3D.position.set(0, -0.5, -4);
    }

    this.object3D.rotation.set(0, this.defaultRotationY, 0);
    this.currentScale = this.defaultScale;
    this.object3D.scale.set(this.currentScale, this.currentScale, this.currentScale);
  }

  enableGPSMode() {
    console.log('ModelController: modo histórico (GPS) ativado.');
  }

  enablePlacementMode() {
    console.log('ModelController: modo livre ativado.');
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
