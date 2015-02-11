/*jslint browser: true*/
/*global $, console, alert, Helper, CellsController, GridDrawer*/

var Helper = {
	CELLS_MATRIX_ROWS: 200,
	CELL_GENERATION_PERCENTAGE: 5,
	CANVAS: null,
	ANIM_FRAME: null,
	
	New: function (canvasId) {
		"use strict";
		
		this.CANVAS = document.getElementById(canvasId);
		this.ANIM_FRAME = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null;
	},
	
	UpdateLabels: function () {
		"use strict";
		
		$("#generationLabel").html(CellsController.generationCount);
		$("#liveCellsLabel").html(CellsController.cellsAlive);
		$("#ruleLabel").html(CellsController.rule);
	}
};