## Music visualizer

### 0. Main Thought
**청각적인** 음악 감상 경험을 **시각적 경험**으로 확장할 수 있을까? 🎶🎸🎧


---

### 1. Description

* `Music visualizer`는 music splitter를 이용하여 사용자가 원하는 음원을 보컬, 피아노, 기타, 드럼, 베이스 별로 분리하여 각 트랙을
  개별적으로 시각화하여 보여주는 서비스입니다.


* Web 3D 기술을 이용하여 분리된 트랙을 3D object로 시각화하고, 음원과 동기화된 3d animation을 제공합니다.


* 사용자가 원하는 무대배경, 악기 디자인을 선택하고 위치를 조정하여 자신만의 무대를 만들 수 있습니다.
---
### 2. Features

| Music Visualization | 
| :---------------: |
| <img src="public/images/demo1.webp" align="center" width="450px" />  |

---

### 3. 성능 최적화 여정
 무거운 웹 3d 기술들을 이용하여 다른 프로젝트보다 웹 성능 최적화에 더 많은 시간을 투입하였습니다
 전반적인 웹, 브라우저, 프론트엔드 지식들과 3d 최적화 기법들을 이용하여 프로젝트의 성능을 개선하고 있습니다.

### Completed

- [x] 잦은 리렌더링으로 인한 브라우저 멈춤 개선 (`scripting 성능 335% 증가`)- https://github.com/WooWan/Capstone/pull/22
- [x]  무거운 3d 모델들로 인해 초기 로딩시간이 지연되는 현상 발생, 이전 페이지에서 3d modeling을 사전 로딩 & 캐싱을 이용하여 /stage를 접속할 때 FCP, TTI를  개선 - https://github.com/WooWan/Capstone/pull/25/commits/be402512c8412627fa54911d905099f3dd5272f8
- [x] 최적화된 오디오 파일 포맷으로 변환하여 사이즈 89% 감소 - https://github.com/WooWan/Capstone/pull/28  


### TODO

- [ ] draco 또는 gzip 을 사용하여 3d 모델 사이즈를 최적화 할 수 있을지 조사 필요
- [ ] /music 페이지에서 모든 3d 파일을 preload 하는 건 불필요. 사용자가 접근하려고 하는 페이지에 대해서만 prefetch 필요(앨범을 클릭 또는 호버할 시에 해당 앨범에 해당하는 model들을 prefetch)

### 3. Architecture

![public/img.png](public/images/architecture.png)

---

### 4. 시연 영상
https://github.com/WooWan/Capstone/assets/47740690/eacf4bb4-8768-4d66-a3e6-ff8128cf6373
