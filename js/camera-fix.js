/**
 * camera-fix.js
 * Responsabilidade única: manter o vídeo da webcam injetado pelo AR.js
 * (elemento <video id="arjs-video">) sempre preenchendo a tela em modo
 * "cover", sem nunca esticar ou achatar a imagem da câmera.
 *
 * Por que isso é necessário:
 * O AR.js reaplica width/height/margin inline no #arjs-video a cada
 * resize (THREEx.ArToolkitSource.onResizeElement/copyElementSizeTo).
 * Esse cálculo interno assume proporção 4:3 em modo retrato, o que não
 * corresponde à proporção real da maioria das câmeras de celular,
 * causando a distorção. Em vez de tentar corrigir o cálculo interno do
 * AR.js, este módulo reaplica um enquadramento "object-fit: cover"
 * simples e correto sempre que o AR.js tenta sobrescrever o estilo.
 */
export class CameraVideoFix {
  constructor(videoId = 'arjs-video') {
    this.videoId = videoId;
    this.video = null;
    this.observer = null;
    this._orientationTimeout = null;

    this._applyFixedStyle = this._applyFixedStyle.bind(this);
    this._onOrientationChange = this._onOrientationChange.bind(this);

    this._attach();
  }

  _attach() {
    // O AR.js dispara este evento assim que cria e anexa o <video> ao DOM.
    window.addEventListener('arjs-video-loaded', (event) => {
      this.video = event.detail?.component || document.getElementById(this.videoId);
      this._applyFixedStyle();
      this._observe();
    });

    // Reforço para o caso de o vídeo já existir antes deste módulo carregar.
    this._applyFixedStyle();

    window.addEventListener('resize', this._applyFixedStyle);
    window.addEventListener('orientationchange', this._onOrientationChange);
  }

  _onOrientationChange() {
    // iOS Safari ainda reporta innerWidth/innerHeight antigos no instante
    // do evento; um pequeno atraso garante que o reenquadramento use as
    // dimensões corretas pós-rotação.
    clearTimeout(this._orientationTimeout);
    this._orientationTimeout = setTimeout(this._applyFixedStyle, 200);
  }

  _observe() {
    if (!this.video || this.observer) return;

    this.observer = new MutationObserver(() => {
      this._applyFixedStyle();
    });
    this.observer.observe(this.video, { attributes: true, attributeFilter: ['style'] });
  }

  _applyFixedStyle() {
    const video = this.video || document.getElementById(this.videoId);
    if (!video) return;
    this.video = video;

    // Evita loop infinito: desliga o observer enquanto nós mesmos
    // alteramos o style, e religa logo em seguida.
    if (this.observer) this.observer.disconnect();

    Object.assign(video.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      margin: '0px',
      objectFit: 'cover',
      objectPosition: 'center center',
    });

    if (this.observer) {
      this.observer.observe(video, { attributes: true, attributeFilter: ['style'] });
    }
  }
}
