var number = [1, 400, 12, 34, 5, 10000];
var i = 0;
var total = 0;
while(i < number.length){
    total += number[i];
    i = i+1;
}
console.log(`total : ${total}`);