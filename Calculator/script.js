var clearEntry = false;
var evalExpression = "";
var lastOperator = "";
var prevEntry = "";
var result = 0;

function evalAndSetValue(expression) {
    result = eval(expression);
    var value = result.toString();
    if (value.length > 8)
        setValue(value.substring(0, 8));
    else
        setValue(value);
}

function evaluateExpression() {
    if (evalExpression.length > 0) {
        if (!clearEntry || lastOperator.length > 0)
            evalExpression += " " + getValue();
        evalAndSetValue(evalExpression);
        setExpression("")
    }
    else if (lastOperator.length > 0) {
        var expression = result + " " + lastOperator + " " + prevEntry;
        evalAndSetValue(expression);
    }
    clearEntry = true;
}

function addInput(btn) {
    var input = getValue();

    if (clearEntry || input == "0") {
        input = "";
        clearEntry = false;
    }
    input = input + $(btn).text();

    setValue(input);
}

function addFunction(btn) {
    var func = $(btn).attr('name');
    var text = $(btn).text();
    var expression = getExpression();
    var value = getValue();

    var addToEval = "";
    var valueSet = "";
    var addToExp = "";

    switch (func) {
        case "percent":
            var entry = parseFloat(prevEntry.length > 0 ? prevEntry : "0");
            var percent = parseFloat(entry) / 100;
            var result = value * percent;
            addToEval = valueSet = addToExp = result;
            break;
        case "sqrt":
            addToEval = "Math.sqrt(" + value + ")";
            valueSet = Math.sqrt(value);
            addToExp = text + "(" + value + ")";
            break;
        case "square":
            addToEval = "Math.pow(" + value + ",2)";
            valueSet = Math.pow(value, 2);
            addToExp = "(" + value + ")<sup>2</sup>";
            break;
        case "fraction":
            addToEval = "(1 / " + value + ")";
            valueSet = 1 / value;
            addToExp = "1/(" + value + ")";
            break;
    }

    addToExpressions(addToExp, addToEval);
    setValue(valueSet);
    clearEntry = true;
    lastOperator = "";
}

function addOperator(btn) {
    var func = $(btn).attr('name');
    var value = $(btn).text();
    var expression = getExpression();
    var input = getValue();

    if (clearEntry) {
        if (lastOperator.length > 0) {
            setExpression(expression.substring(0, expression.length - 1) + value);
            evalExpression = evalExpression.substring(0, evalExpression.length - 1) + func;
        }
        else {
            //addToExpressions(input, input);
            evalAndSetValue(evalExpression);
            addToExpressions(value, func);
        }
    }
    else {
        addToExpressions(input, input);
        evalAndSetValue(evalExpression);
        addToExpressions(value, func);
    }

    prevEntry = input;
    clearEntry = true;
    lastOperator = func;
}

function backspace() {
    var input = getValue();
    if (input == "0" || clearEntry)
        return;

    input = input.substring(0, input.length - 1);
    if (input.length == 0 || input == "-")
        input = "0";

    setValue(input);
}

function setSign() {
    var value = getValue();
    if (value == "0")
        return;

    if (value.startsWith('-'))
        value = value.substring(1);
    else
        value = "-" + value;

    setValue(value);
}

function addDecimal() {
    var value = getValue();
    if (value.indexOf(".") == -1)
        value += ".";
    setValue(value);
}

function clearAll() {
    setValue("0");
    setExpression("");
    lastOperator = "";
}

function addToExpressions(exp, eval) {
    evalExpression += " " + eval;
    evalExpression = evalExpression.trim();

    var expression = getExpression();
    expression += " " + exp;
    setExpression(expression.trim());
}

function getValue() {
    return $('#value').text();
}

function setValue(value) {
    $('#value').text(value);
}

function getExpression() {
    return $('#expression').html();
}

function setExpression(expression) {
    $('#expression').html(expression);
    if (expression == "") {
        evalExpression = "";
    }
}