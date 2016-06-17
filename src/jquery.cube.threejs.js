/*
 * Copyright 2016 Jason Graves (GodLikeMouse/Collaboradev)
 * http://www.collaboradev.com
 *
 * This file is part of jquery.cube.threejs.js.
 *
 * The jquery.cube.threejs.js plugin is free software: you can redistribute it
 * and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * The jquery.cube.threejs.js plugin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with the jquery.cube.threejs.js plugin. If not, see http://www.gnu.org/licenses/.
 */

$.fn.cube = function(options) {

    var _ref = this;
    var _renderer = null;
    var _scene = null;
    var _camera = null;
    var _cube = [];
    var _pivot = null;

    //extend default options
    options = $.extend(true, {
        type: 3,
        camera: {
            x: 50,
            y: 50,
            z: 100
        },
        size: {
            width: 60,
            height: 60
        },
        color: [
            0xff0000, //right
            0xff8000, //left
            0xffff00, //top
            0xffffff, //bottom
            0x0000ff, //front
            0x00ff00, //back
			0x000000 //cube color
        ],
        background: 0x1D1F20,
        animation: {
            delay: 250
        },
        onTurn: $.noop,
        onComplete: $.noop
    }, options);

	//method for resetting the cube back to its default state
	_ref.reset = function(){

		//remove all children from the scene
		for(var i=_scene.children.length - 1; i >= 0; i--){
			_scene.remove(_scene.children[i]);
		}

		//recreate cube
		_cube = [];
		createCube();
	}

    //method for executing a single move/turn
    _ref.turn = function(move){

        options.onTurn(_ref, move);

        var property = null;
        var radian = Math.PI/180;
        var cubits = null;
        var rotation = 0;


        //remove all cubits from pivot
        for(var i=_pivot.children.length -1; i>=0; i--){
            _scene.add(_pivot.children[i]);
            _pivot.remove(_pivot.children[i]);
        }

        _pivot.children = [];

        switch(move){
			case "U":
                property = "y";
                cubits = getCubits(property, options.type-1);
                cubits.to = generateToArray(cubits, "cw");
                rotation = -90;
                break;

            case "U'":
                property = "y";
                cubits = getCubits(property, options.type-1);
                cubits.to = generateToArray(cubits, "ccw");
                rotation = 90;
				break;

            case "u":
                property = "y";
                var f1 = getCubits(property, options.type-2);
                var f2 = getCubits(property, options.type-1);

                if(options.type == 3)
                    cubits = f1.concat(f2);
                else
                    cubits = f1;

                cubits.to = generateToArray(f1, "ccw");

                if(options.type > 3)
                    cubits.to = cubits.to.concat(generateToArray(f2, "ccw"));

                rotation = -90;
				break;

            case "u'":
                property = "y";
				var f1 = getCubits(property, options.type-2);
                var f2 = getCubits(property, options.type-1);

                if(options.type == 3)
                    cubits = f1.concat(f2);
                else
                    cubits = f1;

                cubits.to = generateToArray(f1, "cw");

                if(options.type > 3)
                    cubits.to = cubits.to.concat(generateToArray(f2, "cw"));

                rotation = 90;
				break;

			case "R":
                property = "x";
                cubits = getCubits(property, options.type-1);
                cubits.to = generateToArray(cubits, "cw");
                rotation = -90;
				break;

            case "R'":
				property = "x";
                cubits = getCubits(property, options.type-1);
                cubits.to = generateToArray(cubits, "ccw");
                rotation = 90;
				break;

            case "r":
                property = "x";
				var f1 = getCubits(property, options.type-2);
                var f2 = getCubits(property, options.type-1);

                if(options.type == 3)
                    cubits = f1.concat(f2);
                else
                    cubits = f1;

                cubits.to = generateToArray(f1, "cw");

                if(options.type == 3)
                    cubits.to = cubits.to.concat(generateToArray(f2, "cw"));

                rotation = -90;
				break;

            case "r'":
				property = "x";
				var f1 = getCubits(property, options.type-2);
                var f2 = getCubits(property, options.type-1);

                if(options.type == 3)
                    cubits = f1.concat(f2);
                else
                    cubits = f1;

                cubits.to = generateToArray(f1, "ccw");

                if(options.type == 3)
                    cubits.to = cubits.to.concat(generateToArray(f2, "ccw"));

                rotation = 90;
				break;

			case "D":
                property = "y";
                cubits = getCubits(property, 0);
                cubits.to = generateToArray(cubits, "ccw");
                rotation = 90;
				break;

            case "D'":
                property = "y";
                cubits = getCubits(property, 0);
                cubits.to = generateToArray(cubits, "cw");
                rotation = -90;
				break;

            case "d":
                property = "y";
				var f1 = getCubits("y", 0);
                var f2 = getCubits("y", 1);

                if(options.type == 3)
                    cubits = f1.concat(f2);
                else
                    cubits = f1;

                cubits.to = generateToArray(f1, "ccw");

                if(options.type == 3)
                    cubits.to = cubits.to.concat(generateToArray(f2, "ccw"));

                rotation = 90;
				break;

            case "d'":
				property = "y";
				var f1 = getCubits(property, 0);
                var f2 = getCubits(property, 1);

                if(options.type == 3)
                    cubits = f1.concat(f2);
                else
                    cubits = f1;

                cubits.to = generateToArray(f1, "cw");

                if(options.type == 3)
                    cubits.to = cubits.to.concat(generateToArray(f2, "cw"));

                rotation = -90;
				break;

			case "L":
				property = "x";
				cubits = getCubits(property, 0);
                cubits.to = generateToArray(cubits, "ccw");
                rotation = 90;
				break;

			case "L'":
				property = "x";
				cubits = getCubits(property, 0);
                cubits.to = generateToArray(cubits, "cw");
                rotation = -90;
				break;

            case "l":
                property = "x";
                var f1 = getCubits(property, 1);
                var f2 = getCubits(property, 0);

                if(options.type == 3)
                    cubits = f1.concat(f2);
                else
                    cubits = f1;

                cubits.to = generateToArray(f1, "cw");

                if(options.type == 3)
                    cubits.to = cubits.to.concat(generateToArray(f2, "cw"));

                rotation = 90;
				break;

            case "l'":
                property = "x";
                var f1 = getCubits(property, 1);
                var f2 = getCubits(property, 0);

                if(options.type == 3)
                    cubits = f1.concat(f2);
                else
                    cubits = f1;

                cubits.to = generateToArray(f1, "cw");

                if(options.type == 3)
                    cubits.to = cubits.to.concat(generateToArray(f2, "cw"));

                rotation = -90;
				break;

			case "F":
                property = "z";
				cubits = getCubits(property, options.type-1);
                cubits.to = generateToArray(cubits, "cw");
                rotation = -90;
				break;

			case "F'":
				property = "z";
				cubits = getCubits(property, options.type-1);
                cubits.to = generateToArray(cubits, "ccw");
                rotation = 90;
				break;

            case "f":
				property = "z";
                var f1 = getCubits(property, options.type-2);
				var f2 = getCubits(property, options.type-1);

                if(options.type == 3)
                    cubits = f1.concat(f2);
                else
                    cubits = f1;

                cubits.to = generateToArray(f1, "cw");

                if(options.type > 3)
                    cubits.to = cubits.to.concat(generateToArray(f2, "cw"));

                rotation = -90;
				break;

            case "f'":
				property = "z";
                var f1 = getCubits(property, options.type-2);
				var f2 = getCubits(property, options.type-1);

                if(options.type == 3)
                    cubits = f1.concat(f2);
                else
                    cubits = f1;

                cubits.to = generateToArray(f1, "ccw");

                if(options.type > 3)
                    cubits.to = cubits.to.concat(generateToArray(f2, "ccw"));

                rotation = 90;
				break;

			case "B":
				property = "z";
				cubits = getCubits(property, 0);
                cubits.to = generateToArray(cubits, "ccw");
                rotation = 90;
				break;

			case "B'":
				property = "z";
				cubits = getCubits(property, 0);
                cubits.to = generateToArray(cubits, "cw");
                rotation = -90;
				break;

            case "b":
				property = "z";
				var f1 = getCubits(property, 0);
                var f2 = getCubits(property, 1);

                if(options.type == 3)
                    cubits = f1.concat(f2);
                else
                    cubits = f1;

                cubits.to = generateToArray(f1, "ccw");

                if(options.type > 3)
                    cubits.to = cubits.to.concat(generateToArray(f2, "ccw"));

                rotation = 90;
				break;

            case "b'":
				property = "z";
				var f1 = getCubits(property, 0);
                var f2 = getCubits(property, 1);

                if(options.type == 3)
                    cubits = f1.concat(f2);
                else
                    cubits = f1;

                cubits.to = generateToArray(f1, "cw");

                if(options.type > 3)
                    cubits.to = cubits.to.concat(generateToArray(f2, "cw"));

                rotation = -90;
				break;

            case "M":
                if(options.type % 2 != 0){
                    property = "x";
                    var layer = parseInt(options.type/2);
                    cubits = getCubits(property, layer);
                    cubits.to = generateToArray(cubits, "cw");
                    rotation = 90;
                }
				break;

            case "M'":
                if(options.type % 2 != 0){
                    property = "x";
                    var layer = parseInt(options.type/2);
                    cubits = getCubits(property, layer);
                    cubits.to = generateToArray(cubits, "ccw");
                    rotation = -90;
                }
				break;

            case "E":
                if(options.type % 2 != 0){
                    property = "y";
                    var layer = parseInt(options.type/2);
                    cubits = getCubits(property, layer);
                    cubits.to = generateToArray(cubits, "cw");
                    rotation = -90;
                }
                break;

            case "E'":
                if(options.type % 2 != 0){
                    property = "y";
                    var layer = parseInt(options.type/2);
                    cubits = getCubits(property, layer);
                    cubits.to = generateToArray(cubits, "ccw");
                    rotation = 90;
                }
                break;

            case "S":
                if(options.type % 2 != 0){
                    property = "z";
                    var layer = parseInt(options.type/2);
                    cubits = getCubits(property, layer);
                    cubits.to = generateToArray(cubits, "cw");
                    rotation = -90;
                }
                break;

            case "S'":
                if(options.type % 2 != 0){
                    property = "z";
                    var layer = parseInt(options.type/2);
                    cubits = getCubits(property, layer);
                    cubits.to = generateToArray(cubits, "ccw");
                    rotation = 90;
                }
                break;

            case "X":
                property = "x";

                //get all layers
                var f = [];
                var cubits = [];
                var to = [];
                for(var i=options.type-1; i>=0; i--){
                    var c = getCubits(property, i);
                    f.push(c);
                    cubits = cubits.concat(c);
                    to = to.concat(generateToArray(c, "cw"));
                }

                cubits.to = to;

                rotation = -90;
				break;

            case "X'":
                property = "x";

                //get all layers
                var f = [];
                var cubits = [];
                var to = [];
                for(var i=options.type-1; i>=0; i--){
                    var c = getCubits(property, i);
                    f.push(c);
                    cubits = cubits.concat(c);
                    to = to.concat(generateToArray(c, "ccw"));
                }

                cubits.to = to;

                rotation = 90;
				break;

            case "Y":
                property = "y";

                //get all layers
                var f = [];
                var cubits = [];
                var to = [];
                for(var i=options.type-1; i>=0; i--){
                    var c = getCubits(property, i);
                    f.push(c);
                    cubits = cubits.concat(c);
                    to = to.concat(generateToArray(c, "cw"));
                }

                cubits.to = to;

                rotation = -90;
				break;

            case "Y'":
                property = "y";

                //get all layers
                var f = [];
                var cubits = [];
                var to = [];
                for(var i=options.type-1; i>=0; i--){
                    var c = getCubits(property, i);
                    f.push(c);
                    cubits = cubits.concat(c);
                    to = to.concat(generateToArray(c, "ccw"));
                }

                cubits.to = to;

                rotation = 90;
				break;

            case "Z":
				property = "z";

                //get all layers
                var f = [];
                var cubits = [];
                var to = [];
                for(var i=options.type-1; i>=0; i--){
                    var c = getCubits(property, i);
                    f.push(c);
                    cubits = cubits.concat(c);
                    to = to.concat(generateToArray(c, "cw"));
                }

                cubits.to = to;

                rotation = -90;
				break;

            case "Z'":
				property = "z";

                //get all layers
                var f = [];
                var cubits = [];
                var to = [];
                for(var i=options.type-1; i>=0; i--){
                    var c = getCubits(property, i);
                    f.push(c);
                    cubits = cubits.concat(c);
                    to = to.concat(generateToArray(c, "ccw"));
                }

                cubits.to = to;

                rotation = 90;
				break;

            default:
                return;
		}

        //add children to pivot point
        $(cubits).each(function(){
            _pivot.add(this);
        })

        //animate turn
        $({rotation: _pivot.rotation[property]}).animate(
            {
                rotation: _pivot.rotation[property] + (rotation * radian)
            },
            {
                easing: "swing",
                step: function(now){
                    _pivot.rotation[property] = now;
                },
                duration: options.animation.delay,
                complete: function(){
                    orientCubits(cubits);

                    _ref.trigger("next-move");
                }
            }
        );

    }

    //method for executing a set of moves
    _ref.execute = function(moves){

        //parse moves from notation into individual moves
        moves = parse(moves);

        var ms = _ref.data("move-stack");
        if(ms){
            moves = ms.concat(moves);
        }

        console.info(moves)

		_ref.data("move-stack", moves);

        if(!ms)
            _ref.trigger("next-move");
	}

    //handle next move trigger
    _ref.on("next-move", function(e){

        var moves = _ref.data("move-stack");
        if(!moves)
            return;

        var move = moves.shift();

        if(!move)
            moves = null;

        _ref.data("move-stack", moves);

        if(move)
            _ref.turn(move);
        else
            options.onComplete(_ref);
	})

    //method for parsing moves string into individual moves
    function parse(moves){

        var allowed = ["U","u","R","r","D","d","L","l","F","f","B","b","M","E","S","X","Y","Z","2","'"];

        //clean unnecessary moves
        moves = moves
            .replace(/\(/gm,"")
            .replace(/\)/gm,"")
            .replace(/\[/gm,"")
            .replace(/\]/gm,"")
            .replace(/\n/gm," ");

        //replace old algorithm notation
        //Fw, Bw, Rw, Lw, Uw, Dw
        moves = moves
            .replace(/Fw/gm, "f")
            .replace(/Bw/gm, "b")
            .replace(/Rw/gm, "r")
            .replace(/Lw/gm, "l")
            .replace(/Uw/gm, "u")
            .replace(/Dw/gm, "d")
            .replace(/x/gm, "X")
            .replace(/y/gm, "Y")
            .replace(/z/gm, "Z");

        var m = moves.split(" ");
        var parsed = [];
        for(var i=0; i<m.length; i++){
            var move = m[i];

            //sanity check max length
            if(move.length == 0 || move.length > 3)
                continue;

            //sanity check move notation
            var sane = true;
            for(var j=0; j<move.length; j++){
                var segment = move[j];
                if($.inArray(segment, allowed) < 0){
                    sane = false;
                    break;
                }
            }

            if(!sane)
                continue;

            //check for numeric moves like U2' and B2
            //transform into separate moves
            //U2' => U' U'
            var repeat = move[1];
            if($.isNumeric(repeat)){
                move = move.replace(move[1], "");
                while(repeat--){
                    parsed.push(move);
                }
            }
            else{
                parsed.push(move);
            }

        }

        return parsed;
    }

	//method for creating a colored face texture based on another texture
	function colorFaceTexture(width, height, color){

		//optimize texture creation
		if(colorFaceTexture[color])
			return colorFaceTexture[color];

		//create in memory canvas
		var canvas = $("<canvas>").get(0);
		canvas.width = width;
		canvas.height = height;
		var context = canvas.getContext("2d");

		function _drawRoundRect(x, y, width, height, radius){
			context.beginPath();
			context.moveTo(x + radius, y);
			context.lineTo(x + width - radius, y);
			context.quadraticCurveTo(x + width, y, x + width, y + radius);
			context.lineTo(x + width, y + height - radius);
			context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			context.lineTo(x + radius, y + height);
			context.quadraticCurveTo(x, y + height, x, y + height - radius);
			context.lineTo(x, y + radius);
			context.quadraticCurveTo(x, y, x + radius, y);
			context.closePath();
			context.fill();
		}

		function _toHexColor(color){
			var c = new THREE.Color(color);

			var r = Number(c.r * 255).toString(16);
			var g = Number(c.g * 255).toString(16);
			var b = Number(c.b * 255).toString(16);

			r = r.toString().length < 2 ? "0" + r : r;
			g = g.toString().length < 2 ? "0" + g : g;
			b = b.toString().length < 2 ? "0" + b : b;

			return "#" + r + g + b;
		}

		//fill background with black
		context.fillStyle = _toHexColor(options.color[options.color.length-1]);
		context.fillRect(0, 0, width, height);

		//draw cubit face
		context.fillStyle = _toHexColor(color);
		_drawRoundRect(1, 1, width-2, height-2, 3);

		//create image from canvas
		var image = new Image();
		image.src = canvas.toDataURL();

		//create new texture
		var texture = new THREE.Texture(image);
		texture.anisotropy = 4;
		texture.needsUpdate = true;

		colorFaceTexture[color] = texture;

		return texture;
	}

    //method for creating the cubit
    function createCubit(point){

        //create cubit face material
        var materials = [];
        for(var i=0; i<6; i++){

            var color = options.color[i];
			var texture = colorFaceTexture(32, 32, color);

            var m = new THREE.MeshBasicMaterial(
				{
					map: texture,
					overdraw: 1
				}
			);

            materials.push(m);
        }

        //create cubit mesh model
        var material = new THREE.MeshFaceMaterial(materials);
		var tessellation = _renderer.type == "Canvas" ? 3 : 1;
        if(!createCubit.box)
            createCubit.box = new THREE.BoxGeometry(options.cubit.width, options.cubit.height, options.cubit.height, tessellation, tessellation, tessellation);
        var cubit = new THREE.Mesh(createCubit.box, material);

        //position cubit
        cubit.position.x = point.x;
        cubit.position.y = point.y;
        cubit.position.z = point.z;

        //add cubit to scene
        _scene.add( cubit );

        //add to cube array
        _cube.push(cubit);

        //set index property for orientation
        cubit.index = _cube.length-1;

        return cubit;
    }

    //method for creating the cube
    function createCube(){

        //determine individual cubit sizes divided by
        //overall cube width and height
        options.cubit = {
            width: options.size.width/options.type,
            height: options.size.height/options.type
        };

        //determine secondary offset adjustment for cubes
        //that are even (4,6,8,..)
        var offset = 0;
        if(options.type % 2 == 0)
            offset = options.cubit.width/2;

        var run = (options.type-( Math.ceil(options.type/2) ));

        var point = new THREE.Vector3(0, 0, 0);

        //iterate all layers, center cubits and offset from left to right
        for(var iz=0; iz<options.type; iz++){
            for(var iy=0; iy<options.type; iy++){
                for(var ix=0; ix<options.type; ix++){

                    point.x = options.cubit.width * (ix - run) + offset;
                    point.y = options.cubit.height * (iy - run) + offset;
                    point.z = options.cubit.height * (iz - run) + offset;

                    var cubit = createCubit(point);

                    //optimize non visible cubits
                    if(ix > 0 && ix < options.type-1 &&
                       iy > 0 && iy < options.type-1 &&
                       iz > 0 && iz < options.type-1)
                        cubit.visible = false;
                }
            }

            _pivot = new THREE.Object3D();
            _scene.add(_pivot);
        }

    }

    //method for handling rendering
    function render(){

        requestAnimationFrame(render);
        _renderer.render(_scene, _camera);
        _camera.lookAt(_pivot.position);
    }

    //method for retrieving cubits by layer
    //specifying plane x, y, z
    //and depth 0, 1, 2
    //for example:
    // U layer is
    //      plane: y
    //      depth: 0
    // R layer is
    //      plane: x
    //      depth: 2
    // B layer is
    //      plane: z
    //      depth: 0
    function getCubits(plane, depth){

        var type2 = options.type*options.type;

        switch(plane){
            case "y":
                //get all cubits along y layer
                var cubits = [];
                var my = depth*options.type;
                for(var y=0; y<options.type; y++){

                    for(var x=0; x<options.type; x++){
                        var mx = x;
                        cubits.push(_cube[my+mx]);
                    }

                    my += type2;
                }

                return cubits;

            case "x":
                //get all cubits along x layer
                var cubits = [];
                var my = type2+depth;
                for(var y=0; y<options.type; y++){

                    for(var x=0; x<options.type; x++){
                        var mx = (x+1)*options.type;
                        cubits.push(_cube[my-mx]);
                    }

                    my += type2;
                }

                return cubits;

            case "z":
                //get all cubits along z layer
                var cubits = [];
                var my = type2+(depth*type2)-options.type;
                for(var y=0; y<options.type; y++){

                    for(var x=0; x<options.type; x++){
                        var mx = x;
                        cubits.push(_cube[my+mx]);
                    }

                    my -= options.type;
                }

                return cubits;
        }
    }

    //method for generating the to array from
    //a set of cubits and the move direction
    function generateToArray(cubits, move){

        if(move == "cw"){

            //grab vertical slices for clockwise movement
            //from top to bottom
            var a = [];
            var my = options.type*(options.type-1);
            for(var y=0; y<options.type; y++){

                for(var x=0; x<options.type; x++){
                    var mx = x*options.type;
                    a.push(cubits[my-mx].clone());
                }

                my++;
            }

            return a;
        }

        //grab vertical slices for counter clockwise movement
        //from bottom to top
        var a = [];
		var my = options.type-1;
		for(var y=0; y<options.type; y++){

			for(var x=0; x<options.type; x++){
				var mx = x*options.type;
				a.push(cubits[my+mx].clone());
			}

			my--;
		}

		return a;
    }

    //method for swapping cubit textures
    function swapCubits(from, to){

        for(var i=0; i<from.length; i++){
            from[i].material = to[i].material;
            from[i].material.needsUpdate = true;
        }
    }

    //method for painting cubits faces according to the turn
    function paintFaces(cubits){

        var FACE_RIGHT = 0;
        var FACE_LEFT = 1;
        var FACE_TOP = 2;
        var FACE_BOTTOM = 3;
        var FACE_FRONT = 4;
        var FACE_BACK = 5;

        //paint faces
        $(cubits).each(function(){
            var cubit = this;
            var materials = cubit.material.materials;

            //determine cubit facing
            if(_pivot.rotation.x > 0){
                //R
                var temp = materials[FACE_TOP];
                materials[FACE_TOP] = materials[FACE_BACK];
                materials[FACE_BACK] = materials[FACE_BOTTOM];
                materials[FACE_BOTTOM] = materials[FACE_FRONT];
                materials[FACE_FRONT] = temp;
            }
            else if(_pivot.rotation.x < 0){
                //R'
                var temp = materials[FACE_FRONT];
                materials[FACE_FRONT] = materials[FACE_BOTTOM];
                materials[FACE_BOTTOM] = materials[FACE_BACK];
                materials[FACE_BACK] = materials[FACE_TOP];
                materials[FACE_TOP] = temp;
            }
            else if(_pivot.rotation.y < 0){
                //U
                var temp = materials[FACE_FRONT];
                materials[FACE_FRONT] = materials[FACE_RIGHT];
                materials[FACE_RIGHT] = materials[FACE_BACK];
                materials[FACE_BACK] = materials[FACE_LEFT];
                materials[FACE_LEFT] = temp;
            }
            else if(_pivot.rotation.y > 0){
                //U'
                var temp = materials[FACE_FRONT];
                materials[FACE_FRONT] = materials[FACE_LEFT];
                materials[FACE_LEFT] = materials[FACE_BACK];
                materials[FACE_BACK] = materials[FACE_RIGHT];
                materials[FACE_RIGHT] = temp;
            }
            else if(_pivot.rotation.z < 0){
                //F
                var temp = materials[FACE_TOP];
                materials[FACE_TOP] = materials[FACE_LEFT];
                materials[FACE_LEFT] = materials[FACE_BOTTOM];
                materials[FACE_BOTTOM] = materials[FACE_RIGHT];
                materials[FACE_RIGHT] = temp;
            }
            else if(_pivot.rotation.z > 0){
                //F'
                var temp = materials[FACE_TOP];
                materials[FACE_TOP] = materials[FACE_RIGHT];
                materials[FACE_RIGHT] = materials[FACE_BOTTOM];
                materials[FACE_BOTTOM] = materials[FACE_LEFT];
                materials[FACE_LEFT] = temp;
            }

            cubit.material.needsUpdate = true;
        });
    }

    //method for orienting the cubit faces
    function orientCubits(cubits){

        paintFaces(cubits);

        //build from texture array
        var from = [];
        for(var i=0; i<cubits.length; i++){
            from = cubits[i];
        }

        //swap cubit textures
        swapCubits(cubits, cubits.to);

        //restore pivot
        _pivot.rotation.x =
            _pivot.rotation.y =
            _pivot.rotation.z = 0;
    }

    //constructor
    function constructor() {

        //initialize scene
        _scene = new THREE.Scene();
        _camera = new THREE.PerspectiveCamera(75, _ref.width() / _ref.height(), 0.1, 1000);

		try{
			_renderer = new THREE.WebGLRenderer({antialias: true});
			_renderer.type = "WebGL";
		}
		catch(ex){
			_renderer = new THREE.CanvasRenderer();
			_renderer.type = "Canvas";
		}

        _renderer.setSize(_ref.width(), _ref.height());
        _renderer.setClearColor(options.background, 1);

        _ref.append(_renderer.domElement);

        //create cube
        createCube();

        //setup camera
        _camera.position.y = options.camera.x;
        _camera.position.x = options.camera.y;
        _camera.position.z = options.camera.z;

        //set plugin
        _ref.data("_cube", _ref);

        //render
        render();

        if(_ref.data("moves")){
            setTimeout(function(){
                _ref.execute(_ref.data("moves"));
            }, 1000);
        }
    }
    constructor();

    return _ref;
}
