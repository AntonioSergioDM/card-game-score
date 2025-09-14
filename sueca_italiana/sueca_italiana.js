suecaItaliana = function () {
    // Elements
    let gameHolder, board, undoBtn;

    let history = [];

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
        $('#calculateBtn').on('click', Calculate);
    }

    /* Game Logic */
    const Calculate = () => {
        const score = common.getScore();
        for (let i = 1; i <= 5; i++) {
            score[`score${i}`] = score[`score${i}`] || getDefaultScore();
            score[`score${i}`].push(0);
        }
        common.save(score);
    }

    const undoPoint = () => {
        const player = history.pop();
        if (player === undefined) {
            window.location.reload();
            return;
        }

        const score = common.getScore();

        score[`score${player}`].push(score[`score${player}`].pop() - 1);

        common.save(score);
    }

    const addPoint = (evt) => {
        const player = +$(evt.target).closest('[data-player]').data('player');
        if (!player) {
            return;
        }

        const score = common.getScore();
        score[`score${player}`] = score[`score${player}`] || getDefaultScore();

        score[`score${player}`].push(score[`score${player}`].pop() + 1);

        history.push(player);
        common.save(score);
    }


    /* Drawing */

    const drawScore = () => {
        if (!common.hasChanges()) {
            return
        }

        board.html(buildBoard());
        var scrollArea = board.find('.scroll');
        scrollArea.scrollTop(scrollArea.height());
    }

    const buildBoard = () => {
        const score = common.getScore();
        let html = '<thead><tr>';
        for (let i = 1; i <= 5; i++) {
            html += `<td class="relative">
                        <div class="player" data-renamable="${i}">
                            ${score[`player${i}`] || ['I', 'II', 'III', 'IV', 'V'][i - 1]}
                        </div>`;
            if ((score[`score${i}`] || []).length) {
                html+= `<div class="absolute absolute--endish">
                            ${score[`score${i}`].reduce((a, b) => a + b, 0)}
                        </div>`;
            }
            html += '</td>';
        }
        html += '</tr></thead><tbody class="scroll">';

        const n = (score.score1 || getDefaultScore()).length;
        for (let i = 0; i < n; i++) {
            html += '<tr>';
            for (let j = 1; j <= 5; j++) {
                html += `<td class="relative" data-player="${j}">
                            ${buildUnit((score[`score${j}`] || getDefaultScore())[i])}
                            <div class="absolute absolute--endish text-xs">
                               ${score[`score${j}`] && score[`score${j}`][i] || 0}
                            </div>
                         </td>`;
            }
            html += '</tr>';
        }

        html += '</tbody>';
        return html;
    }

    const buildUnit = (value) => {
        const full5s = Math.floor(value / 5);
        const remaining = value % 5;
        return '<div class="points">'+ getFullUnit().repeat(full5s) + `
<div class="unit">
    ${'<div class="divider"></div>'.repeat(remaining)}
</div>` + '</div>';
    }

    const getFullUnit = () => {
        return `
<div class="unit">
    <div class="divider"></div>
    <div class="divider"></div>
    <div class="divider"></div>
    <div class="divider"></div>
    <div class="divider divider--diagonal"></div>
</div>`;
    }

    /* Drawing Logic */


    /* Helpers */
    const getDefaultScore = () => {
        return [0];
    }

    return {
        init: init,
    };
}();

$(() => {
    suecaItaliana.init();
});