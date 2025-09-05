const $ = jQuery.noConflict();
common = function () {
    // Elements
    let loadPreviousHolder, loadPreviousBtn, startNewBtn, scoreHolder, menuBtn;
    // Values
    let storageName;
    let score = {};
    let wasChanged = true;
    const init = () => {
        //For Dev
        /*if (window.location.href.indexOf('?')<0) {
            window.location.href = window.location.href+'?_ijt=uju87a1n3fgntapsr0m6ht10nr&_ij_reload=RELOAD_ON_SAVE';
        }*/

        loadPreviousHolder = $('#loadPreviousScore');
        loadPreviousBtn = $('#restoreScoreBtn');
        startNewBtn = $('#newScoreBtn');
        scoreHolder = $('#newScore');
        menuBtn = $('#menuBtn');

        storageName = loadPreviousHolder.data('game');


        if (!hasPreviousScore()) {
            scoreHolder.fadeIn();
            return;
        }

        startObservers();
        loadPreviousHolder.fadeIn();
    };

    const startObservers = () => {
        startNewBtn.on('click', () => {
            score = {};
            loadPreviousHolder.fadeOut(()=>scoreHolder.fadeIn());
        });

        loadPreviousBtn.on('click', () => {
            loadPrevious();
            loadPreviousHolder.fadeOut(()=>scoreHolder.fadeIn());
        });

        menuBtn.on('click', () => {
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/').filter(segment => segment);

            // If there's at least one segment, pop the last one off
            if (pathSegments.length > 0) {
                pathSegments.pop();
            }

            // Build the new path and navigate
            window.location.href = '/' + pathSegments.join('/');
        })
    };

    const hasPreviousScore = () => {
        return !!localStorage.getItem(storageName);
    };

    const loadPrevious = () => {
        const json = localStorage.getItem(storageName);
        if (!json) {
            score = {};
            return;
        }

        wasChanged = true;
        score = JSON.parse(json) || {};
    }

    const save = (object) => {
        score = object;
        wasChanged = true;

        const json = JSON.stringify(object);
        localStorage.setItem(storageName, json);
    }

    return {
        init: init,
        save: save,

        hasChanges: () => wasChanged && !(wasChanged = false),
        getScore: () => score,
    };
}();

$(() => {
    common.init();
});