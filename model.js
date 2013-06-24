var currentInfo = {"molesTit":0, "molesAna":0, "millilitersTit":0, "millilitersAna":0, "millilitersTotal":0, "Ka":0, "concTit":0, "concAna":0}




var convertToMoles = function(volume, concentration){
    var moles = concentraion*volume;
    return moles;
}



/*findPH converts from concentraion to pH. It uses Math.log, which is base e, so it also uses the log change of base formula to convert to log base 10.*/
var findPH = function(concentration){
    return -Math.log(concentration)/Math.log(10);
}


/* phCalc takes the current volume in beaker, the current number of moles of analyte, the kA of the analyte, and the amount of titrant added this step. It then calculates pH after reaction. Note that it currently automatically makes the %5 assumption, so it is slightly inaccurate. This will be fixed later. It is iteratively called in buildData*/
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

/*buildData creates the array of data used to graph the curve. It takes starting moles and volumes of analyte, a concentraion and total amount to added of titrant, a Ka of analyte, and step, which is the volume of 1 drop of titrant. It then calls pHCalc iteratively while tracking the amounts of each object*/
var buildData = function(molesAnalyte, volumeAnalyte, concTitrant, volumeTitrant, Ka, step) {
    var volume = volumeAnalyte
    var molesTitrant = (volumeTitrant*concTitrant);
    
    var dataArray = []
    
    var numSteps = volumeTitrant/step
    
    for (i=1;i<numSteps+1;i++){
        volumeTitrant-=step;
        volume += step;
        
        var molesTitrantAdded = molesTitrant * (i) / numSteps;
        var pH = pHCalc(molesTitrantAdded, molesAnalyte, volume, Ka);
        
        dataArray.push([i*step, pH])
    }
    
    console.log(String(dataArray));
    return dataArray;
}

