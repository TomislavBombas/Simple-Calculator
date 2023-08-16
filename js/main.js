/**
 * ToDo:
 * Rewrite and fix calculation history. Mayble to go all in with history... Use array to enable returns...
 * Add memory function
 * Add keyboard use (currently is just a mouse or simple touch);
 * Maybe add touch gestures later... If I ever have time for that
 * think about other functionalites
 */

//======================================================
// Basic calculator definitions: buttons ( bottom left to top right, don't judge me, I like it )
// You can make your calculator from here
// If you add new calculation actions, add methods in the class below
// Method name is the same as action name in the keypad section of definitions
//======================================================
const defaultDefs = {
  keypad: [
    { name: "zero", value: 0, size: 1, color: "black" },
    { name: "dot", value: ".", size: 1, color: "black" },
    { name: "equal", value: "=", size: 2, color: "orange" },
    { name: "one", value: 1, size: 1, color: "black" },
    { name: "two", value: 2, size: 1, color: "black" },
    { name: "three", value: 3, size: 1, color: "black" },
    { name: "plus", value: "+", size: 1, color: "black" },
    { name: "four", value: 4, size: 1, color: "black" },
    { name: "five", value: 5, size: 1, color: "black" },
    { name: "six", value: 6, size: 1, color: "black" },
    { name: "minus", value: "-", size: 1, color: "black" },
    { name: "seven", value: 7, size: 1, color: "black" },
    { name: "eight", value: 8, size: 1, color: "black" },
    { name: "nine", value: 9, size: 1, color: "black" },
    { name: "multiply", value: "*", size: 1, color: "black" },
    { name: "clear", value: "C", size: 1, color: "red" },
    { name: "plusminus", value: "±", size: 1, color: "black" },
    { name: "percentage", value: "%", size: 1, color: "black" },
    { name: "divide", value: "÷", size: 1, color: "black" },
  ],
  width: 4,
};
//======================================================

let activeCalc;

// Simple DOM element generator function, to streamline the process
let genEl = (type = "div", attributes = {}, parent = null) => {
  let element = document.createElement(type);
  Object.keys(attributes).forEach((key) => {
    element.setAttribute(key, attributes[key]);
  });
  if (parent) parent.appendChild(element);
  return element;
};

class Calculator {
  constructor(
    input = { defs: {}, rootElement: document.getElementsByTagName("body")[0] }
  ) {
    console.log(Object.values(input.defs).length);
    Object.values(input.defs).length == 0
      ? (this.defs = defaultDefs)
      : (this.defs = input.defs);
    this.root = input.rootElement;
  }

  directMemory = new Object();
  memory = [];
  history = [];

  create() {
    this.directMemory.value1 = "";
    this.directMemory.value2 = "";
    this.directMemory.action = "";
    let wrapper = genEl(
      "div",
      {
        class: "calculator-wrapper",
        style: "width: " + this.defs.width * 3 + "rem",
        tabindex: "0", // this is so element can be focused on, important for keyboard integration
      },
      this.root
    );
    let screen = genEl("div", { class: "screen-wrapper" }, wrapper);
    this.historyScreen = genEl("div", { class: "history-screen" }, screen);
    let mainScreenWrapper = genEl("div", { class: "screen" }, screen);
    this.mainScreen = genEl(
      "div",
      { class: "inner-screen" },
      mainScreenWrapper
    );
    this.mainScreen.innerHTML = 0;
    let keypad = genEl("div", { class: "keypad" }, wrapper);
    Object.values(this.defs.keypad).forEach((def) => {
      let btn = genEl(
        "div",
        {
          class: "color-" + def.color + " size-" + def.size,
          data: def.value,
          name: def.name,
        },
        keypad
      );
      btn.innerHTML = "<p>" + def.value + "</p>";
      typeof def.value == "number"
        ? btn.addEventListener("click", (e) => this.handleNumber(e))
        : btn.addEventListener("click", (e) => this.doAction(e, def.name));
    });

    this.setActiveInstance(wrapper);

    // Click on calculator sets it as active
    this.root.addEventListener("click", (e) => {
      this.setActiveInstance(wrapper);
    });

    window.addEventListener("keydown", (e) => {
      this.handleKeyboard(wrapper, e.key);
    });
  }

  //======================================================
  // Set active calculator
  //======================================================
  setActiveInstance(instance) {
    let prevActive = document.querySelector(".active-calc");
    if (prevActive) prevActive.classList.remove("active-calc");
    instance.classList.add("active-calc");
    instance.focus();
    activeCalc = this;
  }
  //======================================================

  //======================================================
  // Do his if pressed calculator key is a number, if it is an action go to doAction
  //======================================================
  handleNumber(e) {
    let num = e.target.getAttribute("data");
    let value;
    if (this.directMemory.action == "") {
      this.directMemory.value1 += num;
      value = this.directMemory.value1;
    } else {
      this.directMemory.value2 += num;
      value = this.directMemory.value2;
    }
    this.mainScreen.innerHTML = value;
  }
  //======================================================

  //======================================================
  // Set stage after calculation action is taken
  //======================================================
  setNewAction(actionName, value) {
    this.directMemory.value2 = "";
    this.directMemory.value1 = value;
    this.mainScreen.innerHTML = value;
    this.directMemory.action = actionName;
  }
  //======================================================

  //======================================================
  // While default actions/calculations have dedicated methods,
  // here we define and separate non calculation actions
  // Switch default is for usual calculation actions.
  // Non calculation actions are handeled per swich case
  //======================================================
  doAction(e, actionName) {
    this.doHistory(actionName);
    switch (actionName) {
      case "equal":
        if (this.directMemory.action != "") {
          let value = this[this.directMemory.action](
            this.directMemory.value1,
            this.directMemory.value2
          );
          this.setNewAction("", value);
          this.history.push(["="]);
          this.doHistory(actionName);
          this.history.push(["|"]);
        }
        break;
      case "clear":
        this.directMemory.value2 = "";
        this.directMemory.value1 = "";
        this.mainScreen.innerHTML = 0;
        this.historyScreen.innerHTML = 0;
        this.directMemory.action = "";
        this.history = [];
        break;
      case "plusminus":
        if (this.directMemory.action != "") {
          this.directMemory.value2 = Number(this.directMemory.value2) * -1;
          this.mainScreen.innerHTML = this.directMemory.value2;
        } else {
          this.directMemory.value1 = Number(this.directMemory.value1) * -1;
          this.mainScreen.innerHTML = this.directMemory.value1;
        }
        break;
      default:
        if (this.directMemory.action == "") {
          this.setNewAction(actionName, this.directMemory.value1);
        }
        if (this.directMemory.value2 != "") {
          let value = this[this.directMemory.action](
            this.directMemory.value1,
            this.directMemory.value2
          );
          this.history.push(["="]);
          this.setNewAction(actionName, value);
          this.doHistory(actionName);
        } else {
          let value = this[actionName](
            this.directMemory.value1,
            this.directMemory.value2
          );
          this.setNewAction(actionName, value);
          this.doHistory(actionName);
        }
        break;
    }
  }
  //======================================================

  //======================================================
  // Write history on screen
  //======================================================
  writeInHistoryField() {
    this.historyScreen.innerHTML = "";
    this.history.forEach((step) => {
      step.forEach((state, index) => {
        this.historyScreen.innerHTML += " " + state;
      });
    });
  }
  //======================================================

  //======================================================
  // Get symbol for calculation action from predefined array
  //======================================================
  getActionSymbol(actionName) {
    let actionDef = this.defs["keypad"].find((element) => {
      return element["name"] == actionName;
    });
    return actionDef["value"]; // action variable is the actual symbol
  }
  //======================================================

  //======================================================
  // Send every interaction to history array, will be usefull
  //later on if i decide to expand this to have more options
  // History array is filled with small 3 step arrays for every
  //action[first number, action, second number]
  //======================================================
  doHistory(actionName) {
    let action = this.getActionSymbol(actionName);

    let latest = []; // define an array to hold the latest action before inserting it in history array
    if (
      this.history.length > 0 &&
      this.history[this.history.length - 1].length < 3
    )
      latest = this.history[this.history.length - 1]; // If there is unfinished calculation in history, take that as latest

    switch (latest.length) {
      case 0:
        if (this.directMemory.value1 != "")
          latest.push(Number(this.directMemory.value1));
        latest.push(action);
        break;
      case 2:
        if (this.directMemory.value2 != "")
          latest.push(Number(this.directMemory.value2));
        this.history.pop();
        break;
      default:
        latest = [];
        if (this.directMemory.value1 != "")
          latest.push(Number(this.directMemory.value1));
    }

    this.history.push(latest);
    this.writeInHistoryField();
  }
  //======================================================

  //======================================================
  // Grab key presses and do the calculation
  //======================================================
  handleKeyboard(instance, key) {
    if (!instance.classList.contains("active-calc")) return false;
    switch (key) {
      case "Enter":
        instance.querySelector('div[data="="]').click();
        break;
      case "Escape":
        instance.querySelector('div[data="C"]').click();
        break;
      default:
        if (
          this.defs.keypad.find((el) => {
            return el.value == key;
          })
        )
          instance.querySelector('div[data="' + key + '"]').click();
        break;
    }
  }
  //======================================================

  //======================================================
  // calculaton actions below ↓↓↓↓↓↓↓
  //======================================================
  plus(a, b) {
    return Number(a) + Number(b);
  }
  multiply(a, b) {
    return Number(a) * Number(b);
  }
  minus(a, b) {
    return Number(a) - Number(b);
  }
  divide(a, b) {
    return Number(a) / Number(b);
  }
  percentage(a, b) {
    return (Number(b) / Number(a)) * 100;
  }
  // ======================================================
}

// ======================================================
// Checks if any calculator is in focus, this enables use of
// keyboard with calculator
// ======================================================
let checkCalculatorFocus = () => {
  let calcs = document.querySelectorAll(".calculator-wrapper");
  Object.values(calcs).forEach((calc) => {
    document.activeElement != calc
      ? calc.classList.remove("active-calc")
      : calc.classList.add("active-calc");
  });
};
// ======================================================

// ======================================================
// On document load, initilise the calculators, or whatever
// ======================================================
function init() {
  let calc = new Calculator({
    defs: defaultDefs,
    rootElement: document.getElementById("root"),
  });
  calc.create();

  // check what calculator has focus, if any. When in focus keyboard can be used for calculations
  setInterval(checkCalculatorFocus, 1000);
}
// ======================================================

window.addEventListener("load", init);
