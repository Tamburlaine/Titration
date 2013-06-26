var pHtoColor = function(pH){
    var red = 0 
    var blue = 0
    if (pH<=5){
        red = 1
        blue = 0
        
    }
    else if ( (5<pH) && (pH<9)){
        blue =(pH-5) /4
        red = 1-blue
    }
    else if (pH>=9){
        blue = 1
        red = 0
    }
    $('.red').attr('style','opacity:'+red)
    $('.blue').attr('style','opacity:'+blue)
}

var setupBeaker = function (div) {
    $(div).append("<img src=rsz_beakertop.png class='beakerTop'>")
    .append("<img src=rsz_beakercontents.png class='red'>")
    .append("<img src=rsz_beakercontentsblue.png class='blue'>")
    
}

$(document).ready(function(){
    $('.beaker').each(function(){
        setupBeaker($(this));});
});