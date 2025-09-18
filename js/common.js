const $ = jQuery.noConflict();
common = function () {
    // Elements
    let loadPreviousHolder, loadPreviousBtn, startNewBtn, scoreHolder, menuBtn;
    // Values
    let storageName;
    let score = {};
    let wasChanged = false;

    const init = () => {
        loadPreviousHolder = $('#loadPreviousScore');
        loadPreviousBtn = $('#restoreScoreBtn');
        startNewBtn = $('#newScoreBtn');
        scoreHolder = $('#newScore');
        menuBtn = $('#menuBtn');

        storageName = $('h1').text().toLowerCase().replaceAll(' ', '_');

        startRedirectObservers();

        if (!hasPreviousScore()) {
            wasChanged = true;
            scoreHolder.fadeIn();
            return;
        }

        startRestoreObservers();
        loadPreviousHolder.fadeIn();
    };

    const startRedirectObservers = () => {
        menuBtn.on('click', () => {
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/').filter(segment => segment);

            // If there's at least one segment, pop the last one off
            if (pathSegments.length > 0) {
                pathSegments.pop();
            }

            // Build the new path and navigate
            window.location.href = '/' + pathSegments.join('/');
        });

        $('h1').on('click', () => window.location.reload());

        // Common features
        scoreHolder.on('dblclick focus', rename);
    }

    const startRestoreObservers = () => {
        startNewBtn.on('click', () => {
            score = {};
            wasChanged = true;
            loadPreviousHolder.fadeOut(() => scoreHolder.fadeIn());
        });

        loadPreviousBtn.on('click', () => {
            loadPrevious();
            loadPreviousHolder.fadeOut(() => scoreHolder.fadeIn());
        });
    };

    const rename = (evt) => {
        const element = $(evt.target).closest('[data-renamable]');
        if (!element.length) {
            return;
        }

        const inputElement = $('<div>', {'class': element.attr('class'),})
            .addClass('input input--name')
            .css('width', element.outerWidth() + 'px');

        const input = $('<input>', {
            type: 'text',
            placeholder: element.text(),
            value: score[`player${element.data('renamable')}`] || '',
        }).on('change blur', () => {
            score[`player${element.data('renamable')}`] = input.val();
            save(score);

            // Go back (maybe useless)
            inputElement.replaceWith(element.text(input.val() || input.attr('placeholder')));
            inputElement.remove();
        });

        inputElement.append(input);

        element.replaceWith(inputElement);
        input.trigger('focus').trigger('select');
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