# 인스타그램 연동 방법

Cafe24는 **정적 호스팅**이라 서버가 없어, 인스타그램 공식 API를 사이트에서 직접 호출해 자동으로 피드를 가져오는 방식은 사용할 수 없습니다.  
아래 두 가지 방법 중 하나로 연동할 수 있습니다.

---

## 방법 1: 수동으로 `data/instagram.json` 수정 (추천)

1. **인스타그램**에서 보여주고 싶은 게시물을 엽니다.
2. **이미지 주소**  
   - PC: 게시물 이미지 우클릭 → "이미지 주소 복사"  
   - 또는 브라우저 개발자도구로 이미지 URL 확인
3. **게시물 링크**  
   - 게시물 열기 → 주소창 URL 복사 (예: `https://www.instagram.com/p/ABC123/`)
4. `cafe24/data/instagram.json`을 아래 형식에 맞게 수정합니다.

```json
{
  "posts": [
    {
      "media_url": "여기에_이미지_URL",
      "permalink": "여기에_게시물_링크",
      "caption": "설명 (선택)"
    }
  ]
}
```

- **media_url**: 게시물 이미지의 실제 URL (필수)
- **permalink**: 해당 게시물 페이지 링크 (클릭 시 이동)
- **caption**: 이미지 대체 텍스트용, 비워도 됨

최대 **9개**까지 넣을 수 있고, 수정 후 Cafe24에 `instagram.json`만 다시 업로드하면 됩니다.

---

## 방법 2: Node.js 스크립트로 JSON 자동 생성 (Instagram Graph API)

프로젝트에 `scripts/fetch-instagram.js`가 포함되어 있습니다. 로컬 또는 CI에서 실행해 `data/instagram.json`을 갱신한 뒤, 해당 파일만 Cafe24에 업로드하면 됩니다.

**사전 요구사항**: Instagram 비즈니스/크리에이터 계정, [Meta for Developers](https://developers.facebook.com/) 앱, 액세스 토큰(Long-lived 권장), IG User ID.

**실행 (cafe24 폴더에서):**
```bash
export INSTAGRAM_ACCESS_TOKEN="발급받은_토큰"
export INSTAGRAM_USER_ID="IG_사용자_ID"
node scripts/fetch-instagram.js
```
Windows PowerShell: `$env:INSTAGRAM_ACCESS_TOKEN="토큰"; $env:INSTAGRAM_USER_ID="ID"; node scripts/fetch-instagram.js`

성공 시 `data/instagram.json`에 최근 9개 게시물이 저장됩니다.

---

- **Instagram Graph API (수동 연동 시)**  
  비즈니스/크리에이터 계정 + Facebook 앱이 필요하고, 개발이 필요합니다.  
  정적 호스팅만으로는 “사이트에서 직접 API 호출”이 불가능하므로,  
  **별도 서버/서버리스 함수**에서 주기적으로 API를 호출해 `instagram.json` 파일을 생성·업로드하는 방식이어야 합니다.

- **제3자 피드 서비스**  
  인스타 피드를 가져와 위젯/embed로 보여주는 서비스(유료·무료)를 쓰는 방법도 있습니다.  
  이 경우 해당 서비스 제공 방식에 맞춰 HTML만 넣는 형태가 되고, 현재처럼 `data/instagram.json`을 쓰는 구조와는 다릅니다.

---

**정리**: 서버 없이 운영하려면 **방법 1(수동으로 `data/instagram.json` 수정)**이 가장 단순하고 안정적입니다.  
새 게시물이 올라올 때마다 URL만 복사해 JSON에 추가한 뒤, 수정된 `instagram.json`만 FTP로 다시 올리면 됩니다.
