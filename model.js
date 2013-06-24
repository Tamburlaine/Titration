var currentInfo = {"molesTit":0, "molesAna":0, "millilitersTit":0, "millilitersAna":0, "millilitersTotal":0, "Ka":0, "concTit":0, "concAna":0}

var convertToMoles = function(volume, concentration){
    var moles = concentraion*volume;
    return moles;
}

var findPH = function(concentration){
    return -Math.log(concentration);
}

var pHCalc = function(molesTitrantAdded, molesAnalyte, volume, Ka){
    
    if (molesAnalyte >= molesTitrantAdded){
        molesAnalyte -= molesTitrantAdded;
        var molesProduct = molesTitrantAdded;
        molesTitrantAdded = 0;
    }
    
    else if (molesTitrantAdded> molesAnalyte){
        molesTitrantAdded -= molesAnalyte;
        var molesProduct = molesAnalyte;
        molesAnalyte = 0;
    }
        
    var concProduct = molesProduct / volume
    var concAnalyte = molesAnalyte / volume
    
    var change = Ka *concAnalyte/concProduct
    
    var pH = findPH(change)
    
    return pH
}

