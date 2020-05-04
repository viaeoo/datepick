# Datepick

Simple javascript date pick (Feat. datepicker and calendar)

### Install

```
npm install --save datepick
```

### Getting Started

```
<div id="calendar"></div>
<script>
  const element = document.getElementById('calendar');

  new Datepick(element);
</script>
```

### Options

#### Default options
```
// Basic
grid: 1, // {Number} 달력 그리드 개수 (현재 날짜를 기준으로 앞뒤로 생성 예, 3으로 설정시 현재 날짜 기준으로 이전달, 다음달 같이 생성 / 홀수만 입력 가능 / 'swipe' or 'fade' 모드일 경우 3이상으로 설정)
today: null, //{Date|Null} 오늘 날짜 설정
nextBtnText: '>', //{String} 다음 버튼 텍스트
prevBtnText: '<',// {String} 이전 버튼 텍스트

// Animation
mode: '', // {String} (모드는 효과를 나타냅니다. '': 효과없음 (그리드 개수가 3개 이상일 경우 스크롤이 기본 애니메이션), 'fade': 페이드 효과, 'swipe': 스와이프 효과)
animationTiming: 'ease-in-out', // {String} 애니메이션 변화
animationDuration: 200, // {Number} 애니메이션 속도 (ms)
animationDirection: 'horizon', // {String} 애니메이션 방향 ('horizon' or 'vertical')

// Range
range: false, // {Boolean} 기간 여부
rangeIncludeDisabled: false, // {Boolean} 달력 선택시 비활성화 날짜 포함 여부
rangeDistanceDay: null, // {Number|Null} 달력 선택시 최대 일정

// Multiple
multiple: false, // {Boolean} 다중 선택 여부
multipleMaximum: 0, // {Number} 다중 선택 최대 개수 (0인 경우 제한 없음)

// Language
lang: 'ko', // {String} 기본 언어
locale: {}, // {Object} 기본 텍스트 설정 (달력 요일, 버튼 텍스트 등)

// Min, Max Date
minDate: null, // {Date|Null} 달력 최소 날짜
maxDate: null, // {Date|Null} 달력 최대 날짜

// initial
dates: null, // {Null|Array<Date>} 초기 선택 값 (null인 경우 오늘 날짜 기준으로 설정)
initialDate: null, // {Date|Null|Array<Date>} 초기 설정 날짜 (default: 오늘 날짜)

// touch
touchEvent: true, // {Boolean} 터치 이벤트 설정

// Highlighted
highlightedDate: [], // {Array} 하이라이트 날짜
highlightedToday: false, // {Boolean} 오늘 날짜 하이라이트 여부

// Hide
hideTodayBtn: false, // {Boolean} 오늘 버튼 활성화 여부
hideClearBtn: false, // {Boolean} 삭제 버튼 활성화 여부
hidePrevNextDate: false, // {Boolean} 이전, 다음 날짜 활성화 여부
hideWeek: false, // {Boolean} 요일 활성화 여부

// Disabled day
disabledDate: [], // {Array<Date>} 비활성화 날짜

// holiday
holidayDate: [], // {Array<Date>} 휴일 날짜

// Class
containerClass: '', // {String} 컨테이너 클래스
headerClass: '', // {String} 상단 클래스
titleClass: '', // {String} 제목 클래스
controlsClass: '', // {String} 컨트롤 클래스
controlsTitleClass: '', // {String} 날짜 포맷 클래스
controlsPrevClass: '', // {String} 이전 버튼 클래스
controlsNextClass: '', // {String} 다음 버튼 클래스
controlsTodayClass: '', // {String} 오늘 버튼 클래스
controlsClearClass: '', // {String} 삭제 버튼 클래스
mainClass: '', // {String} 메인 클래스
footerClass: '', // {String} 하단 클래스
weekClass: '', // {String} 요일 컨테이너 클래스
dowClass: '', // {String} 요일 클래스
gridClass: '', // {String} 그리드 클래스
daysClass: '', // {String} 날짜 컨테이너 클래스
dayClass: '', // {String} 날짜 클래스
sundayClass: 'sunday', // {String} 일요일 클래스
saturdayClass: 'saturday', // {String} 토요일 클래스
holidayClass: 'holiday', // {String} 휴일 클래스
firstDayClass: 'first', // {String} 해당 월의 시작 날짜 클래스
lastDayClass: 'last', // {String} 해당 월의 마지막 날짜 클래스
startDayClass: 'start', // {String} 달력 시작 날짜 클래스
endDayClass: 'end', // {String} 달력 마지막 날짜 클래스

// Custom
customDayElement: null, // {Element String/Null} 커스텀 날짜
customInsertBeforeDay: null, // {Element String/Null} 날짜 랜더링 전 커스텀 엘리먼트 
customInsertAfterDay: null, // {Element String/Null} 날짜 랜더링 후 커스텀 엘리먼트

// Callback
beforeClickDay: null, // {Function/Null} 날짜 클릭 전
beforeEffect: null, // {Function/Null} 효과 전
beforeRender: null, // {Function/Null} 랜더링 전

isClickDayEqual: null, // {Function/Null} 중복 날짜 클릭 시
isClickIncludeDisabled: null, // {Function/Null} 비활성화 포함한 날짜 클릭 시
isClickMultipleMaximum: null, // {Function/Null} 다중 선택 최대 개수 초과 시

afterClickDay: null, // {Function/Null} 날짜 클릭 후
afterRender: null, // {Function/Null} 효과 후
afterEffect: null, // {Function/Null} 랜더링 후
```

#### Default Locale Options
```
days: ['일', '월', '화', '수', '목', '금', '토'],
months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
today: '오늘',
clear: '삭제',
format: 'yyyy-mm-dd',
titleFormat: 'y년mm월',
```

### Browser Support

| Chrome | Firefox | Opera | Safari | Edge | Brave | Internet Explorer |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Yes | Yes | Yes | Yes | Yes | Yes | Not yet |


### Todos

- IE 11
- Write test case
- Select Time
- Etc...

### Dependencies

- hammerjs
