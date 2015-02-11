/*jslint browser: true*/
/*global $, console, alert, Helper, CellsController, GridDrawer*/

var GameOfLife = {
	running: false,
	runnerId: null,
	
	New: function () {
		"use strict";
		
		this.BindEvents();
		this.InitializeElements();
	},
	
	InitializeElements: function () {
		"use strict";
		
		Helper.New("gameOfLife");
		CellsController.New(Helper.CELLS_MATRIX_ROWS, "rule");
		GridDrawer.New("gameOfLife", "linesQuantity");
		GridDrawer.UpdateGrid(CellsController.arrayToDraw);
		Helper.UpdateLabels();
	},
	
	BindEvents: function () {
		"use strict";
		
		$("#run").click(function (e) {
			if (GameOfLife.running === true) {
				$(this).html("Run&nbsp;");
				$("#step").prop('disabled', false);
				
				GameOfLife.Stop();
				
			} else {
				$(this).html("Stop");
				$("#step").prop('disabled', true);

				var recursiveAnim, oneFrameTime, animFrame = Helper.ANIM_FRAME;
				
				if (animFrame !== null) {
					recursiveAnim = function () {
						if (GameOfLife.running) {
							GameOfLife.Run();
							animFrame(recursiveAnim);
						}
					};
					
					GameOfLife.running = true;
					animFrame(recursiveAnim);
				} else {
					oneFrameTime = 1000.0 / 60.0;
					GameOfLife.runnerId = setInterval(GameOfLife.Run, oneFrameTime);
				}
			}
			
			e.preventDefault();
		});
		
		$("#step").click(function (e) {
			GameOfLife.Run();
			GameOfLife.running = false;
			
			e.preventDefault();
		});
		
		$("#reset").click(function (e) {
			if (GameOfLife.running) {
				$("#run").html("Run&nbsp;");
				GameOfLife.running = false;
			}
			
			GameOfLife.InitializeElements();
			
			e.preventDefault();
		});
	},
	
	Run: function () {
		"use strict";
		
		GameOfLife.running = true;
		
		CellsController.GrowCells();
		
		GridDrawer.UpdateGrid(CellsController.arrayToDraw);
		Helper.UpdateLabels();
	},
	
	Stop: function () {
		"use strict";
		
		this.running = false;
		clearInterval(this.runnerId);
	},
	
	GenerateAliveCells: function () {
		"use strict";
		
		CellsController.PopulateCellsMatrix();
		GridDrawer.New(this.canvasObject);
		Helper.UpdateLabels();
	}
};