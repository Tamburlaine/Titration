function Model(div){
		var currentInfo = {"molesTit":0, "molesAna":.3, "litersTit":.2, "litersAna":1, "litersTotal":.2, "Ka":0.000008, "concTit":3, "concAna":0, "dripSize":.005, "maxTit":200, "dataArray":[], 'pH':5.1};
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


		/* pHCalc takes molesTitrantAdded, molesAnalyte, total volume in the beaker, a appropriate Ka/Kb, the equivalence point(calculated by calculateEqPt), and an optional artifact baseAnalyte. It uses a piecewise function to calculate pH at a given set of info.*/
		/*baseAnalyte is an optional argument. If false, the calculator assumes a weak acid titrated with strong base, and interprets K as a Ka. If true, it assumes a weak base titrated with a strong acid, and interprets K as Kb . It defaults to false.*/
		var pHCalc = function(molesTitrantAdded, molesAnalyte, volume, K, eqPoint, baseAnalyte){
			
			if (baseAnalyte === undefined){
				baseAnalyte= false;
			}
			
			/*Calculates pH at the initial state, when nothing has been added.*/
			if (molesTitrantAdded == 0){
				var concAnalyte = molesAnalyte / volume;
				var pH = initialPH(concAnalyte, K)
			}
			
			else if (molesAnalyte > molesTitrantAdded){
				molesAnalyte -= molesTitrantAdded;
				var molesProduct = molesTitrantAdded;
			
				
				var concProduct = molesProduct / volume;
				var concAnalyte = molesAnalyte / volume;
				
				var pH = bufferZonePH(concProduct, concAnalyte, K)
			}
			
			
			else {
				var pH = dilutionPH(molesTitrantAdded, molesAnalyte, eqPoint, volume)
			}
			if (baseAnalyte == true){
				pH = 14-pH;
			}
            infoChange('pH', pH)
			return pH;
			
		}

		/*buildData creates the array of data used to graph the curve. It takes starting moles and volumes of analyte, a concentraion and total amount to added of titrant, a Ka of analyte, and step, which is the volume of 1 drop of titrant. It then calls pHCalc iteratively while tracking the amounts of each object*/
		var buildData = function(baseAnalyte) {
			
			var molesAnalyte = currentInfo['molesAna'];
			var volumeAnalyte = currentInfo['litersAna'];
			var concTitrant = currentInfo['concTit']
			var volumeTitrant = currentInfo['litersTit']
			var K = currentInfo['Ka']
			var step = currentInfo['dripSize']
			//Variable assignment from current info
			
			var volume = volumeAnalyte
			var molesTitrant = (volumeTitrant*concTitrant);
			
			var eqPoint =  calculateEqPoint(molesAnalyte, volumeAnalyte, concTitrant, K)
			
			var dataArray = []
			
			var numSteps = volumeTitrant/step
			
			for (i=1;i<numSteps+1;i++){
				volumeTitrant-=step;
				volume += step;
				
				var molesTitrantAdded = molesTitrant * (i) / numSteps;
				var pH = pHCalc(molesTitrantAdded, molesAnalyte, volume, K, eqPoint, baseAnalyte);
				
				dataArray.push([i*step, pH])
			}
			
			infoChange("dataArray", dataArray);
			
			return dataArray;
		}

        /*These pH functions are helper functions for pH calc. Based on the current moles of titrant added and the moles of analyte, a different function is called.*/
		var initialPH = function(conc, k){
			var pH = .5*(findPH(conc*k))
			//Uses concentrated weak acid assumption to find pH at start
			return pH
		}

		var bufferZonePH = function(concProduct, concAnalyte, K){
			
			var change = K*concAnalyte/concProduct;
			var pH = findPH(change);
			//Uses 5% asumption to solve for change
			return pH;
		}

		var equivalencePH = function(concProduct, K){
			 var oppositeK = Math.pow(10, -14)/K
			//converts Ka to Kb, and vice versa
			 var pOH = .5*findPH(oppositeK/concProduct)
			 //Uses concentrated weak base asummption
			 var pH= 14- pOH
			 return pH
		}

		var dilutionPH = function(molesTitrantAdded, molesAnalyte, equivalencePH, volume){
			
			var initialOHConc = Math.pow(10, -(14-equivalencePH));
			var molesOH = initialOHConc * volume;
			var excessTitrant = molesTitrantAdded - molesAnalyte
			molesOH += excessTitrant;
			var newOHConc = molesOH/volume;
			var pOH = findPH(newOHConc)
			var pH = 14-pOH;
			return pH;
		}
        /*calculateEqPoint is used to find the equivalence point. This value is used in dilutionPH calculations, and will be used to mark off the equivalence point on the graph*/
		var calculateEqPoint = function( molesAnalyte, volumeAnalyte, concTitrant, K) {
			var volumeTitrantNeeded = molesAnalyte/concTitrant;
			var newVolume = volumeAnalyte + volumeTitrantNeeded;
			var concProduct = molesAnalyte/newVolume;
			var pH = equivalencePH(concProduct, K)
			return pH;
		}
		exports={"currentInfo":currentInfo, "infoAdd":infoAdd, "infoChange":infoChange, "calculateConcTit":calculateConcTit, "convertToMoles":convertToMoles,
		"findPH":findPH, "pHCalc":pHCalc, "buildData":buildData, "initialPH":initialPH, "bufferZonePH":bufferZonePH, "equivalencePH":equivalencePH,
		"dilutionPH":dilutionPH, "calculateEqPoint":calculateEqPoint};
		
		return exports;
	};