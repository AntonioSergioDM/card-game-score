const kingSettings = {
    identifier: 'king',
    title: 'King',
    howToPlay: 'https://pt.wikipedia.org/wiki/King_(jogo_de_cartas)',
    newScore: `
<table id="board" class="board board--table"></table>
<div class="section mt-1">
    <div class="section section--row">
        <button class="button button--secondary" id="undoBtn">Undo</button>
        <button class="button button--danger" id="calculateBtnNulos" data-festa-nulos="true">Calculate Nulos</button>
        <button class="button button--primary" id="calculateBtn">Calculate</button>
    </div>
</div>`,
};

export default kingSettings;