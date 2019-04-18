goog.require('Blockly.Blocks');
goog.require('Blockly');

Blockly.Blocks['light'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn")
        .appendField(new Blockly.FieldDropdown([["red","R"], ["yellow","Y"], ["green","G"]]), "lights")
        .appendField(new Blockly.FieldDropdown([["on","on"], ["off","off"]]), "switchs");
	this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);	
    this.setColour(165);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['light'] = function(block) {
  var dropdown_light = block.getFieldValue('lights');
  var dropdown_switch = block.getFieldValue('switchs');
  // TODO: Assemble JavaScript into code variable.
  if(dropdown_switch == "on"){
	  var code = "document.getElementById('switch').style.backgroundColor='red';\n";
  }
  if(dropdown_switch == "off"){
	  var code = "document.getElementById('switch').style.backgroundColor='white';\n";
  }
  return code;
};



Blockly.Blocks['led'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("LED")
        .appendField(new Blockly.FieldDropdown([["USR0","0"], ["USR1","1"], ["USR2","2"], ["USR3","3"]]),"ledvar");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['led'] = function(block) {
  var dropdown_name = block.getFieldValue('ledvar');
  // TODO: Assemble JavaScript into code variable.
  var code = "var b = require('bonescript');"; 
  if (dropdown_name == "3"){
	  //var code = "document.getElementById('switch').style.backgroundColor='red';";
	   code += "var led = 'USR3';\n";
  }else if (dropdown_name == "2"){
	     code += "var led = 'USR2';\n";
  }else if (dropdown_name == "1"){
	     code += "var led = 'USR1';\n";
  }else if (dropdown_name == "0"){
	     code += "var led = 'USR0';\n";
  }
  return code;
};

Blockly.Blocks['state'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set state")
        .appendField(new Blockly.FieldNumber(0), "statevar");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['state'] = function(block) {
  var number_name = block.getFieldValue('statevar');
  // TODO: Assemble JavaScript into code variable.
  var code ="";
    if (number_name == "0"){
	  code = "var state = 0;"; 
  }
  return code;
};

Blockly.Blocks['get_temp'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Get temp value from sensor");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['get_temp'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'var analogRead = 1969.84; \n var vin = 3.3 * analogRead / 4096.0; \n';
  return code;
};



 
Blockly.Blocks['print_val'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Print original value from sensor");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
  
Blockly.JavaScript['print_val'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'console.log("LM19: "); \n console.log("vin=");\n console.log(vin);\n console.log("  ");\n';
  return code;
};

Blockly.Blocks['to_cel'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Convert temp to celcius");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['to_cel'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = ' var tempC = (1.8663 - vin) / 0.01169; \n';
  return code;
};

Blockly.Blocks['print_cel'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Print celsius temp");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['print_cel'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'console.log("tempC="); \nconsole.log(tempC);\n';
  return code;
};


Blockly.Blocks['to_far'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Convert temp to farenheit ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


Blockly.JavaScript['to_far'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'var tempF = 1.8 * ((1.8663 - vin) / 0.01169) + 32.0;\n';
  return code;
};


Blockly.Blocks['print_far'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Print farenheit temp");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['print_far'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'console.log("tempF="); \nconsole.log(tempF);\n';
  return code;
};

Blockly.Blocks['set_int'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set Interval")
        .appendField(new Blockly.FieldNumber(100, 0), "interval");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['set_int'] = function(block) {
  var number_interval = block.getFieldValue('interval');
  // TODO: Assemble JavaScript into code variable.
  var code = 'toggleLED = function() { \n state = state ? 0 : 1; \n b.digitalWrite(led, state); }; \ntimer = setInterval(toggleLED, ' + number_interval +');\n';
  return code;
};

Blockly.Blocks['set_out'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set Timeout")
        .appendField(new Blockly.FieldNumber(1000, 0), "timeout");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


Blockly.JavaScript['set_out'] = function(block) {
  var number_timeout = block.getFieldValue('timeout');
  // TODO: Assemble JavaScript into code variable.
  var code = 'stopTimer = function() { clearInterval(timer);}; setTimeout(stopTimer, '+number_timeout+');\n';
  return code;
};

Blockly.Blocks['print'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck(null)
        .appendField("print");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['print'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "console.log(" + 
  (Blockly.JavaScript.valueToCode(block, "NAME", Blockly.JavaScript.ORDER_NONE) || "''") + ");\n";
  return code;

};


Blockly.Blocks['read_temp_cel'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("read temperature (Celsius) from Pin #")
        .appendField(new Blockly.FieldTextInput("P9_40"), "pin")
        .appendField("into variable")
        .appendField(new Blockly.FieldVariable("item"), "var");
    this.setOutput(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['read_temp_cel'] = function(block) {
  var pin_num = block.getFieldValue('pin');
  var variable = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var'), Blockly.Variables.NAME_TYPE);
  // TODO: Assemble JavaScript into code variable.
  var code = "b.analogRead(\""+pin_num+"\", printTemp);  var currentTime = new Date().getTime(); while (currentTime + 3000 >= new Date().getTime()) {}function printTemp(aRead) { var x = (aRead.value * 1800/1024);"+ variable+" =  100*x -50; };"

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};



Blockly.Blocks['read_temp_far'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("read temp (Celsius) from Pin #")
        .appendField(new Blockly.FieldTextInput("P9_40"), "pin");
    this.setOutput(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['read_temp_far'] = function(block) {
  var pin_num = block.getFieldValue('pin');
  // TODO: Assemble JavaScript into code variable.
  var code = "b.analogRead("+pin_num+", printTemp); function printTemp(aRead) { var x = (aRead.value * (1800/1024)); return ((100*x -50)*9/5)+32; };"
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['move_servo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("set servo from pin #")
        .appendField(new Blockly.FieldTextInput("P9_40"), "pin")
        .appendField("to")
        .appendField(new Blockly.FieldDropdown([["90","90"], ["180","180"], ["270","270"]]), "degree")
        .appendField("degrees");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['move_servo'] = function(block) {
  var pin = block.getFieldValue('pin');
  var degree = block.getFieldValue('degree');
  // TODO: Assemble JavaScript into code variable.
  var code = " b.pinMode(\""+pin+"\", b.ANALOG_OUTPUT); var duty_cycle = 1/18* "+degree+" + 2; b.analogWrite(\""+pin+"\", duty_cycle, 500);";
  return code;
};