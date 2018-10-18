var benchmark = document.getElementById("benchmark1");
var play = document.getElementById("play");


function show(element) {
    console.log(element);
    if (element == "game") {
        document.getElementById("bench").className = "";
        document.getElementById("game").className = "active";
        document.getElementById("benchmark1").className = "tab-pane fade";
        document.getElementById("play").className = "tab-pane fade in active";

    } else if (element == "bench") {
        document.getElementById("game").className = "";
        document.getElementById("bench").className = "active";
        document.getElementById("play").className = "tab-pane fade";
        document.getElementById("benchmark1").className = "tab-pane fade in active";


        /*    for (var i = 0; i < tabContents.length; i++) {
                tabContents[i].style.display = 'none';
            }

            var tabContentIdToShow = element.id.replace(/(\d)/g, '-$1');
            document.getElementById(tabContentIdToShow).style.display = 'block';*/
    } else {
        document.getElementById("bench").className = "";
        document.getElementById("game").className = "active";
        benchmark.className = "tab-pane fade";
        play.className = "tab-pane fade in active";
    }

}

function openTab(value) {
    console.log(value);
    var tabcontents = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
    }
    if(value=="game")
        {
            document.getElementById("play").style.display = 'block';
        }
    else if(value=="bench")
    {
        document.getElementById("play").style.display = 'none';
        document.getElementById("benchmark1").style.display = 'block';
        
    }

}