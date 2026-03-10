function generateRandomQuizValues() {
  document.getElementById("cutoff3").value = 0;
  document.getElementById("cutoff4").value = 0;
}

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

  if (!name.localeCompare("FR")) {
    freqResp();
    if (typeof updateFRLabels === "function") updateFRLabels();
  } else if (!name.localeCompare("SYS")) {
    syst();
    if (typeof updateSYSLabels === "function") updateSYSLabels();
  } else if (!name.localeCompare("MVG")) {
    mInit();
  } else if (!name.localeCompare("BLK1")) {
    generateRandomQuizValues();
    qInit();
    if (typeof updateBLK1Labels === "function") updateBLK1Labels();
  } else {
    qInit();
  }
}

var k;
var p;
var sigChoice;
var scaleChoice;
var delayChoice;
var boxChoice;
var yValues;
var inValues;

var global_q1_i1 = 40;
var global_q1_i2 = 20;
var global_q2_i1 = 40;
var global_q2_i2 = 20;
var sigChoice;
var scaleChoice;
var delayChoice;
var boxChoice;
var yValues;
var inValues;

// ------------------------------------------ LTI Frequency Response ----------------------------------------------------------

function freqResp() {
  var sel1 = document.getElementById("sig-names").value;
  sel1 = parseInt(sel1);
  var lc = document.getElementById("fre1").value;
  lc = parseFloat(lc);
  var hc = document.getElementById("fre2").value;
  hc = parseFloat(hc);

  if (sel1 == 6) {
    lc = Math.round(lc);
    document.getElementById("fre1").value = lc;
  }

  N = 1001;

  var sigValues = [];
  var phValues = [];
  var xValues = makeArr(-Math.PI, Math.PI, N);
  if (sel1 == 1) {
    for (var i = 0; i <= 1000; i++) {
      if (Math.abs(xValues[i]) <= lc) {
        sigValues.push(1);
      } else {
        sigValues.push(0);
      }
      phValues.push(0);
    }
  } else if (sel1 == 2) {
    for (var i = 0; i <= 1000; i++) {
      if (Math.abs(xValues[i]) <= lc) {
        sigValues.push(0);
      } else {
        sigValues.push(1);
      }
      phValues.push(0);
    }
  } else if (sel1 == 3) {
    if (lc > hc) {
      alert("Lower cutoff frequency must be less than or equal to higher cutoff frequency");
      return;
    }
    for (var i = 0; i <= 1000; i++) {
      if (
        Math.abs(xValues[i]) >= lc &&
        Math.abs(xValues[i]) <= hc
      ) {
        sigValues.push(1);
      } else {
        sigValues.push(0);
      }
      phValues.push(0);
    }
  } else if (sel1 == 4) {
    if (lc > hc) {
      alert("Lower cutoff frequency must be less than or equal to higher cutoff frequency");
      return;
    }
    for (var i = 0; i <= 1000; i++) {
      if (
        Math.abs(xValues[i]) >= lc &&
        Math.abs(xValues[i]) <= hc
      ) {
        sigValues.push(0);
      } else {
        sigValues.push(1);
      }
      phValues.push(0);
    }
  } else if (sel1 == 5) {
    for (var i = 0; i <= 1000; i++) {
      phValues.push(0);
      sigValues.push(lc);
    }
  } else {
    for (var i = 0; i <= 1000; i++) {
      phValues.push(-lc * xValues[i]);
      sigValues.push(1);
    }
  }

  var trace1 = {
    x: xValues,
    y: sigValues,
    type: "scatter",
    name: "magnitude",
    mode: "lines",
  };

  var trace2 = {
    x: xValues,
    y: phValues,
    type: "scatter",
    name: "phase",
    mode: "lines",
  };

  var data1 = [trace1];
  var data2 = [trace2];

  var config = { responsive: true };

  var layout1 = {
    title: "Magnitude Spectrum",
    showlegend: false,
    xaxis: {
      title: "Frequency (rad/sample)",
      range: [-Math.PI, Math.PI],
      autorange: false,
    },
    yaxis: {
      title: "Magnitude",
      range: [0, 1],
      autorange: false,
    },
  };

  var layout2 = {
    title: "Phase Spectrum",
    showlegend: false,
    xaxis: {
      title: "Frequency (rad/sample)",
      range: [-Math.PI, Math.PI],
      autorange: false,
    },
    yaxis: {
      title: "Phase",
    },
  };

  Plotly.newPlot("figure1", data1, layout1, config);

  if (screen.width < 769) {
    var update = {
      width: 0.9 * screen.width,
      height: 400,
    };
  } else {
    var update = {
      width: 500,
      height: 400,
    };
  }

  Plotly.relayout("figure1", update);
  Plotly.newPlot("figure2", data2, layout2, config);

  if (screen.width < 769) {
    var update = {
      width: 0.9 * screen.width,
      height: 400,
    };
  } else {
    var update = {
      width: 500,
      height: 400,
    };
  }

  Plotly.relayout("figure2", update);
}

// ------------------------------------------ LTI System Functions ----------------------------------------------------------

function fourier(waveform) {
  var N = waveform.length;
  var ft = [];

  for (var k = 0; k < N; k++) {
    var sum = math.complex(0, 0);
    for (var n = 0; n < N; n++) {
      sum = math.add(
        sum,
        math.multiply(
          waveform[n],
          math.complex(
            Math.cos((2 * Math.PI * k * n) / N),
            -Math.sin((2 * Math.PI * k * n) / N),
          ),
        ),
      );
    }
    ft.push(sum);
  }
  return ft;
}

function invFourier(waveform) {
  var N = waveform.length;
  var ft = [];

  for (var k = 0; k < N; k++) {
    var sum = math.complex(0, 0);
    for (var n = 0; n < N; n++) {
      sum = math.add(
        sum,
        math.complex(
          (math.re(waveform[n]) * Math.cos((2 * Math.PI * k * n) / N)) / N -
          (math.im(waveform[n]) * Math.sin((2 * Math.PI * k * n) / N)) / N,
          (math.re(waveform[n]) * Math.sin((2 * Math.PI * k * n) / N)) / N +
          (math.im(waveform[n]) * Math.cos((2 * Math.PI * k * n) / N)) / N,
        ),
      );
    }
    ft.push(sum);
  }
  return ft;
}
function shift(signal) {
  var N = signal.length;
  var cut = parseInt(N / 2);
  var out = [];
  for (var i = cut + 1; i < N; i++) {
    out.push(signal[i]);
  }
  for (var i = 0; i <= cut; i++) {
    out.push(signal[i]);
  }
  return out;
}

function syst() {
  var sel = document.getElementById("imp-names2").value;
  sel = parseFloat(sel);
  var sel1 = document.getElementById("sig-names2").value;
  sel1 = parseFloat(sel1);
  var lc = document.getElementById("cutoff1").value;
  lc = parseFloat(lc);
  var hc = document.getElementById("cutoff2").value;
  hc = parseFloat(hc);

  if ((sel1 == 3 || sel1 == 4) && lc > hc) {
    alert("Lower cutoff frequency must be less than or equal to higher cutoff frequency");
    Plotly.purge("figure3");
    Plotly.purge("figure4");
    Plotly.purge("figure5");
    return;
  }

  am = 1;
  freq = 0.3 * Math.PI;
  var sigValues = [];
  var yValues = [];

  if (sel == 1) {
    var xValues = makeArr(-100, 100, 201);
    for (var i = 0; i <= 200; i++) {
      sigValues.push(am * Math.sin(freq * xValues[i]));
    }
  } else if (sel == 2) {
    var xValues = makeArr(-100, 100, 201);
    for (var i = 0; i <= 200; i++) {
      sigValues.push(am * Math.cos(freq * xValues[i]));
    }
  } else if (sel == 3) {
    var total = 201;
    var xValues = makeArr(
      -parseInt((total - 1) / 2),
      parseInt((total - 1) / 2),
      total,
    );
    for (var i = 0; i <= total - 1; i++) {
      var c = parseInt(total / 3);
      if (i < c) {
        sigValues.push(0);
      } else if (i < 2 * c) {
        sigValues.push(am);
      } else {
        sigValues.push(0);
      }
    }
  } else {
    var total = 201;
    var xValues = makeArr(
      -parseInt((total - 1) / 2),
      parseInt((total - 1) / 2),
      total,
    );
    for (var i = 0; i <= total - 1; i++) {
      var c = parseInt(total / 3);
      if (i < c) {
        sigValues.push(0);
      } else if (i < 2 * c) {
        var rampMax = parseInt((total - 1) / 2);
        var normalizedRamp = (xValues[i] + rampMax) / (2 * rampMax);
        sigValues.push(am * normalizedRamp);
      } else {
        sigValues.push(0);
      }
    }
  }

  // Keep the original signal for calculations
  var originalSigValues = [...sigValues];

  var transOr = fourier(originalSigValues);
  var wValues = makeArr(-Math.PI, Math.PI, transOr.length);
  var ampSpec = [];
  var phSpec = [];
  for (var i = 0; i < transOr.length; i++) {
    ampSpec.push(
      math.sqrt(
        math.pow(math.re(transOr[i]), 2) + math.pow(math.im(transOr[i]), 2),
      ),
    );
    phSpec.push(math.atan2(math.im(transOr[i]), math.re(transOr[i])));
  }

  var maxAmpSpec = Math.max(...ampSpec.map(Math.abs));
  ampSpec = ampSpec.map((value) => value / maxAmpSpec);
  var filValues = [];
  var N_val = transOr.length;
  for (var i = 0; i < N_val; i++) {
    var f = (i < N_val / 2) ? (i * 2 * Math.PI / N_val) : ((i - N_val) * 2 * Math.PI / N_val);
    var absf = Math.abs(f);

    if (sel1 == 1) {
      if (absf <= lc) {
        filValues.push(1);
      } else {
        filValues.push(0);
      }
    } else if (sel1 == 2) {
      if (absf <= lc) {
        filValues.push(0);
      } else {
        filValues.push(1);
      }
    } else if (sel1 == 3) {
      if (absf >= lc && absf <= hc) {
        filValues.push(1);
      } else {
        filValues.push(0);
      }
    } else {
      if (absf >= lc && absf <= hc) {
        filValues.push(0);
      } else {
        filValues.push(1);
      }
    }
  }

  var outValues = math.dotMultiply(filValues, transOr);
  var ampSpecOut = [];
  var phSpecOut = [];
  for (var i = 0; i < outValues.length; i++) {
    ampSpecOut.push(
      math.sqrt(
        math.pow(math.re(outValues[i]), 2) + math.pow(math.im(outValues[i]), 2),
      ),
    );
    phSpecOut.push(math.atan2(math.im(outValues[i]), math.re(outValues[i])));
  }

  var sigValuesOut = invFourier(outValues);
  var sigRealOut = [];
  for (var i = 0; i < sigValuesOut.length; i++) {
    sigRealOut.push(math.re(sigValuesOut[i]));
  }

  // Do not normalize the original signal values for plotting so they match amplitude
  var maxSigValue = Math.max(...originalSigValues.map(Math.abs));
  var normalizedSigValues = originalSigValues;
  var normalizedSpectrumValue = ampSpecOut.map((value) => value / maxAmpSpec);

  var trace1 = {
    x: wValues,
    y: shift(ampSpec),
    type: "scatter",
    mode: "lines",
    name: "Original Spectrum",
  };
  var trace2 = {
    x: wValues,
    y: shift(filValues),
    type: "scatter",
    mode: "lines",
    name: "Filter",
  };
  var trace3 = {
    x: wValues,
    y: shift(normalizedSpectrumValue),
    type: "scatter",
    mode: "lines",
    name: "Filtered Spectrum",
  };
  var trace4 = {
    x: xValues,
    y: normalizedSigValues,
    type: "scatter",
    mode: "lines",
    name: "Original Signal",
  };
  var trace5 = {
    x: xValues,
    y: sigRealOut,
    type: "scatter",
    mode: "lines",
    name: "Filtered Signal",
  };
  var data1 = [trace1, trace2];
  var data2 = [trace3];
  var data3 = [trace4, trace5];

  var config = { responsive: true };

  var layout1 = {
    title: "Magnitude Spectrum",
    xaxis: {
      title: "Frequency (rad/sample)",
      range: [-Math.PI, Math.PI],
      autorange: false,
    },
    yaxis: {
      title: "Magnitude",
      range: [0, 1],
      autorange: false,
    },
    showlegend: true,
  };

  var layout2 = {
    title: "Time Domain",
    xaxis: {
      title: "Time",
    },
    yaxis: {
      title: "Amplitude",
    },
    showlegend: true,
  };

  Plotly.newPlot("figure3", data1, layout1, config);

  var update = {
    width: screen.width < 769 ? 0.9 * screen.width : 500,
    height: 400,
  };
  Plotly.relayout("figure3", update);
  Plotly.newPlot("figure4", data2, layout1, config);
  Plotly.relayout("figure4", update);
  Plotly.newPlot("figure5", data3, layout2, config);
  Plotly.relayout("figure5", update);
}
// ------------------------------------------ Quiz 1 ----------------------------------------------------------

function mInit() {
  global_q1_i2 = 10 + Math.floor(Math.random() * 20);
  global_q1_i1 = 40 + Math.floor(Math.random() * 20);
  var i2_m = 200 - global_q1_i2;
  var i1_m = 200 - global_q1_i1;
  var wValues = makeArr(-Math.PI, Math.PI, 201);
  var inValues = [];
  var outValues = [];
  for (var i = 0; i < 200; i++) {
    if (i == global_q1_i1 || i == global_q1_i2 || i == i1_m || i == i2_m) {
      inValues.push(1);
    } else {
      inValues.push(0);
    }

    if (i == global_q1_i1 || i == i1_m) {
      outValues.push(1);
    } else {
      outValues.push(0);
    }
  }
  var trace1 = {
    x: wValues,
    y: inValues,
    type: "scatter",
    name: "output",
    mode: "markers",
  };
  var trace2 = {
    x: wValues,
    y: outValues,
    type: "scatter",
    name: "output",
    mode: "markers",
  };
  var data1 = [trace1];
  var data2 = [trace2];

  var config = { responsive: true };

  var layout1 = {
    title: "Magnitude Spectrum",
    xaxis: {
      title: "Frequency (rad/sample)",
      range: [-Math.PI, Math.PI],
      autorange: false,
    },
    yaxis: {
      title: "Magnitude",
    },
  };

  Plotly.newPlot("figure6", data1, layout1, config);

  if (screen.width < 769) {
    var update = {
      width: 0.9 * screen.width,
      height: 400,
    };
  } else {
    var update = {
      width: 400,
      height: 400,
    };
  }

  Plotly.relayout("figure6", update);

  Plotly.newPlot("figure7", data2, layout1, config);

  if (screen.width < 769) {
    var update = {
      width: 0.9 * screen.width,
      height: 400,
    };
  } else {
    var update = {
      width: 400,
      height: 400,
    };
  }

  Plotly.relayout("figure7", update);
}

function mavg() {
  var sel1 = document.getElementById("sig-names3").value;
  sel1 = parseFloat(sel1);

  if (sel1 == 2) {
    var element = document.getElementById("result1");
    element.style.color = "#006400";
    element.style.fontWeight = "bold";
    element.innerHTML = "Right Answer!";
  } else {
    var element = document.getElementById("result1");
    element.style.color = "#FF0000";
    element.style.fontWeight = "bold";
    element.innerHTML = "Wrong Answer!";
  }
}

/* ----------------------------------------------- Quiz 2 --------------------------------- */

function qInit() {
  global_q2_i2 = 10 + Math.floor(Math.random() * 20);
  global_q2_i1 = 40 + Math.floor(Math.random() * 20);
  var i2_m = 200 - global_q2_i2;
  var i1_m = 200 - global_q2_i1;
  var wValues = makeArr(-Math.PI, Math.PI, 201);
  var inValues = [];
  var outValues = [];
  for (var i = 0; i < 200; i++) {
    if (i == global_q2_i1 || i == global_q2_i2 || i == i1_m || i == i2_m) {
      inValues.push(1);
    } else {
      inValues.push(0);
    }

    if (i == global_q2_i1 || i == i1_m) {
      outValues.push(1);
    } else {
      outValues.push(0);
    }
  }
  var trace1 = {
    x: wValues,
    y: inValues,
    type: "scatter",
    name: "output",
    mode: "markers",
  };
  var trace2 = {
    x: wValues,
    y: outValues,
    type: "scatter",
    name: "output",
    mode: "markers",
  };
  var data1 = [trace1];
  var data2 = [trace2];

  var config = { responsive: true };

  var layout1 = {
    title: "Magnitude Spectrum",
    xaxis: {
      title: "Frequency (rad/sample)",
      range: [-Math.PI, Math.PI],
      autorange: false,
    },
    yaxis: {
      title: "Magnitude",
    },
  };

  Plotly.newPlot("figure8", data1, layout1, config);

  if (screen.width < 769) {
    var update = {
      width: 0.9 * screen.width,
      height: 400,
    };
  } else {
    var update = {
      width: 500,
      height: 400,
    };
  }

  Plotly.relayout("figure8", update);

  Plotly.newPlot("figure9", data2, layout1, config);

  if (screen.width < 769) {
    var update = {
      width: 0.9 * screen.width,
      height: 400,
    };
  } else {
    var update = {
      width: 500,
      height: 400,
    };
  }

  Plotly.relayout("figure9", update);
}

function mavg1() {
  var sel1 = document.getElementById("sig-names4").value;
  sel1 = parseFloat(sel1);
  var lc = document.getElementById("cutoff3").value;
  lc = parseFloat(lc);
  var hc = document.getElementById("cutoff4").value;
  hc = parseFloat(hc);

  if (sel1 == 3 || sel1 == 4) {
    if (lc > hc) {
      alert("Lower cutoff frequency must be less than or equal to higher cutoff frequency");
      return;
    }
  }

  if (sel1 == 2) {
    var element = document.getElementById("result2");
    element.style.color = "#FF0000";
    element.style.fontWeight = "bold";
    element.innerHTML = "Wrong Answer!";
  } else {
    var wValues = makeArr(-Math.PI, Math.PI, 201);
    var i1_m = 200 - global_q2_i1;
    var i2_m = 200 - global_q2_i2;
    var f1 = wValues[i1_m];
    var f2 = wValues[i2_m];
    if (sel1 == 1) {
      if (lc >= f1 && lc <= f2) {
        var element = document.getElementById("result2");
        element.style.color = "#006400";
        element.style.fontWeight = "bold";
        element.innerHTML = "Right Answer!";
      } else {
        var element = document.getElementById("result2");
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = "Wrong Answer!";
      }
    } else if (sel1 == 3) {
      if (lc <= f1 && hc >= f1 && hc <= f2) {
        var element = document.getElementById("result2");
        element.style.color = "#006400";
        element.style.fontWeight = "bold";
        element.innerHTML = "Right Answer!";
      } else {
        var element = document.getElementById("result2");
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = "Wrong Answer!";
      }
    } else {
      if (lc >= f1 && lc <= f2 && hc >= f2) {
        var element = document.getElementById("result2");
        element.style.color = "#006400";
        element.style.fontWeight = "bold";
        element.innerHTML = "Right Answer!";
      } else {
        var element = document.getElementById("result2");
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = "Wrong Answer!";
      }
    }
  }
}

/* ---------------------------- LinSpace -------------------------------------- */

function makeArr(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + step * i);
  }
  return arr;
}

// ------------------------------------------ On startup ----------------------------------------------------------

function startup() {
  document.getElementById("default").click();
}

window.onload = startup;
