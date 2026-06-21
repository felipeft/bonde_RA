# assets/

Esta pasta contém os recursos estáticos do projeto.

## bonde.glb

Coloque aqui o arquivo **bonde.glb** (formato GLB, não GLTF) produzido pela
equipe responsável pela modelagem em Blender. A aplicação já está
referenciando este caminho em dois lugares:

- `js/app.js` → `modelController.loadModel('assets/bonde.glb')`
- `virtual.html` → `gltf-model="url(assets/bonde.glb)"`

Não é necessário alterar nenhum código: basta exportar o modelo do Blender
em GLB e salvá-lo como `assets/bonde.glb`.

## audio/

Pasta preparada para o arquivo de narração (ex.: `narracao.mp3`), usado por
`ModelController.playNarration()`.

## images/

Pasta preparada para imagens auxiliares (ícones, capturas de tela, material
do painel de informações).
