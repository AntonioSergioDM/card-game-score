const suecaSettings = {
    identifier: 'sueca',
    title: 'Sueca',
    howToPlay: 'https://pt.wikipedia.org/wiki/Sueca_(jogo_de_cartas)',
    newScore: `
<h2>Which mode to use</h2>
<div class="section section--row">
    <button class="button button--secondary" id="startUnlimitedScore">Unlimited</button>
    <button class="button button--primary" id="startNormalScore">Normal</button>
</div>`,
    afterNewScore:`
<div id="inputHolder" class="section mt-1" style="display: none">
    <div class="section section--row">
        <button class="button button--primary" data-player="1">Add up</button>
        <button class="button button--primary" data-player="2">Add down</button>
    </div>
    <div class="section section--row">
        <button class="button button--danger" id="restartBtn">Restart</button>
        <button class="button button--secondary" id="undoBtn">Undo</button>
    </div>
</div>`,
};

export default suecaSettings;