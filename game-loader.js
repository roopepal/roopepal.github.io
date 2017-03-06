/*
 * NOTE: This script ensures that the iframe element is loaded only after
 * the parent document is loaded. Otherwise, if the iframe load event would
 * happen before the parent document load event, the messaging service cannot
 * be guaranteed to work if the iframe loads faster than the parent page.
 *
 * Reads the game URL from the #iframe-wrap element's data-game-url attribute
 * and creates the iframe element.
 */

document.addEventListener('load', function() {
  console.log('game-loader load');

  var iframeWrap = document.getElementById('iframe-wrap');
  console.log('game-loader iframeWrap', iframeWrap);

  if (iframeWrap) {
    var url = iframeWrap.dataset.gameUrl;

    console.log('game-loader url', url);
    if (url) {

      console.log('game-loader creating element');
      var iframe = document.createElement("iframe");
      console.log('game-loader iframe', iframe);
      iframe.src = url;
      iframe.frameborder = "0";
      console.log('game-loader iframe', iframe);
      iframeWrap.appendChild(iframe);
      console.log('game-loader iframeWrap', iframeWrap);
    }
  }
});