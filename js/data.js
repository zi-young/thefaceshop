let a = [];       // 전체 공지 배열 선언
let b = [];       // 쇼핑 배열 선언
let c = [];       // 브랜드 배열 선언
let n = -1;       // 필터링 카운트 변수 쇼핑몰 n
let m = -1;       // 필터링 카운트 변수 브랜드 m
let txt = '';     // 출력할 배열 내용 기억 변수
let cnt = 0;      // 글번호
let imgName = ''; // 구분 이미지

let noticeBtNum = 0; // 필터링 변수 전체공지 = 0, 쇼핑공지 = 1, 브랜드공지 = 2
let totRecord = 0;    // 전체 레코드 개수 전체공지 = 200, 쇼핑고지 = 150, 브랜드 = 50
let list = 5;  // 한 화면에 보여질 목록 개수
let startRecord = 0;  // 레코드 시작 -1 페이지 시작번호
let endRecord = startRecord + list; 

let totPage = 0; // 전체 페이지 전체 200/5=40, 쇼핑 150/5=30페이지, 브랜드 50/5=10페이지
let group = 1;   // 그룹 번호 1: 1~5, 그룹 2: 6~10 ...
let groupPage = 10;
let frontPage = 0; 
let rearPage = frontPage + groupPage;
let currentPage = 0; // 현재 페이지에서 페이지 표시할 addClass 사용할 버튼
let noticeBt = $(".noticeBt");

$.ajax({
  url: './data/notice.json',
  dataType: 'JSON',
  success: function (data) {
    $.each(data.공지사항, function (idx, obj) {
      a[idx] = []; // 2차 배열 선언
      if (obj.구분 === '쇼핑') {
        imgName = "<img src='./img/icon_notice1.gif' alt=''>";
      } else {
        imgName = "<img src='./img/icon_notice2.gif' alt=''>";
      }

      a[idx][0] = idx + 1;
      a[idx][1] = imgName;
      a[idx][2] = obj.제목;
      a[idx][3] = obj.날짜;

      if (obj.구분 === '쇼핑') {
        n++;
        b[n] = [];
        b[n][0] = n + 1;
        b[n][1] = imgName;
        b[n][2] = obj.제목;
        b[n][3] = obj.날짜;
      }
      if (obj.구분 === '브랜드') {
        m++;
        c[m] = [];
        c[m][0] = m + 1;
        c[m][1] = imgName;
        c[m][2] = obj.제목;
        c[m][3] = obj.날짜;
      }
    });

    $('.noticeBt').each(function (index) {
        $(this).on({
          click: function () {
            noticeBtNum = index;
            startRecord = 0; // 페이지 번호를 1로 초기화
            endRecord = startRecord + list;
            $('.noticeBt').removeClass('addNav');
            $(this).addClass('addNav');
            noticeFn();
          }
        });
      });

    noticeFn();
    function noticeFn() {
      txt = ''; // 이전 내용 초기화
      if (noticeBtNum === 0) {
        totRecord = a.length;
        cnt = a.length;
        for (let i = 0; i < a.length; i++) {
          a[i][0] = cnt;
          cnt--;
        }
        for (let i = startRecord; i < endRecord; i++) {
          txt += "<tr>";
          for (let j = 0; j < 4; j++) {
            txt += "<td>" + a[i][j] + "</td>";
          }
          txt += "</tr>";
        }
      } else if (noticeBtNum === 1) {
        totRecord = b.length;
        cnt = b.length;
        for (let i = 0; i < b.length; i++) {
          b[i][0] = cnt;
          cnt--;
        }
        for (let i = startRecord; i < endRecord; i++) {
          txt += "<tr>";
          for (let j = 0; j < 4; j++) {
            txt += "<td>" + b[i][j] + "</td>";
          }
          txt += "</tr>";
        }
      } else if (noticeBtNum === 2) {
        totRecord = c.length;
        cnt = c.length;
        for (let i = 0; i < c.length; i++) {
          c[i][0] = cnt;
          cnt--;
        }
        for (let i = startRecord; i < endRecord; i++) {
          txt += "<tr>";
          for (let j = 0; j < 4; j++) {
            txt += "<td>" + c[i][j] + "</td>";
          }
          txt += "</tr>";
        }
      }
      $('tbody').html(txt);


      //전체 페이지 = 전체레코드/5묶음
      totPage=Math.ceil(totRecord/list);

      //현재 페이지 블럭번호(group)=Math.ceil(현재페이지(endRecord)/페이지당 묶음단위(5)/한화면에 보여질 페이지 수(10))
      group=Math.ceil((endRecord/list)/groupPage)
      console.log(group)

      //페이지 그룹 범위: 앞페이지 뒷페이지 범위 설정 - 블럭단위 그룹
      frontPage=(group-1)*groupPage;
      rearPage=frontPage+groupPage;

      if(rearPage>totPage){
        rearPage=totPage
      }

      $('.page-number>span').remove();
      for(i=frontPage; i<rearPage; i++){
    //   for(i=0; i<totPage; i++){ //40페이지까지 보이는지 확인
        $('.page-number').append(`<span><a href='javascript:' class='pageBt'>${i<9?'0'+(i+1): (i+1)}</a</span>`)
      }

      currentPage=(endRecord/list) %groupPage;
      console.log(currentPage);
      $('.pageBt').eq(currentPage-1).addClass('addpage')
      
    }
    $(document).on('mouseenter','.pageBt', function(){
        $('.pageBt').each(function(index){
            $(this).on({click:function(){
                startRecord=(Number($(this).text())-1)*list;
                endRecord=startRecord+list;

                if(endRecord>totRecord){
                    endRecord=totRecord;
                }

                noticeFn()
            }})
        });      
    })

    $('.pageNext').on({click:function(){
        startRecord += list;
        endRecord=startRecord+list;
        if(endRecord>totRecord){
            startRecord=totRecord-(totRecord % list); // 마지막 시작번호
            endRecord=totRecord;
            if(startRecord==totRecord){
                startRecord=totRecord-list;
                endRecord=totPage;
                return false;
            }
        }
        noticeFn()
    }});
    $('.pagePrev').on({click:function(){
        startRecord -= list;
        endRecord=startRecord+list;
        if(startRecord<0){
            startRecord=0;
            endRecord=startRecord+list;
        }
        noticeFn()
    }});

  }, /* success:function(data) */
  error:function(){
    console.log('Error Message')
  }

});