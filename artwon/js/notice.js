(function() {
  try {
    var container = document.getElementById('noticeList');
    if (!container) return;

    var defaultContent = '안녕하세요.\n아트원영 입니다.\n\n26년도 전체일정 예약중입니다.\n\n감사합니다♥';

    function formatDate(str) {
      if (!str) return '';
      var d = new Date(str);
      return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function escapeHtml(s) {
      return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function render(notices) {
      if (!notices || notices.length === 0) {
        container.innerHTML = '<div class="no-notice">' + escapeHtml(defaultContent) + '</div>';
        return;
      }
      var pinned = notices.filter(function(n) { return n.isPinned; });
      var regular = notices.filter(function(n) { return !n.isPinned; });
      var list = pinned.concat(regular);
      var html = '';
      list.forEach(function(n) {
        var isPinned = n.isPinned ? ' pinned' : '';
        var badge = n.isPinned ? '<span class="badge">중요</span>' : '';
        html += '<article class="notice-item' + isPinned + '">' +
          '<h2>' + badge + escapeHtml(n.title || '') + '</h2>' +
          '<div class="content">' + escapeHtml(n.content || '') + '</div>' +
          '<time datetime="' + (n.createdAt || '') + '">' + formatDate(n.createdAt) + '</time>' +
          '</article>';
      });
      container.innerHTML = html;
    }

    fetch('js/notice.json')
      .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function(data) {
        var list = (data && data.notices) ? data.notices : (Array.isArray(data) ? data : []);
        render(list);
      })
      .catch(function() {
        render([]);
      });
  } catch (e) {
    if (typeof console !== 'undefined' && console.error) console.error('notice.js', e);
  }
})();
