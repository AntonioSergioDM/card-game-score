sueca = function () {
    // Elements
    let gameHolder, startUnlimitedBtn, startNormalBtn;

    // Helper variables
    let currentUnit = false;
    let upGames = [];
    let downGames = [];


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
        var player = +$(evt.target).closest('.player').data('player');

        if (!player) {
            return;
        }

        const score = common.getScore();
        score.score1 = score.score1 || getDefaultScore(score.type);
        score.score2 = score.score2 || getDefaultScore(score.type);

        const currentPosition = getCurrentPosition(score['score' + player], score['score' + (player === 1 ? 2 : 1)], score.type);


        // TODO deal with multiple points
        score['score' + player][currentPosition] = true;
        score['score' + (player === 1 ? 2 : 1)][currentPosition] = score['score' + (player === 1 ? 2 : 1)][currentPosition] || false;

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