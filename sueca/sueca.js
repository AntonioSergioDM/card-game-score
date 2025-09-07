sueca = function () {
    // Elements
    let gameHolder, inputHolder, undoBtn;

    // Helper variables
    let isMultiple = false;
    let isMultipleTimeout = false;
    let not3pointsTimeout = false;

    let unlimitedQty = 10;

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
        undoBtn.on('click', undoPoint);
        $('#restartBtn').on('click', restartAll);


        // Start new game
        $('#startNormalScore').on('click', () => startGame('normal'));
        $('#startUnlimitedScore').on('click', () => startGame('unlimited'));
        $('h1').on('click', () => window.location.reload());
    };

    const startGame = (type) => {
        const score = {
            type: type
        };

        if (type === 'unlimited') {
            score.unlimitedQty = unlimitedQty;
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
        const lastMove = history.pop();
        if (lastMove === undefined) {
            window.location.reload();
            return;
        }
        [lastPointTeam, lastPointPosition] = lastMove;

        const score = common.getScore();
        score['score' + lastPointTeam][lastPointPosition] = false;

        if (lastPointPosition !== 0) {
            //let's check if it's a multiple
            let previousScore = score['score' + lastPointTeam][lastPointPosition-1];
            while (previousScore === 0.5 || previousScore === 1) {
                score['score' + lastPointTeam][lastPointPosition - 1] = false;
                previousScore = score['score' + lastPointTeam][lastPointPosition-1];
            }
        }

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

        // Multiple points (anywhere in unlimited, but can't have multiples after the final point of the game on normal mode
        if (isMultiple === player && (score.type === 'unlimited' || currentPosition % 4 !== 0)) {
            score['score' + player][currentPosition - 1] -= 0.5;
            score['score' + player][currentPosition] = 1.5;

            if (score.type !== 'unlimited' && currentPosition % 4 === 3) {
                // Final point of the game (normal mode)
                isMultiple = false;
                score['score' + player][currentPosition] = true;
                let multiplePosition = score['score' + player].findLastIndex(score => score === 0.5);
                while (multiplePosition < currentPosition) {
                    score['score' + player][multiplePosition] = false;
                    multiplePosition++;
                }
            }

            // Can't have 3 point multiples, but we must wait for the possible fourth
            const numberOfPoints = currentPosition - score['score' + player].findLastIndex(score => score === 0.5) + 1;
            if (numberOfPoints === 3) {
                not3pointsTimeout = setTimeout(() => revert3Points(player, currentPosition), 1000);
            } else if (numberOfPoints >= 4) {
                clearTimeout(not3pointsTimeout);
                isMultiple = false;
            }
        } else { // Single point
            score['score' + player][currentPosition] = true;

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
        score['score' + player][currentPosition] = true;
        score['score' + player][currentPosition - 1] += 0.5;
        common.save(score);
        drawScore();
    }

    const getCurrentPosition = (playerScore, opponentScore, type) => {
        let playerLast = playerScore.findLastIndex(score => score !== false);
        if (playerLast === undefined) {
            playerLast = -1;
        }


        if (type === 'unlimited') {
            return playerLast + 1;
        }

        let opponentLast = opponentScore.findLastIndex(score => score !== false);
        if (opponentLast === undefined) {
            opponentLast = -1;
        }

        if (playerLast >= opponentLast) {
            return playerLast + 1;
        }

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

        gameHolder.html(html + buildPointBtns());
        inputHolder.fadeIn();
    }

    const buildPointBtns = () => {
        return `
    <div class="section section--row">
        <button class="button button--primary" data-player="1">Add up</button>
        <button class="button button--primary" data-player="2">Add down</button>
    </div>`;
    }

    const buildBoard = () => {
        const score = common.getScore();
        if (!score.type) {
            return false;
        }

        const scoreUp = score.score1 || getDefaultScore(score.type);
        const scoreDown = score.score2 || getDefaultScore(score.type);

        return `
<div class="board">
    <div class="players">
        <div class="player" data-player="1">${score.player1 || 'N'}</div>
        <div class="divider divider--horizontal"></div>
        <div class="player" data-player="2">${score.player2 || 'V'}</div>
    </div>
    <div class="divider"></div>
    ${buildFromScores(scoreUp, scoreDown, score.type)}
</div>`;
    }

    const buildUnit = (up, down) => {
        return `
<div class="unit"">
    <div class="${getPointClasses(up)}" data-player="1"></div>
    <div class="divider" data-player="1"></div>
    <div class="divider divider--horizontal"></div>
    <div class="divider" data-player="2"></div>
    <div class="${getPointClasses(down)}" data-player="2"></div>
</div>`;
    }

    const buildEmptyUnit = () => {
        return `<div class="unit"><div class="divider divider--horizontal"></div></div>`;
    }

    const buildWinUnit = (position) => {
        return `
<div class="unit">
    <div class="divider divider--horizontal"></div>
    <div class="win win--${position}" data-player="${position === 'up' ? 1 : 2}"></div>
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

    /* Drawing Logic */

    const buildFromScores = (scoreUp, scoreDown, type) => {
        let html = buildEmptyUnit();
        let scoreUpTotal = 0;
        let scoreDownTotal = 0;
        for (let i = 0; i < scoreUp.length; i++) {
            if (type === 'unlimited') {
                scoreUpTotal += scoreUp[i] ? 1 : 0;
                scoreDownTotal += scoreDown[i] ? 1 : 0;
                html += buildUnit(scoreUp[i], scoreDown[i]);
                if (scoreUpTotal === unlimitedQty || scoreDownTotal === unlimitedQty) {
                    scoreUpTotal = scoreDownTotal = 0;
                    html += buildEndUnit();
                }
            } else if ((i + 1) % 4 === 0) {
                // every fourth point means a game is over
                if (scoreUp[i]) {
                    scoreUpTotal++;
                    html += buildWinUnit('up');
                } else if (scoreDown[i]) {
                    scoreDownTotal++;
                    html += buildWinUnit('down');
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

        if (type !== 'unlimited') {
            html += buildEmptyUnit();
        } else {
            html += buildEndUnit();
        }

        return html;
    }

    /* Helpers */

    const getPointClasses = (point) => {
        let classes = 'point';
        if (point) {
            classes += ' point--active';
        }
        if (point === 0.5 || point === 1) {
            classes += ' point--first';
        }
        if (point === 1.5 || point === 1) {
            classes += ' point--last';
        }

        return classes;
    }

    const getDefaultScore = (type) => {
        return new Array(type === 'unlimited' ? 10 : 8).fill(false);
    }

    return {
        init: init,
    };
}();

$(() => {
    sueca.init();
});