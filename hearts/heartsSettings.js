const heartsSettings = {
    identifier: 'hearts',
    title: 'Hearts',
    howToPlay: 'https://pt.wikipedia.org/wiki/Copas_(jogo_de_cartas)',
    loadPreviousScoreAppend: `
<div class="section section--row">
    <div class="input input--number w-24 text-center">
        <label for="numPlayers">Nº of Players</label>
        <input type="number" class="h-8" id="numPlayers"/>
    </div>
    <div class="input input--number w-40 text-center">
        <label for="numPoints">Shoot the Moon Points</label>
        <input type="number" class="h-8" id="numPoints"/>
    </div>
</div>`,
    newScore: `
<table id="board" class="board board--table"></table>
<div class="section mt-1">
    <div class="section section--row">
        <button class="button button--secondary" id="undoBtn">Undo</button>
        <button class="button button--primary" id="calculateBtn">Calculate</button>
    </div>
</div>`,
};

export default heartsSettings;