var acidInitial = 0
var hInitial = 0
var baseInitial = 0

var iceboxSetup = function(div){
    $(div).append('<table class=table></table>')
    $('.table').append("<tr class = 'row1'></tr><tr class = 'row2'></tr><tr class = 'row3'></tr><tr class = 'row4'></tr>"
                      )
    $('.row1').append("<td></td><td>HA</td><td>H<sub>2</sub>O</td><td>H<sub>3</sub>O<sup>+</sup></td><td>A<sup>-</sup></td>"
                     )
    $('.row2').append("<td>Initial</td><td>" + acidInitial +"</td><td>Irrelevant</td><td>"+hInitial+"</td><td>"+baseInitial+"</td>"
                     )
     $('.row3').append("<td>Change</td><td>-x</td><td>Irrelevant</td><td>+x</td><td>+x</td>"
                      )
      $('.row4').append("<td>End</td><td>" + acidInitial +" -x</td><td>Irrelevant</td><td>"+hInitial+" + x</td><td>"+baseInitial+" + x</td>"
                       )
}

$(document).ready(function(){
    $('.icebox').each(function(){
        iceboxSetup($(this));});
});