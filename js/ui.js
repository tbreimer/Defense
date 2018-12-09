healthBar = new HealthBar();

respawnScreen = new RespawnScreen();
upgradeScreen = new UpgradeScreen();
createScreen = new CreateScreen();
pauseScreen = new PauseScreen();

screenButtons = new ScreenButtons();
waveIndicator = new WaveIndicator();

labels = new Labels();

debugMenu = new DebugMenu();
cheatIndicators = new CheatIndicators();

coolDownIndicator = new CoolDownIndicator();

inventory = new Inventory();

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {

	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();

	if (fill == true) {
		ctx.fill();
	}

	if (stroke == true) {
		ctx.stroke();
	}
}

function Button(){
	Button.prototype.update = function(x, y, width, height, text, textOffset, font, centered){

		this.x = x;
		this.y = y;

		this.width = width;
		this.height = height;

		this.text = text;
		this.textOffset = textOffset;
		this.font = font;

		this.centered = centered;

		// Text vars
		uCtx.font = this.font + "px Arial";
		textWidth = uCtx.measureText(this.text).width;

		// If text width is more than the entire width, change that
		if (textWidth > this.width){
			this.width = textWidth + 10;
		}

		if (this.centered == true){
			this.x = windowWidth / 2 - this.width / 2;
		}

		textX = this.x + (this.width / 2) - (textWidth / 2);
		textY = this.y + this.textOffset;

		// Outline
		uCtx.strokeStyle = "rgb(100, 100, 100)";
		uCtx.lineWidth = 2;
		roundRect(uCtx, this.x, this.y, this.width, this.height, 12, false, true);

		clicked = false;

		if (ui.mouseX > this.x && ui.mouseX < this.x + this.width){
			if (ui.mouseY > this.y && ui.mouseY < this.y + this.height){
				uCtx.fillStyle = "rgb(225, 225, 225)";
				roundRect(uCtx, this.x, this.y, this.width, this.height, 12, true, true);
				if (ui.click == true){
					clicked = true;
					
				}

				if (ui.press == true){
					ui.buttonClicked = true;
				}
			}
		}

		// Draw text
		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.fillText(this.text, textX, textY);

		if (clicked == true){
			return true;
		}else{
			return false;
		}
	}
}

function UI(){
	this.mouseX;
	this.mouseY;

	this.mouseBx;
	this.mouseBy;

	this.mouseWx;
	this.mouseWy;

	this.mousePressed = false;
	this.click = false;
	this.press = false;
	this.buttonClicked = false;

	this.upgradeScreen = false;
	this.createScreen = false;
	this.pauseScreen = false;

	this.debugMenu = false;

	this.screen = false;
	UI.prototype.update = function(){
		uCtx.clearRect(0, 0, windowWidth, windowHeight);

		if(this.debugMenu == true){
			debugMenu.update();
		}

		if (devMode == true){
			cheatIndicators.update();
		}

		// In game UI
		healthBar.update();

		screenButtons.update();
		waveIndicator.update();

		labels.update();

		if (player.selection == 1 || player.selection == 2 && player.alive == true){
			coolDownIndicator.update();
		}
		
		inventory.update();

		if (tutorial.present == true){
			tutorial.update();
		}

		if (world.mode == 1){
			respawnScreen.update();
		}

		if (this.upgradeScreen == true && world.mode == 0){
			upgradeScreen.update();
		}

		if (this.createScreen == true && world.mode == 0){
			createScreen.update();
		}

		if (this.pauseScreen == true){
			if (world.mode == 0 || world.mode == 2){
				pauseScreen.update();
			}
		}

		if (this.createScreen == true || this.upgradeScreen == true || this.pauseScreen == true){
			this.screen = true;
		}else{
			this.screen = false;
		}

		// Gets the block coordinates of the mouse
		canvasTopx = player.x - ((windowWidth / 2) - world.blockSize); 
		canvasTopy = player.y - ((windowHeight / 2) - world.blockSize); 
		
		// Subtracted by one to fit correctly with array indexing
		this.mouseBx = Math.floor((canvasTopx + this.mouseX) / world.blockSize) - 1;
		this.mouseBy = Math.floor((canvasTopy + this.mouseY) / world.blockSize) - 1;

		// Get the world coordinates of the mouse
		this.mouseWx = Math.floor(canvasTopx + this.mouseX) - 40;
		this.mouseWy = Math.floor(canvasTopy + this.mouseY) - 40;
	
	}
}

function DebugMenu(){
	this.textSize = 16;
	this.y = 720;
	this.x = 10;

	DebugMenu.prototype.update = function(){
		uCtx.fillStyle = "black";
		uCtx.font = this.textSize + "px Arial";

		// Difference in y value between elements
		space = this.textSize + 4;

		this.y = windowHeight - 70;

		uCtx.fillText("FPS " + fps, this.x, this.y);
		uCtx.fillText("X " + player.x + ", " + Math.floor(player.x / world.blockSize) + ", " + ui.mouseX, this.x, this.y + (space * 1));
		uCtx.fillText("Y " + player.y + ", " + Math.floor(player.y / world.blockSize) + ", " + ui.mouseY, this.x, this.y + (space * 2));
		uCtx.fillText("Entities " + world.entityCounter + "/" + world.entityLimiter , this.x, this.y + (space * 3));

	}
}

function CheatIndicators(){
	CheatIndicators.prototype.update = function(){
		this.x = windowWidth - 60;
		this.y = windowHeight - 30;

		if (world.pauseEnemies == true){
			// Enemy
			uCtx.fillStyle = "rgb(0, 255, 250)";
			uCtx.strokeStyle = "black";
			roundRect(uCtx, this.x, this.y, 20, 20, 5, true, true);

			// Circle
			uCtx.strokeStyle = "rgb(255, 0, 0)";
			uCtx.beginPath();
			uCtx.arc(this.x + 10, this.y + 10, 6, 0, 2 * Math.PI);
			uCtx.stroke();

			// Line
			uCtx.beginPath();
			uCtx.moveTo(this.x + 5, this.y + 5);
			uCtx.lineTo(this.x + 15, this.y + 15);
			uCtx.stroke();
		}

		if (player.immunity == true){
			// Circle
			uCtx.fillStyle = "rgb(255, 255, 255)";
			uCtx.beginPath();
			uCtx.arc(this.x + 40, this.y + 10, 10, 0, 2 * Math.PI);
			uCtx.fill();

			// Circle
			uCtx.strokeStyle = "rgb(255, 0, 0)";
			uCtx.beginPath();
			uCtx.arc(this.x + 37, this.y + 10, 3, 0, 2 * Math.PI);
			uCtx.stroke();

			uCtx.beginPath();
			uCtx.arc(this.x + 43, this.y + 10, 3, 0, 2 * Math.PI);
			uCtx.stroke();
		}
	}
}

function HealthBar(){
	this.x = 20;
	this.y = 15;
	this.width = 500;
	this.height = 30;

	HealthBar.prototype.update = function(){
		this.width = Math.floor(windowWidth / 3);

		// Gray bar
		uCtx.globalAlpha = 0.75;
		uCtx.fillStyle = "rgb(220, 220, 220)";
		roundRect(uCtx, this.x, this.y, this.width, this.height, 10, true, false);
		uCtx.globalAlpha = 1;

		this.x = windowWidth / 2 - this.width / 2;

		if (player.health > 1){
			// Health indicator
			uCtx.globalAlpha = 1;
			multiplier = (this.width - 10) / player.maxHealth;
			uCtx.fillStyle = "red";
			roundRect(uCtx, this.x + 5, this.y + 5, player.health * multiplier, this.height - 10, 7, true, false);
		}
	}
}

function Labels(){
	this.x = 10;
	this.y = 45;
	this.width = 150;
	this.height = 200;

	this.bgColor = "rgb(220, 220, 220)";
	Labels.prototype.update = function(){
		this.x = windowWidth - this.width - 15;

		// ---------- Background
		uCtx.fillStyle = this.bgColor;
		uCtx.strokeStyle = "rgb(120, 120, 120)"
		uCtx.globalAlpha = 0.75;
		roundRect(uCtx, this.x, this.y, this.width, this.height, 10, true, true);
		uCtx.globalAlpha = 1;

		// ----------- Score Label
		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.font = "30px Arial";
		scoreText = player.score;
		scoreWidth = uCtx.measureText(scoreText).width;
		scoreX = this.x + (this.width / 2) - (scoreWidth / 2);
		scoreY = this.y + 50;
		uCtx.fillText(scoreText, scoreX, scoreY);

		// ---------- XP Label
		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.font = "25px Arial";
		xpText = "XP " + player.xp;
		xpWidth = uCtx.measureText(xpText).width;
		xpX = this.x + (this.width / 2) - (xpWidth / 2);
		xpY = this.y + 105;
		uCtx.fillText(xpText, xpX, xpY);

		// ---------- Material Label
		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.font = "25px Arial";
		materialTText = player.material;
		materialTWidth = uCtx.measureText(materialTText).width;

		materialWidth = 25;
		materialHeight = 25;

		totalWidth = materialWidth + 10 + materialTWidth;

		materialX = this.x + (this.width / 2) - (totalWidth / 2);
		materialTX = materialX + materialWidth + 10;

		materialY = this.y + 145;
		materialTY = this.y + 166;

		uCtx.fillStyle = "rgb(165, 83, 36)";
		uCtx.strokeStyle = "rgb(126, 61, 31)";

		roundRect(uCtx, materialX, materialY, materialWidth, materialHeight, 0, true, true);

		uCtx.beginPath();
		uCtx.moveTo(materialX, materialY);
		uCtx.lineTo(materialX + materialWidth, materialY + materialHeight);
		uCtx.stroke();

		uCtx.beginPath();
		uCtx.moveTo(materialX + materialWidth, materialY);
		uCtx.lineTo(materialX, materialY + materialHeight);
		uCtx.stroke();

		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.fillText(materialTText, materialTX, materialTY);


	}
}

function CoolDownIndicator(){
	CoolDownIndicator.prototype.update = function(){
		// Position above player
		this.width = player.width;
		this.height = 5;
		this.x = (windowWidth / 2) - (this.width / 2);
		this.y = player.screenY - this.height - 10;

		// Outline
		uCtx.fillStyle = "rgb(150, 150, 150)";
		uCtx.lineWidth = 1;
		roundRect(uCtx, this.x - 1, this.y - 1, this.width + 2, this.height + 2, 3, true, false);

		// Make bar proper width
		this.factor = this.width / player.coolInterval;
		width = player.coolDown * this.factor;

		// Background

		// Change color if player is holding sword or bow
		if (player.selection == 1){
			uCtx.fillStyle = "rgb(140, 60, 0)"
		}else{
			uCtx.fillStyle = "rgb(70, 135, 66)";
		}

		roundRect(uCtx, this.x, this.y, this.width, this.height, 3, true, false);


		// Bar
		if (player.selection == 1){
			uCtx.fillStyle = "rgb(255, 156, 28)"
		}else{
			uCtx.fillStyle = "rgb(0, 255, 0)";
		}

		roundRect(uCtx, this.x, this.y, width, this.height, 3, true, false);
	}
}

function RespawnScreen(){
	this.bgColor = "rgb(220, 220, 220)";

	this.respawnButton = new Button();
	RespawnScreen.prototype.update = function(){
		// Background ------
		width = windowWidth * 0.4;
		height = windowHeight * 0.8;

		x = (windowWidth / 2) - (width / 2);
		y = (windowHeight / 2) - (height / 2);

		// ---------- Background
		uCtx.fillStyle = this.bgColor;
		uCtx.strokeStyle = "rgb(120, 120, 120)"
		uCtx.globalAlpha = 0.85;
		roundRect(uCtx, x, y, width, height, 10, true, true);
		uCtx.globalAlpha = 1;

		// ---------- Label
		lText = "You Died!";
		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.font = "36px Arial";
		lWidth = uCtx.measureText(lText).width;
		lX = windowWidth / 2 - lWidth / 2;
		lY = windowHeight * 0.25;
		uCtx.fillText(lText, lX, lY);

		// ---------- Main Menu
		bWidth = windowWidth * 0.3;
		bHeight = 40;

		bX = (windowWidth / 2) - (bWidth / 2);
		bY = (windowHeight / 2) - (bHeight / 2);

		// Text
		uCtx.font = "20px Arial";
		text = "Main Menu";

		clicked = this.respawnButton.update(bX, bY, bWidth, bHeight, text, 26, 20);

		if (clicked == true){
			world.mode = 3;
		}
	}
}

function ScreenButtons(){
	this.x = 10;
	this.y = 10;

	this.upgradeButton = new Button();
	this.createButton = new Button();
	this.pauseButton = new Button();

	ScreenButtons.prototype.update = function(){

		// ---------- Pause Button
		pauseX = this.x;
		pauseY = this.y;
		pauseWidth = 25;
		pauseHeight = 25;
		pauseText = "";

		uCtx.fillStyle = "rgb(220, 220, 220)";
		uCtx.globalAlpha = 0.85;

		roundRect(uCtx, pauseX, pauseY, pauseWidth, pauseHeight, 10, true);
		clicked = this.createButton.update(pauseX, pauseY, pauseWidth, pauseHeight, pauseText, 17, 15);

		uCtx.strokeStyle = "rgb(120, 120, 120)";

		uCtx.beginPath();
		uCtx.moveTo(pauseX + 10, pauseY + 6);
		uCtx.lineTo(pauseX + 10, pauseY + 18);
		uCtx.stroke();

		uCtx.beginPath();
		uCtx.moveTo(pauseX + 15, pauseY + 6);
		uCtx.lineTo(pauseX + 15, pauseY + 18);
		uCtx.stroke();


		if (clicked == true){
			if (world.mode == 0 || world.mode == 2){
				if (ui.pauseScreen == true){
					pauseScreen.close();
				}else{
					pauseScreen.open();
				}
			}
		}

		// ---------- Upgrade Button
		upgradeX = this.x + pauseWidth + 5;
		upgradeY = this.y;
		upgradeWidth = 100;
		upgradeHeight = 25;
		upgradeText = "Upgrade";

		uCtx.fillStyle = "rgb(220, 220, 220)";
		uCtx.strokeStyle = "rgb(120, 120, 120)"
		uCtx.globalAlpha = 0.85;

		roundRect(uCtx, upgradeX, upgradeY, upgradeWidth, upgradeHeight, 10, true);
		clicked = this.upgradeButton.update(upgradeX, upgradeY, upgradeWidth, upgradeHeight, upgradeText, 17, 15);

		if (clicked == true && world.mode == 0){
			if (ui.upgradeScreen == true){
				upgradeScreen.close();
			}else{
				createScreen.close();
				upgradeScreen.open();
			}
		}

		// ---------- Create Button
		createX = this.x + pauseWidth + upgradeWidth + 10;
		createY = this.y;
		createWidth = 100;
		createHeight = 25;
		createText = "Create";

		uCtx.fillStyle = "rgb(220, 220, 220)";
		uCtx.globalAlpha = 0.85;

		roundRect(uCtx, createX, createY, createWidth, createHeight, 10, true);
		clicked = this.createButton.update(createX, createY, createWidth, createHeight, createText, 17, 15);

		if (clicked == true && world.mode == 0){
			if (ui.createScreen == true){
				createScreen.close();
			}else{
				upgradeScreen.close();
				createScreen.open();
			}
		}
		
	}
}

function WaveIndicator(){
	this.width = 150;
	this.height = 30;
	this.y = 10;
	this.x;
	WaveIndicator.prototype.update = function(){
		this.x = windowWidth - this.width - 15;

		uCtx.fillStyle = "rgb(220, 220, 220)";
		uCtx.globalAlpha = 0.85;
		uCtx.strokeStyle = "rgb(120, 120, 120)";

		roundRect(uCtx, this.x, this.y, this.width, this.height, 10, true, true);

		if (world.interval == true){
			text = "Interval " + Math.round(world.intervalFrames / 60) + "/" + Math.round(world.intervalTime / 60);
		}else{
			text = "Wave " + world.wave + ": " + world.entitiesSpawned + "/" + world.entitiesPerWave
		}

		textWidth = uCtx.measureText(text).width;

		textX = this.x + (this.width / 2) - (textWidth / 2);
		textY = this.y + 19;

		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.fillText(text, textX, textY);

	}
}

function UpgradeScreen(){	
	this.powerButton = new Button();
	this.bowCoolButton = new Button();

	this.damageButton = new Button();
	this.reachButton = new Button();
	this.swordCoolButton = new Button();

	this.bgColor = "rgb(220, 220, 220)";

	UpgradeScreen.prototype.update = function(){
		// Background ------
		width = windowWidth * 0.5;
		height = windowHeight * 0.8;

		x = (windowWidth / 2) - (width / 2);
		y = (windowHeight / 2) - (height / 2);

		// ---------- Background
		uCtx.fillStyle = this.bgColor;
		uCtx.strokeStyle = "rgb(120, 120, 120)"
		uCtx.globalAlpha = 0.85;
		roundRect(uCtx, x, y, width, height, 10, true, true);
		uCtx.globalAlpha = 1;

		// ----------- Close Button
		closeX = x + 30;
		closeY = y + 30;
		closeWidth = 20;
		closeHeight = 20;
		closeRadius = 17;

		dist = findDistance(ui.mouseX - (closeX + (closeWidth / 2)), ui.mouseY - (closeY + (closeHeight / 2)))
		
		// If button is hovered on and clicked
		if (dist < closeRadius){
			uCtx.fillStyle = "rgb(225, 225, 225)";
			uCtx.beginPath();
			uCtx.arc(closeX + (closeWidth / 2), closeY + (closeHeight / 2), closeRadius, 0, 2 * Math.PI);
			uCtx.fill();

			if (ui.click == true){
				this.close();
			}
		}

		uCtx.beginPath();
		uCtx.moveTo(closeX, closeY);
		uCtx.lineTo(closeX + closeWidth, closeY + closeHeight);
		uCtx.stroke();

		uCtx.beginPath();
		uCtx.moveTo(closeX + closeWidth, closeY);
		uCtx.lineTo(closeX, closeY + closeHeight);
		uCtx.stroke();

		if (windowHeight > 660){

			// ---------- Upgrade Label
			uX = x + 70;
			uY = y + 49;
			uText = "Upgrade Weapons";
			uCtx.font = "25px Arial";
			uCtx.fillStyle = "rgb(100, 100, 100)";

			uCtx.fillText(uText, uX, uY);

			// ----------- Line
			lWidth = width - 50;
			lX = windowWidth / 2 - lWidth / 2;
			lY = y + 62;

			uCtx.beginPath();
			uCtx.moveTo(lX, lY);
			uCtx.lineTo(lX + lWidth, lY);
			uCtx.stroke();
		}

		// ----------- Labels
		uCtx.font = "25px Arial";
		uCtx.fillStyle = "rgb(100, 100, 100)";

		swordText = "Sword";
		swordWidth = uCtx.measureText(swordText).width;
		swordX = (windowWidth * (1 / 2)) - (swordWidth / 2);
		swordY = windowHeight / 2 - 170;// y + height * (1 / 8); 

		uCtx.fillText(swordText, swordX, swordY);

		uCtx.font = "25px Arial";
		uCtx.fillStyle = "rgb(100, 100, 100)";

		bowText = "Bow";
		bowWidth = uCtx.measureText(bowText).width;
		bowX = (windowWidth * (1 / 2)) - (bowWidth / 2);
		bowY = swordY + 230;

		uCtx.fillText(bowText, bowX, bowY);

		// ----------- Bow Buttons 

		// Power

		powWidth = windowWidth * 0.2;
		powHeight = 40;

		powX = (windowWidth * (1 / 2)) - (powWidth / 2);
		powY = bowY + 30;

		// Text
		powerUpgrade = player.powerUpgrades[player.powerUpgrades.indexOf(player.power) + 1];

		powerXP = player.powerXP[player.powerUpgrades.indexOf(player.power) + 1];

		if (powerUpgrade == undefined){
			powText = "Power Fully Upgraded!"
		}else{
			powText = "Power " + player.power + " -> " + powerUpgrade + ": " + powerXP + " XP";
		}

		clicked = this.powerButton.update(powX, powY, powWidth, powHeight, powText, 26, 20, true);

		if (clicked == true){
			player.upgrade("power");
		}

		// BowCool

		bowCoolWidth = windowWidth * 0.2;
		bowCoolHeight = 40;

		bowCoolX = (windowWidth * (1 / 2)) - (powWidth / 2);
		bowCoolY = bowY + 80;

		// Text
		bowCoolUpgrade = player.bowCoolUpgrades[player.bowCoolUpgrades.indexOf(player.bowCool) + 1];

		bowCoolXP = player.bowCoolXP[player.bowCoolUpgrades.indexOf(player.bowCool) + 1];

		if (bowCoolUpgrade == undefined){
			bowCoolText = "Cooldown Fully Upgraded!"
		}else{
			bowCoolText = "Cooldown " + player.bowCool + " -> " + bowCoolUpgrade + ": " + bowCoolXP + " XP";
		}

		clicked = this.bowCoolButton.update(bowCoolX, bowCoolY, bowCoolWidth, bowCoolHeight, bowCoolText, 26, 20, true);

		if (clicked == true){
			player.upgrade("bowCool");
		}

		// Damage

		damageWidth = windowWidth * 0.2;
		damageHeight = 40;

		damageX = (windowWidth * (1 / 2)) - (damageWidth / 2);
		damageY = swordY + 30;

		// Text
		damageUpgrade = player.damageUpgrades[player.damageUpgrades.indexOf(player.damage) + 1];

		damageXP = player.damageXP[player.damageUpgrades.indexOf(player.damage) + 1];

		if (damageUpgrade == undefined){
			damageText = "Damage Fully Upgraded!"
		}else{
			damageText = "Damage " + player.damage + " -> " + damageUpgrade + ": " + damageXP + " XP";
		}

		clicked = this.damageButton.update(damageX, damageY, damageWidth, damageHeight, damageText, 26, 20, true);

		if (clicked == true){
			player.upgrade("damage");
		}

		// Reach

		reachWidth = windowWidth * 0.2;
		reachHeight = 40;

		reachX = (windowWidth * (1 / 2)) - (reachWidth / 2);
		reachY = swordY + 80;

		// Text
		reachUpgrade = player.reachUpgrades[player.reachUpgrades.indexOf(player.reach) + 1];

		reachXP = player.reachXP[player.reachUpgrades.indexOf(player.reach) + 1];

		if (reachUpgrade == undefined){
			reachText = "Reach Fully Upgraded!"
		}else{
			reachText = "Reach " + player.reach + " -> " + reachUpgrade + ": " + reachXP + " XP";
		}

		clicked = this.reachButton.update(reachX, reachY, reachWidth, reachHeight, reachText, 26, 20, true);

		if (clicked == true){
			player.upgrade("reach");
		}

		// SwordCool

		swordCoolWidth = windowWidth * 0.2;
		swordCoolHeight = 40;

		swordCoolX = (windowWidth * (1 / 2)) - (swordCoolWidth / 2);
		swordCoolY = swordY + 130;

		// Text
		swordCoolUpgrade = player.swordCoolUpgrades[player.swordCoolUpgrades.indexOf(player.swordCool) + 1];

		swordCoolXP = player.swordCoolXP[player.swordCoolUpgrades.indexOf(player.swordCool) + 1];

		if (swordCoolUpgrade == undefined){
			swordCoolText = "Cooldown Fully Upgraded!"
		}else{
			swordCoolText = "Cooldown " + player.swordCool + " -> " + swordCoolUpgrade + ": " + swordCoolXP + " XP";
		}

		clicked = this.swordCoolButton.update(swordCoolX, swordCoolY, swordCoolWidth, swordCoolHeight, swordCoolText, 26, 20, true);

		if (clicked == true){
			player.upgrade("swordCool");
		}

	}

	UpgradeScreen.prototype.open = function(){
		pauseScreen.close();
		createScreen.close();
		ui.upgradeScreen = true;
	}

	UpgradeScreen.prototype.close = function(){
		ui.upgradeScreen = false;
	}
}

function CreateScreen(){
	this.arrowButton = new Button();
	this.bombButton = new Button();
	this.bandageButton = new Button();
	this.fenceButton = new Button();
	this.wallButton = new Button();

	this.bgColor = "rgb(220, 220, 220)";
	CreateScreen.prototype.update = function(){
		// Background ------
		width = windowWidth * 0.5;
		height = windowHeight * 0.8;

		x = (windowWidth / 2) - (width / 2);
		y = (windowHeight / 2) - (height / 2);

		// ---------- Background
		uCtx.fillStyle = this.bgColor;
		uCtx.strokeStyle = "rgb(120, 120, 120)"
		uCtx.globalAlpha = 0.85;
		roundRect(uCtx, x, y, width, height, 10, true, true);
		uCtx.globalAlpha = 1;

		// ----------- Close Button
		closeX = x + 30;
		closeY = y + 30;
		closeWidth = 20;
		closeHeight = 20;
		closeRadius = 17;

		dist = findDistance(ui.mouseX - (closeX + (closeWidth / 2)), ui.mouseY - (closeY + (closeHeight / 2)))
		
		// If button is hovered on and clicked
		if (dist < closeRadius){
			uCtx.fillStyle = "rgb(225, 225, 225)";
			uCtx.beginPath();
			uCtx.arc(closeX + (closeWidth / 2), closeY + (closeHeight / 2), closeRadius, 0, 2 * Math.PI);
			uCtx.fill();

			if (ui.click == true){
				this.close();
			}
		}

		uCtx.beginPath();
		uCtx.moveTo(closeX, closeY);
		uCtx.lineTo(closeX + closeWidth, closeY + closeHeight);
		uCtx.stroke();

		uCtx.beginPath();
		uCtx.moveTo(closeX + closeWidth, closeY);
		uCtx.lineTo(closeX, closeY + closeHeight);
		uCtx.stroke();



		// ---------- Upgrade Label
		uX = x + 70;
		uY = y + 49;
		uText = "Create Items";
		uCtx.font = "25px Arial";
		uCtx.fillStyle = "rgb(100, 100, 100)";

		uCtx.fillText(uText, uX, uY);

		// ----------- Line
		lWidth = width - 50;
		lX = windowWidth / 2 - lWidth / 2;
		lY = y + 62;

		uCtx.beginPath();
		uCtx.moveTo(lX, lY);
		uCtx.lineTo(lX + lWidth, lY);
		uCtx.stroke();
		

		// Weapons Label
		uCtx.font = "25px Arial";
		weaponsText = "Weapons";
		weaponsWidth = uCtx.measureText(weaponsText).width;
		weaponsX = (windowWidth / 2) - (weaponsWidth / 2);
		weaponsY = y + 100;
		uCtx.font = "25px Arial";
		uCtx.fillStyle = "rgb(100, 100, 100)";

		uCtx.fillText(weaponsText, weaponsX, weaponsY);

		// Arrow Button
		arrowBWidth = width / 2;
		arrowBHeight = 40;
		arrowBX = (windowWidth / 2) - (arrowBWidth / 2);
		arrowBY = weaponsY + 70;

		clicked = this.arrowButton.update(arrowBX, arrowBY, arrowBWidth, arrowBHeight, "Make 10 Arrows: " + player.arrowCost * 10 + " Material", 25, 20, true);

		if (clicked == true){
			player.addItem("arrow", 10);
		}

		// Bomb Button
		bombBWidth = width / 2;
		bombBHeight = 40;
		bombBX = (windowWidth / 2) - (bombBWidth / 2);
		bombBY = arrowBY - 50;

		clicked = this.bombButton.update(bombBX, bombBY, bombBWidth, bombBHeight, "Make Bomb: " + player.bombCost + " Material", 25, 20, true);

		if (clicked == true){
			player.addItem("bomb", 1);
		}

		// Health Label
		uCtx.font = "25px Arial";
		healthText = "Health";
		healthWidth = uCtx.measureText(healthText).width;
		healthX = (windowWidth / 2) - (healthWidth / 2);
		healthY = y + 250;
		uCtx.font = "25px Arial";
		uCtx.fillStyle = "rgb(100, 100, 100)";

		uCtx.fillText(healthText, healthX, healthY);

		// Bandage Button
		bandageBWidth = width / 2;
		bandageBHeight = 40;
		bandageBX = (windowWidth / 2) - (bandageBWidth / 2);
		bandageBY = healthY + 20;

		clicked = this.bandageButton.update(bandageBX, bandageBY, bandageBWidth, bandageBHeight, "Make Bandage: " + player.bandageCost + " Material", 25, 20, true);

		if (clicked == true){
			player.addItem("bandage", 1);
		}

		// Construction Label
		uCtx.font = "25px Arial";
		constructionText = "Construction";
		constructionWidth = uCtx.measureText(constructionText).width;
		constructionX = (windowWidth / 2) - (constructionWidth / 2);
		constructionY = y + 350;
		uCtx.font = "25px Arial";
		uCtx.fillStyle = "rgb(100, 100, 100)";

		uCtx.fillText(constructionText, constructionX, constructionY);

		// Fence Button
		fenceWidth = width / 2;
		fenceHeight = 40;
		fenceX = (windowWidth / 2) - (fenceWidth / 2);
		fenceY = constructionY + 20;

		clicked = this.fenceButton.update(fenceX, fenceY, fenceWidth, fenceHeight, "Make Fence: " + player.fenceCost + " Material", 25, 20, true);

		if (clicked == true){
			player.addItem("fence", 1);
		}

		// Wall Button
		wallWidth = width / 2;
		wallHeight = 40;
		wallX = (windowWidth / 2) - (wallWidth / 2);
		wallY = constructionY + 70;

		clicked = this.wallButton.update(wallX, wallY, wallWidth, wallHeight, "Make Wall: " + player.wallCost + " Material", 25, 20, true);

		if (clicked == true){
			player.addItem("wall", 1);
		}
	}

	CreateScreen.prototype.open = function(){
		pauseScreen.close();
		upgradeScreen.close();
		ui.createScreen = true;
	}

	CreateScreen.prototype.close = function(){
		ui.createScreen = false;
	}
}

function PauseScreen(){
	this.mainMenuButton = new Button();
	this.tutorialButton = new Button();
	this.bgColor = "rgb(220, 220, 220)";

	this.dragging = false;
	PauseScreen.prototype.update = function(){
		// Background ------
		width = windowWidth * 0.5;
		height = windowHeight * 0.8;

		x = (windowWidth / 2) - (width / 2);
		y = (windowHeight / 2) - (height / 2);

		// ---------- Background
		uCtx.fillStyle = this.bgColor;
		uCtx.strokeStyle = "rgb(120, 120, 120)"
		uCtx.globalAlpha = 0.85;
		roundRect(uCtx, x, y, width, height, 10, true, true);
		uCtx.globalAlpha = 1;

		// ----------- Close Button
		closeX = x + 30;
		closeY = y + 30;
		closeWidth = 20;
		closeHeight = 20;
		closeRadius = 17;

		dist = findDistance(ui.mouseX - (closeX + (closeWidth / 2)), ui.mouseY - (closeY + (closeHeight / 2)))
		
		// If button is hovered on and clicked
		if (dist < closeRadius){
			uCtx.fillStyle = "rgb(225, 225, 225)";
			uCtx.beginPath();
			uCtx.arc(closeX + (closeWidth / 2), closeY + (closeHeight / 2), closeRadius, 0, 2 * Math.PI);
			uCtx.fill();

			if (ui.press == true){
				this.close();
			}
		}

		uCtx.beginPath();
		uCtx.moveTo(closeX, closeY);
		uCtx.lineTo(closeX + closeWidth, closeY + closeHeight);
		uCtx.stroke();

		uCtx.beginPath();
		uCtx.moveTo(closeX + closeWidth, closeY);
		uCtx.lineTo(closeX, closeY + closeHeight);
		uCtx.stroke();

		// ---------- Main Menu Button
		mainBY = y + height - 80;
		mainBText = "Exit to Main Menu";
		mainBWidth = 200;
		mainBHeight = 40;

		clicked = this.mainMenuButton.update(0, mainBY, mainBWidth, mainBHeight, mainBText, 25, 20, true);

		if (clicked == true){
			world.mode = 3;
		}

		if (windowHeight > 660){

			// ---------- Label
			uX = x + 70;
			uY = y + 49;
			uText = "Game Paused";
			uCtx.font = "25px Arial";
			uCtx.fillStyle = "rgb(100, 100, 100)";

			uCtx.fillText(uText, uX, uY);

			// ----------- Line
			lWidth = width - 50;
			lX = windowWidth / 2 - lWidth / 2;
			lY = y + 62;

			uCtx.beginPath();
			uCtx.moveTo(lX, lY);
			uCtx.lineTo(lX + lWidth, lY);
			uCtx.stroke();
		}

		// ---------- Tutorial Button
		tutY = mainBY - 50;
		tutText = "Tutorial";
		tutWidth = 200;
		tutHeight = 40;

		clicked = this.tutorialButton.update(0, tutY, tutWidth, tutHeight, tutText, 25, 20, true);

		if (clicked == true){
			tutorial.screen = 0;
			tutorial.present = true;
		}

		if (windowHeight > 660){

			// ---------- Label
			uX = x + 70;
			uY = y + 49;
			uText = "Game Paused";
			uCtx.font = "25px Arial";
			uCtx.fillStyle = "rgb(100, 100, 100)";

			uCtx.fillText(uText, uX, uY);

			// ----------- Line
			lWidth = width - 50;
			lX = windowWidth / 2 - lWidth / 2;
			lY = y + 62;

			uCtx.beginPath();
			uCtx.moveTo(lX, lY);
			uCtx.lineTo(lX + lWidth, lY);
			uCtx.stroke();
		}

		// ---------- Block Size Slider

		// Line

		sWidth = width * 0.75;
		sX = (windowWidth / 2) - (sWidth / 2);
		sY = windowHeight * 0.50;

		uCtx.beginPath();
		uCtx.moveTo(sX, sY);
		uCtx.lineTo(sX + sWidth, sY);
		uCtx.stroke();

		// Label
		uCtx.font = "25px Arial";
		lText = "Block Size";
		lWidth = uCtx.measureText(lText).width;
		lX = (windowWidth / 2) - (lWidth / 2);
		lY = sY - 30;

		uCtx.font = "25px Arial";
		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.fillText(lText, lX, lY);

		range = 50 - 30;

		factor = sWidth / range;

		bX = sX + ((world.blockSize - 30) * factor);
		bY = sY;
		bRadius = 8;

		uCtx.globalAlpha = 0.97;
		uCtx.fillStyle = "rgb(220, 220, 220)";
		uCtx.beginPath();
		uCtx.arc(bX, bY, bRadius, 0, 2 * Math.PI);
		uCtx.stroke();
		uCtx.fill();
		uCtx.globalAlpha = 1;

		dist = findDistance(ui.mouseX - (bX), ui.mouseY - (bY));
		
		// If button is hovered on and clicked
		if (dist < bRadius){
			uCtx.fillStyle = "rgb(225, 225, 225)";
			uCtx.beginPath();
			uCtx.arc(bX, bY, bRadius, 0, 2 * Math.PI);
			uCtx.fill();

			if (ui.mousePressed){
				this.dragging = true;
			}
		}

		if (ui.mousePressed == false){
			this.dragging = false;
		}

		if (this.dragging == true){
			if (ui.mouseX < sX){
				bX = sX;
			}else if (ui.mouseX > sX + sWidth){
				bX = sX + sWidth;
			}else{
				bX = ui.mouseX;
			}

			blockSize = Math.round((bX - sX) / factor + 30);

			world.changeBlockSize(blockSize);
		}
	}
	PauseScreen.prototype.open = function(){
		world.mode = 2;

		createScreen.close();
		upgradeScreen.close();
		ui.pauseScreen = true;
	}

	PauseScreen.prototype.close = function(){
		world.mode = 0;

		ui.pauseScreen = false;
	}
}

function Inventory(){
	this.x = 10;
	this.y = 45;
	this.width = 150;
	this.height = 260;

	this.bgColor = "rgb(220, 220, 220)";

	this.axeImg = new Image();
	this.axeImg.src = "inventory/axe.png";

	this.swordImg = new Image();
	this.swordImg.src = "inventory/sword.png";

	this.bowImg = new Image();
	this.bowImg.src = "inventory/bow.png";

	this.bombImg = new Image();
	this.bombImg.src = "inventory/bomb.png";

	this.bandageImg = new Image();
	this.bandageImg.src = "inventory/bandage.png";

	Inventory.prototype.update = function(){
		// ---------- Background
		uCtx.fillStyle = this.bgColor;
		uCtx.strokeStyle = "rgb(120, 120, 120)"
		uCtx.globalAlpha = 0.75;
		roundRect(uCtx, this.x, this.y, this.width, this.height, 10, true, true);
		uCtx.globalAlpha = 1;

		// ---------- Side Numbers
		uCtx.font = "10px Arial";
		uCtx.fillStyle = "rgb(100, 100, 100)"
		for (var x = 1; x < 9; x++){
			uCtx.fillText(x, this.x + 11, (this.y - 2) + 30 * x);
		}

		// ---------- Selection Indicator
		indX = this.x + 25;
		indY = Math.floor(this.y + 10 + (player.selection * 30.5));
		indWidth = this.width - 30;
		indHeight = 25;

		uCtx.fillStyle = this.bgColor;
		uCtx.globalAlpha = 0.85;
		uCtx.lineWidth = 1;
		uCtx.strokeStyle = "rgb(100, 100, 100)";
		roundRect(uCtx, indX, indY, indWidth, indHeight, 10, false, true);
		uCtx.globalAlpha = 1;

		// ---------- Axe
		axeX = this.x + 63;
		axeY = this.y + 8;
		uCtx.drawImage(this.axeImg, axeX, axeY);

		// ---------- Sword
		swordX = this.x + 64;
		swordY = this.y + 38;
		uCtx.drawImage(this.swordImg, swordX, swordY);

		// ---------- Bow
		bowX = this.x + 64;
		bowY = this.y + 67;
		uCtx.drawImage(this.bowImg, bowX, bowY);

		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.font = "16px Arial";

		bowTX = this.x + 93;
		bowTY = this.y + 90;
		bowText = player.arrows;

		uCtx.fillText(bowText, bowTX, bowTY);

		// ---------- Bomb
		bombX = this.x + 62;
		bombY = this.y + 99;
		uCtx.drawImage(this.bombImg, bombX, bombY);

		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.font = "16px Arial";

		bombTX = this.x + 93;
		bombTY = this.y + 120;
		bombText = player.bombs;

		uCtx.fillText(bombText, bombTX, bombTY);

		// ---------- Bandage
		bandageX = this.x + 62;
		bandageY = this.y + 128;
		uCtx.drawImage(this.bandageImg, bandageX, bandageY);

		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.font = "16px Arial";

		bandageTX = this.x + 93;
		bandageTY = this.y + 150;
		bandageText = player.bandages;

		uCtx.fillText(bandageText, bandageTX, bandageTY);

		// ---------- Sapling
		saplingX = this.x + 71;
		saplingY = this.y + 175;

		// Fill and stroke
		uCtx.beginPath();
  		uCtx.arc(saplingX, saplingY, 5, 0, 2 * Math.PI, false);
  		uCtx.fillStyle = 'rgb(30, 155, 20)';
  		uCtx.fill();

  		uCtx.lineWidth = 2;
  		uCtx.strokeStyle = 'rgb(3, 130, 0)';
  		uCtx.stroke();

		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.font = "16px Arial";

		saplingTX = this.x + 93;
		saplingTY = this.y + 180;
		saplingText = player.saplings;

		uCtx.fillText(saplingText, saplingTX, saplingTY);

		// ---------- Fence
		fenceX = this.x + 71;
		fenceY = this.y + 204;

		// Fill and stroke
		uCtx.beginPath();
  		uCtx.arc(fenceX, fenceY, 9, 0, 2 * Math.PI, false);
  		uCtx.fillStyle = 'rgb(205, 133, 63)';
  		uCtx.fill();

  		uCtx.lineWidth = 2;
  		uCtx.strokeStyle = 'rgb(160, 82, 45)';
  		uCtx.stroke();

		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.font = "16px Arial";

		fenceTX = this.x + 93;
		fenceTY = this.y + 210;
		fenceText = player.fences;

		uCtx.fillText(fenceText, fenceTX, fenceTY);

		// ---------- Walls
		wallX = this.x + 62;
		wallY = this.y + 224;
		uCtx.fillStyle = 'rgb(205, 133, 63)';
		uCtx.fillRect(wallX, wallY, 18, 18);

		uCtx.strokeStyle = 'rgb(160, 82, 45)';
		uCtx.strokeRect(wallX, wallY, 18, 18);

		uCtx.fillStyle = "rgb(100, 100, 100)";
		uCtx.font = "16px Arial";

		wallTX = this.x + 93;
		wallTY = this.y + 240;
		wallText = player.walls;

		uCtx.fillText(wallText, wallTX, wallTY);
	}
}
