(function() {
  try {
    var grid = document.getElementById('instagramGrid');
    if (!grid) return;

    var placeholderSrc = 'images/placeholder.svg';
    var placeholderCount = 4;

    function render(items) {
      var section = document.getElementById('instagramSection');
      if (section) section.style.display = '';

      if (!items || items.length === 0) {
        var html = '';
        for (var i = 0; i < placeholderCount; i++) {
          html += '<div class="instagram-item"><span class="instagram-placeholder"><img src="' + placeholderSrc + '" alt="" loading="lazy" width="300" height="300"></span></div>';
        }
        grid.innerHTML = html;
        return;
      }
      var out = '';
      var max = Math.min(items.length, 9);
      for (var i = 0; i < max; i++) {
        var item = items[i];
        var url = item.permalink || item.url || '#';
        var img = item.media_url || item.image || '';
        if (img && img.indexOf('/') === 0) img = img.slice(1);
        var alt = (item.caption || '').slice(0, 100) || 'Instagram';
        out += '<div class="instagram-item"><a href="' + url + '" target="_blank" rel="noopener noreferrer"><img src="' + img + '" alt="' + (alt.replace(/"/g, '&quot;')) + '" loading="lazy" width="300" height="300"></a></div>';
      }
      grid.innerHTML = out;
    }

    var dataUrl = 'data/instagram.json';
    fetch(dataUrl)
      .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function(data) {
        var posts = (data && data.posts) ? data.posts : (Array.isArray(data) ? data : []);
        render(posts);
      })
      .catch(function() {
        render([]);
      });
  } catch (e) {
    if (typeof console !== 'undefined' && console.error) console.error('instagram.js', e);
  }
})();
