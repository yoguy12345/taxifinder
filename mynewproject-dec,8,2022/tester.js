// function that builds a grid in the "container"
var passengers = [];
var gridsize = 8;
var startinglocation = "7-0";
var del = 0;
var bin = 0;

function createGrid(x) {
    bin=0;
    for (var rows = 0; rows < x; rows++) {
        for (var columns = 0; columns < x; columns++) {
            var myid = String(rows) + "-"+ String(columns);
            //console.log(myid);
            var thisgrid = jQuery('<div>', {
                id: myid,
                class: 'grid'
            })
            thisgrid.appendTo('#container');
        };
    };
    $(".grid").width(960/x);
    $(".grid").height(960/x);

    startinglocation = String(x-1) + "-"+ String(0);
    var starter ="#"+startinglocation;
    $(starter).css("background-color", "yellow");
    console.log($(starter).css("background-color"));
};

// function that clears the grid
function clearGrid(){
    $(".grid").remove();
};  

// function that prompts the user to select the number of boxes in a new grid
// the function then also creates that new grid
function refreshGrid(){
    var z = prompt("How many boxes per side?");
    gridsize = z;
    startinglocation = String(z-1)+"-"+String(0);
    clearGrid();
    createGrid(z);
};

function getpassengers(){
    var passengers2 = [...passengers];
    var currentval = strtonum(startinglocation,"-");
   console.log("1");
   var mindistance = -1;
   while(passengers.length>0){
    console.log("2");
    //console.log(passengers);
    //console.log(currentval);
    mindistance = findnearestone(currentval);
    console.log("mindistance = " + mindistance);
    currentval = passengers[mindistance];
    passengers.splice(mindistance,1);
   }
   if(bin==1){
    passengers = passengers2;
    console.log("passengers = " + passengers);
    bin=0;
    getpassengers();
   }
}


function findnearestone(currentval){
    var mindistance = 0;
    if(bin==0){
        console.log("3");
        for(var i=0;i<passengers.length;i++){
            if(finddistance(passengers[i],currentval) < finddistance(passengers[mindistance],currentval)){
                mindistance=i
            }
        }
        console.log("4");
        constructpath(currentval,passengers[mindistance])
        return mindistance
    }else{
        console.log("n1");
        console.log("currentval= " + currentval);
        var newlist = [currentval];
        var valstochange = [];
        //console.log(passengers.includes(0));
        while(different(newlist,passengers)){
            newlist = getnextlist(newlist);
            valstochange = hashstringconverter(newlist)
            rowchange(valstochange,"green");
        }
        mindistance = which(newlist,passengers);
        //constructpath(currentval,passengers[mindistance])
        return mindistance;
    }
}

function hashstringconverter(newlist){
    var string = ""
    var valstochange = [];
    for(var i=0;i<newlist.length;i++){
        string = "#" + newlist[i][0] + "-" + newlist[i][1];
        valstochange.push(string);
    }
    return valstochange;
}

function getnextlist(newlist){
    var list1 = [];
    var list2 = [];
    console.log("n2");
    for(var i=0;i<newlist.length;i++){
        list2 = movedirections(newlist[i]);
        console.log("list2 = " + list2);
        //list2 = newlist;
        list1 = [...list1,...list2];
        list1 = setify(list1);
        console.log("list1 " + list1);
    }
    console.log("final list1 " + list1);
    return list1;
}

function setify(list1){
    list1 = list1.map(String);
    list1 = [... new Set(list1)];
    var list2=[];
    for(var i=0;i<list1.length;i++){
        list2.push(strtonum(list1[i],","));
    }
    return list2;
}


function movedirections(i){
    //console.log("move list = "+ i);
    var list2=[];
    var y = i[0];
    var x = i[1];

    if(x+1 < gridsize){
       list2.push([y,x+1]); 
    }
    if(y+1 < gridsize){
        list2.push([y+1,x]);
     }
    if(0<=(x-1)){
        list2.push([y,x-1]); 
    }
    if(0<=(y-1)){
        list2.push([y-1,x]);
    }
    //console.log("move list = "+ list2);
    return list2;
}

function which(list2,list1){
    console.log("list1 =" + list1);
    console.log("list2 =" + list2);
    for(var i=0;i<list1.length;i++){
        for(var j=0;j<list2.length;j++){
            if(JSON.stringify(list1[i]) == JSON.stringify(list2[j])){
                return i;
            }
        }
    }
    return -1;
}

function different(list1,list2){
    console.log("n3");
    console.log(list2);
    for(var i = 0;i<list1.length;i++){
        console.log("inner loop");
        for(var j = 0;j<list2.length;j++){
            if(JSON.stringify(list1[i])==JSON.stringify(list2[j])){
                return false;
            }
        }
    }
    return true;
}

function finddistance(list1,list2){
    var dist= Math.abs(list1[0]-list2[0]) + Math.abs(list1[1]-list2[1]);
    return dist;
}

function inrangex(x){
    return x>=0 & x<=gridsize;
}

function inrangey(y){
    return y>=0 & y<=gridsize;
}

function strtonum(str,val){
    var ind = str.indexOf(val)
    var y = parseInt(str.substring(0,ind));
    var x = parseInt(str.substring(ind+1));
    return [y,x];
}

function change(valstochange,color){
    console.log(valstochange);
    var changer;
    for (var i = 0; i < valstochange.length; i++) {
        //$(valstochange[i]).css("background-color", "red");
        del += 200
        changer = valstochange[i];
        if(!($(changer).css("background-color")=="rgb(0, 0, 0)")){
            $(changer).delay(del).animate({ backgroundColor: color},500);
        }
    }
}

function rowchange(valstochange,color){
    console.log(valstochange);
    var changer;
    for (var i = 0; i < valstochange.length; i++) {
        //$(valstochange[i]).css("background-color", "red");
        changer = valstochange[i];
        if((!($(changer).css("background-color")=="rgb(0, 0, 0)") && !($(changer).css("background-color")=="rgb(255, 255, 0)") && !($(changer).css("background-color")=="rgb(255, 0, 0)"))){
            $(changer).delay(del).animate({ backgroundColor: color},500);
        }
    }
    del += 200
}

function constructpath(list1,list2){
    var sy = list1[0]
    var sx = list1[1]
    var py = list2[0]
    var px = list2[1]
    var valstochange = [];
    var x=sx;
    if(px>sx){
        x=sx+1;
        while(x<px){
            valstochange.push("#" + String(sy) + "-" + String(x));
            x++;
        }
    }
    if(px<sx){
        x=sx-1;
        while(x>px){
            valstochange.push("#" + String(sy) + "-" + String(x));
            x--;
        }
    }
    var y=sy;
    if(py>sy){
        if(x==sx){
        var y= sy+1;
        }else{
        var y= sy; 
        }
        while(y<py){
            valstochange.push("#" + String(y) + "-" + String(x));
            y++;
        }
    }
    if(py<sy){
        if(x==sx){
            var y= sy-1;
            }else{
            var y= sy; 
            }
        while(y>py){
            valstochange.push("#" + String(y) + "-" + String(x));
            y--;
        }
    }
    if(valstochange.includes("#" + String(py) + "-" + String(px))){
        valstochange.splice(valstochange.indexOf("#" + String(py) + "-" + String(px)),1);
    }
    if(valstochange.includes("#" + String(sy) + "-" + String(sx))){
        valstochange.splice(valstochange.indexOf("#" + String(sy) + "-" + String(sx)),1);
    }
    
    change(valstochange,"red");
    
}

$(document).ready(function() {
    createGrid(8);

    $(".grid").click(function() {
        $(this).css("background-color", "black");
        console.log($(this).attr("id"));
        passengers.push(strtonum($(this).attr("id"),"-"));
        });

    $(".newGrid").click(function() {
        refreshGrid();

        $(".grid").click(function() {
        $(this).css("background-color", "black");
        console.log($(this).attr("id"));
        passengers.push(strtonum($(this).attr("id"),"-"));
        });
    });
    $(".findpassengers").click(function() {
         getpassengers();
    });
    $(".check1").click(function() {
        console.log("bin = 1");
        bin=1;
    });
});
