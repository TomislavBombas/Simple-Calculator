let calculatorButtons;

// ==========================================================================================================
//   CALCULATOR OBJECT -> everything is here, from creation to functionality
// Object to hold all calculator functions
// has to be on top to be declaired before everything else
// ==========================================================================================================
let calculator = {
    create: (options = {}) => { // create DOM element of calculator with it' parts
        let wrapper = document.body
        if (options.wrapper) wrapper = options.wrapper; // use DOM element as wrapper if it is specified in options

        let calc = element.create ({ 'type': 'div', 'id': 'calculator' }); // create DOM element for calculator
        let display = element.create ({ 'type': 'div', 'id': 'display' }); // Create DOM element to hold numbers and actions
        let curNumDisplay = element.create ({ 'type': 'div', 'id': 'cur-display' }); // Create DOM element to hold current number
        display.appendChild(curNumDisplay);

        calculator.display = curNumDisplay; // Set variable to hold the element so it is not searched for every time
        calculator.current = 0; // holder for new input value
        calculator.stored = 0; // Holder for current calculated value. New operations will include this value and the previous one
        calculator.action = null; // Holder for action to be held after number is inputed
        curNumDisplay.innerHTML = calculator.current;
        calc.appendChild(display);


        // Setting up the keyboard
        Object.values(calculatorButtons).forEach((item,index)=>{
            let btnClass = 'simple-button';
            if ( item['size']==2 ) btnClass += '-2r'; // if button is two field wide
            let button = element.create({ 'type': 'div', 'class': 'button '+btnClass });
            if ( item['color'] != 'default' ) button.style.backgroundColor = item['color']; // if #color is specified in options
            let name = element.create( { 'type': 'p', 'class': 'button-text'} );
            name.innerHTML = item['symbol'];
            button.appendChild(name);
            button.addEventListener('click', item['callback']); // binds functions to buttons according to options
            calc.appendChild(button);
        })
        
        wrapper.appendChild(calc); // sets everything in the DOM 
    },
    clear: ()=>{ // clears input screen and variables
        calculator.current = 0;
        calculator.stored = 0;
        calculator.action = null;
        calculator.display.innerHTML = calculator.current;
    },
    doAction: (action)=>{
        // First check if the = sign is cliked, because that ends the calculation
        if ( action == 'calculate' ) {
            calculator.doCalculation();
            calculator.current = calculator.stored; // after calculation is done, store the result as current in case a new calculation is needed
            calculator.stored = 0; // clear stored value since the calculation is done
            calculator.action = null; // clear the action que
            return true; // breaks the function flow - ends the function
        }
        if ( action == 'flip') {
            if (calculator.current == 0 ) calculator.current = calculator.stored;
            calculator.current *= -1;
            calculator.action = null; 
            calculator.display.innerHTML = calculator.current;
            return true;
        }
        // Now check if there is number stored from previous input
        // If there is one, do the previous calculation on it, before declaring new calculation
        // This is done so you can chain your calculations
        if ( calculator.stored != 0 ) {
            if (calculator.current == 0 ) calculator.current = calculator.stored;
            calculator.doCalculation();
        } else { // if there isn't previous number stored, store the one in input
            calculator.stored = calculator.current;
            calculator.current = 0;
        }
        // and finaly declare the calculation to be done with next number inputed
        calculator.action = action; 
    },
    doCalculation: ()=> {
        let first = Number(calculator.stored);
        let second = Number(calculator.current);
        let result = 0;
        switch(calculator.action) {
            case 'multiply':
              result = first * second;
            break;
            case 'add':
                result = first + second;
            break;
            case 'substract':
                result = first - second;
            break;
            case 'divide':
                result = first / second;
            break;
            case 'percentage':
                result = second * ( first / 100 );
            break;
            default:
              // code block
        }
        let nonDecimalLength = String(Math.round(result)).length; // this is to check the length of the whole numbers, without the decimals
        result = parseFloat(result.toFixed(10-nonDecimalLength)); // this is to limit the decimal numbers to the ammount of numbers visible on screen
        
        //reset the variables
        calculator.current = 0;
        calculator.stored = result;
        // and display the calculated value
        calculator.display.innerHTML = calculator.stored;
},
    input: (e)=>{
        let inputValue;
        try {
            inputValue = e;
            if(calculator.display) {
                let currentContent = calculator.current;
                if ( Number(currentContent) == NaN || currentContent == 0 ) currentContent="";
                if (calculator.action != null ) currentContent="";
                currentContent += inputValue;
                calculator.current = currentContent;
                calculator.display.innerHTML = calculator.current;
            }
    
        } catch (error) {
            console.log(error);
            alert('Nesto je poslo kako ne velja, pogledaj u konzoli');
            return false;
        }
        
    },
    calculate: ()=>{
        calculator.action = 'calculate';
    },
}

// ==========================================================================================================
// Calculator buttons definitions array
// Stored in order they appear, left to rigth, top to bottom
// Each button is an array containint: Symbol, Callback function activated on click, button size, button color
// Array can contain more defintions but they would have to be accounted for in calculator.create function
// ===========================================================================================================
calculatorButtons = [
    { 'symbol':'c', 'callback': ()=>{ calculator.clear() }, 'size': 1, 'color':'#ff0000' },
    { 'symbol':'∓', 'callback': ()=>{ calculator.doAction('flip') }, 'size': 1, 'color':'default' },
    { 'symbol':'%', 'callback': ()=>{ calculator.doAction('percentage') }, 'size': 1, 'color':'default' },
    { 'symbol':'÷', 'callback': ()=>{ calculator.doAction('divide') }, 'size': 1, 'color':'default' },
    { 'symbol':'7', 'callback': ()=>{ calculator.input(7) }, 'size': 1, 'color':'default' },
    { 'symbol':'8', 'callback': ()=>{ calculator.input(8) }, 'size': 1, 'color':'default' },
    { 'symbol':'9', 'callback': ()=>{ calculator.input(9) }, 'size': 1, 'color':'default' },
    { 'symbol':'×', 'callback': ()=>{ calculator.doAction('multiply') }, 'size': 1, 'color':'default' },
    { 'symbol':'4', 'callback': ()=>{ calculator.input(4) }, 'size': 1, 'color':'default' },
    { 'symbol':'5', 'callback': ()=>{ calculator.input(5) }, 'size': 1, 'color':'default' },
    { 'symbol':'6', 'callback': ()=>{ calculator.input(6) }, 'size': 1, 'color':'default' },
    { 'symbol':'-', 'callback': ()=>{ calculator.doAction('substract') }, 'size': 1, 'color':'default' },
    { 'symbol':'1', 'callback': ()=>{ calculator.input(1) }, 'size': 1, 'color':'default' },
    { 'symbol':'2', 'callback': ()=>{ calculator.input(2) }, 'size': 1, 'color':'default' },
    { 'symbol':'3', 'callback': ()=>{ calculator.input(3) }, 'size': 1, 'color':'default' },
    { 'symbol':'+', 'callback': ()=>{ calculator.doAction('add') }, 'size': 1, 'color':'default' },
    { 'symbol':'0', 'callback': ()=>{ calculator.input(0) }, 'size': 1, 'color':'default' },
    { 'symbol':'.', 'callback': ()=>{ calculator.input('.') }, 'size': 1, 'color':'default' },
    { 'symbol':'=', 'callback': ()=>{ calculator.doAction('calculate') }, 'size': 2, 'color':'#f57f36' },
]
// ===========================================================================================================
// ===========================================================================================================


// ===========================================================================================================
// Create some DOM element based on OPTIONS ARRAY
// Many DOM elements are to be created so best thing is to separate their creation into one functuon
// THIS IS A HELPER FUNCTION
// ===========================================================================================================
let element = {
    create: (options = { 'type': 'div', 'class': '', 'id': '', 'attribute': { 'name': null, 'value': '' }, 'event': null })=> {
        let el = document.createElement( options.type );
        if ( options.class ) el.setAttribute( 'class', options.class );
        if ( options.id ) el.setAttribute( 'id', options.id );
        if ( options.attribute ) {
            Object.values(options.attribute).forEach ((item, index)=>{
                if (item.name) el.setAttribute( item.name, item.value );
            });
        }
        if ( options.event ) el.addEventListener( options.event.name, options.event.funct );
        return el;
    }
}
// ===========================================================================================================
// ===========================================================================================================

function startme () {
    // Create root element
    let rootElement = document.createElement('div');
    rootElement.setAttribute('id', 'root');
    document.body.appendChild(rootElement);
    // creaate calculator and append it to the root element
    calculator.create( {'wrapper': rootElement } );
}
window.addEventListener('load', startme);