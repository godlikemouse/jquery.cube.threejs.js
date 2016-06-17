jquery.cube.threejs.js
======================

An implementation of a Rubik's Cube using jQuery and ThreeJS with the ability to read old and new cube notation for executing moves. Supports cube sizes from 2x2 up about 9x9.

## Compatibility

| Browser | Compatibility |
| ------- | ------------- |
| Chrome | Perfect |
| Firefox | Perfect |
| Opera | Perfect |
| Safari | Perfect |
| IE | Perfect - Has not been tested on browsers earlier than IE 11 |

## Usage

(Requires jQuery and ThreeJS) Include the jquery.cube.threejs.js or jquery.cube.threejs.min.js file.
Create an HTML container for the cube, implement a script block, initialize the cube plugin and send commands to the plbugin by use of the execute() method or by adding a data-moves parameter.

## Quick Start

Create an HTML container for the cube.

	<div class="cube"></div>

In JavaScript, initialize the plugin and execute some commands.

	var cube = $(".cube").cube();
	cube.execute("x (R' U R') D2 (R U' R') D2 (R U R') D2 (R U' R') D2 (R U R') D2 (R U' R') D2 R2 x'");

## Options

The following table specifies the options available to be used in conjunction with the plugin.

| Name | Description |
| ---- | ----------- |
| type | Specifies the size of the cube to use.  (default 3), to create a larger cube increase this value. 4 for 4x4, 5 for 5x5, etc. |
| camera.x | Specifies the camera's x position. (default 50) |
| camera.y | Specifies the camera's y position. (default 50) |
| camera.z | Specifies the camera's z position. (default 100) |
| size.width | Controls the cube width in pixels. (default 60) |
| size.height | Controls the cube height in pixels. (default 60) |
| color | Array sepcifying edge colors. [ right, left, top, bottom, font, back, cube ] (default [0xff0000, 0xff8000, 0xffff00, 0xffffff, 0x0000ff, 0x00ff00, 0x000000]) |
| background | Specifies the background color. (default 0x1d1f20) |
| animation.delay | Specifies the animation delay in ms for turns. (default 250) |
| onTurn | Callback function invoked when a turn or move is made. (function (cube, move)) |
| onComplete | Callback function invoked when all turns or moves for an execution is complete. (function (cube)) |

	var cube = $(".cube").cube({
		animation: {
			delay: 500 //half a second per turn animation
		},
		colors: [0xff0000,
				 0xff8000,
				 0xffff00,
				 0x000000, //black side instead of white
				 0x0000ff,
				 0x00ff00],
		onTurn: function(cube, move){
			console.info(move, "was made");
		}
	});

Moves can also be specified as a data-moves attribute in the HTML tag.

	<div class="cube" data-moves="U R U' R'"></div>

## API

The following table specifies the API methods available for the cube plugin.

| Method | Description |
| ------ | ----------- |
| execute (moves) | Executes a set of moves specified by the moves string. (example: cube.execute("U R U' R'")) |
| turn (move) | Executes a single move specified by the move string. (example: cube.turn("R")) |
| reset | Resets the cube back to its initial state |

Living object reference is availble by accessing the following:

	var cube = $(".cube").data("_cube");
	cube.execute("U R U' R'");

## Community

Keep track of development and community news.

* Follow [@Collaboradev on Twitter](https://twitter.com/collaboradev).
* Follow the [Collaboradev Blog](http://www.collaboradev.com).

## License

jquery.cube.js is released under [GPL, version 2.0](http://www.gnu.org/licenses/gpl-2.0.html)
