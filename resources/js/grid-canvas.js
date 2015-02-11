/*jslint browser: true*/
/*global $, console, alert*/

var GridDrawer = {
	linesQuantity: null,
	canvas: {
		object: null,
		context: null,
		width: null,
		height: null
	},
	arrayToDraw: null,
	
	New: function (canvasId, linesHandlerId) {
		"use strict";
		
		var linesHandler = $("#" + linesHandlerId);
		
		this.canvas.object = document.getElementById(canvasId);
		this.canvas.context = this.canvas.object.getContext('2d');
		this.canvas.width = this.canvas.object.width;
		this.canvas.height = this.canvas.object.height;
		
		this.linesQuantity = linesHandler.val();
		
		linesHandler.mousemove(function () {
			GridDrawer.UpdateGrid(null, $(this).val());
		});
		
		$("#canvas").click(function (e) {

			var x = Math.floor((e.pageX - $("#canvas").offset().left) / 20),
				y = Math.floor((e.pageY - $("#canvas").offset().top) / 20);
			
			ctx.fillStyle = "rgb(255,255,255)";
			ctx.fillRect(x*20, y*20, 20, 20);


		});
	},
	
	UpdateGrid: function (array, linesQuantity) {
		"use strict";
		if (array) {
			this.arrayToDraw = array;
		}
		
		if (linesQuantity) {
			this.linesQuantity = linesQuantity;
		}
		
		this.DrawGrid();
	},
	
	ClearGrid: function () {
		"use strict";
		this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	
	DrawGrid: function () {
		"use strict";
		
		this.ClearGrid();
		this.DrawBorders();
		this.DrawLines();
		
		if (this.arrayToDraw) {
			this.DrawMatrix();
		}
	},
	
	DrawBorders: function () {
		"use strict";
		
		this.canvas.context.beginPath();
		this.canvas.context.moveTo(0, 0);
		this.canvas.context.lineTo(0, this.canvas.height);
		this.canvas.context.lineWidth = 0.5;
		this.canvas.context.stroke();
		
		this.canvas.context.beginPath();
		this.canvas.context.moveTo(0, 0);
		this.canvas.context.lineTo(this.canvas.width, 0);
		this.canvas.context.lineWidth = 0.5;
		this.canvas.context.stroke();
		
		this.canvas.context.beginPath();
		this.canvas.context.moveTo(this.canvas.width, 0);
		this.canvas.context.lineTo(this.canvas.width, this.canvas.width);
		this.canvas.context.lineWidth = 0.5;
		this.canvas.context.stroke();
		
		this.canvas.context.beginPath();
		this.canvas.context.moveTo(0, this.canvas.height);
		this.canvas.context.lineTo(this.canvas.width, this.canvas.height);
		this.canvas.context.lineWidth = 0.5;
		this.canvas.context.stroke();
	},
	
	DrawLines: function () {
		"use strict";
		
		var	lineSpace = this.canvas.height / this.linesQuantity,
			colunmQuantity = this.linesQuantity * (this.canvas.width / this.canvas.height),
			colunmSpace = (this.canvas.width / colunmQuantity),
			count;
		
		for (count = 1; count <= colunmQuantity; count += 1) {
			
			if (count <= this.linesQuantity) {
				this.canvas.context.beginPath();
				this.canvas.context.moveTo(0, lineSpace * count);
				this.canvas.context.lineTo(this.canvas.width, lineSpace * count);
				this.canvas.context.lineWidth = 0.1;
				this.canvas.context.stroke();
			}
			
			this.canvas.context.beginPath();
			this.canvas.context.moveTo(colunmSpace * count, 0);
			this.canvas.context.lineTo(colunmSpace * count, this.canvas.height);
			this.canvas.context.lineWidth = 0.1;
			this.canvas.context.stroke();
		}
	},
	
	DrawMatrix: function () {
		"use strict";
		
		var	lineSpace = this.canvas.height / this.linesQuantity,
			colunmQuantity = this.linesQuantity * (this.canvas.width / this.canvas.height),
			colunmSpace = (this.canvas.width / colunmQuantity),
			i,
			cellInfo,
			color;
		
		for (i = 0; i < this.arrayToDraw.length; i += 1) {
			cellInfo = this.arrayToDraw[i];

			this.canvas.context.beginPath();
			this.canvas.context.rect(colunmSpace * cellInfo.x + 1, lineSpace * cellInfo.y + 1, lineSpace - 1, colunmSpace - 1);
			this.canvas.context.fillStyle = cellInfo.color;
			this.canvas.context.fill();
			this.canvas.context.stroke();
		}
	},
	
	DrawCellByCoordinate: function (x, y, color) {
		"use strict";
		var	lineSpace = this.canvas.height / this.linesQuantity,
			colunmQuantity = this.linesQuantity * (this.canvas.width / this.canvas.height),
			colunmSpace = (this.canvas.width / colunmQuantity);
		
		this.canvas.context.beginPath();
		this.canvas.context.rect(colunmSpace * x + 1, lineSpace * y + 1, lineSpace - 1, colunmSpace - 1);
		this.canvas.context.fillStyle = color;
		this.canvas.context.fill();
		this.canvas.context.stroke();
	}
};