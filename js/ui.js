healthBar = new HealthBar();

respawnScreen = new RespawnScreen();
upgradeScreen = new UpgradeScreen();
createScreen = new CreateScreen();

scoreLabel = new ScoreLabel();
materialLabel = new MaterialLabel();
xpLabel = new XPLabel();

debugMenu = new DebugMenu();

coolDownIndicator = new CoolDownIndicator();

inventory = new Inventory();

function Button(){
	Button.prototype.update = function(x, y, width, height, text, textOffset, font){

		this.x = x;
		this.y = y;

		this.width = width;
		this.height = height;

		this.text = text;
		this.textOffset = textOffset;
		this.font = font;

		// Text vars
		uCtx.font = this.font + "px Arial";
		textWidth = uCtx.measureText(this.text).width;

		// If text width is more than the entire width, change that
		if (textWidth > this.width){
			this.width = textWidth + 5;
		}

		textX = this.x + (this.width / 2) - (textWidth / 2);
		textY = this.y + this.textOffset;

		// Outline
		uCtx.strokeStyle = "black";
		uCtx.strokeRect(this.x, this.y, this.width, this.height);

		clicked = false;

		if (ui.mouseX > this.x && ui.mouseX < this.x + this.width){
			if (ui.mouseY > this.y && ui.mouseY < this.y + this.height){
				uCtx.fillStyle = "rgb(180, 180, 180)";
				uCtx.fillRect(this.x, this.y, this.width, this.height);
				if (ui.click == true){
					clicked = true;
				}
			}
		}

		// Draw text
		uCtx.fillStyle = "black";
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

	this.upgradeScreen = false;
	this.createScreen = false;
	this.pauseScreen = false;

	this.screen = false;
	UI.prototype.update = function(){
		debugMenu.update();

		// In game UI
		healthBar.update();
		scoreLabel.update();
		xpLabel.update();
		materialLabel.update();
		coolDownIndicator.update();

		inventory.update();

		if (world.mode == 1){
			respawnScreen.update();
		}

		if (this.upgradeScreen == true && world.mode == 0){
			upgradeScreen.update();
		}

		if (this.createScreen == true && world.mode == 0){
			createScreen.update();
		}

		if (this.createScreen == true || this.upgradeScreen == true){
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

		this.click = false; // True for one frame after player releases mouse
		this.press = false; // True for one frame as soon as player clicks mouse
	}
}

function DebugMenu(){
	this.textSize = 16;
	this.y = 160;
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
		uCtx.fillText("Entities " + world.entityCounter + "/" + world.entityLimiter , this.x, this.y + (space * 4));
		uCtx.fillText("Interval " + Math.round(world.intervalFrames / 60) + "/" + Math.round(world.intervalTime / 60), this.x, this.y + (space * 5));
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

function XPLabel(){
	this.x = 10;
	this.y = 100;
	this.textSize = 20;

	XPLabel.prototype.update = function(){
		text = "XP: " + player.xp;

		uCtx.font = this.textSize + "px Arial";
		uCtx.fillStyle = "black";
		uCtx.fillText(text, this.x, this.y);
	}
}

function MaterialLabel(){
	this.x = 10;
	this.y = 130;
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
					player.spawn();
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

function UpgradeScreen(){	
	this.powerButton = new Button();
	this.bowCoolButton = new Button();

	this.damageButton = new Button();
	this.reachButton = new Button();
	this.swordCoolButton = new Button();
	UpgradeScreen.prototype.update = function(){
		// Background ----------
		width = windowWidth * 0.8;
		height = windowHeight * 0.8;

		x = (windowWidth / 2) - (width / 2);
		y = (windowHeight / 2) - (height / 2);

		uCtx.fillStyle = "rgb(200, 200, 200)";
		uCtx.fillRect(x, y, width, height);

		// Outline
		uCtx.strokeStyle = "black";
		uCtx.strokeRect(x, y, width, height);

		// Labels ----------
		uCtx.font = "30px Arial";
		uCtx.fillStyle = "black";

		swordText = "Sword";
		swordWidth = uCtx.measureText(swordText).width;
		swordX = (windowWidth * (1 / 3)) - (swordWidth / 2);
		swordY = y + 100;

		uCtx.fillText(swordText, swordX, swordY);

		uCtx.font = "30px Arial";
		uCtx.fillStyle = "black";

		bowText = "Bow";
		bowWidth = uCtx.measureText(bowText).width;
		bowX = (windowWidth * (2 / 3)) - (bowWidth / 2);
		bowY = y + 100;

		uCtx.fillText(bowText, bowX, bowY);

		// Bow Buttons ----------

		// Power

		powWidth = windowWidth * 0.2;
		powHeight = 40;

		powX = (windowWidth * (2 / 3)) - (powWidth / 2);
		powY = bowY + 70;

		// Text
		powerUpgrade = player.powerUpgrades[player.powerUpgrades.indexOf(player.power) + 1];

		if (powerUpgrade == undefined){
			powText = "Power Fully Upgraded!"
		}else{
			powText = "Upgrade Power " + player.power + " -> " + powerUpgrade;
		}

		clicked = this.powerButton.update(powX, powY, powWidth, powHeight, powText, 25, 20);

		if (clicked == true){
			player.upgrade("power");
		}

		// BowCool

		bowCoolWidth = windowWidth * 0.2;
		bowCoolHeight = 40;

		bowCoolX = (windowWidth * (2 / 3)) - (powWidth / 2);
		bowCoolY = bowY + 120;

		// Text
		bowCoolUpgrade = player.bowCoolUpgrades[player.bowCoolUpgrades.indexOf(player.bowCool) + 1];

		if (bowCoolUpgrade == undefined){
			bowCoolText = "Bow Cooldown Fully Upgraded!"
		}else{
			bowCoolText = "Upgrade Bow Cooldown " + player.bowCool + " -> " + bowCoolUpgrade;
		}

		clicked = this.bowCoolButton.update(bowCoolX, bowCoolY, bowCoolWidth, bowCoolHeight, bowCoolText, 25, 20);

		if (clicked == true){
			player.upgrade("bowCool");
		}

		// Damage

		damageWidth = windowWidth * 0.2;
		damageHeight = 40;

		damageX = (windowWidth * (1 / 3)) - (damageWidth / 2);
		damageY = bowY + 70;

		// Text
		damageUpgrade = player.damageUpgrades[player.damageUpgrades.indexOf(player.damage) + 1];

		if (damageUpgrade == undefined){
			damageText = "Damage Fully Upgraded!"
		}else{
			damageText = "Upgrade Damage " + player.damage + " -> " + damageUpgrade;
		}

		clicked = this.damageButton.update(damageX, damageY, damageWidth, damageHeight, damageText, 25, 20);

		if (clicked == true){
			player.upgrade("damage");
		}

		// Reach

		reachWidth = windowWidth * 0.2;
		reachHeight = 40;

		reachX = (windowWidth * (1 / 3)) - (reachWidth / 2);
		reachY = bowY + 120;

		// Text
		reachUpgrade = player.reachUpgrades[player.reachUpgrades.indexOf(player.reach) + 1];

		if (reachUpgrade == undefined){
			reachText = "Reach Fully Upgraded!"
		}else{
			reachText = "Upgrade Reach " + player.reach + " -> " + reachUpgrade;
		}

		clicked = this.reachButton.update(reachX, reachY, reachWidth, reachHeight, reachText, 25, 20);

		if (clicked == true){
			player.upgrade("reach");
		}

		// SwordCool

		swordCoolWidth = windowWidth * 0.2;
		swordCoolHeight = 40;

		swordCoolX = (windowWidth * (1 / 3)) - (swordCoolWidth / 2);
		swordCoolY = bowY + 170;

		// Text
		swordCoolUpgrade = player.swordCoolUpgrades[player.swordCoolUpgrades.indexOf(player.swordCool) + 1];

		if (swordCoolUpgrade == undefined){
			swordCoolText = "Sword Cooldown Fully Upgraded!"
		}else{
			swordCoolText = "Upgrade Sword Cooldown " + player.swordCool + " -> " + swordCoolUpgrade;
		}

		clicked = this.swordCoolButton.update(swordCoolX, swordCoolY, swordCoolWidth, swordCoolHeight, swordCoolText, 25, 20);

		if (clicked == true){
			player.upgrade("swordCool");
		}

	}

	UpgradeScreen.prototype.open = function(){
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
	CreateScreen.prototype.update = function(){
		// Background ----------
		width = windowWidth * 0.8;
		height = windowHeight * 0.8;

		x = (windowWidth / 2) - (width / 2);
		y = (windowHeight / 2) - (height / 2);

		uCtx.fillStyle = "rgb(200, 200, 200)";
		uCtx.fillRect(x, y, width, height);

		// Outline
		uCtx.strokeStyle = "black";
		uCtx.strokeRect(x, y, width, height);

		// Arrow Button
		arrowBWidth = width / 2;
		arrowBHeight = 40;
		arrowBX = (windowWidth / 2) - (arrowBWidth / 2);
		arrowBY = (windowHeight / 2) - (arrowBHeight / 2);

		clicked = this.arrowButton.update(arrowBX, arrowBY, arrowBWidth, arrowBHeight, "Make 10 Arrows: " + player.arrowCost * 10 + " Material", 25, 20);

		if (clicked == true){
			player.addItem("arrow", 10);
		}

		// Bomb Button
		bombBWidth = width / 2;
		bombBHeight = 40;
		bombBX = (windowWidth / 2) - (bombBWidth / 2);
		bombBY = arrowBY - 50;

		clicked = this.bombButton.update(bombBX, bombBY, bombBWidth, bombBHeight, "Make Bomb: " + player.bombCost + " Material", 25, 20);

		if (clicked == true){
			player.addItem("bomb", 1);
		}

		// Bandage Button
		bandageBWidth = width / 2;
		bandageBHeight = 40;
		bandageBX = (windowWidth / 2) - (bandageBWidth / 2);
		bandageBY = arrowBY + 50;

		clicked = this.bandageButton.update(bandageBX, bandageBY, bandageBWidth, bandageBHeight, "Make Bandage: " + player.bandageCost + " Material", 25, 20);

		if (clicked == true){
			player.addItem("bandage", 1);
		}
	}

	CreateScreen.prototype.open = function(){
		ui.createScreen = true;
	}

	CreateScreen.prototype.close = function(){
		ui.createScreen = false;
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
		thirdText = "Bow: " + player.arrows;
		thirdWidth = uCtx.measureText(thirdText).width;
		thirdX = secondX + secondWidth + this.spacing;
		uCtx.fillText(thirdText, thirdX, this.y);

		// Box
		if (player.selection == 2){
			uCtx.strokeRect(thirdX - 2, this.y - this.font + 2, thirdWidth + 4, this.font);
		}

		// 4th Item
		fourthText = "Bombs: " + player.bombs;
		fourthWidth = uCtx.measureText(fourthText).width;
		fourthX = thirdX + thirdWidth + this.spacing;
		uCtx.fillText(fourthText, fourthX, this.y);

		// Box
		if (player.selection == 3){
			uCtx.strokeRect(fourthX - 2, this.y - this.font + 2, fourthWidth + 4, this.font);
		}

		// 5th Item
		fifthText = "Bandages: " + player.bandages;
		fifthWidth = uCtx.measureText(fifthText).width;
		fifthX = fourthX + fourthWidth + this.spacing;
		uCtx.fillText(fifthText, fifthX, this.y);

		// Box
		if (player.selection == 4){
			uCtx.strokeRect(fifthX - 2, this.y - this.font + 2, fifthWidth + 4, this.font);
		}

		// 6th Item
		sixthText = "Saplings: " + player.saplings;
		sixthWidth = uCtx.measureText(sixthText).width;
		sixthX = fifthX + fifthWidth + this.spacing;
		uCtx.fillText(sixthText, sixthX, this.y);

		// Box
		if (player.selection == 5){
			uCtx.strokeRect(sixthX - 2, this.y - this.font + 2, sixthWidth + 4, this.font);
		}
		
	}
}
