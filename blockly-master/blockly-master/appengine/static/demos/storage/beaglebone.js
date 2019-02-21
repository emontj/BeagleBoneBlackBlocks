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
  var code = "return " + 
  (Blockly.JavaScript.valueToCode(block, "NAME", Blockly.JavaScript.ORDER_NONE) || "''") + ";\n";
  return code;

};


