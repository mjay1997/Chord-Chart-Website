// -----------------------------------------------------------------------------------------
// SETUP

let chord_title = document.querySelector(".chord_name");
let tonic_button = document.querySelectorAll(".tonic_button");
let harmony_button = document.querySelectorAll(".harmony_button");
let dots = document.querySelectorAll(".dot");
let open_fret = document.querySelectorAll(".open_fret");
let fret_number = document.querySelector(".fret_number");
let string_labels = document.querySelectorAll(".string_label");
let tonic_name = "";
let harm_name = "";
let prev_chord = [];

// event listener for user interface
// the listeres check that both buttons have been clicked, and then implements the UI

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

function general_button() {
  let check = check_buttons();
  if (check) {
    chord_name = tonic_name + harm_name;
    build_chart();
  } else {
    reset_chart();
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

function build_tuning() {
  // goes thru the string names and saves them into a tuning array

  let tuning = [];
  string_labels.forEach((string_labels) => {
    tuning.push(string_labels.innerText);
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
// -----------------------------------------------------------------------------------------
// UTILITY FUNCTIONS

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

function count_active(chart_code) {
  let fret_count = 0;
  for (let i = 0; i < chart_code.length; i++) {
    if (typeof chart_code[i] === "number" && chart_code[i] != 0) {
      fret_count++;
    }
  }

  return fret_count;
}

function check_comprehensive(fret_array) {
  // makes sure that the chart code has all the notes that the chord should have
  // the function goes thru the fret_array and counts how many of each interval are present
  // if all the intervals are present, the functions returns true

  // fret_array - array of the intervals present in the chord

  let chord_notes = analyzechord(chord_name);
  let fifth = findFifth(chord_name);

  let interval_dictionary = {};
  for (let i = 0; i < chord_notes.length; i++) {
    if (chord_notes[i] != fifth) {
      interval_dictionary[i] = chord_notes[i];
    }
  }

  for (let i = 0; i < fret_array.length; i++) {
    if (fret_array[i] in interval_dictionary) {
      delete interval_dictionary[fret_array[i]];
    }
  }

  if (Object.keys(interval_dictionary).length === 0) return true;

  return false;
}

function check_thumb(chart_code) {
  // uses the chart code to figure out if the shape should use the users thumb
  // returns false if the shape doesnt need the thumb and true if it does
  let min_num = calc_min(chart_code);
  let fret_count = count_active(chart_code);

  if (fret_count < 4) {
    return false;
  }

  if (typeof chart_code[0] !== "number") {
    return false;
  } else if (chart_code[0] == min_num) {
    if (chart_code.includes("x") || chart_code.includes(0)) {
      return true;
    }
  } else {
    return false;
  }
}

function check_barre(chart_code) {
  // takes the chart code array and checks if the shape should be using a barre

  // check if the shape already fits in a common barre shape
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

  if (check_common_barre(chart_code)) {
    return true;
  }

  var fret_dictionary = {};
  var existing_fret = [];
  let muted_fret = false;
  for (let i = 0; i < chart_code.length; i++) {
    if (typeof chart_code[i] === "number" && chart_code[i] != 0) {
      if (!existing_fret.includes(chart_code[i])) {
        existing_fret.push(chart_code[i]);
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

// -----------------------------------------------------------------------------------------
// UI FUNCTIONS

function spice() {}

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
  chord_title.style.color = "transparent";
  fret_number.textContent = "fr1";

  // remove the active, muted and open fret apperances and note names
  dots.forEach((dots) => {
    dots.classList.remove("active");
    dots.textContent = "";
  });

  open_fret.forEach((open_fret) => {
    open_fret.classList.remove("muted");
    open_fret.classList.remove("open");
    open_fret.textContent = "";
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
    if (inputValue.length > 2) {
      selected_string_label.textContent = inputValue[0];
    } else if (inputValue.length === 0) {
      selected_string_label.textContent = original_text;
    } else {
      if (!(inputValue.charAt(1) == "#")) {
        selected_string_label.textContent = inputValue[0];
      } else {
        selected_string_label.textContent = inputValue;
      }
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

// -----------------------------------------------------------------------------------------
// CHART FUNCTIONS

function check_stretch(chart_code) {
  // calculates the stretch number for the chord shape. This is done by counting all of the
  // the stretches in the shape, and then avergaing them over how many frets are active.
  // If the stretch number is greater than 3, check is returned false, else it's true

  // init variables
  let stretch_num = 0;
  let temp_array = [...chart_code].splice(1, 5);
  let active_frets = count_active(chart_code);

  for (let i = 0; i < chart_code.length; i++) {
    if (typeof chart_code[i] === "number" && chart_code[i] != 0) {
      for (let j = 0; j < temp_array.length; j++) {
        if (typeof temp_array[j] === "number" && temp_array[j] != 0) {
          horz_distance = Math.abs(chart_code[i] - temp_array[j]);
          vert_distance = j + 1;
          distance_index = Math.sqrt(
            Math.pow(horz_distance, 2) + Math.pow(vert_distance, 2)
          );
          stretch_num += distance_index;
        }
      }
    }

    temp_array.splice(0, 1);
    if (temp_array.length == 0) {
      break;
    }
  }

  return stretch_num / active_frets;
  // if (stretch_num / active_frets > 100) {
  //   return false;
  // } else {
  //   return true;
  // }
}

function assign_finger(chart_code, fingers = []) {
  // takes a chart_code and assigns the fingers to each fret

  // -----------------------------------------------------------------------------------------
  // UTILITY FUNCTIONS

  function check_finger_chart(finger_chart, chart_code) {
    // checks if all frets in the chord chart have been assigned. Go thru the entire finger chart
    // and count the frets that have been assigned. Then checks if the count matches the length
    // of the chord chart

    let active = count_active(chart_code);
    let count = 0;
    for (let i = 0; i < finger_chart.length; i++) {
      if (finger_chart[i] !== "x") {
        count++;
      }
    }

    if (count == active) {
      return true;
    } else {
      return false;
    }
  }

  function convert_finger_chart(finger_chart) {
    // converts a finger chart to a number system

    // create the correct finger dictionary to allow convertion
    if (finger_chart.includes("t")) {
      finger_dictionary = {
        t: 1,
        i: 2,
        m: 3,
        r: 4,
        p: 5,
      };
    } else {
      finger_dictionary = {
        i: 1,
        m: 2,
        r: 3,
        p: 4,
      };
    }

    // build a new array where the finger charts are converted to numbers
    let converted_chart = [];
    for (let i = 0; i < finger_chart.length; i++) {
      if (finger_chart[i] != "x") {
        converted_chart.push(finger_dictionary[finger_chart[i]]);
      } else {
        converted_chart.push("x");
      }
    }

    // return the new array
    return converted_chart;
  }

  function find_finger_index(finger, fingers) {
    // finds the index of the fingers array where the selected finger is, this is done by looping
    // thru the finger array until the matching finger is found

    for (let i = 0; i < fingers.length; i++) {
      if (finger == fingers[i]) {
        finger_index = i + 1;
      }
    }

    // return the finger index
    return finger_index;
  }

  function find_max_finger(finger_chart, chart_code) {
    let max_num = calc_max(chart_code);

    for (let i = 0; i < finger_chart.length; i++) {
      if (chart_code[i] == max_num) return finger_chart[i];
    }
  }
  // -----------------------------------------------------------------------------------------

  let thumb_check = check_thumb(chart_code);
  let barre_check = check_barre(chart_code);
  let active = count_active(chart_code);

  if (fingers.length == 0) {
    if (thumb_check) {
      fingers = ["t", "i", "m", "r", "p"];
      if (active > 5 && !barre_check) return [];
    } else {
      fingers = ["i", "m", "r", "p"];
      if (active > 4 && !barre_check) return [];
    }
  }

  if (barre_check) return ["barre"];

  let finger_chart = [];
  let check = false;
  let index = 0;
  let min_num = calc_min(chart_code);
  while (!check) {
    for (let i = 0; i < chart_code.length; i++) {
      if (chart_code[i] == min_num) {
        finger_chart[i] = fingers[index];
        index++;
      } else if (finger_chart.length < chart_code.length) {
        finger_chart.push("x");
      }
    }
    check = check_finger_chart(finger_chart, chart_code);
    min_num++;
  }

  // -----------------------------------------------------------------------------
  // EDGE CASES

  // stretch check
  let finger_numbers = convert_finger_chart(finger_chart);
  let temp_fingers = [...fingers];
  let max_finger = find_max_finger(finger_chart, chart_code);
  let filter_finger = "p";
  let last_index = 0;
  for (let i = 0; i < finger_chart.length; i++) {
    if (i != 0 && finger_chart[i] !== "x") {
      actual_stretch = Math.abs(finger_numbers[i] - finger_numbers[last_index]);
      theory_stretch = Math.abs(chart_code[i] - chart_code[last_index]);
      if (theory_stretch == 0) {
        theory_stretch = Math.abs(i - last_index);
        filter_finger = "r";
      }
      last_index = i;
      if (actual_stretch < theory_stretch) {
        if (
          finger_chart[i] != filter_finger &&
          !finger_chart.includes(filter_finger)
        ) {
          temp_fingers = temp_fingers.filter((item) => item !== max_finger);
          finger_chart = assign_finger(chart_code, temp_fingers);
        }
      }
    }
  }

  // -----------------------------------------------------------------------------

  return finger_chart;
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
    strings_chromatic.push(build_str(tuning[i]));
  }

  // check where the tonic is on the first three strings
  let c_notes = analyzechord(chord_name);
  let first_fret = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < strings_chromatic[i].length; j++) {
      if (strings_chromatic[i][j] == c_notes[0]) {
        first_fret.push(j);
        break;
      }
    }
  }

  let check = 0;
  while (check == 0) {
    // build the beginning of the chart based off of the random starting string
    let rand_tonic = Math.floor(Math.random() * 3);
    var chart_code = [];
    var chart_notes = [];
    if (rand_tonic == 0) {
      chart_code[0] = first_fret[0];
      chart_notes[0] = c_notes[0];
    } else if (rand_tonic == 1) {
      chart_code[0] = "b";
      chart_code[1] = first_fret[1];
      chart_notes[0] = "b";
      chart_notes[1] = c_notes[0];
    } else if (rand_tonic == 2) {
      chart_code[0] = "b";
      chart_code[1] = "b";
      chart_code[2] = first_fret[2];
      chart_notes[0] = "b";
      chart_notes[1] = "b";
      chart_notes[2] = c_notes[0];
    }

    // create rand num array that has all intervals present (using check comprehensive)
    let c_length = chart_code.length;
    comp_check = false;
    while (comp_check == false) {
      var fret_array = [];
      if (c_length != 0) {
        for (let i = 0; i < 6 - c_length; i++) {
          rand_num = Math.floor(Math.random() * (c_notes.length + 1));
          fret_array.push(rand_num);
          comp_check = check_comprehensive(fret_array);
        }
      }
    }

    // build chart code following the random intervals from the array
    for (let i = 0; i < 6 - c_length; i++) {
      if (fret_array[i] == c_notes.length) {
        chart_code.push("b");
        chart_notes.push("b");
      } else {
        for (let j = 0; j < strings_chromatic[c_length].length; j++) {
          if (
            strings_chromatic[chart_code.length][j] == c_notes[fret_array[i]]
          ) {
            chart_code.push(j);
            chart_notes.push(c_notes[fret_array[i]]);
            break;
          }
        }
      }
    }

    // check the span and stretch number of the chord chart, if it's possible, the chord chart is allowed
    span = calc_span(chart_code);
    stretch = check_stretch(chart_code);
    finger_chart = assign_finger(chart_code);
    if (span < 4 && stretch < 5 && finger_chart.length != 0) {
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
    prev_chord.push(chart_code);
  }

  // adjust the chart and fret number to display the chart properly
  chart_code = offset_array(chart_code);
  console.log(assign_finger(chart_code));
  console.log(check_stretch(chart_code));

  // display the chord chart
  chord_title.style.color = "var(--main_text_color)";
  chord_title.textContent = chord_name;
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
      string_array[i][chart_code[i]].textContent = chart_notes[i];
    } else if (typeof chart_code[i] === "number" && chart_code[i] == 0) {
      string_labels[i].style.color = "transparent";
      string_array[i][0].classList.add("open");
      string_array[i][chart_code[i]].textContent = chart_notes[i];
    } else if (chart_code[i] === "b") {
      string_labels[i].style.color = "transparent";
      string_array[i][0].classList.add("muted");
    }
  }
}
