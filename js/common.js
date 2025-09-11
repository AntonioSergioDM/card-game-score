const $ = jQuery.noConflict();
common = function () {
    // Elements
    let loadPreviousHolder, loadPreviousBtn, startNewBtn, scoreHolder, menuBtn;
    // Values
    let storageName;
    let score = {};
    let wasChanged = false;

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
            wasChanged = true;
            scoreHolder.fadeIn();
            return;
        }

        startObservers();
        loadPreviousHolder.fadeIn();
    };

    const startObservers = () => {
        startNewBtn.on('click', () => {
            score = {};
            wasChanged = true;
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

        // Common features
        scoreHolder.on('dblclick focus', rename)
    };

    const rename = (evt) => {
        const element = $(evt.target).closest('[data-renamable]');
        if (!element.length) {
            return;
        }

        const input = $('<input>', {
            type: 'text',
            data: element.data(),
            placeholder: element.text(),
        }).on('change blur', () => {
            //save the names
            score[`player${element.data('renamable')}`] = input.val();
            save(score);

            // Go back (maybe useless)
            input.replaceWith(element.text(input.val() || input.attr('placeholder')));
            input.remove();
        })

        element.replaceWith(input);
        input.focus();
    }

    const hasPreviousScore = () => {
        return !!localStorage.getItem(storageName);
    };

    const loadPrevious = () => {
        const json = localStorage.getItem(storageName);
        score = JSON.parse(json || "{}") || {};
        wasChanged = true;
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