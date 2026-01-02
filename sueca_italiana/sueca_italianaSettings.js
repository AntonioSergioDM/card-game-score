import suecaSettings from "../sueca/suecaSettings";

const sueca_italianaSettings = {
    identifier: 'sueca_italiana',
    title: 'Sueca Italiana',
    newScore: `
<table id="board" class="board board--table"></table>
<div class="section mt-1">
    <div class="section section--row">
        <button class="button button--secondary" id="undoBtn">Undo</button>
        <button class="button button--primary" id="calculateBtn">Calculate</button>
    </div>
</div>`,
    howToPlay: JSON.stringify({
        intro: 'É um jogo muito parecido com a <a data-how-to-play="' + JSON.stringify(suecaSettings.howToPlay) + '">sueca</a>, mas para 5 jogadores.',
        rules: [
            'Distribui-se as 40 cartas (8 por jogador)',
            'Começa o leilão - minimo 65 pontos (sempre multiplo de 5)',
            'Quem ganha o leilão escolhe o trunfo, uma carta que não tenha (quem tiver essa carta será o seu parceiro) e começa a jogar',
            'Se atingir o valor do leilão em pontos (conta-se como na sueca), ganha um jogo. Se fizerem as 8 vazas ganham 2 jogos',
        ],
        conclusion: 'Este jogo é mais fixe se se continuar a contar os pontos sempre. O botão "Calculate" termina uma sessão, e depois podes continuar a contar da próxima vez que jogares.',
    }),
};

export default sueca_italianaSettings;