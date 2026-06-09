const configElement = document.getElementById('play-config');
const config = configElement ? JSON.parse(configElement.textContent || '{}') : {};
const video = document.getElementById(config.video || 'movie-video');
const cover = document.getElementById(config.cover || 'player-cover');
const button = document.getElementById(config.button || 'play-button');
const stream = config.stream || '';
const Hls = window.Hls;
let hls = null;
let prepared = false;
let wantsPlay = false;

const attemptPlay = function () {
  if (!video || !wantsPlay) {
    return;
  }

  const attempt = video.play();

  if (attempt && typeof attempt.catch === 'function') {
    attempt.catch(function () {});
  }
};

const prepare = function () {
  if (!video || !stream || prepared) {
    return;
  }

  prepared = true;

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = stream;
    return;
  }

  if (Hls && Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      maxBufferLength: 20,
      backBufferLength: 30
    });

    hls.loadSource(stream);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      attemptPlay();
    });

    hls.on(Hls.Events.ERROR, function (event, data) {
      if (!data || !data.fatal) {
        return;
      }

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
      } else {
        hls.destroy();
      }
    });
  }
};

const play = function () {
  if (!video) {
    return;
  }

  wantsPlay = true;
  prepare();

  if (cover) {
    cover.classList.add('is-hidden');
  }

  attemptPlay();
};

if (cover) {
  cover.addEventListener('click', play);
}

if (button) {
  button.addEventListener('click', function (event) {
    event.stopPropagation();
    play();
  });
}

if (video) {
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
}

window.addEventListener('pagehide', function () {
  if (hls) {
    hls.destroy();
  }
});
