sueca = function () {
    // Elements
    let gameHolder, startUnlimitedBtn, startNormalBtn;

    // Helper variables
    let currentUnit = false;
    let upGames = [];
    let downGames = [];
    let isMultiple = false;
    let isMultipleTimeout = false;
    let not3pointsTimeout = false;


    /* Initialization */


    const init = () => {
        gameHolder = $('#newScore');
        startNormalBtn = $('#startNormalScore');
        startUnlimitedBtn = $('#startUnlimitedScore');

        startObservers();
    };

    const startObservers = () => {
        setInterval(drawScore, 100);
        startNormalBtn.on('click', () => common.save({type: 'normal'}));
        startUnlimitedBtn.on('click', () => common.save({type: 'unlimited'}));
        gameHolder.on('click', addPoint);
    };

    /* Game Logic */

    const addPoint = (evt) => {
        const player = +$(evt.target).closest('.player').data('player');
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
                not3pointsTimeout = setTimeout(revert3PointsBoundFunction(player, currentPosition), 1000);
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

        common.save(score);
        drawScore();
    }

    const revert3PointsBoundFunction = (player, currentPosition) => {
        return () => {
            const score = common.getScore();
            score['score' + player][currentPosition] = true;
            score['score' + player][currentPosition - 1] += 0.5;
            common.save(score);
            drawScore();
        };
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

        const score = common.getScore();
        if (!score.type) {
            return;
        }

        const scoreUp = score.score1 || getDefaultScore(score.type);
        const scoreDown = score.score2 || getDefaultScore(score.type);

        gameHolder.html(`
<div class="board">
    <div class="players">
        <div class="player" data-player="1">${score.player1 || 'N'}</div>
        <div class="divider divider--horizontal"></div>
        <div class="player" data-player="2">${score.player2 || 'V'}</div>
    </div>
    <div class="divider"></div>
    ${buildFromScores(scoreUp, scoreDown, score.type)}
</div>
        `);

        closeGames(upGames, 'up');
        closeGames(downGames, 'down');
    }

    const buildUnit = (up, down) => {
        if (up === undefined && down === undefined) {
            return `<div class="unit" data-unit="${currentUnit}"><div class="divider divider--horizontal"></div></div>`;
        }

        return `
<div class="unit" data-unit="${currentUnit}">
    <div class="${getPointClasses(up)}"></div>
    <div class="divider"></div>
    <div class="divider divider--horizontal"></div>
    <div class="divider"></div>
    <div class="${getPointClasses(down)}"></div>
</div>
        `;
    }

    const closeGames = (games, position) => {
        const html = `<div class="win win--${position}"></div>`;
        games.forEach((game) => {
            $(`[data-unit="${game}"]`).append(html);
        });
    }

    /* Drawing Logic */

    const buildFromScores = (scoreUp, scoreDown, type) => {
        let html = buildUnit();
        upGames = [];
        downGames = [];
        for (let i = 0; i < scoreUp.length; i++) {
            currentUnit = i;
            if (type !== 'unlimited' && (i + 1) % 4 === 0) {
                // every fourth point means a game is over
                if (scoreUp[i]) {
                    upGames.push(i)
                }

                if (scoreDown[i]) {
                    downGames.push(i)
                }

                html += buildUnit();
                continue;
            }

            html += buildUnit(scoreUp[i], scoreDown[i]);
        }

        currentUnit = false;

        return html + buildUnit();
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