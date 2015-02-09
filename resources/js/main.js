/*jslint browser: true*/
/*global $, jQuery, console, alert, CellMatrix, GridDrawer, Helper, GameOfLife*/

var CellsModel = {
	cellsMatrix: null,
	width: null,
	height: null,
	generationCount: null,
	cellsAlive: null,
	
	New: function (linesQuantity) {
		"use strict";
		
		this.height = linesQuantity;
		this.width = this.height * (GameOfLife.canvasObject.width / GameOfLife.canvasObject.height);
		this.generationCount = 0;
		this.cellsAlive = 0;
		
		this.FirstPopulateCellsMatrix();
		//this.PopulateCellsMatrix();
	},
	
	FirstPopulateCellsMatrix: function () {
		"use strict";
		
		this.cellsMatrix = [];
		CellsModel.cellsAlive = 7;
		
		CellsModel.SetCellValueByCoordinates(101, 71);
		CellsModel.SetCellValueByCoordinates(103, 72);
		CellsModel.SetCellValueByCoordinates(100, 73);
		CellsModel.SetCellValueByCoordinates(101, 73);
		CellsModel.SetCellValueByCoordinates(104, 73);
		CellsModel.SetCellValueByCoordinates(105, 73);
		CellsModel.SetCellValueByCoordinates(106, 73);
	},
	
	PopulateCellsMatrix: function () {
		"use strict";
		
		this.cellsMatrix = [];
		CellsModel.cellsAlive = 0;
		
		var i, j, isAlive;
		for (i = 0; i < CellsModel.width; i += 1) {
			for (j = 0; j < CellsModel.height; j += 1) {
				isAlive = (Math.random() * 100) < Helper.generationPercentage ? true : false;
				
				CellsModel.cellsMatrix.push(isAlive);
				
				if (isAlive) {
					CellsModel.cellsAlive += 1;
				}
			}
		}
	},
	
	GetCellByCoordinates: function (x, y) {
		"use strict";
		
		if (x < 0 || y < 0 || x > CellsModel.width || y > CellsModel.height) {
			return false;
		}
		
		return CellsModel.cellsMatrix[x * CellsModel.height + y];
	},
	
	SetCellValueByCoordinates: function (x, y) {
		"use strict";
		
		CellsModel.cellsMatrix[x * CellsModel.height + y] = true;
	}
};

var GridDrawer = {
	linesQuantity: null,
	canvasObject: null,
	context: null,
	width: null,
	height: null,
	
	New: function (canvasObject, linesQuantity) {
		"use strict";
				
		this.canvasObject = canvasObject;
		this.context = this.canvasObject.getContext('2d');
		this.width = this.canvasObject.width;
		this.height = this.canvasObject.height;
		
		this.DrawGrid(linesQuantity);
	},
	
	DrawGrid: function (linesQuantity) {
		"use strict";
		if (linesQuantity) {
			GridDrawer.linesQuantity = linesQuantity;
		}
		
		GridDrawer.context.clearRect(0, 0, this.width, this.height);
		GridDrawer.DrawBorders();
		GridDrawer.DrawLines();
		
		if (CellsModel.cellsMatrix) {
			GridDrawer.DrawCells();
		}
	},
	
	DrawBorders: function () {
		"use strict";
		
		GridDrawer.context.beginPath();
		GridDrawer.context.moveTo(0, 0);
		GridDrawer.context.lineTo(0, this.height);
		GridDrawer.context.lineWidth = 0.5;
		GridDrawer.context.stroke();
		
		GridDrawer.context.beginPath();
		GridDrawer.context.moveTo(0, 0);
		GridDrawer.context.lineTo(this.width, 0);
		GridDrawer.context.lineWidth = 0.5;
		GridDrawer.context.stroke();
		
		GridDrawer.context.beginPath();
		GridDrawer.context.moveTo(GridDrawer.width, 0);
		GridDrawer.context.lineTo(GridDrawer.width, GridDrawer.width);
		GridDrawer.context.lineWidth = 0.5;
		GridDrawer.context.stroke();
		
		GridDrawer.context.beginPath();
		GridDrawer.context.moveTo(0, GridDrawer.height);
		GridDrawer.context.lineTo(GridDrawer.width, GridDrawer.height);
		GridDrawer.context.lineWidth = 0.5;
		GridDrawer.context.stroke();
	},
	
	DrawLines: function () {
		"use strict";
		
		var	lineSpace = GridDrawer.height / GridDrawer.linesQuantity,
			colunmQuantity = GridDrawer.linesQuantity * (GridDrawer.width / GridDrawer.height),
			colunmSpace = (GridDrawer.width / colunmQuantity),
			count;
		
		for (count = 1; count <= colunmQuantity; count += 1) {
			
			if (count <= GridDrawer.linesQuantity) {
				GridDrawer.context.beginPath();
				GridDrawer.context.moveTo(0, lineSpace * count);
				GridDrawer.context.lineTo(GridDrawer.width, lineSpace * count);
				GridDrawer.context.lineWidth = 0.1;
				GridDrawer.context.stroke();
			}
			
			GridDrawer.context.beginPath();
			GridDrawer.context.moveTo(colunmSpace * count, 0);
			GridDrawer.context.lineTo(colunmSpace * count, GridDrawer.height);
			GridDrawer.context.lineWidth = 0.1;
			GridDrawer.context.stroke();
		}
	},
	
	DrawCells: function () {
		"use strict";
		
		var	lineSpace = GridDrawer.height / GridDrawer.linesQuantity,
			colunmQuantity = GridDrawer.linesQuantity * (GridDrawer.width / GridDrawer.height),
			colunmSpace = (GridDrawer.width / colunmQuantity),
			i,
			j,
			isAlive;
		
		for (i = 0; i < CellsModel.width; i += 1) {
			for (j = 0; j < CellsModel.height; j += 1) {
				isAlive = CellsModel.GetCellByCoordinates(i, j);
				//isAlive = CellsModel.cellsMatrix.shift();
				
				if (isAlive) {
					GridDrawer.context.beginPath();
					GridDrawer.context.rect(colunmSpace * i, lineSpace * j, lineSpace, colunmSpace);
					GridDrawer.context.fillStyle = 'black';
					GridDrawer.context.fill();
					GridDrawer.context.stroke();
				}
			}
		}
	}
};

var GameOfLife = {
	running: null,
	runnerId: null,
	canvasObject: null,
	
	New: function () {
		"use strict";
		
		this.InitializeVariables();
		CellsModel.New(100);
		GridDrawer.New(this.canvasObject, 100);
	},
	
	InitializeVariables: function () {
		"use strict";
		
		this.canvasObject = document.getElementById("gameOfLife");
	},
	
	Run: function () {
		"use strict";
		GameOfLife.running = true;
		
		GameOfLife.GrowCells();
		CellsModel.generationCount += 1;
		
		GridDrawer.DrawGrid();
		Helper.UpdateLabels();
	},
	
	Stop: function () {
		"use strict";
		
		this.running = false;
		clearInterval(this.runnerId);
	},
	
	GenerateAliveCells: function () {
		"use strict";
		
		CellsModel.PopulateCellsMatrix();
		GridDrawer.New(this.canvasObject);
		Helper.UpdateLabels();
	},
	
	GrowCells: function () {
		"use strict";
		
		var i, j, index, neighborsQuantity, isAlive, tempMatrix = [];
		for (i = 0; i < CellsModel.width; i += 1) {
			for (j = 0; j < CellsModel.height; j += 1) {
				index = i * CellsModel.height + j;
				neighborsQuantity = this.NeighborsQuantity(i, j);
				isAlive = CellsModel.cellsMatrix[index];
				tempMatrix.push(isAlive);
				
				if (isAlive) {
					if (neighborsQuantity < 2 || neighborsQuantity > 3) {
						tempMatrix[index] = false;
						CellsModel.cellsAlive -= 1;
					}
				} else {
					if (neighborsQuantity === 3) {
						tempMatrix[index] = true;
						CellsModel.cellsAlive += 1;
					}
				}
			}
		}
		
		CellsModel.cellsMatrix = tempMatrix;
	},
	
	NeighborsQuantity: function (x, y) {
		"use strict";
		var i, j, quantity = 0, isAlive;
		for (i = x - 1; i < x + 2; i += 1) {
			for (j = y - 1; j < y + 2; j += 1) {
				isAlive = CellsModel.GetCellByCoordinates(i, j);
				if (!(i === x && j === y)) {
					quantity += isAlive ? 1 : 0;
				}
			}
		}
		
		return quantity;
	}
};

var Helper = {
	generationPercentage: 5,
	
	New: function () {
		"use strict";
		
		this.BindEvents();
		this.UpdateLabels();
	},
	
	BindEvents: function () {
		"use strict";
		
		$("#linesQuantity").val(100);
		$("#linesQuantity").change(function () {
			var value = $("#linesQuantity").val();
			
			if ($.isNumeric(value) && value >= 10 && value <= 100) {
				GridDrawer.DrawGrid(value);
				Helper.UpdateLabels();
			}
		});
		
		$("#run").click(function (e) {
			if (GameOfLife.running === true) {
				$(this).html("Run");
				
				GameOfLife.Stop();
			} else {
				if (CellsModel.cellsMatrix !== null) {
					$(this).html("Stop");

					GameOfLife.runnerId = setInterval(GameOfLife.Run, 1);
				}
			}
			
			e.preventDefault();
		});
		
		$("#generate").click(function (e) {
			GameOfLife.GenerateAliveCells();
			
			e.preventDefault();
		});
	},
	
	UpdateLabels: function () {
		"use strict";
		
		$("#generationLabel").html(CellsModel.generationCount);
		$("#liveCellsLabel").html(CellsModel.cellsAlive);
		$("#linesQuantityLabel").html(GridDrawer.linesQuantity);
	}
};

$(document).ready(function () {
	"use strict";
		
	GameOfLife.New();
	Helper.New();
});