# Bonde de Quixadá — Experiência de Realidade Aumentada

Interface de Realidade Aumentada para a reconstrução digital do antigo
bonde de tração animal de Quixadá-CE, desenvolvida para a disciplina de
Realidade Virtual. Funciona inteiramente no navegador (A-Frame + AR.js),
sem backend, pronta para o GitHub Pages.

## Stack

- A-Frame `1.3.0`
- AR.js `3.4.5` (compatível com A-Frame 1.3.0)
- JavaScript (ES Modules, vanilla)
- HTML5 / CSS3

## Estrutura

```
/
├── index.html              modo AR (câmera + bonde)
├── virtual.html             ambiente virtual (sem câmera)
├── css/
│   └── style.css
├── js/
│   ├── app.js                ponto de entrada, inicializa os módulos
│   ├── ui.js                  botões da interface
│   ├── gestures.js            gestos de toque (pinça, arraste)
│   ├── placement.js           alterna entre Modo Histórico e Modo Livre
│   └── model-controller.js    toda a manipulação do modelo 3D
└── assets/
    ├── bonde.glb               (a adicionar pela equipe de modelagem)
    ├── audio/
    └── images/
```

## Como testar localmente

AR.js precisa de acesso à câmera, que os navegadores só liberam em
contexto seguro (`https://` ou `localhost`). Para testar no computador:

```bash
npx serve .
# ou
python3 -m http.server 8000
```

Abra `http://localhost:PORTA` no navegador. Para testar em um celular,
use a mesma rede Wi-Fi e acesse pelo IP do computador, ou publique direto
no GitHub Pages (passo abaixo) e abra o link no celular.

## Publicar no GitHub Pages

1. Faça commit de todos os arquivos na branch principal do repositório.
2. Em **Settings → Pages**, selecione a branch e a pasta raiz (`/`).
3. Acesse a URL gerada pelo GitHub Pages a partir de um celular Android
   (Chrome é o navegador priorizado) com a câmera liberada.

## Pontos de integração para as demais equipes

- **Geolocalização** → `ModelController.enableGPSMode()`, em
  `js/model-controller.js`. É chamada sempre que o botão 📍 é
  pressionado; hoje apenas registra um log, e é o lugar indicado para
  posicionar o bonde com coordenadas reais (por exemplo, usando o
  componente `gps-new-entity-place` do AR.js).
- **Modelagem 3D** → basta salvar o arquivo final como
  `assets/bonde.glb` (ver `assets/README.md`).
- **Áudio/narração** → `ModelController.playNarration()` já busca um
  arquivo em `assets/audio/`; basta adicionar o `.mp3` final.
- **Captura de tela** → `ModelController.takeScreenshot()` está
  preparada como ponto de extensão futuro.

## Controles

| Gesto                        | Ação                                   |
|-------------------------------|------------------------------------------|
| Arrastar 1 dedo (horizontal)   | Rotaciona o bonde no eixo Y              |
| Pinçar com 2 dedos             | Escala o bonde (limites: 0.3× a 4×)      |
| Arrastar 2 dedos               | Move o bonde (apenas em Modo Livre)      |

| Botão | Ação |
|---|---|
| 📍 Local | `placementManager.enableGPSMode()` |
| ✋ Livre | `placementManager.enablePlacementMode()` |
| 🌎 Virtual | Abre `virtual.html` |
| ↺ Reset | `modelController.reset()` |
| ℹ Informações | Abre o painel com informações do bonde |
