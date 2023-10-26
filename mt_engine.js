// -----------------------------------------------------------------------------------------
// SET UP

function selectednotearray(selectedarray = "sharp") {
  // sets the notes array to either a chromatic scale with sharps {default} or flats
  let chromatic_notes = [];
  if (selectedarray == "flat") {
    chromatic_notes = [
      "C",
      "Db",
      "D",
      "Eb",
      "E",
      "F",
      "Gb",
      "G",
      "Ab",
      "A",
      "Bb",
      "B",
    ];
  } else if (selectedarray == "sharp") {
    chromatic_notes = [
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
  }

  return chromatic_notes;
}

let chromatic_notes = selectednotearray();

// -----------------------------------------------------------------------------------------
// UTILITY CODES

function reorderArray(tonic) {
  // takes the selected note array and reorders it to start on the selected tonic
  let index = chromatic_notes.indexOf(tonic.toUpperCase());
  let before = chromatic_notes.slice(0, index);
  let after = chromatic_notes.slice(index);
  let reordered_array = after.concat(before);

  return reordered_array;
}

function sortArray(chord_array) {
  // takes a chord array and sorts it into the unique notes chronilogically
  let sorted_array = [];
  for (let i = 0; i < chord_array.length; i++) {
    if (i == 0 || !sorted_array.includes(chord_array[i])) {
      sorted_array.push(chord_array[i]);
    }
  }
  sorted_array.sort((a, b) => a - b);

  return sorted_array;
}

function renameUpperextention(interval) {
  // takes an interval name and when appropriate, raises it's name by an octave

  // check if the interval is flat, then removes the 'b' and converts to number and adds an octave
  if (interval.startsWith("b")) {
    temp_array = Number(interval.substring(1));
    // negate seventh intervals
    if (temp_array < 7) {
      temp_array += 7;
    }
    // convert back to string
    new_string = "b" + String(temp_array);
  } else {
    // if the interval isnt flat, it's simply turned to a number and then raised an octave
    temp_array = Number(interval);
    // negate seventh intervals
    if (temp_array < 7) {
      temp_array += 7;
    } else temp_array = "maj7";
    // convert back to string
    new_string = String(temp_array);
  }

  // return the adjusted string
  return new_string;
}

function capArray(array) {
  // takes an array of strings or charecters and capitilizes all elements

  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].toUpperCase();
  }

  return array;
}

function checkVoicingname(string) {
  // takes a string and checks the first charecter to see if it's the beginning of a voicing
  // name

  if (
    string.startsWith("a") || // add
    string.startsWith("m") || // m, maj7
    string.startsWith("s") || // sus
    string.startsWith("/") || // splits up extentions, slash voicings
    string.startsWith("7") // b7
  ) {
    return true;
  } else {
    return false;
  }
}

// -----------------------------------------------------------------------------------------
// MUSIC THEORY / MUSICIAL ANALYSIS

function assignintervals(tonic, chord_array) {
  // takes the tonic and assigns interval names to all of the chromatic notes

  let notes_array = reorderArray(tonic);
  let interval_dictionary = {};
  let intervals = [
    "1",
    "b2",
    "2",
    "m3",
    "3",
    "4",
    "b5",
    "5",
    "b6",
    "6",
    "b7",
    "7",
  ];

  // ensure that all the notes in the chord_array are cap
  chord_array = capArray(chord_array);

  // create the interval dictionary where each chromatic note is assigned an interval name
  // in reference to the tonic
  for (let i = 0; i < notes_array.length; i++) {
    interval_dictionary[notes_array[i]] = intervals[i];
  }

  // matches the note to the interval stored in the dictionary; then saves the interval name in
  // the interval_array
  let interval_array = [];
  // this adjusts the code to allow just a string input rather than an array
  if (typeof chord_array === "string") {
    interval_array.push(interval_dictionary[chord_array]);
  } else {
    for (let i = 0; i < chord_array.length; i++) {
      if (chord_array[i] != "b") {
        interval_array.push(interval_dictionary[chord_array[i]]);
      }
    }
  }

  return interval_array;
}

function seperateVoicingnames(chord_name) {
  // takes a chord name and seperates the string into the different voicing names

  let temp_string = "";
  let voicing_array = [];

  for (let i = 0; i < chord_name.length; i++) {
    // check each charecter in the chord name, looking for the beginning of voicing names
    if (!checkVoicingname(chord_name[i])) {
      // if the charecter isnt the beginning of a voicing name, add it to temp string
      if (i != 0) {
        temp_string += chord_name[i];
      }
    } else {
      // -----------------------------------------------------------------------------------------
      // EDGE CASES

      // make sure that sus isnt double counted because of the second s
      if (temp_string == "su") {
        temp_string = "sus";
        continue;
      }
      // make sure that the code can differentiate minor and maj7 voices
      if (temp_string == "m" && chord_name[i] == "a") {
        temp_string = "ma";
        continue;
      }
      // make sure that the code can differentiate maj7 and b7 voices
      if (temp_string == "maj" && chord_name[i] == "7") {
        temp_string = "maj7";
        continue;
      }

      // -----------------------------------------------------------------------------------------

      // if the charecter is the beginning of a voicing name, reset temp string and add the previous
      // string to voicing array
      voicing_array.push(temp_string);
      temp_string = chord_name[i];
    }
  }
  // add the final voicing to the voicing array
  voicing_array.push(temp_string);

  // filter out any reduntant "" or "/" to make the array readable
  voicing_array = voicing_array.filter((item) => item !== "");
  voicing_array = voicing_array.filter((item) => item !== " ");
  voicing_array = voicing_array.filter((item) => item !== "#");
  voicing_array = voicing_array.filter((item) => item !== "# ");
  for (let i = 0; i < voicing_array.length; i++) {
    if (i != voicing_array.length - 1 && voicing_array[i].startsWith("/")) {
      voicing_array[i] = voicing_array[i].substring(1);
    }
  }

  // ensure that the major third voicing is included in the voicing array
  if (!voicing_array.includes("m")) {
    voicing_array.push("3");
  }

  // return the array
  return capArray(voicing_array);
}

function translateVoicings(tonic, voicing_array) {
  // -----------------------------------------------------------------------------------------
  // VOICING FUNCTIONS

  function slashVoicing(tonic, voicing) {
    // takes the tonic and the speicifc voicing name and converts it into an interval name

    // remove the "/" symbol
    voicing = voicing.substring(1);

    // find the interval name for the new bass note in reference to the tonic
    interval_name = String(assignintervals(tonic, voicing));

    // return the interval name
    return interval_name;
  }

  function addVoicing(voicing) {
    // takes the add voicings and converts them into an array containing
    //  all of the additional intervals
    let interval_name_array = [];
    let temp_string = "";
    for (let i = 0; i < voicing.length; i++) {
      if (
        !(
          voicing[i].toUpperCase() == "A" ||
          voicing[i].toUpperCase() == "D" ||
          voicing[i] == "(" ||
          voicing[i] == ")"
        )
      ) {
        // checks for commas to see if the temp string should be reset
        if (voicing[i] != ",") {
          if (voicing[i] == "B") {
            temp_string += "b";
          } else {
            temp_string += voicing[i];
          }
        } else {
          // once a comma is found, the interval is added to the array, and the temp string
          // is reset
          interval_name_array.push(temp_string);
          temp_string = "";
        }
      }
    }

    // ensures that all intervals are added to the array
    if (temp_string != "") {
      interval_name_array.push(temp_string);
    }

    // return the interval array
    return interval_name_array;
  }

  function susVoicing(voicing) {
    // takes a sus voicing and converts it into an interval
    let interval_name = "";

    for (let i = 0; i < voicing.length; i++) {
      if (
        !(
          voicing[i].toUpperCase() == "S" ||
          voicing[i].toUpperCase() == "U" ||
          voicing[i] == "(" ||
          voicing[i] == ")"
        )
      ) {
        if (voicing[i] == "B") {
          interval_name += "b";
        } else {
          // after sorting out the (sus)s and parenthesis, the interval name is identified
          interval_name += voicing[i];
        }
      }
    }

    //  returns the interval name
    return interval_name;
  }

  function upperVoicing(voicing) {
    // takes the upper extentions voicings and converts them into an array containing
    //  all of the upper extention intervals
    let interval_name_array = [];
    let temp_string = "";
    for (let i = 0; i < voicing.length; i++) {
      if (!(voicing[i] == "(" || voicing[i] == ")")) {
        // checks for commas to see if the temp string should be reset
        if (voicing[i] != ",") {
          if (voicing[i] == "B") {
            temp_string += "b";
          } else {
            temp_string += voicing[i];
          }
        } else {
          // once a comma is found, the interval is added to the array, and the temp string
          // is reset
          interval_name_array.push(temp_string);
          temp_string = "";
        }
      }
    }

    // ensures that all intervals are added to the array
    if (temp_string != "") {
      interval_name_array.push(temp_string);
    }

    // return the interval array
    return interval_name_array;
  }
  // -----------------------------------------------------------------------------------------

  let interval_array = [];

  // check if clash chords exists and place them at the beginning of the interval array
  for (let i = 0; i < voicing_array.length; i++) {
    if (voicing_array[i].includes("/")) {
      interval_array.push(slashVoicing(tonic, voicing_array[i]));
      voicing_array.splice(i, 1);
    }
  }

  // make sure that the tonic is included in the interval chart
  interval_array.push("1", "5");

  // nested for that allows each letter of each voicing name to be analyzed. Each letter
  // of the voicing name is added to a temp string until a full voicing name is recognized. The temp
  // string is then reset. The voicing name is then sent to the appropriate function for analysis.
  // Once the interval name is identified, it's then added to an interval array
  let temp_string = "";
  for (let i = 0; i < voicing_array.length; i++) {
    for (let j = 0; j < voicing_array[i].length; j++) {
      temp_string += voicing_array[i][j].toUpperCase();
      // console.log(temp_string);

      // checks for add voicing
      if (temp_string.includes("ADD") && temp_string.length == 4) {
        temp_string = "";
        add_array = addVoicing(voicing_array[i]); // analyzed in the addVoicing function
        if (typeof add_array === "string") {
          // allows individual strings to be added
          if (add_array > 7) {
            interval_array.push(String(Number(add_array) - 7));
          } else {
            interval_array.push(add_array);
          }
        } else {
          for (let k = 0; k < add_array.length; k++) {
            if (add_array[k] > 7) {
              interval_array.push(String(Number(add_array[k]) - 7));
            } else {
              interval_array.push(add_array[k]);
            }
          }
        }

        // checks for maj7 voicings
      } else if (temp_string === "MAJ7") {
        temp_string = "";
        interval_array.push("7");

        // checks for b7 voicings
      } else if (temp_string === "7") {
        temp_string = "";
        interval_array.push("b7");

        // checks for 9 voicings
      } else if (temp_string === "9") {
        temp_string = "";
        interval_array.push("b7", "2");

        // checks for 11 voicings
      } else if (temp_string === "11") {
        temp_string = "";
        interval_array.push("b7", "2", "4");

        // checks for 13 voicings
      } else if (temp_string === "13") {
        temp_string = "";
        interval_array.push("b7", "2", "4", "6");

        // checks for a minor 3rd voicing
      } else if (voicing_array[i] === "M") {
        temp_string = "";
        interval_array.push("m3");

        // checks for upper extentions
      } else if (temp_string.startsWith("(") && temp_string.slice(-1) === ")") {
        upper_interval = upperVoicing(temp_string);
        temp_string = "";
        if (typeof add_array === "string") {
          // allows individual strings to be added
          if (upper_interval > 7) {
            interval_array.push(String(Number(upper_interval) - 7));
          } else {
            interval_array.push(upper_interval);
          }
        } else {
          for (let k = 0; k < upper_interval.length; k++) {
            if (upper_interval[k] > 7) {
              interval_array.push(String(Number(upper_interval[k]) - 7));
            } else {
              interval_array.push(upper_interval[k]);
            }
          }
        }

        // checks for a major 3rd voicing
      } else if (temp_string === "3") {
        temp_string = "";
        interval_array.push("3");

        // check for a sus voicing
      } else if (temp_string.includes("SUS") && temp_string.length == 4) {
        temp_string = "";
        sus_interval = susVoicing(voicing_array[i]); // analyzed in the susVoicing function
        interval_array.push(sus_interval);
      }
    }
  }

  // return the interval array
  return interval_array;
}

function namechord(tonic, chord_array) {
  // take a chord array and names it using analysis

  // ensure that the chord_array is cap
  chord_array = capArray(chord_array);

  let interval_array = assignintervals(tonic, chord_array);
  let used_intervals = ["1", "5"];
  let slash_name = "";
  let third_name = "";
  let adjusted_fifth = "";
  let extention_name = "";
  let additional_name = "";
  let chord_name = "";

  // check if the chord is a slash chord
  let slash_check = false;
  if (interval_array[0] != "1") {
    slash_name = chord_array[0];
    slash_check = true;
  }

  // check if the third exists
  let third_check = false;
  if (interval_array.includes("3")) {
    third_name = "";
    third_check = true;
    used_intervals.push("3");
  } else if (interval_array.includes("m3")) {
    third_name = "m";
    third_check = true;
    used_intervals.push("m3");
  }

  // check for aug and dim chords
  let dim_check = false;
  let aug_check = false;
  if (third_check) {
    if (third_name == "m" && interval_array.includes("b5")) {
      adjusted_fifth = "dim";
      third_name = "";
      dim_check = true;
      used_intervals.push("b5");
    } else if (interval_array.includes("3") && interval_array.includes("b6")) {
      aug_check = true;
      adjusted_fifth = "aug";
      used_intervals.push("b6");
    }
  }

  // checks if there are suspended chords
  let sus_type = "";
  let sus_name = "";
  let sus_check = false;
  if (!third_check) {
    if (interval_array.includes("4")) {
      sus_type = "4";
      sus_name = "sus4";
      sus_check = true;
      used_intervals.push("4");
    } else if (interval_array.includes("2")) {
      sus_type = "2";
      sus_name = "sus2";
      sus_check = true;
      used_intervals.push("2");
    }
  }

  // check for extentions / upper extentions
  let upper_extention = [];
  let extention_type = "";
  let extention_check = false;
  if (interval_array.includes("b7")) {
    extention_type = "b7";
    extention_check = true;
    used_intervals.push("b7");
  } else if (interval_array.includes("7")) {
    extention_type = "7";
    extention_check = true;
    used_intervals.push("7");
  } else if (interval_array.includes("6")) {
    extention_type = "6";
    extention_check = true;
    used_intervals.push("6");
  }

  // finds all upper extentions
  if (extention_check) {
    for (let i = 0; i < interval_array.length; i++) {
      if (
        !(
          interval_array[i] == "1" ||
          interval_array[i] == "m3" ||
          interval_array[i] == "3" ||
          interval_array[i] == "5" ||
          interval_array[i] == extention_type ||
          interval_array[i] == sus_type
        )
      ) {
        // adjusts the interval names to more appropirately label them as
        // upper extentions
        upper_extention.push(Number(renameUpperextention(interval_array[i])));
        used_intervals.push(interval_array[i]);
      }
    }

    // ensures that the upper extentions are in the correct order
    String(upper_extention.sort((a, b) => a - b));
  }

  // -----------------------------------------------------------------------------------------
  // EDGE CASES
  // adjusts upper extention for aug and dim chords [REMOVES THE REDUNTANT b13 AND b12 INTERVALS]
  if (upper_extention.includes("b13") && aug_check) {
    upper_extention = upper_extention.filter((item) => item !== "b13");
  } else if (upper_extention.includes("b12") && dim_check) {
    upper_extention = upper_extention.filter((item) => item !== "b12");
    // removes the 6th interval if it's included (as a diminished chord would naturally contain
    // a bb7 ie the sixth interval)
    if (extention_type == "6") {
      extention_type = "";
    }
  }

  // checks for the edge case where both the minor and major thirds are present in the chord
  // SHOUTOUT TO HENDRICK!
  if (interval_array.includes("3") && interval_array.includes("m3")) {
    upper_extention.push("#9");
    used_intervals.push("m3");
  }

  // adds a no3 label if right for the chord
  if (!third_check) {
    if (sus_type == "") {
      upper_extention.push("no3");
    }
  }
  // -----------------------------------------------------------------------------------------

  // constructs the extention name
  if (extention_type == "b6" || extention_type == "6") {
    extention_name = extention_type + "(" + upper_extention + ")";
  } else if (extention_type == "b7") {
    extention_name = "7(" + upper_extention + ")";
  } else if (extention_type == "7") {
    extention_name = "maj7(" + upper_extention + ")";
  }

  // removes the parenthesis if there are no upper extentions
  if (upper_extention.length == 0) {
    extention_name = extention_name.slice(0, extention_name.length - 2);
  }

  // adds any other additions to the chord
  for (let i = 0; i < interval_array.length; i++) {
    if (!used_intervals.includes(interval_array[i])) {
      additional_name += "add" + renameUpperextention(interval_array[i]);
    }
  }

  // constructs the entire chord name
  if (!extention_check && sus_check) {
    chord_name =
      tonic +
      third_name +
      adjusted_fifth +
      extention_name +
      sus_name +
      additional_name;
  } else if (extention_check && sus_check) {
    chord_name =
      tonic +
      third_name +
      adjusted_fifth +
      extention_name +
      sus_name +
      additional_name;
  } else {
    chord_name =
      tonic +
      third_name +
      adjusted_fifth +
      extention_name +
      sus_name +
      additional_name;
  }

  // adapts the chord name to a slash chord if needed
  if (slash_check) {
    chord_name += " / " + slash_name;
  }

  // return the chord name
  return chord_name;
}

function analyzechord(chord_name) {
  // takes the name of a chord and builds an interval chart out of it

  // split the chord name into tonic and it's voicing names
  let tonic = chord_name.charAt(0).toUpperCase();
  if (chord_name.charAt(1) == "#" || chord_name.charAt(1) == "b") {
    tonic += chord_name.charAt(1);
  }
  let voicing_array = seperateVoicingnames(chord_name);

  // translate the voicing names into intervals
  let interval_array = translateVoicings(tonic, voicing_array);
  let notes_array = reorderArray(tonic);
  let interval_dictionary = {};
  let intervals = [
    "1",
    "b2",
    "2",
    "m3",
    "3",
    "4",
    "b5",
    "5",
    "b6",
    "6",
    "b7",
    "7",
  ];

  // create the interval dictionary where each chromatic note is assigned an interval name
  // in reference to the tonic
  for (let i = 0; i < notes_array.length; i++) {
    interval_dictionary[intervals[i]] = notes_array[i];
  }

  // matches the note to the interval stored in the dictionary; then saves the interval name in
  // the interval_array
  let chord_notes = [];
  // this adjusts the code to allow just a string input rather than an array
  for (let i = 0; i < interval_array.length; i++) {
    chord_notes.push(interval_dictionary[interval_array[i]]);
  }

  return chord_notes;
}

function findFifth(chord_name) {
  chord_notes = analyzechord(chord_name);
  let tonic = chord_name.charAt(0).toUpperCase();
  if (chord_name.charAt(1) == "#" || chord_name.charAt(1) == "b") {
    tonic += chord_name.charAt(1);
  }

  interval_array = assignintervals(tonic, chord_notes);
  for (let i = 0; i < interval_array.length; i++) {
    if (interval_array[i] == "5") {
      return chord_notes[i];
    }
  }

  return "";
}
