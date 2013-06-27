var Beaker = function(){
    
    
    /*pHtoColor takes  pH and uses it to determine the opacities of the layers of the beaker image. Below start pH, the beaker is 100% red. Above end pH, it is 100% blue. Between the two pH's, the opacitys change linearly.*/
    var pHtoColor = function(pH){
        var startPH = 5
        var endPH=9
        var red = 1
        var blue = 0
        
        if (pH<=startPH){
            red = 1
            blue = 0
            
        }
        else if ( (startPH<pH) && (pH<endPH)){
            blue =(pH-startPH) /(endPH-startPH
            red = 1-blue
        }
        else if (pH>=endPH){
            blue = 1
            red = 0
        }
        $('.red').attr('style','opacity:'+red)
        $('.blue').attr('style','opacity:'+blue)
    }
    
    /*Builds the html for the beaker*/
    var setupBeaker = function (div) {
        $(div).append("<div class= 'dropper'></div><img src=rsz_beakertop.png class='beakerTop'>")
        .append("<img src=rsz_beakercontents.png class='red'>")
        .append("<img src=rsz_beakercontentsblue.png class='blue'>")
        
    }
    /* Not used. Will be removed when i can safely access titration.js*/
    var dropperOnClick = function(){
        
        var pH = Model().currentInfo['pH']
        pHtoColor(pH);
    }
   
    var pH = Model().currentInfo['pH']
    /*Sets up the dropper*/
    var setupDropper = function(){
        $('.dropper').append("<img src = dropper.png class = 'dropperPic'>")
    }
    
    var exports = {'pHtoColor':pHtoColor, 'setupBeaker':setupBeaker, 'setupDropper':setupDropper, 'dropperOnClick':dropperOnClick}
    return exports
    
};
