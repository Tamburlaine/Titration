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

Initially the sliders are all set to default values of
pKa = 3
Moles Analyte = 1
Titrant Concentration = 0.5 (moles/liters)
Drip size = 0.1 mL

If any value is changed, the full titration graph is shown. The user can either watch how the graph changes with
varying values, or can click "Clear" to completely clear the graph. The titration can then be simulated by either
clicking the dropper or by clicking "drip" to see how the pH changes with each drop added. Near the equivalence
point, the user will observe a large jump in pH.

The equivalence point is also displayed on the graph, along with a label.

At each step, an "ICEbox" is displayed to the right showing the relevant equations at each volume of titrant
added. This is designed to help students understand the relevance of these equations to the titration at each
step.

Finally, the beaker at the left is red at low pH and blue at high pH. In between, the beaker transitions from
red to blue by passing through shades of purple corresponding to how acidic it is. The more visual learner can
understand titration by watching the beaker change color as more titrant is added. This also gives the
simulation more of a "lab" feel, because color changing chemicals are often added to the analyte to change with
the pH.




