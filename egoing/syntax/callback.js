// function a(){
//     console.log('A');
// } 

// 익명 함수를 var a 변수에 할당
// js에서는 함수 역시 값
var a = function(){
    console.log('A');
} 

function slowfunc(callback){
    callback();
}

slowfunc(a);