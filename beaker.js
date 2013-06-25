var pHtoColor = function(pH){
    var red = 0
    var green = 0 
    var blue = 0
    if (pH<=5){
        red = 200
        blue = 0
        
    }
    else if ( (5<pH) && (pH<9)){
        blue = parseInt((pH-5)*50);
        red = parseInt(200 -  blue);
    }
    else if (pH>=9){
        blue = 200
        red = 0
    }
    var color = 'background-color:rgb('+String(red)+','+String(green)+','+ String(blue) +')';
    return color;
}

var pH = 5.3
var setupBeaker = function () {
    var color = pHtoColor(pH)
    $('.beaker').append("<img src='http://www.clker.com/cliparts/Q/K/x/q/i/P/empty-erlenmeyer-flask-hi.png' class = 'beakerPic'>").attr('style', color)
    
}

$(document).ready(setupBeaker())