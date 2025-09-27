import "./hearts.css";

import $ from 'jquery';
import {common} from "../common";

const hearts = function () {
    // Elements
    let gameHolder, board, undoBtn, numPlayers, numPoints;

    let playerNumber = 4;
    let totalPointsPerGame = 26

    /* Initialization */

    const init = () => {
        common.init();

        gameHolder = $('#newScore');
        board = $('#board');
        undoBtn = $('#undoBtn');
        numPlayers = $('#numPlayers').val(playerNumber);
        numPoints = $('#numPoints').val(totalPointsPerGame);

        startObservers();
    };

    const startObservers = () => {
        setInterval(drawScore, 100);
        gameHolder
            .on('click', focusPlayerEvent)
            .on('change', calculate)
            .on('keyup', onKeydown);
        // Actions
        undoBtn.on('click', undo);
        $('#calculateBtn').on('click', calculate);
        numPlayers.on('change', () => playerNumber = +numPlayers.val() || playerNumber);
        numPoints.on('change', () => totalPointsPerGame = +numPoints.val() || totalPointsPerGame);
    };

    const focusPlayerEvent = (evt) => {
        const player = +$(evt.target).closest('[data-player]').data('player');
        if (!player) {
            return;
        }

        $('td[data-player="' + player + '"] input').trigger('focus');
    };

    const onKeydown = (evt) => {
        const player = +$(evt.target).closest('[data-player]').data('player');
        if (!player) {
            return;
        }

        if (evt.key === 'Enter') {
            $(`td[data-player="${player + 1}"] input`).trigger('focus');
        }
    };

    /* Game Logic */
    /**
     *
     * @returns {[number,number]}
     */
    const getTotalPoints = () => {
        let shootTheMoon = 0;
        let totalPoints = 0;
        const inputs = $('td[data-player] input');

        inputs.each(function () {
            const input = $(this);
            const value = +input.val();
            totalPoints += value;
            if (shootTheMoon === false) {
                return;
            }

            if (value === 0) {
                return;
            }

            if (value > 0 && shootTheMoon) {
                shootTheMoon = false;
                return;
            }

            shootTheMoon = +input.closest('td').data('player');
        });

        return [totalPoints, shootTheMoon];
    }

    const calculate = (evt) => {
        const [totalPoints, shootTheMoon] =  getTotalPoints();

        const score = common.getScore();
        totalPointsPerGame = score.totalPointsPerGame = score.totalPointsPerGame || totalPointsPerGame;

        if (totalPoints < totalPointsPerGame) {
            return;
        } else if (totalPoints > totalPointsPerGame) {
            const player = +$(evt.target).closest('[data-player]').data('player');
            if (player) {
                $(`td[data-player="${player}"]`)
                    .find('div').addClass('input--error')
                    .find('input').trigger('focus');
            }
            return;
        }

        const inputs = $('td[data-player] input');

        inputs.each(function () {
            const player = +$(this).closest('td').data('player');
            score[`score${player}`] = score[`score${player}`] || getDefaultScore();
            let currentScore = !!score[`score${player}`].length && score[`score${player}`].pop();

            if (currentScore === false) {
                currentScore = 0;
            } else {
                score[`score${player}`].push(currentScore);
            }

            if (shootTheMoon) {
                if (shootTheMoon !== player) {
                    currentScore += totalPointsPerGame;
                }
            } else {
                currentScore += +$(this).val();
            }

            score[`score${player}`].push(currentScore);
        });

        common.save(score);
    };

    const undo = () => {
        const score = common.getScore();
        if (!(score.score1 || []).length) {
            window.location.reload();
            return;
        }

        playerNumber = score.playerNumber = score.playerNumber || playerNumber;

        for (let i = 1; i <= playerNumber; i++) {
            score[`score${i}`].pop();
        }

        common.save(score);
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
        playerNumber = score.playerNumber = score.playerNumber || playerNumber;

        let html = '<thead><tr>';
        for (let i = 1; i <= playerNumber; i++) {
            html += `
                <td>
                    <div class="player" data-renamable="${i}">
                        ${score[`player${i}`] || ['I', 'II', 'III', 'IV', 'V'][i - 1]}
                    </div>
                </td>`;
        }

        html += '</tr></thead><tbody class="scroll">';

        const n = (score.score1 || getDefaultScore()).length;
        for (let i = 0; i < n; i++) {
            html += '<tr>';
            for (let j = 1; j <= playerNumber; j++) {
                html += `
                    <td data-player="${j}">
                        ${buildUnit((score[`score${j}`] || getDefaultScore())[i], i < n - 1)}
                    </td>`;
            }
            html += '</tr>';
        }

        html += '<tr>';
        for (let i = 1; i <= playerNumber; i++) {
            html += `
                <td data-player="${i}">
                    <div class="input input--number points">
                        <input type="number" placeholder="${score[`player${i}`] || ['I', 'II', 'III', 'IV', 'V'][i - 1]}"/>
                    </div>
                 </td>`;
        }
        html += '</tr>';
        html += '</tbody>';
        return html;
    }

    const buildUnit = (value, crossed) => {
        return `<div class="points ${crossed && 'points--crossed' || ''}">&nbsp;${value}&nbsp;</div>`;
    }


    /* Helpers */
    const getDefaultScore = () => {
        return [];
    }

    return {
        init: init,
    };
}();

$(() => {
    hearts.init();
});