var beaker = function(){
    
    var pHtoColor = function(pH){
        var red = 1
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
        $(div).append("<div class= 'dropper'></div><div><img src=rsz_beakertop.png class='beakerTop'>")
        .append("<img src=rsz_beakercontents.png class='red'>")
        .append("<img src=rsz_beakercontentsblue.png class='blue'></div>")
        
    }
    
    var dropperOnClick = function{
        dripSize = model.currentInfo["dripSize"];
        model.infoAdd("millilitersTit", dripSize);
        model.infoAdd("maxTit", dripSize);
        view.graphpH();
        var pH = Model().currentInfo['pH']
        pHtoColor(pH);
    }
   
    var pH = Model().currentInfo['pH']
    var setupDropper = function(){
        $('.dropper').append("<img src = dropper.png onclick = dropperOnClick() class = 'dropperPic'>")
    }
    
    var exports = {'pHtoColor':pHtoColor, 'setupBeaker':setupBeaker, 'setupDropper':setupDropper}
    return exports
    
}

$(document).ready(function(){
    $('.beaker').each(function(){
        beaker().setupBeaker($(this));});
    $('.dropper').each(function(){
        beaker().setupDropper($(this));});
});