// ===========================================================================================================
// Create some DOM element based on OPTIONS ARRAY
// Many DOM elements are to be created so best thing is to separate their creation into one functuon
// THIS IS A HELPER FUNCTION
// ===========================================================================================================
class Element {
    constructor (options = { 'type': 'div', 'class': '', 'id': '', 'attribute': { 'name': null, 'value': '' }, 'event': null, 'content': '' }) {
        let el = document.createElement( options.type );
        if ( options.class ) el.setAttribute( 'class', options.class );
        if ( options.id ) el.setAttribute( 'id', options.id );
        if ( options.attribute ) {
            Object.values(options.attribute).forEach ((item, index)=>{
                if (item.name) el.setAttribute( item.name, item.value );
            });
        }
        if ( options.content ) el.innerHTML = options.content;
        if ( options.event ) console.log(options.event.name)
        if ( options.event ) el.addEventListener( options.event.name, options.event.funct );
        return el;
    }
}

// ===========================================================================================================
// ===========================================================================================================



class Calculator {
    constructor ( domInsertPoint, calcDefs =[] ) {
        this.create (domInsertPoint, calcDefs);
        this.rootEl = domInsertPoint;
    }
    calculations = [''];
    currentValue = 0;
    currenSum = 0;
    create (domInsertPoint, calcDefs) {
        let calculator = new Element ({ 'type': 'div', 'id': 'calculator' }); // Create DOM element to hold calculator elements
        let display = new Element ({ 'type': 'div', 'id': 'display' }); // Create DOM element to hold numbers and actions
        let curNumDisplay = new Element ({ 'type': 'div', 'id': 'cur-display' }); // Create DOM element to hold current number
        display.appendChild(curNumDisplay);
        calculator.appendChild(display);
        this.curDisp = curNumDisplay;

        // Setting up the keyboard
        [...calcDefs].forEach( ( item ) => {
            item['size'] == 2 ? item.btnClass = 'simple-button-2r' : item.btnClass = 'simple-button';
            let name = new Element ( { 'type': 'p', 'class': 'button-text', 'content': item['symbol'] } );
            let button = new Element ( { 
                'type': 'div', 
                'class': 'button ' + item.btnClass, 
                'content': name.outerHTML, 
            } );
            let functName = item['callback'].name;
            let attr = item['callback'].attribute;
            button.addEventListener ( 'click' , ( ) => { this[functName](attr) } )
            if ( item['color'] != 'default' ) button.style.backgroundColor = item['color']; // if #color is specified in options
            calculator.appendChild(button);
        } );

        domInsertPoint.appendChild(calculator); // sets everything in the DOM 
    }
    clear () {
       this.calculations = [''];
       this.currentValue = 0;
       this.render();
    }
    doAction (action) {
        console.log ('doAction', action);
        this.calculations.push (action);
        this.currenSum == 0 ? this.currenSum = this.currentValue : false; 
        switch (action) {

        }
    }
    input (e) {
        let lng = this.calculations.length - 1;
        if (Number( this.calculations[ lng ] ) != this.calculations[ lng ] ) this.calculations.push('');    
        String( this.calculations[ lng ] ).length > 0 ?   this.calculations[ lng ] = this.calculations[ lng ] + e : this.calculations[ lng ] = e;
        this.render();
    }
    render () {
        this.curDisp.innerHTML = '<p id="current-numbers">' + this.calculations[ this.calculations.length - 1 ] + '</p>';
        let scale = this.curDisp.clientWidth / this.curDisp.getElementsByTagName('p')[0].clientWidth;
        console.log(scale);
        scale < 1 ? this.curDisp.getElementsByTagName('p')[0].setAttribute ('style', 'transform: scale(' + scale + ');') : true;
    }
}



const calcDefs = [
    { 'symbol':'c', 'callback': {'name':'clear', 'attribute':''}, 'size': 1, 'color':'#ff0000' },
    { 'symbol':'∓', 'callback': { 'name': 'doAction', 'attribute': 'flip'}, 'size': 1, 'color':'default' },
    { 'symbol':'%', 'callback': { 'name': 'doAction', 'attribute': 'percentage'}, 'size': 1, 'color':'default' },
    { 'symbol':'÷', 'callback': { 'name': 'doAction', 'attribute': 'divide'}, 'size': 1, 'color':'default' },
    { 'symbol':'7', 'callback': { 'name': 'input', 'attribute': '7'}, 'size': 1, 'color':'default' },
    { 'symbol':'8', 'callback': { 'name': 'input', 'attribute': '8'}, 'size': 1, 'color':'default' },
    { 'symbol':'9', 'callback': { 'name': 'input', 'attribute': '9'}, 'size': 1, 'color':'default' },
    { 'symbol':'×', 'callback': { 'name': 'doAction', 'attribute': 'multiply'}, 'size': 1, 'color':'default' },
    { 'symbol':'4', 'callback': { 'name': 'input', 'attribute': '4'}, 'size': 1, 'color':'default' },
    { 'symbol':'5', 'callback': { 'name': 'input', 'attribute': '5'}, 'size': 1, 'color':'default' },
    { 'symbol':'6', 'callback': { 'name': 'input', 'attribute': '6'}, 'size': 1, 'color':'default' },
    { 'symbol':'-', 'callback': { 'name': 'doAction', 'attribute': 'substract'}, 'size': 1, 'color':'default' },
    { 'symbol':'1', 'callback': { 'name': 'input', 'attribute': '1'}, 'size': 1, 'color':'default' },
    { 'symbol':'2', 'callback': { 'name': 'input', 'attribute': '2'}, 'size': 1, 'color':'default' },
    { 'symbol':'3', 'callback': { 'name': 'input', 'attribute': '3'}, 'size': 1, 'color':'default' },
    { 'symbol':'+', 'callback': { 'name': 'doAction', 'attribute': 'add'}, 'size': 1, 'color':'default' },
    { 'symbol':'0', 'callback': { 'name': 'input', 'attribute': '0'}, 'size': 1, 'color':'default' },
    { 'symbol':'.', 'callback': { 'name': 'input', 'attribute': '.'}, 'size': 1, 'color':'default' },
    { 'symbol':'=', 'callback': { 'name': 'doAction', 'attribute': 'calculate'}, 'size': 2, 'color':'#f57f36' },
]

function startme () {
    // Create root element
    const rootElement = document.createElement('div');
    rootElement.setAttribute('id', 'root');
    document.body.appendChild(rootElement);
    // creaate calculator and append it to the root element
    const calculator = new Calculator(rootElement, calcDefs)
}
window.addEventListener('load', startme);