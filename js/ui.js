/**
 * UIController
 * Responsabilidade única: ligar os botões da interface (barra inferior,
 * modal de informações) às ações correspondentes nos demais módulos.
 */
export class UIController {
  constructor({ modelController, placementManager }) {
    this.modelController = modelController;
    this.placementManager = placementManager;

    this.buttons = {
      gps: document.getElementById('btn-gps'),
      free: document.getElementById('btn-free'),
      virtual: document.getElementById('btn-virtual'),
      reset: document.getElementById('btn-reset'),
      info: document.getElementById('btn-info'),
      screenshot: document.getElementById('btn-screenshot'),
      playNarration: document.getElementById('btn-play-narration'),
    };

    this.modal = document.getElementById('info-modal');
    this.modalCloseBtn = document.getElementById('info-modal-close');
    this.statusBadge = document.getElementById('mode-status');

    this._bindEvents();
    this._updateModeStatus(this.placementManager.getMode());
  }

  _bindEvents() {
    this.buttons.gps?.addEventListener('click', () => {
      this.placementManager.enableGPSMode();
      this._updateModeStatus(this.placementManager.getMode());
    });

    this.buttons.free?.addEventListener('click', () => {
      this.placementManager.enablePlacementMode();
      this._updateModeStatus(this.placementManager.getMode());
    });

    this.buttons.virtual?.addEventListener('click', () => {
      window.location.href = 'virtual.html';
    });

    this.buttons.reset?.addEventListener('click', () => {
      // TRAVA DE SEGURANÇA: Só executa se for Modo Livre
      if (this.placementManager.isFreeMode()) {
        this.modelController.reset();
      }
    });

    this.buttons.info?.addEventListener('click', () => {
      this._openModal();
    });

    this.buttons.screenshot?.addEventListener('click', () => {
      this.modelController.takeScreenshot();
    });

    this.buttons.playNarration?.addEventListener('click', () => {
      this.modelController.playNarration();
    });

    this.modalCloseBtn?.addEventListener('click', () => {
      this._closeModal();
    });

    this.modal?.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this._closeModal();
      }
    });
  }

  _openModal() {
    this.modal?.classList.remove('hidden');
  }

  _closeModal() {
    this.modal?.classList.add('hidden');
  }

  _updateModeStatus(mode) {
    const labels = {
      gps: '📍 Modo Histórico',
      free: '✋ Modo Livre',
    };

    if (this.statusBadge) {
      this.statusBadge.textContent = labels[mode] ?? '';
    }

    this.buttons.gps?.setAttribute('aria-pressed', String(mode === 'gps'));
    this.buttons.free?.setAttribute('aria-pressed', String(mode === 'free'));
    this.buttons.gps?.classList.toggle('active', mode === 'gps');
    this.buttons.free?.classList.toggle('active', mode === 'free');

    // MÁGICA VISUAL: Desabilita a aparência do botão "Centrar/Reset" quando no modo GPS
    if (this.buttons.reset) {
      if (mode === 'gps') {
        this.buttons.reset.style.opacity = '0.4';
        this.buttons.reset.style.pointerEvents = 'none'; // Evita o clique no CSS
      } else {
        this.buttons.reset.style.opacity = '1';
        this.buttons.reset.style.pointerEvents = 'auto'; // Restaura o botão
      }
    }
  }
}
