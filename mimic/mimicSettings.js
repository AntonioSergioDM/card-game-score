import portugues from "./themes/portugues.json";
import got from "./themes/game_of_thrones.json";
import harryPotter from "./themes/harry_potter.json";
import scyFy from "./themes/scy_fy.json";
import lotr from "./themes/lotr.json";
import pokemon from "./themes/pokemon.json";
import jobs from "./themes/jobs_pt.json";
import animated from "./themes/animated_movies.json";
import celebrities from "./themes/celebrities.json";

export const words = {
    "Portugues": portugues,
    "Game of Thrones": got,
    "Harry Potter": harryPotter,
    "Scy-Fy": scyFy,
    "Lord of the Rings": lotr,
    "Pokemon": pokemon,
    "Jobs (PT)": jobs,
    "Animated Movies": animated,
    "Celebrities": celebrities,
};


const mimicSettings = {
    identifier: 'mimic',
    title: 'Word Game',
    newScore: `
<select id="language" class="absolute absolute--thirdish">${Object.keys(words).map(lang => `<option value="${lang}">${lang}</option>`).join('')}</select>
<table id="board" class="board board--table"></table>
<div class="section mb-1 w-full">
    <div class="section section--row w-full">
        <button class="button button--big button--danger" id="skipBtn">Skip</button>
        <div class="word" id="word">Confirm to start!</div>
        <button class="button button--big button--primary" id="confirmBtn">Confirm</button>
    </div>
</div>
`,
    howToPlay: JSON.stringify({
        intro: 'Neste jogo de mimica, cada jogador tem 1 minuto para fazer mímica do máximo numero de palavras possível.',
        rules: [
            'Escolhe um tema, o numero e nome das equipas e começa a jogar.',
            'Se a equipa acertar na palavra, clica em "Confirm" e ganham um ponto',
            'Se a equipa, ou o jogador não conseguirem acertar podem perder um ponto para saltar a palavra clicando no botão "Skip"',
            'Ao fim de um minuto, devem passar a vez à equipa adversária',
        ],
        conclusion: 'Podem jogar tantas vezes quantas quiserem. No fim ganha a equipa com mais pontos.',
    }),
};

export default mimicSettings;

