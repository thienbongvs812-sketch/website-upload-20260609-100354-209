(function () {
    var section = document.querySelector('[data-stream]');
    if (!section) {
        return;
    }

    var video = section.querySelector('.video-player');
    var overlay = section.querySelector('.player-overlay');
    var source = section.getAttribute('data-stream');
    var attached = false;
    var hls = null;

    function attach() {
        if (attached || !video || !source) {
            return;
        }
        attached = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({ enableWorker: true });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function start() {
        attach();
        section.classList.add('is-playing');
        var result = video.play();
        if (result && typeof result.catch === 'function') {
            result.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener('click', start);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', function () {
            section.classList.add('is-playing');
        });
    }

    window.addEventListener('pagehide', function () {
        if (hls) {
            hls.destroy();
        }
    });
})();
