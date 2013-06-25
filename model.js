var currentInfo = {"molesTit":0, "molesAna":0, "millilitersTit":0, "millilitersAna":0, "millilitersTotal":0, "Ka":0, "concTit":0,
					"concAna":0, "dripSize":.005, "maxTit":0};
//I added a variable dripSize to indicate how much titrant we're adding per drip
//I initialized it to 5 mL --K
//I also added a variable maxTit for graphing
//I think we should talk about how to deal with updating this. I think that we should have some way of automatically calculating
//things like the conc, totalmL, etc. without individually updating these things (because it could be a big mess if we accidentally
//updated the titrant mL but not the total mL or something. We can cover this tmrw



//I added this whole section here!
//controller calls these things a lot, but I didn't mess with the currentInfo array yet
//(so no automatic updates yet) --K

//adds amount to property value
var infoAdd = function(property, amount){
	currentInfo[property] += amount;
};

//changes the property value to amount
var infoChange = function(property, amount){
	currentInfo[property] = amount;
};

var calculateConcTit = function(moles, volume){
	moles = parseFloat(moles);
	volume = parseFloat(volume);
	return moles/volume;
};

//end what I added --K

var convertToMoles = function(volume, concentration){
    var moles = concentration*volume;
    return moles;
}


/*findPH converts from concentration to pH. It uses Math.log, which is base e, so it also uses the log change of base formula to convert to log base 10.*/
var findPH = function(concentration){
    return -Math.log(concentration)/Math.log(10);
}


/* phCalc takes the current volume in beaker, the current number of moles of analyte, the kA of the analyte, and the amount of titrant added this step. It then calculates pH after reaction. Note that it currently automatically makes the %5 assumption, so it is slightly inaccurate. This will be fixed later. It is iteratively called in buildData*/
/*baseAnalyte is an optional argument. If false, the claculator assumes a weak acid titrated with strong base, and interprets K as a Ka. If true, it assumes a weak base titrated with a strong acid, and interprets K as Kb . It defaultds to false.*/
var pHCalc = function(molesTitrantAdded, molesAnalyte, volume, K, baseAnalyte=false){
    
    
    if (molesAnalyte >= molesTitrantAdded){
        molesAnalyte -= molesTitrantAdded;
        var molesProduct = molesTitrantAdded;
        molesTitrantAdded = 0;
    
        
        var concProduct = molesProduct / volume;
        var concAnalyte = molesAnalyte / volume;
        
        var change = K*concAnalyte/concProduct;
        
        var pH = findPH(change);
    }
    else {
        molesTitrantAdded -=molesAnalyte;
        molesAnalyte = 0;
        var molesProduct = molesAnalyte;
        
        var concProduct = molesProduct/volume;
        var concTitrant = molesTitrant/volume;
        
        change 
    }
    if (baseAnalyte == true){
        pH = 14-pH;
    }
    return pH;
    
}

/*buildData creates the array of data used to graph the curve. It takes starting moles and volumes of analyte, a concentraion and total amount to added of titrant, a Ka of analyte, and step, which is the volume of 1 drop of titrant. It then calls pHCalc iteratively while tracking the amounts of each object*/
//I strongly suspect your life will be easier (and my life will be easier!) if you take only currentInfo as the input and redeclare all the variables inside the function
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

