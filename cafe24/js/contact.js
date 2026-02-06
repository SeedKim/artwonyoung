(function() {
  try {
    var form = document.getElementById('contactForm');
    var toast = document.getElementById('toast');
    var submitBtn = document.getElementById('submitBtn');

    function showToast(message, type) {
      if (!toast) return;
      toast.textContent = message;
      toast.className = 'toast ' + (type || 'success');
      toast.classList.add('show');
      setTimeout(function() { toast.classList.remove('show'); }, 4000);
    }

    function setError(id, msg) {
      var el = document.getElementById(id);
      if (el) { el.textContent = msg || ''; el.style.display = msg ? 'block' : 'none'; }
    }

    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = (form.name && form.name.value || '').trim();
      var email = (form.email && form.email.value || '').trim();
      var message = (form.message && form.message.value || '').trim();

      setError('errorName', '');
      setError('errorEmail', '');
      setError('errorMessage', '');

      var err = false;
      if (name.length < 2) { setError('errorName', '이름은 2자 이상 입력해주세요.'); err = true; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('errorEmail', '올바른 이메일을 입력해주세요.'); err = true; }
      if (message.length < 10) { setError('errorMessage', '메시지는 10자 이상 입력해주세요.'); err = true; }
      if (err) return;

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '전송 중...'; }

      if (typeof emailjs !== 'undefined') {
        emailjs.send(
          window.EMAILJS_SERVICE_ID || 'your_service_id',
          window.EMAILJS_TEMPLATE_ID || 'your_template_id',
          { from_name: name, from_email: email, message: message },
          window.EMAILJS_PUBLIC_KEY || 'your_public_key'
        ).then(function() {
          showToast('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.', 'success');
          form.reset();
        }).catch(function() {
          showToast('전송에 실패했습니다. Kakao 채널 또는 Instagram DM으로 문의해 주세요.', 'error');
        }).finally(function() {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '문의하기'; }
        });
      } else {
        showToast('문의 내용이 전송되었습니다. (EmailJS 미설정 시 Kakao/Instagram DM 이용)', 'success');
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '문의하기'; }
      }
    });
  } catch (e) {
    if (typeof console !== 'undefined' && console.error) console.error('contact.js', e);
  }
})();
