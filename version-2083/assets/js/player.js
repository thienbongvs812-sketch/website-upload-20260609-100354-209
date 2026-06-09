(function () {
  var shell = document.querySelector('[data-player]');

  if (!shell) {
    return;
  }

  var video = shell.querySelector('video');
  var overlay = shell.querySelector('[data-play-overlay]');
  var playButton = shell.querySelector('[data-play-button]');
  var message = document.querySelector('[data-player-message]');
  var videoUrl = video ? video.getAttribute('data-video') : '';
  var hlsInstance = null;
  var prepared = false;

  function showMessage(text) {
    if (!message) {
      return;
    }

    message.textContent = text;
    message.classList.add('is-open');
  }

  function hideOverlay() {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  }

  function prepareVideo() {
    if (!video || !videoUrl || prepared) {
      return Promise.resolve();
    }

    prepared = true;

    return new Promise(function (resolve) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
        resolve();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hlsInstance.loadSource(videoUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          resolve();
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (data && data.fatal) {
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hlsInstance.startLoad();
              return;
            }

            if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hlsInstance.recoverMediaError();
              return;
            }

            showMessage('播放暂不可用，请稍后再试。');
          }
        });
        return;
      }

      showMessage('播放暂不可用，请更换浏览器后重试。');
      resolve();
    });
  }

  function startPlayback() {
    prepareVideo().then(function () {
      if (!video) {
        return;
      }

      var playTask = video.play();
      hideOverlay();

      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {
          showMessage('点击播放按钮即可继续观看。');
        });
      }
    });
  }

  if (playButton) {
    playButton.addEventListener('click', startPlayback);
  }

  if (video) {
    video.addEventListener('play', hideOverlay);
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
