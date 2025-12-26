import "./mimic.css";

import $ from "jquery";
import {common} from "../common";

import {words} from "./mimicSettings";

const mimic = function () {
    // Elements
    let skipBtn, confirmBtn, word, board, language;
    let currentTime = false;
    let currentWord = 'abracadabra';


    /* Initialization */

    const init = () => {
        common.init();
        skipBtn = $('#skipBtn');
        confirmBtn = $('#confirmBtn');
        word = $('#word');
        board = $('#board');
        language = $('#language');

        startObservers();
    };

    const startObservers = () => {
        setInterval(drawScore, 100);

        // Actions
        skipBtn.on('click', () => nextWord(true));
        confirmBtn.on('click', nextWord);
    }

    /* Game Logic */
    const nextWord = (skip) => {
        const score = common.getScore();
        const time2play =  60;
        score.currentPlayer = (score.currentPlayer || 1)

        if (currentTime === false) {
            word.html(`<div>${score[`player${score.currentPlayer}`] || `Team ${score.currentPlayer}`} playing!</div><div>Click confirm when ready</div>`);
            currentTime = time2play;
        } else if (currentTime === time2play) {
            currentWord = getRandomWord();
            const timer = setInterval(() => {
                currentTime -= 0.1;
                if (currentTime <= 0) {
                    currentTime = false;
                    clearInterval(timer);
                    word.html(`<span style="color: red;">Time's up!</span>`);
                    score.currentPlayer++;
                    if (!shouldDrawPlayer(score.currentPlayer)){
                        score.currentPlayer = 1;
                    }
                } else {
                    word.html(`<div ${currentTime < 5 ? 'style="color: red;"' : ''}>${Math.ceil(currentTime)}</div><div>${currentWord}</div>`);
                }
            }, 100);
        } else {
            score[`score${score.currentPlayer}`] = (score[`score${score.currentPlayer}`] || 0) + (skip === true ? -1 : 1);
            currentWord = getRandomWord();
        }

        common.save(score);
    };

    const getRandomWord = () => {
        return words[language.val()][Math.floor(Math.random() * words[language.val()].length)].toUpperCase();
    }


    /* Drawing */

    const drawScore = () => {
        if (!common.hasChanges()) {
            return
        }

        board.html(buildBoard());
        var scrollArea = board.find('.scroll');
        scrollArea.scrollTop(scrollArea.prop("scrollHeight"));
    }

    const buildBoard = () => {
        const score = common.getScore();
        const gameStarted = score.currentPlayer > 0;
        let html = '<thead><tr>';
        let i = 1;
        while (shouldDrawPlayer(i)) {
            html += `<td class="relative">
                        <div class="player" data-renamable="${i}">
                            ${score[`player${i}`] || `Team ${i}`}
                        </div>`;
            html += '</td>';
            i++;
        }
        if (!gameStarted) {
            html += `<td class="relative">
                        <div class="player" data-renamable="${i}">
                            Add Team
                        </div>`;
            html += '</td>';
        }

        html += '</tr></thead><tbody class="scroll">';
        html += '<tr>';

        i = 1;
        while (shouldDrawPlayer(i)) {
            html += `<td class="relative player" data-player="${i}">
                        ${score[`score${i}`] || 0}
                     </td>`;
            i++;
        }

        if (!gameStarted) {
            html += `<td class="relative player" data-player="${i}"></td>`;
        }

        html += '</tr>';

        html += '</tbody>';
        return html;
    }

    const shouldDrawPlayer = (player) => {
        const score = common.getScore();
        if (typeof score[`score${player}`] === 'number') {
            return true;
        }

        if (typeof score[`player${player}`] !== 'undefined') {
            return true;
        }

        return player <= 2;
    };

    return {
        init: init,
    };
}();

$(() => {
    mimic.init();
});