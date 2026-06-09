(function () {
  function setupPlayer(player) {
    var video = player.querySelector("video");
    var sourceNode = video ? video.querySelector("source") : null;
    var coverButton = player.querySelector(".player-cover");
    var playButton = player.querySelector(".play-toggle");
    var muteButton = player.querySelector(".mute-toggle");
    var fullscreenButton = player.querySelector(".fullscreen-toggle");
    var streamUrl = sourceNode ? sourceNode.getAttribute("src") : "";
    var hls = null;
    var ready = false;

    if (!video || !streamUrl) {
      return;
    }

    function attachStream() {
      if (ready) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        ready = true;
        return;
      }

      video.src = streamUrl;
      ready = true;
    }

    function playMovie() {
      attachStream();
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    function togglePlay() {
      if (video.paused) {
        playMovie();
      } else {
        video.pause();
      }
    }

    function syncState() {
      var playing = !video.paused && !video.ended;
      player.classList.toggle("is-playing", playing);
      if (playButton) {
        playButton.textContent = playing ? "暂停" : "▶";
      }
    }

    attachStream();

    if (coverButton) {
      coverButton.addEventListener("click", playMovie);
    }

    if (playButton) {
      playButton.addEventListener("click", togglePlay);
    }

    video.addEventListener("click", togglePlay);
    video.addEventListener("play", syncState);
    video.addEventListener("pause", syncState);
    video.addEventListener("ended", syncState);

    if (muteButton) {
      muteButton.addEventListener("click", function () {
        video.muted = !video.muted;
        muteButton.textContent = video.muted ? "已静音" : "音量";
      });
    }

    if (fullscreenButton) {
      fullscreenButton.addEventListener("click", function () {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (player.requestFullscreen) {
          player.requestFullscreen();
        }
      });
    }

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.querySelectorAll("[data-player]").forEach(setupPlayer);
})();
