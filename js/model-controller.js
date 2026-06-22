/**
 * ModelController
 * Responsabilidade única: toda a manipulação do modelo 3D do bonde
 * (carregamento, escala, rotação livre, deslocamento, reset, áudio e captura).
 */
export class ModelController {
  constructor(entitySelector, options = {}) {
    // CORREÇÃO: Limite mínimo de escala drasticamente reduzido.
    // Agora você pode pinçar o bonde para ficar minúsculo!
    this.scaleMin = options.scaleMin ?? 0.05;
    this.scaleMax = options.scaleMax ?? 4.0;

    // CORREÇÃO: Afastamos o bonde no eixo Z (de -3 para -7) para compensar o zoom de tela,
    // e reduzimos a escala inicial padrão para não assustar o usuário.
    this.defaultPosition = options.defaultPosition ?? { x: 0, y: -0.5, z: -7 };
    this.defaultRotationY = options.defaultRotationY ?? 0;
    this.defaultScale = options.defaultScale ?? 0.5;

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

  /**
   * Rotação em 360º utilizando Quaternions matemáticos.
   * Evita o travamento de eixo e garante que o modelo acompanhe o dedo livremente.
   */
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

  reset() {
    if (!this.object3D) return;
    
    // Limpa fisicamente qualquer inclinação complexa
    this.object3D.quaternion.identity();

    const { x, y, z } = this.defaultPosition;
    this.object3D.position.set(x, y, z);
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
    
    if (audio.getAttribute('src') !== src) {
      audio.setAttribute('src', src);
    }

    audio.play().catch((err) => {
      console.warn('ModelController: reprodução bloqueada ou arquivo de áudio indisponível.', err);
    });
  }

  takeScreenshot() {
    console.log('ModelController: takeScreenshot() preparada — implementação futura.');
  }

  _clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}
