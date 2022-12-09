function openPart(evt, name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";
}

var k;
var p;
var sigChoice;
var scaleChoice;
var delayChoice;
var boxChoice;
var yValues;
var inValues;

// ------------------------------------------ LTI Frequency Response ----------------------------------------------------------

function freqResp(){

    var sel1 = document.getElementById("sig-names").value;
    sel1 = parseInt(sel1);
    var lc = document.getElementById("fre1").value;
    lc = parseFloat(lc);
    var hc = document.getElementById("fre2").value;
    hc = parseFloat(hc);

    N = 1001;

    var sigValues = [];
    var phValues = [];
    var xValues = makeArr(-Math.PI,Math.PI,N);
    if(sel1==1)
    {
        for (var i=0; i<=1000; i++)
        {
            if(Math.abs(xValues[i])<lc*Math.PI)
            {
                sigValues.push(1);
            }
            else
            {
                sigValues.push(0);
            }
            phValues.push(0);
        }
    }
    else if(sel1==2)
    {
        for (var i=0; i<=1000; i++)
        {
            if(Math.abs(xValues[i])<lc*Math.PI)
            {
                sigValues.push(0);
            }
            else
            {
                sigValues.push(1);
            }
            phValues.push(0);
        }
    }
    else if(sel1==3)
    {
        if(lc>hc)
        {
            var temp = hc;
            hc = lc;
            lc = temp;
        }
        for (var i=0; i<=1000; i++)
        {
            if(Math.abs(xValues[i])>lc*Math.PI && Math.abs(xValues[i])<hc*Math.PI)
            {
                sigValues.push(1);
            }
            else
            {
                sigValues.push(0);
            }
            phValues.push(0);
        }
    }
    else if(sel1==4)
    {
        if(lc>hc)
        {
            var temp = hc;
            hc = lc;
            lc = temp;
        }
        for (var i=0; i<=1000; i++)
        {
            if(Math.abs(xValues[i])>lc*Math.PI && Math.abs(xValues[i])<hc*Math.PI)
            {
                sigValues.push(0);
            }
            else
            {
                sigValues.push(1);
            }
            phValues.push(0);
        }
    }
    else if(sel1==5)
    {
        for (var i=0; i<=1000; i++)
        {
            phValues.push(0);
            sigValues.push(lc);
        }
    }
    else
    {
        for (var i=0; i<=1000; i++)
        {
            phValues.push(-lc*xValues[i]);
            sigValues.push(1);
        }
    }

    var trace1 = {
        x: xValues,
        y: sigValues,
        type: 'scatter',
        name: 'magnitude',
        mode: 'lines'
    };

    var trace2 = {
        x: xValues,
        y: phValues,
        type: 'scatter',
        name: 'phase',
        mode: 'lines'
    };
      
    var data1 = [trace1];
    var data2 = [trace2];

    var config = {responsive: true}

    var layout1 = {
        title: 'Magnitude Spectrum',
        showlegend: false,
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };

    var layout2 = {
        title: 'Phase Spectrum',
        showlegend: false,
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Phase'
        }
    };
      
    Plotly.newPlot('figure1', data1, layout1, config);
      var update = {
        width: 380,
        height: 300
    };
    Plotly.relayout('figure1', update);
    Plotly.newPlot('figure2', data2, layout2, config);
      var update = {
        width: 380,
        height: 300
    };
    Plotly.relayout('figure2', update);
}

// ------------------------------------------ LTI System Functions ----------------------------------------------------------

function fourier(waveform){
    var N = waveform.length;
    var ft = [];
    
    for(var k=0; k<N; k++)
    {
        var sum = math.complex(0,0);
        for(var n=0; n<N; n++)
        {
            sum = math.add(sum,(math.multiply(waveform[n],math.complex(Math.cos(2*Math.PI*k*n/N),-Math.sin(2*Math.PI*k*n/N)))));
        }
        if(math.re(sum)<1e-10)
        {
            var sum1 = math.complex(0,math.im(sum));
            sum = sum1;
        }
        if(math.im(sum)<1e-10)
        {
            var sum1 = math.complex(math.re(sum),0);
            sum = sum1;
        }
        ft.push(sum);
    }
    return ft;
}

function invFourier(waveform){
    var N = waveform.length;
    var ft = [];
    
    for(var k=0; k<N; k++)
    {
        var sum = math.complex(0,0);
        for(var n=0; n<N; n++)
        {
            sum = math.add(sum,math.complex(math.re(waveform[n])*Math.cos(2*Math.PI*k*n/N)/N - math.im(waveform[n])*Math.sin(2*Math.PI*k*n/N)/N,math.re(waveform[n])*Math.sin(2*Math.PI*k*n/N)/N + math.im(waveform[n])*Math.cos(2*Math.PI*k*n/N)/N));
        }
        if(math.re(sum)<1e-10)
        {
            var sum1 = math.complex(0,math.im(sum));
            sum = sum1;
        }
        if(math.im(sum)<1e-10)
        {
            var sum1 = math.complex(math.re(sum),0);
            sum = sum1;
        }
        ft.push(sum);
    }
    return ft;
}

function shift(signal){
    var N = signal.length;
    var cut = parseInt(N/2);
    var out = [];
    for(var i=cut+1; i<N; i++)
    {
        out.push(signal[i]);
    }
    for(var i=0; i<=cut; i++)
    {
        out.push(signal[i]);
    }
    return out;
}

function syst(){
    var sel = document.getElementById("imp-names2").value;
    sel = parseFloat(sel);
    var sel1 = document.getElementById("sig-names2").value;
    sel1 = parseFloat(sel1);
    var lc = document.getElementById("cutoff1").value;
    lc = parseFloat(lc);
    var hc = document.getElementById("cutoff2").value;
    hc = parseFloat(hc);
    am = 1;
    freq = 0.3;
    var sigValues = [];
    var sigValues1 = [];
    var yValues = [];

    if(sel==1)
    {
        var xValues = makeArr(-100,100,201);
        for (var i=0; i<=200; i++)
        {
            sigValues.push(am*Math.sin(freq*xValues[i]));
        }
    }
    else if(sel==2)
    {
        var xValues = makeArr(-100,100,201);
        for (var i=0; i<=200; i++)
        {
            sigValues.push(am*Math.cos(freq*xValues[i]));
        }
    }
    else if(sel==3)
    {
        var total = 201;
        var xValues = makeArr(-parseInt((total-1)/2),parseInt((total-1)/2),total);
        for (var i=0; i<=total-1; i++)
        {
            var c = parseInt(total/3);
            if(i<c)
            {
                sigValues.push(0);
            }
            else if(i<2*c)
            {
                sigValues.push(am*xValues[i]);
            }
            else
            {
                sigValues.push(0);
            }
        }
    }
    else
    {
        var total = 201;
        var xValues = makeArr(-parseInt((total-1)/2),parseInt((total-1)/2),total);
        for (var i=0; i<=total-1; i++)
        {
            var c = parseInt(total/3);
            if(i<c)
            {
                sigValues.push(0);
            }
            else if(i<2*c)
            {
                sigValues.push(am);
            }
            else
            {
                sigValues.push(0);
            }
        }
    }

    var transOr = fourier(sigValues);
    var trans = shift(transOr);
    var wValues = [];
    var N = sigValues.length;
    var ampSpec = [];
    var phSpec = [];
    wValues = makeArr(-Math.PI,Math.PI,N);
    for(var i=0; i<N; i++)
    {
        ampSpec.push(math.sqrt(math.pow(math.re(trans[i]),2)+math.pow(math.im(trans[i]),2)));
        phSpec.push(math.atan2(math.im(trans[i]),math.re(trans[i])));
    }

    var filValues = [];
    var filValues1 = [];
    if(sel1==2)
    {
        for (var i=0; i<=200; i++)
        {
            if(Math.abs(wValues[i])<lc*Math.PI)
            {
                filValues.push(1);
            }
            else
            {
                filValues.push(0);
            }
        }
    }
    else if(sel1==1)
    {
        for (var i=0; i<=200; i++)
        {
            if(Math.abs(wValues[i])<lc*Math.PI)
            {
                filValues.push(0);
            }
            else
            {
                filValues.push(1);
            }
        }
    }
    else if(sel1==3)
    {
        if(lc>hc)
        {
            var temp = hc;
            hc = lc;
            lc = temp;
        }
        for (var i=0; i<=200; i++)
        {
            if(Math.abs(wValues[i])>lc*Math.PI && Math.abs(wValues[i])<hc*Math.PI)
            {
                filValues.push(1);
            }
            else
            {
                filValues.push(0);
            }
        }
    }
    else
    {
        if(lc>hc)
        {
            var temp = hc;
            hc = lc;
            lc = temp;
        }
        for (var i=0; i<=1000; i++)
        {
            if(Math.abs(wValues[i])>lc*Math.PI && Math.abs(wValues[i])<hc*Math.PI)
            {
                filValues.push(0);
            }
            else
            {
                filValues.push(1);
            }
        }
    }

    if(sel1==1)
    {
        for (var i=0; i<=200; i++)
        {
            if(Math.abs(wValues[i])<lc*Math.PI)
            {
                filValues1.push(1);
            }
            else
            {
                filValues1.push(0);
            }
        }
    }
    else if(sel1==2)
    {
        for (var i=0; i<=200; i++)
        {
            if(Math.abs(wValues[i])<lc*Math.PI)
            {
                filValues1.push(0);
            }
            else
            {
                filValues1.push(1);
            }
        }
    }
    else if(sel1==3)
    {
        if(lc>hc)
        {
            var temp = hc;
            hc = lc;
            lc = temp;
        }
        for (var i=0; i<=200; i++)
        {
            if(Math.abs(wValues[i])>lc*Math.PI && Math.abs(wValues[i])<hc*Math.PI)
            {
                filValues1.push(1);
            }
            else
            {
                filValues1.push(0);
            }
        }
    }
    else
    {
        if(lc>hc)
        {
            var temp = hc;
            hc = lc;
            lc = temp;
        }
        for (var i=0; i<=1000; i++)
        {
            if(Math.abs(wValues[i])>lc*Math.PI && Math.abs(wValues[i])<hc*Math.PI)
            {
                filValues1.push(0);
            }
            else
            {
                filValues1.push(1);
            }
        }
    }

    var outValues = math.dotMultiply(filValues,transOr);
    var outValues = shift(outValues);
    var ampSpecOut = [];
    var phSpecOut = [];
    for(var i=0; i<N; i++)
    {
        ampSpecOut.push(math.sqrt(math.pow(math.re(outValues[i]),2)+math.pow(math.im(outValues[i]),2)));
        phSpecOut.push(math.atan2(math.im(outValues[i]),math.re(outValues[i])));
    }

    var sigValuesOut = invFourier(outValues);
    var sigRealOut = [];
    for(var i=0; i<N; i++)
    {
        sigRealOut.push(math.re(sigValuesOut[i]));
    }

    sigRealOut = shift(sigRealOut); 

    var trace1 = {
        x: wValues,
        y: ampSpec,
        type: 'scatter',
        name: 'output',
        mode: 'line'
    };
    var trace2 = {
        x: wValues,
        y: filValues1,
        type: 'scatter',
        name: 'output',
        mode: 'line'
    };
    var trace3 = {
        x: wValues,
        y: ampSpecOut,
        type: 'scatter',
        name: 'output',
        mode: 'line'
    };
    var trace4 = {
        x: xValues,
        y: sigValues,
        type: 'scatter',
        name: 'output',
        mode: 'line'
    };
    var trace5 = {
        x: xValues,
        y: sigRealOut,
        type: 'scatter',
        name: 'output',
        mode: 'line'
    };
    var data1 = [trace1,trace2];
    var data2 = [trace3];
    var data3 = [trace4,trace5];

    var config = {responsive: true}

    var layout1 = {
        title: 'Magnitude Spectrum',
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };

    var layout2 = {
        title: 'Time Domain',
        xaxis: {
            title: 'Time'
        },
        yaxis: {
            title: 'Amplitude'
        }
    };
      
    Plotly.newPlot('figure3', data1, layout1, config);
      var update = {
        width: 500,
        height: 300
    };
    Plotly.relayout('figure3', update);

    Plotly.newPlot('figure4', data2, layout1, config);
      var update = {
        width: 500,
        height: 300
    };
    Plotly.relayout('figure4', update);

    Plotly.newPlot('figure5', data3, layout2, config);
      var update = {
        width: 500,
        height: 300
    };
    Plotly.relayout('figure5', update);
}

// ------------------------------------------ Quiz 1 ----------------------------------------------------------

function mInit(){
    var wValues = makeArr(-Math.PI,Math.PI,201);
    var inValues = [];
    var outValues = [];
    for(var i=0; i<200; i++)
    {
        if(i==20 || i==40 || i==180 || i==160)
        {
            inValues.push(1);
        }
        else
        {
            inValues.push(0);
        }

        if(i==40 || i==160)
        {
            outValues.push(1);
        }
        else
        {
            outValues.push(0);
        }
    }
    var trace1 = {
        x: wValues,
        y: inValues,
        type: 'scatter',
        name: 'output',
        mode: 'markers'
    };
    var trace2 = {
        x: wValues,
        y: outValues,
        type: 'scatter',
        name: 'output',
        mode: 'markers'
    };
    var data1 = [trace1];
    var data2 = [trace2];

    var config = {responsive: true}

    var layout1 = {
        title: 'Magnitude Spectrum',
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };
      
    Plotly.newPlot('figure6', data1, layout1, config);
      var update = {
        width: 500,
        height: 400
    };
    Plotly.relayout('figure6', update);

    Plotly.newPlot('figure7', data2, layout1, config);
      var update = {
        width: 500,
        height: 400
    };
    Plotly.relayout('figure7', update);
}

function mavg(){
    
    var sel1 = document.getElementById("sig-names3").value;
    sel1 = parseFloat(sel1);

    if(sel1==2)
    {
        var element = document.getElementById("result1")
        element.style.color = "#006400";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Right Answer!';
    }
    else
    {
        var element = document.getElementById("result1")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Wrong Answer!';
    }
}

/* ----------------------------------------------- Quiz 2 --------------------------------- */

function qInit(){
    var wValues = makeArr(-Math.PI,Math.PI,201);
    var inValues = [];
    var outValues = [];
    for(var i=0; i<200; i++)
    {
        if(i==20 || i==40 || i==180 || i==160)
        {
            inValues.push(1);
        }
        else
        {
            inValues.push(0);
        }

        if(i==40 || i==160)
        {
            outValues.push(1);
        }
        else
        {
            outValues.push(0);
        }
    }
    var trace1 = {
        x: wValues,
        y: inValues,
        type: 'scatter',
        name: 'output',
        mode: 'markers'
    };
    var trace2 = {
        x: wValues,
        y: outValues,
        type: 'scatter',
        name: 'output',
        mode: 'markers'
    };
    var data1 = [trace1];
    var data2 = [trace2];

    var config = {responsive: true}

    var layout1 = {
        title: 'Magnitude Spectrum',
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };
      
    Plotly.newPlot('figure8', data1, layout1, config);
      var update = {
        width: 500,
        height: 400
    };
    Plotly.relayout('figure8', update);

    Plotly.newPlot('figure9', data2, layout1, config);
      var update = {
        width: 500,
        height: 400
    };
    Plotly.relayout('figure9', update);
}

function mavg1(){
    
    var sel1 = document.getElementById("sig-names4").value;
    sel1 = parseFloat(sel1);
    var lc = document.getElementById("cutoff3").value;
    lc = parseFloat(lc);
    lc = lc*Math.PI;
    var hc = document.getElementById("cutoff4").value;
    hc = parseFloat(hc);
    hc = hc*Math.PI;

    if(sel1==2)
    {
        var element = document.getElementById("result2")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Wrong Answer!';
    }
    else
    {
        var wValues = makeArr(-Math.PI,Math.PI,201);
        var f1 = wValues[160];
        var f2 = wValues[180];
        if(sel1==1)
        {
            if(lc>=f1 && lc<=f2)
            {
                var element = document.getElementById("result2")
                element.style.color = "#006400";
                element.style.fontWeight = "bold";
                element.innerHTML = 'Right Answer!';
            }
            else
            {
                var element = document.getElementById("result2")
                element.style.color = "#FF0000";
                element.style.fontWeight = "bold";
                element.innerHTML = 'Wrong Answer!';
            }
        }
        else if(sel1==3)
        {
            if(lc<=f1 && hc>=f1 && hc<=f2)
            {
                var element = document.getElementById("result2")
                element.style.color = "#006400";
                element.style.fontWeight = "bold";
                element.innerHTML = 'Right Answer!';
            }
            else
            {
                var element = document.getElementById("result2")
                element.style.color = "#FF0000";
                element.style.fontWeight = "bold";
                element.innerHTML = 'Wrong Answer!';
            }
        }
        else
        {
            if(lc>=f1 && lc<=f2 && hc>=f2)
            {
                var element = document.getElementById("result2")
                element.style.color = "#006400";
                element.style.fontWeight = "bold";
                element.innerHTML = 'Right Answer!';
            }
            else
            {
                var element = document.getElementById("result2")
                element.style.color = "#FF0000";
                element.style.fontWeight = "bold";
                element.innerHTML = 'Wrong Answer!';
            }
        }
    }
}

/* ---------------------------- LinSpace -------------------------------------- */

function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
}

// ------------------------------------------ On startup ----------------------------------------------------------

function startup()
{
    freqResp();
    syst();
    mInit();
    qInit();
    document.getElementById("default").click();
}

window.onload = startup;