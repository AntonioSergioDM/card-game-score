king = function () {
    // Elements
    let gameHolder, board, undoBtn;

    const negativeOrder = ['vazas', 'copas', 'homens', 'mulheres', 'king', 'duasUltimas'];
    let currentTurn = 0;
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
        'festa-nulos': {
            max: 13,
            multiplier: -75,
            start: 325,
            positive: true,
        },
    }

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
        $('#calculateBtn').on('click', calculate);
    }

    /* Game Logic */
    const calculate = () => {
        let turnSettings = {};
        if (currentTurn < negativeOrder.length) {
            turnSettings = gameSettings[negativeOrder[currentTurn]];
        } else {
            // TODO or nulos
            turnSettings = gameSettings['festa'];
        }

        const score = common.getScore();
        let turnTotal = 0;
        for (let i = 1; i <= 4; i++) {
            const playerInput = $('#input_' + i);
            let points = +playerInput.val() || 0;
            playerInput.closest('.input').removeClass('input--error');

            if (points <= turnSettings.max) {
                points = points * turnSettings.multiplier + (turnSettings.start || 0);
            } else if (points % turnSettings.multiplier !== 0) {
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
            // TODO this is not working.
            scrollArea.scrollTop(input.offset().top);
            input.trigger('focus').trigger('select');
        }

        // TODO add totals depending on the current turn
    }

    const buildBoard = () => {
        const score = common.getScore();
        let html = '<thead><tr><td></td>';
        for (let i = 1; i <= 4; i++) {
            html += `<td colspan="2">
                        <div class="player" data-renamable="${i}">
                            ${score[`player${i}`] || ['I', 'II', 'III', 'IV', 'V'][i - 1]}
                        </div>`;
            html += '</td>';
        }
        html += '</tr></thead><tbody class="scroll">';
        currentTurn = score.currentTurn || currentTurn;
        const n = negativeOrder.length;
        for (let i = 0; i < n; i++) {
            html += `<tr>
                        <td>${negativeOrder[i]}</td>`;
            for (let j = 1; j <= 4; j++) {
                const playerScore = (score[`score${j}`] || getDefaultScore());
                html += buildUnit(j, i, playerScore[negativeOrder[i]]);
                html += buildUnit(j, i + n, playerScore[`festa${i + 1}`]);
            }
            html += '</tr>';
        }
        html += '</tbody>';
        return html;
    }

    const buildUnit = (player, turn, playerScore) => {
        let html = `<td data-player="${player}" data-turn="${turn}">`;
        if (turn < currentTurn) {
            html += playerScore || '---';
        } else if (turn === currentTurn) {
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