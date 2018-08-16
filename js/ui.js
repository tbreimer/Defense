healthBar = new HealthBar();
respawnScreen = new RespawnScreen();
scoreLabel = new ScoreLabel();
materialLabel = new MaterialLabel();
debugMenu = new DebugMenu();
coolDownIndicator = new CoolDownIndicator();
inventory = new Inventory();

function UI(){
	this.mouseX;
	this.mouseY;

	this.mouseBx;
	this.mouseBy;

	this.mousePressed = false;
	this.click = false;
	this.press = false;

	this.buttons = [];

	this.map = false;
	UI.prototype.update = function(){
		debugMenu.update();

		// In game UI
		healthBar.update();
		scoreLabel.update();
		materialLabel.update();
		coolDownIndicator.update();

		inventory.update();

		if (world.mode == 1){
			respawnScreen.update();
		}

		// Gets the block coordinates of the mouse
		canvasTopx = player.x - ((windowWidth / 2) - world.blockSize); 
		canvasTopy = player.y - ((windowHeight / 2) - world.blockSize); 
		
		// Subtracted by one to fit correctly with array indexing
		this.mouseBx = Math.floor((canvasTopx + this.mouseX) / world.blockSize) - 1;
		this.mouseBy = Math.floor((canvasTopy + this.mouseY) / world.blockSize) - 1;

		this.click = false; // True for one frame after player releases mouse
		this.press = false; // True for one frame as soon as player clicks mouse
	}
}

function DebugMenu(){
	this.textSize = 16;
	this.y = 130;
	this.x = 10;

	DebugMenu.prototype.update = function(){
		uCtx.fillStyle = "black";
		uCtx.font = this.textSize + "px Arial";

		// Difference in y value between elements
		space = this.textSize + 4;

		uCtx.fillText("FPS " + fps, this.x, this.y);
		uCtx.fillText("X " + player.x + ", " + Math.floor(player.x / world.blockSize) + ", " + ui.mouseX, this.x, this.y + (space * 1));
		uCtx.fillText("Y " + player.y + ", " + Math.floor(player.y / world.blockSize) + ", " + ui.mouseY, this.x, this.y + (space * 2));
		uCtx.fillText("Wave " + world.wave + ": " + world.entitiesSpawned + "/" + world.entitiesPerWave, this.x, this.y + (space * 3));
	}
}

function HealthBar(){
	this.x = 10;
	this.y = 10;
	this.width = 200;
	this.height = 30;
	HealthBar.prototype.update = function(){
		// Gray bar
		uCtx.fillStyle = "rgb(200, 200, 200)";
		uCtx.fillRect(this.x, this.y, this.width, this.height);

		// Health indicator
		multiplier = (this.width - 10) / player.maxHealth;
		uCtx.fillStyle = "red";
		uCtx.fillRect(15, 15, player.health * multiplier, this.height - 10);
	}
}

function ScoreLabel(){
	this.x = 10;
	this.y = 70;
	this.textSize = 30;

	ScoreLabel.prototype.update = function(){
		text = player.score;

		uCtx.font = this.textSize + "px Arial";
		uCtx.fillStyle = "black";
		uCtx.fillText(text, this.x, this.y);
	}
}

function MaterialLabel(){
	this.x = 10;
	this.y = 100;
	this.textSize = 20;

	MaterialLabel.prototype.update = function(){
		text = "Material: " + player.material;

		uCtx.font = this.textSize + "px Arial";
		uCtx.fillStyle = "black";
		uCtx.fillText(text, this.x, this.y);
	}
}

function CoolDownIndicator(){
	CoolDownIndicator.prototype.update = function(){
		// Position above player
		this.width = player.width;
		this.height = 5;
		this.x = (windowWidth / 2) - (this.width / 2);
		this.y = player.screenY - this.height - 5;

		// Make bar proper width
		this.factor = this.width / player.coolInterval;
		width = player.coolDown * this.factor;

		// Background
		uCtx.fillStyle = "rgb(70, 135, 66)";
		uCtx.fillRect(this.x, this.y, this.width, this.height);

		// Bar
		uCtx.fillStyle = "rgb(0, 255, 0)"
		uCtx.fillRect(this.x, this.y, width, this.height);

		// Outline
		uCtx.strokeStyle = "black";
		uCtx.strokeRect(this.x, this.y, this.width, this.height);

	}
}

function RespawnScreen(){
	RespawnScreen.prototype.update = function(){
		// Background ------
		width = windowWidth * 0.4;
		height = windowHeight * 0.8;

		x = (windowWidth / 2) - (width / 2);
		y = (windowHeight / 2) - (height / 2);

		uCtx.fillStyle = "rgb(200, 200, 200)";
		uCtx.fillRect(x, y, width, height);

		// Outline
		uCtx.strokeStyle = "black";
		uCtx.strokeRect(x, y, width, height);

		// Button ------
		bWidth = windowWidth * 0.3;
		bHeight = 40;

		bX = (windowWidth / 2) - (bWidth / 2);
		bY = (windowHeight / 2) - (bHeight / 2);

		// Outline
		uCtx.strokeStyle = "black";
		uCtx.strokeRect(bX, bY, bWidth, bHeight);

		if (ui.mouseX > bX && ui.mouseX < bX + bWidth){
			if (ui.mouseY > bY && ui.mouseY < bY + bHeight){
				uCtx.fillStyle = "rgb(180, 180, 180)";
				uCtx.fillRect(bX, bY, bWidth, bHeight);
				if (ui.click == true){
					player.respawn();
				}
			}
		}

		// Text
		uCtx.font = "20px Arial";
		text = "Respawn";
		tWidth = uCtx.measureText(text).width;
		tHeight = 16;

		tX = (windowWidth / 2) - (tWidth / 2);
		tY = (windowHeight / 2) - (tHeight / 2) + 14;

		uCtx.fillStyle = "rgb(60, 60, 60)";
		uCtx.fillText(text, tX, tY);
	}
}

function Inventory(){
	this.x = 230;
	this.y = 32;
	this.font = 20;
	this.spacing = 10;
	Inventory.prototype.update = function(){
		// Collector
		uCtx.font = this.font + "px Arial";
		uCtx.fillStyle = "black";

		// 1st item
		firstText = "Collector";
		firstWidth = uCtx.measureText(firstText).width;
		firstX = this.x;
		uCtx.fillText(firstText, firstX, this.y);

		// Box
		if (player.selection == 0){
			uCtx.strokeRect(firstX - 2, this.y - this.font + 2, firstWidth + 4, this.font);
		}

		// 2nd Item
		secondText = "Sword";
		secondWidth = uCtx.measureText(secondText).width;
		secondX = firstX + firstWidth + this.spacing;
		uCtx.fillText(secondText, secondX, this.y);

		// Box
		if (player.selection == 1){
			uCtx.strokeRect(secondX - 2, this.y - this.font + 2, secondWidth + 4, this.font);
		}

		// 3rd Item
		thirdText = "Saplings: " + player.saplings;
		thirdWidth = uCtx.measureText(thirdText).width;
		thirdX = secondX + secondWidth + this.spacing;
		uCtx.fillText(thirdText, thirdX, this.y);

		// Box
		if (player.selection == 2){
			uCtx.strokeRect(thirdX - 2, this.y - this.font + 2, thirdWidth + 4, this.font);
		}
		
	}
}
