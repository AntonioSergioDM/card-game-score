king = function () {
    // Elements
    let gameHolder, board, undoBtn;

    const negativeOrder = ['vazas', 'copas', 'homens', 'mulheres', 'king', 'duasUltimas'];
    const gameSettings = {
        'vazas': {
            multiplier: 20,
            max: 13,
        },
        'copas': {
            multiplier: 20,
            max: 13,
        },
        'homens': {
            multiplier: 30,
            max: 8,
        },
        'mulheres': {
            multiplier: 50,
            max: 4,
        },
        'king': {
            multiplier: 160,
            max: 1,
        },
        'duasUltimas': {
            multiplier: 90,
            max: 2,
        },
        'festa': {
            max: 13,
            multiplier: 25,
            positive: true,
        },
        'festaNulos': {
            max: 13,
            multiplier: -75,
            start: 325,
            positive: true,
        },
    }
    const numPlayers = 4;
    let currentTurn = 0;

    /* Initialization */

    const init = () => {
        gameHolder = $('#newScore');
        board = $('#board');
        undoBtn = $('#undoBtn');

        startObservers();
    };

    const startObservers = () => {
        setInterval(drawScore, 100);

        // Actions
        gameHolder.on('click', addPoint);
        undoBtn.on('click', undoPoint);
        $('#calculateBtn, #calculateBtnNulos').on('click', calculate);
    }

    /* Game Logic */
    const calculate = (evt) => {
        let turnSettings = {};
        if (currentTurn < negativeOrder.length) {
            turnSettings = gameSettings[negativeOrder[currentTurn]];
        } else {
            if ($(evt.target).data('festa-nulos')) {
                turnSettings = gameSettings.festaNulos;
            } else {
                turnSettings = gameSettings.festa;
            }
        }

        const score = common.getScore();
        let turnTotal = 0;
        for (let i = 1; i <= numPlayers; i++) {
            const playerInput = $('#input_' + i);
            let points = +playerInput.val() || 0;
            playerInput.closest('.input').removeClass('input--error');

            if (Math.abs(points) <= turnSettings.max) {
                points = Math.abs(points) * turnSettings.multiplier + (turnSettings.start || 0);
            } else if ((points - (turnSettings.start || 0)) % turnSettings.multiplier !== 0) {
                playerInput.closest('.input').addClass('input--error');
                points = 0;
            }

            turnTotal += points;

            score[`score${i}`] = score[`score${i}`] || getDefaultScore();
            if (currentTurn < negativeOrder.length) {
                score[`score${i}`][negativeOrder[currentTurn]] = playerInput;
            } else {
                score[`score${i}`][`festa${currentTurn - negativeOrder.length + 1}`] = points;
            }
            score[`score${i}`][negativeOrder[currentTurn]] = points;

        }

        if (turnTotal !== turnSettings.max * turnSettings.multiplier + ((turnSettings.start || 0) * 4)) {
            return;
        }

        score.currentTurn = currentTurn = currentTurn + 1;
        common.save(score);
    }

    const undoPoint = () => {
        const score = common.getScore();

        score.currentTurn = currentTurn = Math.max(currentTurn - 1, 0);

        common.save(score);
    }

    const addPoint = (evt) => {
        const player = +$(evt.target).closest('[data-player]').data('player');
        if (!player) {
            return;
        }

        $('#input_' + player).trigger('focus').trigger('select');
    }


    /* Drawing */

    const drawScore = () => {
        if (!common.hasChanges()) {
            return
        }

        board.html(buildBoard());
        const scrollArea = board.find('.scroll');
        const input = $('#input_1');
        if (input.length) {
            scrollArea.scrollTop(input.offset().top);
            input.trigger('focus').trigger('select');
        }

        if (currentTurn >= negativeOrder.length + numPlayers) {
            scrollArea.scrollTop(scrollArea.find('td').last().offset().top);
        } else if (currentTurn >= negativeOrder.length) {
            $('#calculateBtnNulos').show();
        } else {
            $('#calculateBtnNulos').hide();
        }
    }

    const buildBoard = () => {
        const score = common.getScore();

        currentTurn = score.currentTurn || currentTurn;
        const negativeTurns = negativeOrder.length;
        let totals = {};

        let html = buildHead(score);

        html += '<tbody class="scroll">';
        for (let i = 0; i < negativeTurns; i++) {
            html += `<tr>
                        <td>${negativeOrder[i]}</td>`;
            for (let j = 1; j <= numPlayers; j++) {
                if (!totals[j]) {
                    totals[j] = {};
                }

                const playerScore = (score[`score${j}`] || getDefaultScore());

                totals[j].negative = (totals[j]?.negative || 0) + playerScore[negativeOrder[i]];
                totals[j].positive = (totals[j]?.positive || 0) + (playerScore[`festa${i + 1}`] || 0);

                html += buildUnit(j, i, playerScore[negativeOrder[i]], -totals[j].negative);
                html += buildUnit(j, i + negativeTurns, playerScore[`festa${i + 1}`], totals[j].positive);
            }
            html += '</tr>';
        }

        // extra line for design effects and final score
        html += '<tr><td class="h-4"></td>';
        for (let j = 1; j <= numPlayers; j++) {
            html+= '<td></td><td class="relative">';
            if (currentTurn >= negativeOrder.length + numPlayers) {
                html+= `<div class="total total--final">${totals[j].positive - totals[j].negative}</div>`;
            }
            html+= '</td>';
        }
        html += '</tr>';
        html += '</tbody>';
        return html;
    }

    const buildHead = (score) => {
        let html = '<thead><tr><td></td>';
        for (let i = 1; i <= numPlayers; i++) {
            html += `<td colspan="2">
                        <div class="player" data-renamable="${i}">
                            ${score[`player${i}`] || ['I', 'II', 'III', 'IV', 'V'][i - 1]}
                        </div>`;
            html += '</td>';
        }
        html += '</tr></thead>';
        return html;
    }

    const buildUnit = (player, turn, playerScore, total) => {
        let html = `<td class="relative text-center" data-player="${player}" data-turn="${turn}">`;
        if (turn < currentTurn) {
            html += playerScore || '---';

            if (turn === negativeOrder.length - 1 || turn === negativeOrder.length - 1 + numPlayers) {
                html += `<div class="total">${total}</div>`;
            }
        } else if (turn === currentTurn && currentTurn < negativeOrder.length + numPlayers) {
            html += `
                <div class="input text-center">
                    <input type="number" id="input_${player}" value="${playerScore || ''}">
                </div>`;
        }

        html += '</td>';

        return html;
    }

    /* Helpers */
    const getDefaultScore = () => {
        return {
            'vazas': 0,
            'copas': 0,
            'homens': 0,
            'mulheres': 0,
            'king': 0,
            'duasUltimas': 0,
            'festa1': 0,
            'festa2': 0,
            'festa3': 0,
            'festa4': 0,
        };
    }

    return {
        init: init,
    };
}();

$(() => {
    king.init();
});