

var pHCalc = function(molesTitrant, molesAnalyte, volume, pK){
    
    
}

var initialPH = function(molesAnalyte, volume, pK){
    var plusChange = (-pK +Math.sqrt( Math.pow(pK, 2) - 4*pK*molesAnalyte))/(2);
    var minusChange = (-pK -Math.sqrt( Math.pow(pK, 2) - 4*pK*molesAnalyte))/(2);
    //plusChange and minusChange are used to find the positive solution to the quadratic equation, since the negative solution is impossible)
    if (plusChange>0){
        var change = plusChange;
    }
    
    else{
        var change = minusChange;   
    }
    
    var pH = -(Math.log(change))
}