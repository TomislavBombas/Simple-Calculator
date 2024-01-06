class Calculator {
    constructor ( defs={}, domInsertPoint = document.getElementsByTagName ('body')[0] ) {
        this.defs = defs
        this.generate ();
    }

    generate () {
        console.log (this.defs)
    }
}

const calcDefs = [
    { 'symbol':'c', 'callback': {'name': 'clear', 'attribute':''}, 'size': 1, 'color':'#ff0000' },
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


let calc = new Calculator (calcDefs);