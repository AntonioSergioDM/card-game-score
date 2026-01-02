import "./theme.css";

import $ from "jquery";

export const common = function () {
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

        // Rules
        $('[data-how-to-play]').off('click.rules').on('click.rules', showRules);
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

    const showRules = function () {
        let howToPlay = $(this).data('how-to-play');

        if (/^https?:\/\//.test(howToPlay)) {
            window.open(howToPlay, '_blank');
            return;
        }

        Object.keys(howToPlay).forEach((key) => {
            let html = '';
            if (Array.isArray(howToPlay[key])) {
                html += '<ul>';
                howToPlay[key].forEach((item) => {
                    html += `<li>${item}</li>`;
                });
                html += '</ul>';
            } else {
                html = howToPlay[key];
            }

            $('.howToPlay__' + key).html(html);
        });

        const overlay = $('.howToPlay__overlay');

        overlay.addClass('howToPlay__overlay--open');
        $('.howToPlay__close-btn').on('click', () => overlay.removeClass('howToPlay__overlay--open'))

        // In case of links inside
        $('[data-how-to-play]').off('click.rules').on('click.rules', showRules);
    }

    return {
        init: init,
        save: save,

        hasChanges: () => wasChanged && !(wasChanged = false),
        getScore: () => score,
    };
}();