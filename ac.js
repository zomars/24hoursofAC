function YTAudio(elem, id) {
  this.elem = elem;
  this.id = id;
  this.audio_streams = {};
}

YTAudio.prototype.init = function() {
  // Set up our HTTP request
  var xhr = new XMLHttpRequest();

  // Setup our listener to process compeleted requests
  xhr.onreadystatechange = function() {
    // Only run if the request is complete
    if (xhr.readyState !== 4) return;

    // Process our return data
    if (xhr.status === 200) {
      // What do when the request is successful
      var data = this.parse_str(xhr.responseText);
      var streams = (
        data.url_encoded_fmt_stream_map +
        ',' +
        data.adaptive_fmts
      ).split(',');
      console.log(streams);

      streams.forEach(
        function(s) {
          var stream = this.parse_str(s);
          var itag = stream.itag * 1;
          var quality = false;
          console.log(stream);
          switch (itag) {
            case 139:
              quality = '48kbps';
              break;
            case 140:
              quality = '128kbps';
              break;
            case 141:
              quality = '256kbps';
              break;
          }
          if (quality) this.audio_streams[quality] = stream.url;

          console.log(this.audio_streams);
          this.elem.setAttribute('src', this.audio_streams['128kbps']);
          this.elem.setAttribute('autoplay', true);
        }.bind(this),
      );
    } else {
      console.log('The request failed!');
    }
  }.bind(this);

  xhr.open(
    'GET',
    `https://cors-anywhere.herokuapp.com/https://www.youtube.com/get_video_info?video_id=${
      this.id
    }`,
  );
  xhr.send();
};

YTAudio.prototype.parse_str = function(str) {
  return str.split('&').reduce(function(params, param) {
    var paramSplit = param.split('=').map(function(value) {
      return decodeURIComponent(value.replace('+', ' '));
    });
    params[paramSplit[0]] = paramSplit[1];
    return params;
  }, {});
};
