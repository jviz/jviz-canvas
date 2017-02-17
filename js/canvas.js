//Canvas layer component
//
// Arguments:
// opt: an object with the following keys:
// - id: the tool id
// - class: the tool class
// - parent: the parent ID (mandatory)
// - layers: the number of canvas layers (mandatory)
// - width: the tool width
// - height: the tool height
// - margin: an object with the tool margins. Default: { left: 50, right: 50, top: 30, bottom: 30 }
//

//Initialize the component
jviz.components.canvas = new jviz.component({ attributes: [ 'layers', 'width', 'height' ] });

//Init function
jviz.components.canvas.prototype._init = function()
{
  //Main canvas ID
  this._id = jviz.misc.get_id({ prefix: 'jviz-canvas-', length: 5 });

  //Main canvas class
  this._class = 'jviz-components-canvas';

  //Object width
  this._width = 0;

  //Object height
  this._height = 0;

  //Canvas object
  this._canvas = {};
  this._canvas.id = this._id + '-canvas'; //Canvas ID
  this._canvas.class = this._class + '-canvas'; //Canvas class

  //Draw object
  this._draw = {};
  this._draw.width = 0; //Draw width
  this._draw.height = 0; //Draw height
  this._draw.margin = { top: 0, bottom: 0, left: 0, right: 0 }; //Default margin

  //Layers elements
  this._layers = {};
  this._layers.num = 0; //Number of layers
  this._layers.el = []; //Layers elements
  this._layers.id = []; //Layers id names
};

//Create event
jviz.components.canvas.prototype._created = function()
{
  //Update the component id
  this._id = this._parse_id(this._id);

  //Add the class
  jviz.dom.class.add(this, this._class);

  //Build the canvas container
  //this.innerHTML = jviz.dom.render('div', { id: this._id, class: this._class });

  //Display the provided number of layers
  if(this.getAttribute('layers') !== null){ this.build_layers(this.getAttribute('layers')); }

  //Set the layers size
  if(this.getAttribute('width') !== null){ this.set_size({ width: this.getAttribute('width') }); }

  //Get the height
  if(this.getAttribute('height') !== null){ this.set_size({ height: this.getAttribute('height') }); }
};

//Destroyed event
jviz.components.canvas.prototype._destroyed = function()
{

};

//Attribute change
jviz.components.canvas.prototype._attribute = function(name, old_value, new_value)
{
  //Check the layers number
  if(name === 'layers'){ return this.build_layers(new_value); }

  //Check the width value
  else if(name === 'width'){ return this.set_size({ width: new_value }); }

  //Check the height value
  else if(name === 'height'){ return this.set_size({ height: new_value }); }
};

//Build the layers
jviz.components.canvas.prototype.build_layers = function(num)
{
  //Clear the container
  jviz.dom.html(this._id, '');

  //Save the number of layers
  this._layers.num = parseInt(num);

  //Reset the layers elements
  this._layers.el = [];

  //Reset the layers ids
  this._layers.id = [];

  //Build the layers
  for(var i = 0; i < this._layers.num; i++)
  {
    //Generate the layer ID
    var layer_id = this.layer_id(i);

    //Get the layer html
    var layer_html = jviz.dom.render('canvas', { id: layer_id, class: this._canvas.class });

    //Add the layer
    jviz.dom.append(this._id, layer_html);

    //Save the layer ID
    this._layers.id.push(layer_id);
  }

  //Initialize the canvas elements
  for(var i = 0; i < this._layers.num; i++)
  {
    //Get the canvas element
    var el = new jviz.canvas({ id: this._layers.id[i], width: this._width, height: this._height });

    //Initialize the new canvas object
    this._layers.el.push(el);
  }

  //Exit
  return this;
};

//Add the margins
jviz.components.canvas.prototype.set_margin = function(opt)
{
  //Check the options
  if(typeof opt !== 'object'){ return this._draw.margin; }

  //Check the margin top value
  if(typeof opt.top !== 'undefined'){ this._draw.margin.top = parseInt(opt.top); }

  //Check margin bottom value
  if(typeof opt.bottom !== 'undefined'){ this._draw.margin.bottom = parseInt(opt.bottom); }

  //Check the margin left value
  if(typeof opt.left !== 'undefined'){ this._draw.margin.left = parseInt(opt.left); }

  //Check the margin right value
  if(typeof opt.right !== 'undefined'){ this._draw.margin.right = parseInt(opt.right); }

  //Resize the draw
  this.draw_resize();

  //Continue
  return this;
};

//Set the object size
jviz.components.canvas.prototype.set_size = function(opt)
{
  //Check the width value
  if(typeof opt.width !== 'undefined'){ jviz.dom.width(this._id, opt.width); }

  //Check the height value
  if(typeof opt.height !== 'undefined'){ jviz.dom.height(this._id, opt.height); }

  //Resize
  return this.resize();
};

//Get the object size
jviz.components.canvas.prototype.get_size = function()
{
  //Return the object size
  return { width: this._width, height: this._height };
};

//Get the draw object
jviz.components.canvas.prototype.get_draw = function(){ return this._draw; };

//Get the layer
jviz.components.canvas.prototype.get_layer = function(index)
{
  //Check the index
  if(typeof index === 'undefined'){ return jviz.console.error('No layer index provided', null); }

  //Parse the index
  index = parseInt(index);

  //Check the index value
  if(index < 0 || index > this._layers.num){ return jviz.console.error('Invalid layer index', null); }

  //Return the layer element
  return this._layers.el[index];
};

//Get the number of layers
jviz.components.canvas.prototype.layer_num = function()
{
  //Return the layers number
  return this._layers.num;
};

//Get the layer ID
jviz.components.canvas.prototype.layer_id = function(index)
{
  //Build the layer ID
  return this._canvas.id + '-' + index;
};

//Update the size of the layer i
jviz.components.canvas.prototype.layer_size = function(index, width, height)
{
  //Update the width
  this._layers.el[index]._id.width = width;

  //Update the height
  this._layers.el[index]._id.height = height;
};

//Get the layer width
jviz.components.canvas.prototype.get_width = function(){ return this._width; };

//Get the layer height
jviz.components.canvas.prototype.get_height = function(){ return this._height; };

//Set the layer width
jviz.components.canvas.prototype.set_width = function(value)
{
  //Set the canvas size
  return this.set_size({ width: value });
};

//Set the layer height
jviz.components.canvas.prototype.set_height = function(value)
{
  //Set the canvas size
  return this.set_size({ height: value });
};

//Resize the tool
jviz.components.canvas.prototype.resize = function()
{
  //Get the width
  this._width = jviz.dom.width(this._id);

  //Get the height
  this._height = jviz.dom.height(this._id);

  //Read all the layers
  for(var i = 0; i < this._layers.num; i++)
  {
    //Update the size
    this.layer_size(i, this._width, this._height);
  }

  //Resize the draw
  return this.draw_resize();
};

//Clear all layers
jviz.components.canvas.prototype.clear = function()
{
  //Read all the canvas layers
  for(var i = 0; i < this._layers.num; i++)
  {
    //Clear this layer
    this._layers.el[i].clear();
  }

  //Exit
  return this;
};

//Draw test
jviz.components.canvas.prototype.draw_test = function()
{
  //Get the first canvas layer
  var canvas = this._layers.el[0];

  //Draw the test zone rectangle
  canvas.rect({ x: this._draw.margin.left, y: this._draw.margin.top, width: this._draw.width, height: this._draw.height });

  //Add the fill color
  canvas.fill({ color: jviz.colors.navy.hex, opacity: 0.2 });

  //Return this
  return this;
};

//Resize the draw zone
jviz.components.canvas.prototype.draw_resize = function()
{
  //Resize the draw width
  this._draw.width = Math.max(0, this._width - this._draw.margin.left - this._draw.margin.right);

  //Resize the draw height
  this._draw.height = Math.max(0, this._height - this._draw.margin.top - this._draw.margin.bottom);

  //Continue
  return this;
};

//Register the canvas element
window.customElements.define('jviz-canvas', jviz.components.canvas);
