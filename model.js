var currentInfo = {“molesTit”:moles, “molesAna”:molesAna, “millilitersTit”:millilitersTit, “millilitersAna”:millilitersAna, "millilitersTotal": “pKa”:pKa, “concTit”:concTit, “concAna”:concAna}

var convertToMoles = function(volume, concentration){
    var moles = concentraion*volume;
    return moles;
}

var findPH = function(concentration){
    return -Math.log(concentration);
}

var pHCalc = function(molesTitrantAdded, molesAnalyte, volume, pK){
    
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
    
    var change = pKa *concAnalyte/concProduct
    
    var pH = findPH(change)
    
    return pH
}

