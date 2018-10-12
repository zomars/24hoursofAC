var vid = '3xny-xwQ9-k';
var audio_streams = {};

// Set up our HTTP request
var xhr = new XMLHttpRequest();

// Setup our listener to process compeleted requests
xhr.onreadystatechange = function() {
  // Only run if the request is complete
  if (xhr.readyState !== 4) return;

  // Process our return data
  if (xhr.status === 200) {
    // What do when the request is successful
    var data = parse_str(xhr.responseText);
    var streams = (
      data.url_encoded_fmt_stream_map +
      ',' +
      data.adaptive_fmts
    ).split(',');
    console.log(streams);

    streams.forEach(function(s) {
      var stream = parse_str(s);
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
      if (quality) audio_streams[quality] = stream.url;

      console.log(audio_streams);
      document
        .querySelector('#youtube')
        .setAttribute('src', audio_streams['128kbps']);
    });
  } else {
    // What do when the request fails
    console.log('The request failed!');
  }
};

xhr.open(
  'GET',
  `https://cors-anywhere.herokuapp.com/https://www.youtube.com/get_video_info?video_id=${vid}`,
);
xhr.send();

function parse_str(str) {
  return str.split('&').reduce(function(params, param) {
    var paramSplit = param.split('=').map(function(value) {
      return decodeURIComponent(value.replace('+', ' '));
    });
    params[paramSplit[0]] = paramSplit[1];
    return params;
  }, {});
}