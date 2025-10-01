$fn=100;
module D(size = 10){
circle(size);
translate([-size,-size,0]){
square([size*2,size]);
}
}


module long(tl = -10){
linear_extrude(40, scale=0.3){
translate([0,tl,0]){
difference(){
    D();
    
D(7);
}
}
}
}

long();
translate([0,5,0]){
    long(+10);
}

translate([0,0,20]){
cube([10,10,10], center=true);
}