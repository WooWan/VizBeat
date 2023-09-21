> 🍒 이 프로젝트는 많은 interaction과 애니메이션, 3d 기술이 포함되어 있습니다.
🐣  [VizBeat](https://vizbeat.com)를 방문해서 저의 역량과 가능성을 확인해주세요 
[데모 보러 가기](https://vizbeat.com/)

많은 노력과 시간, 그리고 애정을 담아 졸업 프로젝트를 완성했습니다.
프론트엔드 개발 뿐 아니라, 디자인, UI/UX, 서버, 인프라 모두 직접 구성했습니다. 


<div>
<img src="https://github.com/WooWan/VizBeats/assets/47740690/c75e6556-3e8f-4052-902e-2d5fd8bf4a68" />
</div>
  

## 🎸 프로젝트 소개

VizBeat는 음원을 보컬, 기타, 베이스, 피아노, 드럼의 음원 트랙으로 분리한뒤 각 음원들의 주파수를 이용해 시각화하는 프로젝트입니다. 

(음원 분리는 파이썬 서버에서 AI 모델을 이용하여 여러 악기의 음원으로 분리하였습니다.)

##  VizBeat를 소개합니다

<image src='https://github.com/depromeet/jalingobi-client/assets/47740690/ad466044-4388-4aed-bc19-242469d30e4a'>

#### 1. Musics

##### ☑ **뮤직 플레이리스트** 

왼쪽 상단에 뮤직 플레이 리스트를 이용하여 음원 재생/정지,  seek bar 구현, 이전 노래 다음 노래 등의 기능을 구현하였습니다. 
 GIF에서 볼 수 있듯이 음원 재생 목록과 오른쪽의 Three.js 앨범들은 상태를 공유합니다.

##### ☑ **음원 업로드**

| 음원 업로드 | 업로드 완료 |
|:---:|:---:|
 ![Image1](https://github.com/WooWan/VizBeats/assets/47740690/20d44646-48ae-4bd1-bada-1ece85f441ed) | ![Image2](https://github.com/WooWan/VizBeats/assets/47740690/c5ae543b-1cf1-4bd1-aced-47f9a841ed4d)

왼쪽 navbar의 음악 추가하기를 통해 새로운 음원을 등록할 수 있습니다. 음원은 아래 2가지 방법을 통해 추가가 가능합니다. 

- 음원 파일 업로드
  사용자가 가지고 있는 음원을 직접 업로드할 수 있습니다.
  음원의 메타 데이터를 분석하여 아티스트, 음원 제목의 정보를 가져옵니다.
    
- 유튜브 검색
    유튜브 검색 api를 통해 유튜브 음원을 찾을 수 있습니다.

  
 ##### ☑ 음원 분리
  유저가 업로드 또는 유튜브 검색으로 음원을 선택하고 제출하면 음원을 파이썬 서버에 전달하고, 서버에서 AI 모델을 이용하여 음원을 분리합니다. 
  
---
  
### 2. **Stage**
<div>
<img src="https://github.com/WooWan/VizBeats/assets/47740690/c75e6556-3e8f-4052-902e-2d5fd8bf4a68" >
</div>

#### ☑ **Visualizing**

중심 원 기준으로 cos, sin 함수를 통하여 동심원을 형성하고, 높이와 너비는 음원 주파수의 제곱에 비례하여 변화합니다.

#### ☑ **멀티 트랙 플레이어**

![](https://github.com/depromeet/jalingobi-client/assets/47740690/41950ac8-03af-407a-aa4a-d072b8c758d8) | ![](https://github.com/depromeet/jalingobi-client/assets/47740690/41950ac8-03af-407a-aa4a-d072b8c758d8)
--- | --- |

멀티 트랙 플레이어에서 지원하는 기능은 다음과 같습니다.

- 마스터 볼륨 및 싱글 볼륨 조절, 재생/정지
- 음원 다운로드
    
    원본 음원, 분리된 음원들과 mixed 음원까지 다운로드 할 수 있습니다.
    

## 👀 저는 프로젝트를 만들면서 이런 고민을 했어요

VizBeat에서는 무거운 3d를 많이 다루어야 하다 보니, 성능 최적화가 꼭 필요했어요

### ☑ WASM을 사용하여 음원 인코딩 성능을 개선(JavaScript 라이브러리 대비 20배 속도)
    
`멀티 트랙 플레이어`에서는 여러 개의 음원 트랙들을 하나의 mp3 파일로 만들어서 다운로드 하는 기능을 지원합니다.
  
여러 Blob 형태의 음원을 하나의 mp3로 만들기 위해서는 인코딩 과정이 필요한데요, JavaScript library를 사용할 시, 3분 길이의 음원 기준 3분의 인코딩 시간이 걸려서, 서비스에서 적합하지 않았습니다.
    
또한, 7개 음원 파일을(7mb *8 = 56mb) 서버와 매번 주고 받기도 적절하지 않다고 판단하여서 FFmpeg WASM을 채택하였습니다.
    
FFmpeg란 미디어와 오디오 파일을 다루는 오픈 소스 라이브러리이고 c로 작성되어서 빠른 속도를 보여줍니다.
이 라이브러리를 브라우저에서 돌릴 수 있도록 만든 것이 FFmpeg WASM입니다. 
    
   - WASM을 도입하면서 이런 어려움이 있었어요
        
     ```tsx
        import { fetchFile, toBlobURL } from '@ffmpeg/util';
        
        export async function mergeAudios(blobs: Blob[], onProgress: (progress: number) => void) {
          const { FFmpeg } = await import('@ffmpeg/ffmpeg');
        	
        	// more code...
        })
    ```
        
   
프로젝트에서는 Next.js 를 사용하고 있었기 때문에, WASM을 최상단에서 import할 시에 서버에서 오류가 발생하였습니다. 이를 해결하기 위해 dynamic import를 사용해서 클라이언트에서만 import하도록 변경하였습니다.
        
    
WASM 성능측정 (트랙 6개 기준) 
    
| 음원 | 노래 길이 | JavaScript(audio-encoder) | FFmpeg wasm |
    | --- | --- | --- | --- |
    | 요아소비 아이돌 | 3:34 | 182초 | 6.5초 |
    | Basket case | 3:02 | 170초 | 6.1초 |
    
    182초 ⇒ 6.5초, 170초 ⇒ 6.1초로 20배 이상의 성능 향상이 있었습니다.
    
### ☑ **오디오 Blob를 Indexed DB를 저장하여 동일한 오디오 파일 중복 요청 제거**
    
1번 항목에서 살펴보았듯이, 멀티 트랙 플레이어에서는 7개 음원 파일을(7mb *8 = 56mb) 을 S3에 요청하게 되는데요
    
사용자가 페이지를 렌더링하면서 오디오를 요청했는데, 다운로드 할 때마다 같은 파일은 중복적으로 요청하고 있었습니다.
    
또한, 이미 방문한 페이지의 경우 네트워크 요청 대신에 IndexedDB를 사용하여 네트워크 병목을 줄여 페이지 렌더링 시간이 줄어들고, S3 요금도 줄일 수 있습니다.
    
- Local Storage 대신에 IndexedDB를 선택한 이유
  
  1. Chrome 기준으로 LocalStorage는 domain 별로 최대 10mb를 지원합니다. 우리는 50mb이상의 mp3 파일을 저장해야 함으로, 스펙 상 불가능합니다.
            
    반면, IndexedDB는 사용자 디스크의 80%까지 사용할 수 있어서 audio blob을 저장하기에 적합합니다.
            
    2. audio을 blob으로 관리하는데, string 만 저장가능한 local Storage는 오디오 데이터를 다루기에 적합하지 않습니다.
    
### ☑ 유려한 UI/UX 를 구현
    
CSS도 프론트엔드 개발자의 범위라고 생각하고, 프로젝트에서 필요하다면 적절한 애니메이션과 유저 인터렉션을 UI에 녹여낼 수 있어야 한다고 생각합니다.
  
[랜딩 페이지](https://vizbeat.com/)에 framer motion과 scoll 기반 애니메이션들을 만들어서 시각적인 즐거움을 구현하였습니다.
 
 - Headless library를 사용했어요.
          
Headelss library는 개발자가 서비스 로직에 집중할 수 있게 만들고, 작게 서비스를 개발하고 빠르게 검증할 수 있게 생각합니다.
        
 Material ui, Chakra 등의 ui 라이브러리도 있지만, 저의 서비스는 UI 통일성을 주고 싶었기 때문에 headless library를 채택했습니다.
그 중에서도 Headless 라이브러리의 상태 제어와 기본 스타일을 가지고 있는 `shadcn/ui` 를 선택했습니다.
        

### ☑ 브라우저 멈춤 현상 해결 ([PR](https://github.com/WooWan/VizBeats/pull/22))

`useFrame` 은 매 프레임마다 내부 로직을 실행하는 3d util 기능입니다. (매 프레임 16.6ms 마다 실행됩니다)

3d 오브젝트의 움직임을 함수 내부에서 `setState`  를 이용하여 position을 변경하고 있었습니다.

아래는 변경 전후 코드입니다.

```tsx
언뜻 보기에는 문제가 없는 듯 보이지만, useFrame은 매 프레임마다 실행되는데요,
즉, setState를 통해 height를 변경하면 매 frame마다 리렌더링이 발생하여 브라우저 멈춤이 발생합니다.
`before`
useFrame(() => {
	setHeight(height - height * 0.2);
})

원인을 알아내면 해결하는 것은 간단합니다. useRef를 통하여 height를 변경해주면 됩니다.
`after`
useFrame(() => {
	heightRef.current = height - height * 0.2;
})
```

개선 전 => 개선후 약 scripting [`77%` 감소](https://github.com/WooWan/VizBeats/pull/22)
  

#### ☑ 테스트 코드

  테스트 코드는 아직 배워야 할 내용이 많지만, 기준을 세워서 테스트를 작성하려고 노력했습니다.

- 중요한 로직에 대해서 테스트하자, 되도록 통합테스트로 

 테스트 코드를 작성하는 것도 리소스이기 때문에 중요하고 검증하기 힘든 로직에 대해서 테스트 코드를 작성해야하고, 하나의 테스트가 적절한 범위를 커버해야 한다고 생각합니다.
    
    또한, `어떤 함수가 호출되느냐`보다 `어떤 일이 발생했는지` 를 테스트 해야한다고 생각합니다.
    
    함수가 몇 번 호출되었는지보다 유저가 A라는 행동을 했을 때의 B라는 결과를 검증하는 것이 넓은 테스트 범위를 가질 수 있다고 생각합니다.
---
  [Kent의 테스트 가이드](https://kentcdodds.com/blog/write-tests)를 통해 테스트에 지식을 배울 수 있었습니다.
    

## 📖 3. 회고

### **왜 Vizbeat를 만들었을까?**

프로젝트를 회고하는 시점에서 돌이켜보면 정말 많은 성장과 다양한 시도를 해봤던 것 같아요.

졸업 프로젝트 주제를 선정할 때, 2가지 기준을 세웠어요

1. 6개월 이상 몰입할 수 있는 주제인가?
  
   프로젝트에 관해 아래 질문을 받은 적이 있어요.
    `이 프로젝트는 어떤 문제를 해결하고 있어?` 
  
  `BM이 어떻게돼?`
  
    > 물론 중요한 질문이지만 제가 온전히 6개월 이상 몰입할 수 있는 주제여야 했어요
  
2. 기술적 역량과 잠재력을 보여줄 수 있는 프로젝트인가?
  
  이동욱님의 글 ["그 연차치곤 잘하네"의 함정](https://jojoldu.tistory.com/68)을 읽으면서 굉장히 공감갔는데요, 
  
  저는 `주니어 개발자 치고 잘 만든 프로젝트`가 아닌 `잘 만든 프로젝트` 를 만들고 싶었습니다.
    
    시장에 주니어 개발자들이 많아졌고, 그 중에서 눈에 띄기 위해서 높은 퀄리티의 프로젝트를 만들고자 했어요
    
    
    완성된 결과물을 봤을 때 기본기와 트렌드 사이에서 적절히 균형을 맞추면서 다양한 시도를 하면서 성장할 수 있었고, 만족스러운 결과물을 얻을 수 있었습니다.
    

### **오픈 소스 기여**

`VizBeat` 프로젝트 회고에서 오픈소스 기여를 빼놓을 수가 없을 것 같아요

오픈소스 기여는 저와 거리가 먼 이야기라고 생각했고, 몇 년 후에 실력을 키워서 시도해보자고 생각했어요

결과적으로, Vizbeat를 진행하면서 3개의 pull request를 통해 오픈소스에 기여했어요

제가 사용하는 라이브러리의 문제를 발견하고, 필요한 기능을 직접 구현하여 해결했기 때문에 더욱 뜻 깊었습니다.

  <div>
  <img src='https://github.com/depromeet/jalingobi-client/assets/47740690/99e43d15-8767-4311-a411-452311324761'>
  (첫 pull request가 머지되었다는 알림을 받고 🐳)
  </div>


라이브러리 저자와 코드에 대한 서로의 생각을 나누고 PR을 완성해나가는 것은 특히 즐거운 경험이었습니다😊
  
<img src='https://github.com/depromeet/jalingobi-client/assets/47740690/44c475a1-24fa-47c9-98ee-81f0f28aca5f' width='450' align='left' ></img>  
   
 ---
 
 올해 2월에 친구와 함께 졸업 프로젝트를 시작하였는데, 반년이 지나 프로젝트를 다 만들 수 있었습니다.
 학교, 개발 동아리, 인턴을 병행하면서 꽤 바쁜 4학년을 보낸 것 같습니다.
 당장 이번 달부터 취업 시장에 뛰어들 생각을 하니 떨리기도 하고, 걱정도 되지만, 가슴 뛰는 일을 하고 싶습니다.
   
   
## Reference
https://jojoldu.tistory.com/68
https://kentcdodds.com/blog/write-tests
https://all-dev-kang.tistory.com/entry/Nextjs-분리된-음원을-다시-하나로-Web-Assembly-web-worker
  
  
  
  