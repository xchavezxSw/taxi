(function(){
    var t,n,r;
    t=require("crypto"),r=128,n=12e3,exports.hash=function(l,i,u)
    {var e;
    if(3===arguments.length)
    try{t.pbkdf2(l,i,n,r,function(t,n){t?u(t,null):(n=n.toString("base64"),u(null,n))})}catch(o){e=o,u(e.toString(),null)}else u=i,t.randomBytes(r,function(i,o){if(i)return u(i);o=o.toString("base64");try{t.pbkdf2(l,o,n,r,function(t,n){return t?u(t):(n=n.toString("base64"),void u(null,o,n))})}catch(a){e=a,u(e.toString(),null,null)}})}}).call(this);