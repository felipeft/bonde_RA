/**
 * gestures.js
 * Captura 1 dedo para ROTACIONAR (em todos os eixos) 
 * e 2 dedos para MOVER (Arrastar pela tela) e ESCALAR (Pinça).
 */
export class GestureController {
  constructor(targetElement, modelController, placementManager, options = {}) {
    this.target = targetElement;
    this.modelController = modelController;
    this.placementManager = placementManager;

    this.rotationSensitivity = options.rotationSensitivity ?? 0.4; 
    this.moveSensitivity = options.moveSensitivity ?? 0.012; 

    this.activeTouches = new Map();
    this.lastSingle = null;
    this.lastPinchDistance = null;
    this.lastPinchMidpoint = null;

    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);

    this._attach();
  }

  _attach() {
    this.target.addEventListener('touchstart', this._onTouchStart, { passive: false });
    this.target.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this.target.addEventListener('touchend', this._onTouchEnd, { passive: false });
    this.target.addEventListener('touchcancel', this._onTouchEnd, { passive: false });
  }

  _onTouchStart(event) {
    event.preventDefault();
    this._syncActiveTouches(event);

    if (this.activeTouches.size === 1) {
      const touch = this._first();
      this.lastSingle = { x: touch.clientX, y: touch.clientY };
    }

    if (this.activeTouches.size === 2) {
      const [t1, t2] = this.activeTouches.values();
      this.lastPinchDistance = this._distance(t1, t2);
      this.lastPinchMidpoint = this._midpoint(t1, t2);
    }
  }

  _onTouchMove(event) {
    event.preventDefault();
    this._syncActiveTouches(event);

    if (this.activeTouches.size === 1) {
      this._handleRotate();
    } else if (this.activeTouches.size === 2) {
      this._handlePinchScale();
      // O mover de 2 dedos só funciona se estiver no Modo Livre
      if (this.placementManager.isFreeMode()) {
        this._handlePan();
      }
    }
  }

  _onTouchEnd(event) {
    this._syncActiveTouches(event);

    if (this.activeTouches.size < 2) {
      this.lastPinchDistance = null;
      this.lastPinchMidpoint = null;
    }

    if (this.activeTouches.size === 1) {
      const touch = this._first();
      this.lastSingle = { x: touch.clientX, y: touch.clientY };
    } else if (this.activeTouches.size === 0) {
      this.lastSingle = null;
    }
  }

  _syncActiveTouches(event) {
    this.activeTouches.clear();
    for (const touch of event.touches) {
      this.activeTouches.set(touch.identifier, touch);
    }
  }

  _handleRotate() {
    const touch = this._first();
    if (!this.lastSingle) {
      this.lastSingle = { x: touch.clientX, y: touch.clientY };
      return;
    }
    
    const deltaX = touch.clientX - this.lastSingle.x;
    const deltaY = touch.clientY - this.lastSingle.y;

    // Envia os movimentos X e Y para rotacionar o bonde
    this.modelController.rotate(deltaX * this.rotationSensitivity, deltaY * this.rotationSensitivity);
    this.lastSingle = { x: touch.clientX, y: touch.clientY };
  }

  _handlePinchScale() {
    const [t1, t2] = this.activeTouches.values();
    const distance = this._distance(t1, t2);

    if (this.lastPinchDistance === null) {
      this.lastPinchDistance = distance;
      return;
    }

    const factor = distance / this.lastPinchDistance;
    this.modelController.scaleBy(factor);
    this.lastPinchDistance = distance;
  }

  _handlePan() {
    const [t1, t2] = this.activeTouches.values();
    const midpoint = this._midpoint(t1, t2);

    if (!this.lastPinchMidpoint) {
      this.lastPinchMidpoint = midpoint;
      return;
    }

    const dx = midpoint.x - this.lastPinchMidpoint.x;
    const dy = midpoint.y - this.lastPinchMidpoint.y;
    
    // Envia o movimento do arrasto de 2 dedos para transladar o objeto
    this.modelController.move(dx * this.moveSensitivity, dy * this.moveSensitivity);
    this.lastPinchMidpoint = midpoint;
  }

  _first() {
    return this.activeTouches.values().next().value;
  }

  _distance(t1, t2) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  _midpoint(t1, t2) {
    return {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    };
  }
}
