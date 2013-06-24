var currentInfo = {"molesTit":0, "molesAna":0, "millilitersTit":0, "millilitersAna":0, "millilitersTotal":0, "Ka":0, "concTit":0, "concAna":0}

var convertToMoles = function(volume, concentration){
    var moles = concentraion*volume;
    return moles;
}

var findPH = function(concentration){
    return -Math.log(concentration);
}


/* phCalc takes the current volume in beaker, the current number of moles of analyte, the kA of the analyte, and the amount of titrant added this step. It then calculates pH after reaction. Note that it currently automatically makes the %5 assumption, so it is slightly inaccurate. This wil be fixed later. It is iteratively called in buildData*/
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
/*buildData creates the array of data used to graph the curve. It takes starting moles and volumes of analyte, a concentraion and total amount to added of titrant, a Ka of analyte, and step, which is the size of 1 drop of titrant*/
var buildData = function(molesAnalyte, volumeAnalyte, concTitrant, volumeTitrant, Ka, step) {
    
    
}

