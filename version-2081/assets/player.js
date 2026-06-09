function setupMoviePlayer(videoId, coverId, streamUrl) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  var started = false;
  var hlsInstance = null;

  if (!video || !cover || !streamUrl) {
    return;
  }

  function playVideo() {
    var playback = video.play();

    if (playback && typeof playback.catch === "function") {
      playback.catch(function () {});
    }
  }

  function attachStream() {
    if (started) {
      playVideo();
      return;
    }

    started = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    cover.classList.add("is-hidden");
    video.controls = true;
    playVideo();
  }

  cover.addEventListener("click", attachStream);

  video.addEventListener("click", function () {
    if (!started) {
      attachStream();
    }
  });

  video.addEventListener("ended", function () {
    if (hlsInstance && typeof hlsInstance.stopLoad === "function") {
      hlsInstance.stopLoad();
    }
  });
}
