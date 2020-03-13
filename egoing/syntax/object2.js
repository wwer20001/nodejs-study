// array, object

var f = function (){   
    console.log(1+1);
    console.log(1+2);
}

var a = [f];
a[0]();

var o = {
    func:f
};
o.func();

// console.log(f);
// f();

//var i = if(true) {console.log(1);}

//while(true) {console.log(1);}