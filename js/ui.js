healthBar = new HealthBar();

function UI(){
	this.mouseX;
	this.mouseY;
	this.mousePressed = false;
	this.click = false;

	this.map = false;
	UI.prototype.update = function(){
		this.debugMenu();

		healthBar.update();

		this.click = false; // True for one frame after player releases mouse
	}

	UI.prototype.debugMenu = function(){
		uCtx.fillStyle = "black";
		uCtx.font = "16px Arial";

		uCtx.fillText("FPS " + fps, 5, 60);
		uCtx.fillText("X " + player.x + ", " + Math.floor(player.x / world.blockSize), 5, 80);
		uCtx.fillText("Y " + player.y + ", " + Math.floor(player.y / world.blockSize), 5, 100);

	}
}

function HealthBar(){
	this.width = 200;
	this.height = 30;
	HealthBar.prototype.update = function(){
		// Gray bar
		uCtx.fillStyle = "rgb(200, 200, 200)";
		uCtx.fillRect(10, 10, this.width, this.height);

		multiplier = (this.width - 10) / player.maxHealth;
		uCtx.fillStyle = "red";
		uCtx.fillRect(15, 15, player.health * multiplier, this.height - 10);


	}
}