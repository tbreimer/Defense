healthBar = new HealthBar();
respawnScreen = new RespawnScreen();
scoreLabel = new ScoreLabel();
debugMenu = new DebugMenu();
coolDownIndicator = new CoolDownIndicator();

function UI(){
	this.mouseX;
	this.mouseY;
	this.mousePressed = false;
	this.click = false;

	this.buttons = [];

	this.map = false;
	UI.prototype.update = function(){
		debugMenu.update();

		// In game UI
		healthBar.update();
		scoreLabel.update();
		coolDownIndicator.update();

		if (world.mode == 1){
			respawnScreen.update();
		}

		this.click = false; // True for one frame after player releases mouse
	}
}

function DebugMenu(){
	this.textSize = 16;
	this.y = 90;
	this.x = 10;

	DebugMenu.prototype.update = function(){
		uCtx.fillStyle = "black";
		uCtx.font = this.textSize + "px Arial";

		// Difference in y value between elements
		space = this.textSize + 4;

		uCtx.fillText("FPS " + fps, this.x, this.y);
		uCtx.fillText("X " + player.x + ", " + Math.floor(player.x / world.blockSize) + ", " + ui.mouseX, this.x, this.y + (space * 1));
		uCtx.fillText("Y " + player.y + ", " + Math.floor(player.y / world.blockSize) + ", " + ui.mouseY, this.x, this.y + (space * 2));
		uCtx.fillText("Wave " + world.entitiesSpawned + "/" + world.entitiesPerWave, this.x, this.y + (space * 3));
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
