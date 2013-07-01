====Titration====

====Description====

This widget is designed to illustrate the concept of chemical titration by graphing the pH of a beaker of analyte
as more titrant is added. The goal is for students to understand how the pH of a weak base is changed as titrant,
with a particular aim of giving students a way to visualize the buffer zone and the jump in pH around the
equivalence point. The user is able to alter 4 parameters in order to see the effect on the graph -- the
pKa of the titrant, the moles of analyte, the concentration of titrant, and the size of the drops added during the
titration. Certain parameters, such as the volume of analyte and the total volume of titrant added, are assumed to
be constant (1 L and 200 mL, respectively).




====Setup & Requirements====

The files titration.js, titration.css, and titration.html are required. The user should insert a div element into
the HTML with the class "titration". Upon document setup, the relevant divs are called into existence using
titration.js at each div element with the class "titration".

Required Sources are 
	- jQuery
	- Bootstrap (for general formatting)
	- D3 (for the graph)
	

	
	
	
====Use====

Initially the sliders are all set to default values 