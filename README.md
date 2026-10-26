# support

## 로컬 실행 (Windows)

아래 배치 파일을 더블클릭하세요. Node.js가 PATH에 있거나, 옆 `Homepage/bin/node/node.exe`가 있으면 별도 설치 없이 실행할 수 있습니다.

| 파일 | 기능 |
| --- | --- |
| `start-local.bat` | 문서 HTML 생성 후 서버 실행 및 브라우저 열기 |
| `stop-local.bat` | 이 폴더에서 실행한 로컬 서버 중지 |
| `restart-local.bat` | 서버 중지 후 다시 실행 및 브라우저 열기 |

기본 주소: http://127.0.0.1:3103/

서버는 백그라운드에서 실행되므로 배치 창을 닫아도 유지됩니다. 수정 후 브라우저에서 Ctrl+F5로 새로고침하세요. 직접 접속하는 HTML도 갱신하려면 재실행하세요.

기존 Python 서버 등이 3103 포트를 사용 중이면 해당 터미널에서 Ctrl+C로 종료한 뒤 실행하세요. 다른 서버는 자동으로 종료하지 않습니다. 별도 포트를 사용할 수도 있습니다. 이때 실행·중지·재실행에 같은 포트를 지정하세요.

```powershell
.\start-local.bat -Port 3107
.\stop-local.bat -Port 3107
.\restart-local.bat -Port 3107
```

브라우저를 열지 않으려면 실행·재실행에 `-NoBrowser`를 추가하세요. 중지 상태에서도 중지 배치 파일은 정상 종료합니다. 실행 정보와 로그는 Windows 임시 폴더의 `cizentech-support-*.json`, `*.log`에 저장됩니다.

배치 파일로 실행한 로컬 서버는 이 PC에서만 접근할 수 있으며 운영 사이트를 배포하지 않습니다.

https://cizentech.github.io/support



```
Docsify에서 .md 파일 내부의 헤더(제목)를 자동으로 인식하여
👉 좌측 사이드바에 Table of Contents(TOC)를 링크 형태로 표시하는 기능


예시: guide.md
# 사용 가이드

## 설치 방법

내용...

## 초기 설정

내용...

### 고급 설정

위 문서를 열면 좌측 사이드바에:
내용...

사용 가이드
  - 설치 방법
  - 초기 설정
    - 고급 설정

```
