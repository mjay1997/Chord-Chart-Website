let chromatic_notes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
let chord_name = document.querySelector(".chord_name");
let tonic_button = document.querySelectorAll(".tonic_button");
let harmony_button = document.querySelectorAll(".harmony_button");
let dots = document.querySelectorAll(".dot");
let open_fret = document.querySelectorAll(".open_fret");
let fret_number = document.querySelector(".fret_number");
let string_labels = document.querySelectorAll(".string_label");
let tonic_name = "";
let harm_name = "";
let prev_chord = [];

// -------------------------------------------------------------------------------------------------------

// event listener for user interface
// the listeres check that both buttons have been clicked, and then implements the UI
function general_button() {
  let check = check_buttons();
  if (check) {
    build_chart();
  } else {
    reset_chart();
  }
}

tonic_button.forEach((tonic_button) => {
  tonic_button.addEventListener("click", () => {
    general_button();
  });
});

harmony_button.forEach((harmony_button) => {
  harmony_button.addEventListener("click", () => {
    general_button();
  });
});

// -------------------------------------------------------------------------------------------------------

function tonic(id) {
  // only allow one top button to be pressed and return the tonic name that the user selected
  let button = document.getElementById(id);
  tonic_name = button.id;

  if (button.className == "general_button tonic_button clicked") {
    tonic_button.forEach((tonic_button) => {
      tonic_button.classList.remove("clicked");
    });
  } else {
    tonic_button.forEach((tonic_button) => {
      tonic_button.classList.remove("clicked");
    });
    button.classList.add("clicked");
  }

  return tonic_name;
}

function harmony(id) {
  // only allow one bottom button to be pressed and return the harmony name that the user selected
  let button = document.getElementById(id);
  harm_name = button.id;

  if (button.className == "general_button harmony_button clicked") {
    harmony_button.forEach((harmony_button) => {
      harmony_button.classList.remove("clicked");
    });
  } else {
    harmony_button.forEach((harmony_button) => {
      harmony_button.classList.remove("clicked");
    });
    button.classList.add("clicked");
  }

  return harm_name;
}

function calc_max(array) {
  // go thru the entire array and find the highest number, return that value
  let prev_num = 0;
  for (let i = 0; i < array.length; i++) {
    if (typeof array[i] === "number") {
      if (array[i] > prev_num) {
        prev_num = array[i];
      }
    }
  }

  return prev_num;
}

function calc_min(array) {
  // go thru the entire array and find the lowest number, ignoring zeros, return that value
  let prev_num = 1000;
  for (let i = 0; i < array.length; i++) {
    if (typeof array[i] === "number") {
      if (array[i] < prev_num && array[i] != 0) {
        prev_num = array[i];
      }
    }
  }

  return prev_num;
}

function calc_span(array) {
  // find the difference the highest and lowest chord in the progression, return the span
  let max = calc_max(array);
  let min = calc_min(array);

  span = max - min;

  return span;
}

function count_freted(chart_code) {
  let fret_count = 0;
  for (let i = 0; i < chart_code.length; i++) {
    if (typeof chart_code[i] === "number" && chart_code[i] != 0) {
      fret_count++;
    }
  }

  return fret_count;
}

function offset_array(chart_code) {
  // offsets the chart code to make sense on the chart. If the max number of the chart code
  // is higher than 4, the entire array gets shifted by the offset. The offset is 1 - the smallest
  // num in the array. Then the fret number is changed to reflext where the chord is on the fretboard

  // chart_code - an array showing which frets should be active on the fretboard

  // get max, min and offset
  let max_num = calc_max(chart_code);
  let min_num = calc_min(chart_code);
  let offset = 1 - min_num;
  if (max_num > 4) {
    // change the fret number
    fret_number.textContent = "fr" + min_num;
    for (let i = 0; i < chart_code.length; i++) {
      // go thru the entire array and move each element by the offset
      if (typeof chart_code[i] === "number" && chart_code[i] != 0) {
        chart_code[i] += offset;
      }
    }
  } else {
    // keep the fret number as 1 if the max number is lower than 4
    fret_number.textContent = "fr" + 1;
  }

  // return the new chart code, that has been offset
  return chart_code;
}

function build_tuning() {
  // goes thru the string names and saves them into a tuning array

  let tuning = [];
  string_labels.forEach((string_labels) => {
    tuning = tuning.concat(string_labels.innerText);
  });

  return tuning;
}

function build_str(starting_note) {
  // takes the notes array, and reorders it according to a differernt starting note

  // chromatic notes - the chromatic scale starting from C and going to B
  let index = chromatic_notes.indexOf(starting_note);
  let before = chromatic_notes.slice(0, index);
  let after = chromatic_notes.slice(index);
  chromatic_notes.splice(index, starting_note);
  reorderedarray = after.concat(before);
  s_array = reorderedarray.concat(reorderedarray[0]);

  return s_array;
}

function build_chord(tonic, harm) {
  // takes the tonic and harm and builds the chord using intervals

  // key - chromatic scale starting from the tonic note
  // c_notes - array with note names for the specific chord
  // EXAMPLE: tonic = "C", harm = "maj"
  //          1. the key will be built from the tonic note
  //          2. the harm is matched up (in this case, if harm = " ", that means major)
  //          3. c_notes will be [key[0], key[4], key[7]]
  //             where key[0] = "C", key[4] = "E", key[7] = "G"
  //          4. return c_notes

  let key = build_str(tonic);
  let c_notes = [];
  if (harm == " major") {
    c_notes = [key[0], key[4], key[7]];
  } else if (harm == "7") {
    c_notes = [key[0], key[4], key[7], key[10]];
  } else if (harm == "maj7") {
    c_notes = [key[0], key[4], key[7], key[11]];
  } else if (harm == "add9") {
    c_notes = [key[0], key[4], key[7], key[2]];
  } else if (harm == "sus4") {
    c_notes = [key[0], key[5], key[7]];
  } else if (harm == "m") {
    c_notes = [key[0], key[3], key[7]];
  } else if (harm == "m7") {
    c_notes = [key[0], key[3], key[7], key[10]];
  } else if (harm == "mMaj7") {
    c_notes = [key[0], key[3], key[7], key[11]];
  } else if (harm == "m9") {
    c_notes = [key[0], key[3], key[7], key[2]];
  } else if (harm == "m11") {
    c_notes = [key[0], key[3], key[7], key[5]];
  } else if (harm == "dim7") {
    c_notes = [key[0], key[3], key[6], key[10]];
  } else if (harm == "aug") {
    c_notes = [key[0], key[4], key[8]];
  }

  return c_notes;
}

function check_comprehensive(fret_array) {
  // makes sure that the chart code has all the notes that the chord should have
  // the function goes thru the fret_array and counts how many of each interval are present
  // if all the intervals are present, the functions returns true

  // fret_array - array of the intervals present in the chord

  let tonic = tonic_name;
  let harm = harm_name;
  let c_notes = build_chord(tonic, harm);
  let check = false;
  let c_1 = 0;
  let c_2 = 0;
  let c_3 = 0;

  // counts the intervals if the harmony should have 4 different intervals
  if (c_notes.length == 4) {
    for (let i = 0; i < fret_array.length; i++) {
      if (fret_array[i] == 1) {
        c_1++;
      } else if (fret_array[i] == 2) {
        c_2++;
      } else if (fret_array[i] == 3) {
        c_3++;
      }
    }

    // check is true if all intervals are present
    if (c_1 > 0 && c_2 > 0 && c_3 > 0) {
      check = true;
    }

    // counts the intervals if the harmony should have 3 different intervals
  } else {
    for (let i = 0; i < fret_array.length; i++) {
      if (fret_array[i] == 1) {
        c_1++;
      } else if (fret_array[i] == 2) {
        c_2++;
      }
    }

    // check is true if all intervals are present
    if (c_1 > 0 && c_2 > 0) {
      check = true;
    }
  }

  return check;
}

function check_muted(chart_code) {
  // function that checks if the chart code has a muted string in it
  let muted_count = 0;

  // goes thru the chart_code and counts all the muted strings
  for (let i = 0; i < chart_code.length; i++) {
    if (typeof chart_code[i] !== "number") {
      muted_count++;
    }
  }

  // if there were muted strings, return true, else return false
  if (muted_count > 0) {
    return true;
  } else {
    return false;
  }
}

function check_thumb(chart_code) {
  // uses the chart code to figure out if the shape should use the users thumb
  // returns false if the shape doesnt need the thumb and true if it does
  let min_num = calc_min(chart_code);
  let muted = check_muted(chart_code);
  let fret_count = count_freted(chart_code);

  if (fret_count < 4) {
    return false;
  }

  if (typeof chart_code[0] !== "number") {
    return false;
  } else if (chart_code[0] == min_num && muted) {
    return true;
  } else {
    return false;
  }
}

function check_common_barre(chart_code) {
  // takes a chart_code and checks if it matches any of the common barre chords

  // all templates for common chord shapes. These shapes also help with edge cases
  // that arent caught in the barre check function
  const barre_chord_1 = [0, 2, 2, 1, 0, 0]; // major chord
  const barre_chord_2 = [0, 2, 2, 0, 0, 0]; // minor chord
  const barre_chord_3 = ["b", 0, 2, 2, 2, 0]; // second major shape
  const barre_chord_4 = ["b", 0, 2, 2, 1, 0]; // second minor shape
  const barre_chord_5 = ["b", 1, 0, 1, 1, 1]; // 9 chord
  const barre_chord_6 = [0, "b", 0, 0, 0, 0]; // hendrick minor chord
  const barre_chord_7 = [0, 2, 0, 1, 0, 0]; // 7 chord
  const barre_chord_8 = [0, 2, 1, 1, 0, 0]; // maj7 chord
  const barre_chord_9 = [0, 2, 0, 0, 0, 0]; //m7 chord
  const barre_chord_10 = ["b", "b", 2, 1, 0, 0]; //third major shape
  const barre_chord_array = [
    barre_chord_1,
    barre_chord_2,
    barre_chord_3,
    barre_chord_4,
    barre_chord_5,
    barre_chord_6,
    barre_chord_7,
    barre_chord_8,
    barre_chord_9,
    barre_chord_10,
  ];

  // repeat the offsets as many times as needed, 20 should do for now
  let counter = 0;
  while (counter < 20) {
    // go thru each chord shape in the barre_chord_array
    for (let i = 0; i < barre_chord_array.length; i++) {
      // loop thru the selected common barre chord shape
      for (let j = 0; j < barre_chord_array[i].length; j++) {
        if (typeof barre_chord_array[i][j] === "number") {
          // add one to each element in the shape, unless is a blank element
          barre_chord_array[i][j]++;
        }
      }

      // check if offset chord shape is equal to the chart code, if it is, return true
      if (check_arrays_equal(barre_chord_array[i], chart_code)) {
        return true;
      }
    }
    counter++;
  }

  // return false if none of the shapes match
  return false;
}

function check_barre(chart_code) {
  // takes the chart code array and checks if the shape should be using a barre

  // check if the shape already fits in a common barre shape
  if (check_common_barre(chart_code)) {
    return true;
  }

  var fret_dictionary = {};
  var existing_fret = [];
  let muted_fret = false;
  for (let i = 0; i < chart_code.length; i++) {
    if (typeof chart_code[i] === "number" && chart_code[i] != 0) {
      if (!existing_fret.includes(chart_code[i])) {
        existing_fret = existing_fret.concat(chart_code[i]);
        fret_dictionary[chart_code[i]] = 1;
      } else {
        fret_dictionary[chart_code[i]]++;
      }
    } else {
      muted_fret = true;
    }
  }

  if (muted_fret) {
    for (let i = 0; i < chart_code.length; i++) {
      if (!(i == 0 || i == chart_code.length - 1)) {
        if (typeof chart_code[i] !== "number") {
          return false;
        }
      }
    }
  }

  for (key in fret_dictionary) {
    if (fret_dictionary[key] > 2) {
      return true;
    }
  }

  return false;
}

function assign_finger(chart_code) {
  // takes a chart_code and assigns the fingers to each fret

  let min_num = calc_min(chart_code);
  let thumb = check_thumb(chart_code);
  let barre = check_barre(chart_code);
  let fret_count = count_freted(chart_code);

  let finger_chart = [];
  for (let i = 0; i < chart_code.length; i++) {
    if (typeof chart_code[i] === "number" && chart_code[i] != 0) {
      finger_chart = finger_chart.concat(1);
    } else {
      finger_chart = finger_chart.concat("x");
    }
  }

  if (barre) {
    console.log("barre_chord");
    return;
  } else if (fret_count > 5) {
    console.log("impossible");
    return;
  }

  let fingers = [];
  if (thumb) {
    fingers = ["t", "i", "m", "r", "p"];
    if (fret_count > 5) {
      console.log("Impossible");
      return;
    }
  } else {
    fingers = ["i", "m", "r", "p"];
    if (fret_count > 4) {
      console.log("Impossible");
      return;
    }
  }

  function check_finger_chart(finger_chart) {
    let count = 0;
    for (let i = 0; i < finger_chart.length; i++) {
      if (typeof finger_chart[i] !== "number") {
        count++;
      }
    }

    if (count == chart_code.length) {
      return true;
    } else {
      return false;
    }
  }

  let check = check_finger_chart(finger_chart);
  let index = 0;
  while (!check) {
    for (let i = 0; i < chart_code.length; i++) {
      if (chart_code[i] == min_num) {
        finger_chart[i] = fingers[index];
        index++;
      }
    }
    check = check_finger_chart(finger_chart);
    min_num++;
  }

  console.log(thumb);
  return finger_chart;
}

function reset_chart(reset_type = " ") {
  // resets the chart to default appearance, used on the reset button

  // if reset_type is button, that means that function is coming from the
  // reset button.
  if (reset_type === "button") {
    // remove the clicked class from tonic and harmony buttons
    tonic_button.forEach((tonic_button) => {
      tonic_button.classList.remove("clicked");
    });

    harmony_button.forEach((harmony_button) => {
      harmony_button.classList.remove("clicked");
    });
  }

  // reset the chord name and fret number to default values
  chord_name.style.color = "transparent";
  fret_number.textContent = "fr1";

  // remove the active, muted and open fret apperances
  dots.forEach((dots) => {
    dots.classList.remove("active");
  });

  open_fret.forEach((open_fret) => {
    open_fret.classList.remove("muted");
    open_fret.classList.remove("open");
  });

  // reset the color on the string names
  string_labels.forEach((string_labels) => {
    string_labels.style.color = "var(--main_text_color)";
  });
}

function reset_tuning() {
  // resets the tuning of the chart back to standard tuning, for the reset tuning button
  // eventually, the button should reset to the tuning that the user selected for the
  // chart
  let standard_tuning = ["E", "A", "D", "G", "B", "E"];
  let array_counter = 0;

  // reset the chart to avoid bugs
  reset_chart("button");

  // go thru each string label and reset the text to standard tuning
  string_labels.forEach((string_labels) => {
    string_labels.textContent = standard_tuning[array_counter];
    array_counter++;
  });
}

function build_chart() {
  // this is the algo that builds the chart. The function finds the tuning of the guitar,
  // then it finds where the tonic is on each of the first three strings. It picks a random
  // first string to start on, and then goes thru a loop to build a random chord chart. As the
  // chart is random, the chord shape is often impossible, so the shape is brought thru a check function
  // and as soon as the shape is confirmed to be possible, it is displayed

  // reset the chart
  reset_chart();

  // find the tuning of the guitar
  let strings_chromatic = [];
  let tuning = build_tuning();
  for (let i = 0; i < 6; i++) {
    strings_chromatic[i] = build_str(tuning[i]);
  }

  // check where the tonic is on the first three strings
  let first_fret = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < strings_chromatic[i].length; j++) {
      if (strings_chromatic[i][j] == tonic_name) {
        first_fret = first_fret.concat(j);
        break;
      }
    }
  }

  let check = 0;
  while (check == 0) {
    // build the beginning of the chart based off of the random starting string
    let c_notes = build_chord(tonic_name, harm_name);
    let rand_tonic = Math.floor(Math.random() * 3);
    var chart_code = [];
    if (rand_tonic == 0) {
      chart_code[0] = first_fret[0];
    } else if (rand_tonic == 1) {
      chart_code[0] = "b";
      chart_code[1] = first_fret[1];
    } else if (rand_tonic == 2) {
      chart_code[0] = "b";
      chart_code[1] = "b";
      chart_code[2] = first_fret[2];
    }

    // create rand num array that has all intervals present (using check comprehensive)
    let c_length = chart_code.length;
    comp_check = false;
    while (comp_check == false) {
      var fret_array = [];
      if (c_length != 0) {
        for (let i = 0; i < 6 - c_length; i++) {
          rand_num = Math.floor(Math.random() * (c_notes.length + 1));
          fret_array = fret_array.concat(rand_num);
          comp_check = check_comprehensive(fret_array);
        }
      }
    }

    // build chart code following the random intervals from the array
    for (let i = 0; i < 6 - c_length; i++) {
      if (fret_array[i] == c_notes.length) {
        chart_code = chart_code.concat("b");
      } else {
        for (let j = 0; j < strings_chromatic[c_length].length; j++) {
          if (
            strings_chromatic[chart_code.length][j] == c_notes[fret_array[i]]
          ) {
            chart_code = chart_code.concat(j);
            break;
          }
        }
      }
    }

    // check the span and stretch number of the chord chart, if it's possible, the chord chart is allowed
    span = calc_span(chart_code);
    stretch = check_stretch(chart_code);
    if (span < 4 && stretch <= 4) {
      // check that the shape hasn't already been showed
      if (prev_chord.length == 0) {
        check = 1;
      } else if (!check_arrays_equal(prev_chord, chart_code)) {
        check = 1;
      }
    }
  }

  // if the shape passes all tests, its saved as prev_chord, to ensure that it's not shown twice
  // in a row
  if (prev_chord.length >= chart_code.length) {
    prev_chord = [].concat(chart_code);
  } else {
    prev_chord = prev_chord.concat(chart_code);
  }

  // adjust the chart and fret number to display the chart properly
  console.log(assign_finger(chart_code));
  chart_code = offset_array(chart_code);

  // display the chord chart
  chord_name.style.color = "var(--main_text_color)";
  chord_name.textContent = tonic_name + harm_name;
  string_1 = document.querySelectorAll("#string_1");
  string_2 = document.querySelectorAll("#string_2");
  string_3 = document.querySelectorAll("#string_3");
  string_4 = document.querySelectorAll("#string_4");
  string_5 = document.querySelectorAll("#string_5");
  string_6 = document.querySelectorAll("#string_6");
  string_array = [string_1, string_2, string_3, string_4, string_5, string_6];
  for (let i = 0; i < 6; i++) {
    if (typeof chart_code[i] === "number" && chart_code[i] != 0) {
      string_array[i][chart_code[i]].classList.add("active");
    } else if (typeof chart_code[i] === "number" && chart_code[i] == 0) {
      string_labels[i].style.color = "transparent";
      string_array[i][0].classList.add("open");
    } else if (chart_code[i] === "b") {
      string_labels[i].style.color = "transparent";
      string_array[i][0].classList.add("muted");
    }
  }
}

function shuffle() {
  // used to shuffle the progression, used on the shuffle button
  let check = check_buttons();

  if (check) {
    build_chart();
  }
}

function change_string(id) {
  // allows the user to change the tuning of the string by double
  // clicking on the string label

  // doesnt allow the user to change tuning if the chart is already filled
  let check = check_buttons();
  if (check) {
    return;
  }

  // selected the string label that was clicked and saves it orginal text info
  let selected_string_label = document.getElementById(id);
  const orginal_text = selected_string_label.textContent;

  // create an input element and set its value to the current text, then
  // also add class onto the input element to allow for styling
  const input = document.createElement("input");
  input.value = selected_string_label.innerText;
  input.classList.add("change_string_input");

  // take away the text content of the string label, and insert the input element
  // into the div, also put focus onto the input
  selected_string_label.textContent = " ";
  selected_string_label.appendChild(input);
  input.focus();

  // function to update the string info
  function updateStringLabel() {
    const inputValue = input.value.trim();
    if (inputValue.length > 1) {
      selected_string_label.textContent = inputValue[0];
    } else if (inputValue.length === 0) {
      selected_string_label.textContent = original_text;
    } else {
      selected_string_label.textContent = inputValue;
    }

    // Clean up the input element
    input.remove();
  }

  // listener events
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      updateStringLabel();
    }
  });

  input.addEventListener("blur", () => {
    updateStringLabel();
  });
}

function check_stretch(chart_code) {
  // calculates the stretch number for the chord shape. This is done by counting all of the
  // the stretches in the shape, and then avergaing them over how many frets are active.
  // If the stretch number is greater than 3, check is returned false, else it's true

  // init variables
  let stretch = 0;
  let fret_active = 0;
  let gap = 0;
  let gap_count = 0;
  let seen = [];
  let dup = [];
  const bias = 1.5;

  for (let i = 0; i < chart_code.length; i++) {
    if (typeof chart_code[i] === "number" && chart_code[i] != 0) {
      // counts the active frets
      fret_active++;

      // counts how many duplicates are in the shape
      if (!seen.includes(chart_code[i])) {
        seen.push(chart_code[i]);
      } else if (seen.includes(chart_code[i])) {
        if (!dup.includes(chart_code[i])) {
          dup = dup.concat(chart_code[i]);
        }
      }
      for (let j = i + 1; j < chart_code.length; j++) {
        if (typeof chart_code[j] === "number" && chart_code[j] != 0) {
          if (gap == 1) {
            // this adds bias if theres a gap between the strings
            // gaps in the strings make chord shapes much harder, the bias
            // of 1.5 seems to account for this well
            stretch += Math.abs(chart_code[i] - chart_code[j]) * bias;
            gap = 0;
          } else {
            // adds stretches when gaps arent an issue
            stretch += Math.abs(chart_code[i] - chart_code[j]);
          }
        } else {
          gap++;
        }
      }
    }
  }

  // finds where the actual frets start by taking into account the muted strings
  if (typeof chart_code[0] !== "number") {
    starting = 1;
    if (typeof chart_code[1] !== "number") {
      starting = 2;
    }
  } else {
    starting = 0;
  }

  // find how many gaps there are
  for (let i = starting; i < chart_code.length; i++) {
    if (chart_code[i] === "b" || chart_code[i] == 0) {
      if (i == starting || i + 1 == chart_code.length) {
        gap_count = gap_count;
      } else {
        gap_count++;
      }
    }
  }

  // checks for a duplicate stretch. This is when duplicates exist, there's a gap in the middle
  // of the shape, and average stretch is greater than 1. This makes the shape much more
  // difficult to play properly, so an additional bias is accounted for.
  let stretch_avg = stretch / fret_active;
  if (dup.length > 1 && gap_count > 0 && stretch_avg > 1) {
    stretch *= bias;
    // console.log("1");
  } else if (dup.length > 1 && stretch_avg > 1) {
    stretch *= 1.125;
    // console.log("2");
  }

  // adds bias if more than 4 frets are active. This is because when more than 4 fingers are used
  // the thumb or often barres are essential, making the shape much more difficult. Extra
  // consideration is placed on shapes where the thumb would be needed on the lowest frets of
  // the shape, as this makes the chord much much more difficult
  let max = calc_max(chart_code);
  if (fret_active == 5) {
    stretch *= 1.125;
    // console.log("3");
    if (max == chart_code[starting]) {
      stretch *= bias;
      // console.log("4");
    } else if (starting != 0 && max == chart_code[starting]) {
      stretch *= 2.5;
      // console.log("5");
    }
  } else if (fret_active == 6) {
    stretch *= bias;
    // console.log("6");
  }

  // this acts as the number rating how hard the stretch actually is
  stretch_num = stretch / fret_active;

  // console.log(stretch_num);
  return stretch_num;
}

function check_arrays_equal(arr1, arr2) {
  // function takes two arrays and checks if they're exactly the same.
  // arr1 - first array, arr2 - second array

  // if the arrays aren't the same length, they can't be the same. Return false
  if (arr1.length !== arr2.length) {
    return false;
  }

  // check each element and make sure they're the same
  let count = 0;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] === arr2[i]) {
      count++;
    }
  }

  // if all of them are the same return true, else return false.
  if (count == arr1.length) {
    return true;
  } else {
    return false;
  }
}

function check_buttons() {
  // make sure that a button from the top and a button from the bottom are selected
  // returns true if the buttons are pressed
  let count = 0;
  let check = false;

  // check the top row
  tonic_button.forEach((tonic_button) => {
    if (tonic_button.className == "general_button tonic_button clicked") {
      count++;
    }
  });

  // check the bottom row
  harmony_button.forEach((harmony_button) => {
    if (harmony_button.className == "general_button harmony_button clicked") {
      count++;
    }
  });

  if (count > 1) {
    check = true;
  }

  return check;
}
