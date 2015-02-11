/*jslint browser: true*/
/*global $, console, alert, Helper, GridDrawer*/

var CellState = {
	EMPTY: 0,
	ALIVE: 1,
	DEAD: 2
};

var CellColor = {
	EMPTY: null,
	ALIVE: 'black',
	DEAD: 'lightgray'
};

var CellsController = {
	cellsMatrix: null,
	width: null,
	height: null,
	generationCount: 0,
	cellsAlive: 0,
	rule: null,
	arrayToDraw: null,
	
	New: function (linesQuantity, patternHandlerId) {
		"use strict";
		
		var patternHandler = $("#" + patternHandlerId);
		
		this.cellsMatrix = [];
		this.height = linesQuantity;
		this.width = this.height * (Helper.CANVAS.width / Helper.CANVAS.height);
		this.generationCount = 0;
		this.cellsAlive = 0;
		this.arrayToDraw = [];
		this.rule = patternHandler.val();
		
		patternHandler.change(function () {
			var value = $(this).val();
			
			if (value.indexOf("/") > -1) {
				CellsController.rule = value;
			}
		});
		
		$(".model-buttons").click(function () {
			var type = $(this).attr("id");
			
			switch (type) {
			case "acorn":
				CellsController.CreateAcornByCoordinate(101, 71);
				break;
			case "gliderGun":
				CellsController.CreateGliderGunByCoordinate(51, 27);
				break;
			case "dieHard":
				CellsController.CreateDieHardByCoordinate(160, 50);
				break;
			case "line":
				CellsController.CreateLineByCoordinate(195, 100);
				break;
			}
			
			GridDrawer.UpdateGrid(CellsController.arrayToDraw);
		});
	},
	
	CreateAcornByCoordinate: function (x, y) {
		"use strict";
		
		this.cellsAlive += 7;
		
		var positions = [[x, y], [x + 2, y + 1], [x - 1, y + 2], [x, y + 2], [x + 3, y + 2], [x + 4, y + 2], [x + 5, y + 2]];
		
		this.SetCellValuesByPositions(positions);
	},
	
	CreateGliderGunByCoordinate: function (x, y) {
		"use strict";
		
		this.cellsAlive += 7;
		
		var x2 = x + 20, y2 = y - 2,
			positions = [[x, y], [x + 1, y], [x, y + 1], [x + 1, y + 1],
				[x + 10, y], [x + 11, y - 1], [x + 12, y - 2], [x + 13, y - 2], [x + 10, y + 1], [x + 10, y + 2], [x + 11, y + 3], [x + 12, y + 4], [x + 13, y + 4],
				[x + 14, y + 1], [x + 15, y - 1], [x + 15, y + 3], [x + 16, y], [x + 16, y + 1], [x + 16, y + 2], [x + 17, y + 1],
				[x2, y2], [x2 + 1, y2], [x2, y2 + 1], [x2 + 1, y2 + 1], [x2, y2 + 2], [x2 + 1, y2 + 2], [x2 + 2, y2 - 1], [x2 + 2, y2 + 3], [x2 + 4, y2 - 2], [x2 + 4, y2 - 1], [x2 + 4, y2 + 3], [x2 + 4, y2 + 4],
				[x2 + 14, y2], [x2 + 15, y2], [x2 + 14, y2 + 1], [x2 + 15, y2 + 1]];
		
		this.SetCellValuesByPositions(positions);
	},
	
	CreateDieHardByCoordinate: function (x, y) {
		"use strict";
		
		this.cellsAlive += 7;
		
		var positions = [[x, y], [x + 1, y], [x + 1, y + 1], [x + 6, y - 1], [x + 5, y + 1], [x + 6, y + 1], [x + 7, y + 1]];
		
		this.SetCellValuesByPositions(positions);
	},
	
	CreateLineByCoordinate: function (x, y) {
		"use strict";
		
		this.cellsAlive += 7;
		
		var positions = [[x, y], [x + 1, y], [x + 2, y], [x + 3, y], [x + 4, y], [x + 5, y], [x + 6, y], [x + 7, y],
			[x + 9, y], [x + 10, y], [x + 11, y], [x + 12, y], [x + 13, y],
			[x + 17, y], [x + 18, y], [x + 19, y],
			[x + 26, y], [x + 27, y], [x + 28, y], [x + 29, y], [x + 30, y], [x + 31, y], [x + 32, y],
			[x + 34, y], [x + 35, y], [x + 36, y], [x + 37, y], [x + 38, y]];
		
		this.SetCellValuesByPositions(positions);
	},
	
	SetCellValuesByPositions: function (positions) {
		"use strict";
		var i;
		
		for (i = 0; i < positions.length; i += 1) {
			this.SetCellValueByCoordinates(positions[i][0], positions[i][1]);
		}
	},
	
	RandomPopulateCellsMatrix: function () {
		"use strict";
		
		var i, j, isAlive, cellColor;
		for (i = 0; i < this.width; i += 1) {
			for (j = 0; j < this.height; j += 1) {
				isAlive = (Math.random() * 100) < Helper.CELL_GENERATION_PERCENTAGE ? true : false;
				
				this.cellsMatrix.push(isAlive);
				
				if (isAlive) {
					this.cellsAlive += 1;
				}
			}
		}
	},
	
	GetCellByCoordinates: function (x, y) {
		"use strict";
		
		if (x < 0 || y < 0 || x > this.width || y > this.height) {
			return false;
		}
		
		return this.cellsMatrix[x * this.height + y];
	},
	
	SetCellValueByCoordinates: function (x, y, value) {
		"use strict";
		
		this.cellsMatrix[x * this.height + y] = true;
		this.arrayToDraw.push({ x: x, y: y, color: CellColor.ALIVE });
	},
	
	GrowCells: function () {
		"use strict";
		
		var i, j, index, neighborsQuantity, isAlive, tempMatrix = [], arrayToDraw = [], color, rules;
		this.arrayToDraw = [];
		
		for (i = 0; i < this.width; i += 1) {
			for (j = 0; j < this.height; j += 1) {
				index = i * this.height + j;
				neighborsQuantity = this.NeighborsQuantity(i, j);
				
				isAlive = this.cellsMatrix[index];
				
				tempMatrix.push(isAlive);
				
				rules = this.rule.split("/");
				
				if (isAlive) {
					if (rules[0].indexOf(neighborsQuantity) === -1) {
						tempMatrix[index] = false;
						this.cellsAlive -= 1;
					}
				} else {
					if (rules[1].indexOf(neighborsQuantity) > -1) {
						tempMatrix[index] = true;
						this.cellsAlive += 1;
					}
				}
				
				if (tempMatrix[index]) {
					this.arrayToDraw.push({ x: i, y: j, color: CellColor.ALIVE });
				}
			}
		}
		
		this.generationCount += 1;
		this.cellsMatrix = tempMatrix;
	},
	
	NeighborsQuantity: function (x, y) {
		"use strict";
		var i, j, quantity = 0, isAlive;
		for (i = x - 1; i < x + 2; i += 1) {
			for (j = y - 1; j < y + 2; j += 1) {
				isAlive = this.GetCellByCoordinates(i, j);
				
				if (!(i === x && j === y) && isAlive) {
					quantity += 1;
				}
			}
		}
		
		return quantity;
	}
};