sueca = function () {
    // Elements
    let gameHolder, inputHolder, undoBtn;

    // Helper variables
    let isMultiple = false;
    let isMultipleTimeout = false;
    let not3pointsTimeout = false;

    let unlimitedQty = 10;
    const chunkSize = 20;

    let history = [];

    /* Initialization */

    const init = () => {
        gameHolder = $('#newScore');
        inputHolder = $('#inputHolder');
        undoBtn = $('#undoBtn');

        startObservers();
    };

    const startObservers = () => {
        setInterval(drawScore, 100);

        // Actions
        gameHolder.on('click', addPoint);
        inputHolder.on('click', addPoint);
        undoBtn.on('click', undoPoint);
        $('#restartBtn').on('click', restartAll);


        // Start new game
        $('#startNormalScore').on('click', () => startGame('normal'));
        $('#startUnlimitedScore').on('click', startUnlimited);
    };

    const startUnlimited = () => {
        gameHolder.html(`
            <h2>How many points per game?</h2>
            <div class="input input--number player">
                <input class="" id="unlimitedQty" type="number" value="${unlimitedQty}"/>
            </div>
            
            <button class="button button--primary" id="startGame">Start</button>
        `);

        const input = $('#unlimitedQty');
        input.trigger('focus').trigger('select');

        $('#startGame').on('click', () => startGame('unlimited', input.val()));
    }

    const startGame = (type, qty) => {
        const score = {
            type: type
        };

        if (type === 'unlimited') {
            score.unlimitedQty = +qty || unlimitedQty;
        }

        common.save(score);
    }

    /* Game Logic */
    const restartAll = () => {
        const score = common.getScore();
        score.score1 = getDefaultScore(score.type);
        score.score2 = getDefaultScore(score.type);
        common.save(score);
    }

    const undoPoint = () => {
        let lastMove = history.pop();
        if (lastMove === undefined) {
            return;
        }
        [lastPointTeam, lastPointPosition] = lastMove;

        const score = common.getScore();
        score['score' + lastPointTeam][lastPointPosition] = false;

        // Remove the multiple points inputs from history
        do {
            lastMove = history.pop();
            if (lastMove === undefined) {
                break;
            }

            [lastPointTeam, lastPointPosition] = lastMove;
        } while(score['score' + lastPointTeam][lastPointPosition] <= 0)
        history.push([lastPointTeam, lastPointPosition]);
        common.save(score);
    }

    const addPoint = (evt) => {
        const player = +$(evt.target).closest('[data-player]').data('player');
        if (!player) {
            return;
        }

        const opponent = player === 1 ? 2 : 1;

        const score = common.getScore();
        score.score1 = score.score1 || getDefaultScore(score.type);
        score.score2 = score.score2 || getDefaultScore(score.type);

        const currentPosition = getCurrentPosition(score['score' + player], score['score' + opponent], score.type);

        // Because both scores need to be the same length, add to the opponent too
        score['score' + opponent][currentPosition] = score['score' + opponent][currentPosition] || false;

        // Multiple points (but can't have multiples after the final point of the game
        const isLastPointOfSet = score.type !== 'unlimited'
            ? currentPosition % 4 === 0
            : currentPosition % score.unlimitedQty === 0;
        if (isMultiple === player) {
            if (isLastPointOfSet) {
                console.log(score['score' + player]);
                score['score' + player][currentPosition-1]++;
            } else {
                score['score' + player][currentPosition] = score['score' + player][currentPosition - 1] + 1;
                score['score' + player][currentPosition - 1] = false;
            }

            // Can't have 3 point multiples, but we must wait for the possible fourth
            const numberOfPoints = score['score' + player][currentPosition];
            if (numberOfPoints === 3) {
                not3pointsTimeout = setTimeout(() => revert3Points(player, currentPosition), 1000);
            } else if (numberOfPoints >= 4) {
                clearTimeout(not3pointsTimeout);
                isMultiple = false;
            }
        } else { // Single point
            score['score' + player][currentPosition] = 1;

            // Allow multiple points
            clearTimeout(isMultipleTimeout);
            isMultipleTimeout = setTimeout(() => isMultiple = false, 1000);
            isMultiple = player;
        }

        history.push([player, currentPosition]);
        common.save(score);
    }

    const revert3Points = (player, currentPosition) => {
        const score = common.getScore();
        score['score' + player][currentPosition - 1] = score['score' + player][currentPosition] - 1;
        score['score' + player][currentPosition] = 1;
        common.save(score);
        drawScore();
    }

    const getCurrentPosition = (playerScore, opponentScore, type) => {
        let playerLast = playerScore.findLastIndex(score => !!score);
        if (playerLast === undefined) {
            playerLast = -1;
        }

        if (type === 'unlimited') {
            return playerLast + 1;
        }

        let opponentLast = opponentScore.findLastIndex(score => !!score);
        if (opponentLast === undefined) {
            opponentLast = -1;
        }

        if (playerLast >= opponentLast) {
            return playerLast + 1;
        }

        // We need to check in which game we are
        const not_sure_what_to_call_it = (opponentLast % 4);
        if (not_sure_what_to_call_it === 3) {
            return opponentLast + 1;
        }

        if (opponentLast - playerLast <= not_sure_what_to_call_it) {
            return playerLast + 1;
        }

        return opponentLast - not_sure_what_to_call_it;
    }

    /* Drawing */

    const drawScore = () => {
        if (!common.hasChanges()) {
            return
        }

        const html = buildBoard();
        if (!html) {
            return;
        }

        gameHolder.html(html);
        inputHolder.fadeIn();
    }

    const buildBoard = () => {
        let html = '';
        const score = common.getScore();
        if (!score.type) {
            return false;
        }
        if (score.type === 'unlimited') {
            unlimitedQty = +score.unlimitedQty;
        }

        const scoreUp = score.score1 || getDefaultScore(score.type);
        const scoreDown = score.score2 || getDefaultScore(score.type);

        // lets split in
        let index = 0;
        while (index < scoreUp.length) {
            html += `
                <div class="board">
                    <div class="players">
                        <div class="player" data-renamable="1">${score.player1 || 'N'}</div>
                        <div class="divider divider--horizontal"></div>
                        <div class="player" data-renamable="2">${score.player2 || 'V'}</div>
                    </div>
                    <div class="divider"></div>
                    ${buildFromScores(scoreUp.slice(index, index + chunkSize), scoreDown.slice(index, index + chunkSize), score.type)}
                </div>`;
            index += chunkSize;
        }



        return html;
    }

    const buildUnit = (up, down, addBandeira) => {
        return `
            <div class="unit">
                <div class="point" data-player="1"><div class="${getPointClasses(up)}">${up && addBandeira && buildBandeira('up') || ''}</div></div>
                <div class="divider" data-player="1"></div>
                <div class="divider divider--horizontal"></div>
                <div class="divider" data-player="2"></div>
                <div class="point" data-player="2"><div class="${getPointClasses(down)}">${down && addBandeira && buildBandeira('down') || ''}</div></div>
            </div>`;
    }

    const buildEmptyUnit = () => {
        return `<div class="unit"><div class="divider divider--horizontal"></div></div>`;
    }

    const buildWinUnit = (position, addBandeira) => {
        return `
            <div class="unit">
                <div class="divider divider--horizontal"></div>
                <div class="win win--${position}" data-player="${position === 'up' ? 1 : 2}">
                    ${addBandeira && buildBandeira(position) || ''}
                </div>
            </div>`;
    }

    const buildEndUnit = () => {
        return `
            <div class="unit">
                <span class="game-separator">\\/</span>
            <div class="divider divider--horizontal"></div>
                <span class="game-separator">/\\</span>
            </div>`;
    }

    const buildBandeira = (position) => {
        return `<div class="bandeira bandeira--${position} bandeira__pole">
                    <div class="bandeira__flag wave"></div>
                </div>`;
    }

    /* Drawing Logic */

    const buildFromScores = (scoreUp, scoreDown, type) => {
        let html = buildEmptyUnit();
        let scoreUpTotal = 0;
        let scoreDownTotal = 0;
        for (let i = 0; i < scoreUp.length; i++) {
            if (type === 'unlimited') {
                scoreUpTotal += scoreUp[i];
                scoreDownTotal += scoreDown[i];
                if (scoreUpTotal >= unlimitedQty || scoreDownTotal >= unlimitedQty) {
                    // It's the last point of the set
                    if (scoreUp.slice(i-3, i+1).reduce((a, b) => a + b, 0) > 4 || scoreDown.slice(i-3, i+1).reduce((a, b) => a + b, 0) > 4) {
                        // It's a bandeira that doesn't fit. let's draw a bandeira
                        html += buildUnit(scoreUp[i] && -1, scoreDown[i] && -1, true);
                    } else {
                        html += buildUnit(scoreUp[i], scoreDown[i]);
                    }

                    scoreUpTotal = scoreDownTotal = 0;
                    html += buildEndUnit();
                } else{
                    html += buildUnit(scoreUp[i], scoreDown[i]);
                }
            } else if ((i + 1) % 4 === 0) {
                // every fourth point means a game is over
                if (scoreUp[i]) {
                    scoreUpTotal++;
                    html += buildWinUnit('up', scoreUp[i] === 4);
                } else if (scoreDown[i]) {
                    scoreDownTotal++;
                    html += buildWinUnit('down', scoreDown[i] === 4);
                } else {
                    html += buildEmptyUnit();
                }

                if (scoreUpTotal === 2 || scoreDownTotal === 2) {
                    scoreUpTotal = scoreDownTotal = 0
                    html += buildEndUnit() + buildEmptyUnit();
                }
            } else {
                html += buildUnit(scoreUp[i], scoreDown[i]);
            }
        }

        html += buildEmptyUnit();

        return html;
    }

    /* Helpers */

    const getPointClasses = (point) => {
        switch (+point) {
            case 1:
                return 'point point--active';
            case 2:
                return 'point__multiple point__multiple--double';
            case 4:
                return 'point__multiple point__multiple--tetra';
            default:
                return '';
        }
    }

    const getDefaultScore = (type) => {
        return new Array(type === 'unlimited' ? unlimitedQty : 8).fill(false);
    }

    return {
        init: init,
    };
}();

$(() => {
    sueca.init();
});