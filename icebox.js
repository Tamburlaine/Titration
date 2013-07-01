var icebox = function() {
var acidInitial = 0
var ohInitial = 0
var baseInitial = 0
var Ka= 0

var getEqInfo = function(){
    acidInitial = 0
    baseInitial = Model().currentInfo['molesAna']
    Ka = Model().currentInfo['Ka']
    ohInitial = 0
}

var iceboxSetup = function(div, infoFunction){
    infoFunction()
    $(div).append('<div class = iceboxTable><table class="table table-striped"></table></div>')
    $('.table').append("<tr class = 'row1'></tr><tr class = 'row2 info'></tr><tr class = 'row3'></tr><tr class = 'row4 info'></tr>"
                      )
    $('.row1').append("<td></td><td>A<sup>-</sup></td><td>H<sub>2</sub>O</td><td>OH<sup>-</sup></td><td>HA</td>"
                     )
    $('.row2').append("<td>Initial</td><td>" + baseInitial +"</td><td>Irrelevant</td><td>"+ohInitial+"</td><td>"+acidInitial+"</td>"
                     )
     $('.row3').append("<td>Change</td><td>-x</td><td>Irrelevant</td><td>+x</td><td>+x</td>"
                      )
      $('.row4').append("<td>End</td><td class='baseEnd'>" + baseInitial +" - x</td><td>Irrelevant</td><td class='ohEnd'>"+ohInitial+" + x</td><td class='acidEnd'>"+acidInitial+" + x</td>"
                       )
      $('.icebox').append('<div class = "calcText"></div>')
}

var iceboxCalcText = function(){
    
    $('.calcText').empty()
    
    $('.calcText').append('<div class = "formula"></div>')
    $('.formula').append('<u>[0H-] * [HA]</u> = Kb' )
                 .append('<br> [A-] <br>')
    
    var ohText = $('.ohEnd').text()
    var acidText = $('.acidEnd').text()
    var baseText = $('.baseEnd').text()
    var Ka= Model().currentInfo['Ka']
    var Kw = Math.pow(10,-14)
    var Kb = Kw/Ka
    var pOH = Model().findPH(
                        Math.sqrt(baseInitial*Kb))
         
    $('.calcText').append('<div class = "kConversion"></div>')
    $('.kConversion').append('<br> Kb = Kw / Ka')
                 .append('<br>Kb = '+Kw+'/'+Ka)
                 .append('<br>Kb = ' +Kb)
        
    $('.calcText').append('<div class = "pluggedIn"></div>')
    $('.pluggedIn').append('<br><u>['+ohText+'] * ['+acidText+']</u> = '+ Kb)
                 .append('<br> ['+baseText+']')
                 .append('<br> Use the 5% assumption to simplify.')
         
    $('.calcText').append('<div class = "simplified"></div>')
    $('.simplified').append('<br>x<sup>2</sup> = '+ baseInitial*Kb)
                    .append('<br>[OH<sup>-</sup>] =' + Math.sqrt(baseInitial*Kb))
                    .append('<br>pOH =' + pOH.toFixed(3))
                    
                    .append('<br>pH = 14- pOH = ' + (14.0-pOH).toFixed(3))
}

return {'iceboxSetup':iceboxSetup, 'iceboxCalcText':iceboxCalcText, 'getEqInfo':getEqInfo}
}
$(document).ready(function(){
    $('.icebox').each(function(){
        icebox().iceboxSetup($(this), icebox().getEqInfo);});
        icebox().iceboxCalcText()
});