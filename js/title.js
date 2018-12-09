function Title(){
	this.playButton = new Button();
	this.creditsButton = new Button();

	this.youtubeButton = new Button();
	this.websiteButton = new Button();

	this.logo = new Image();
	this.logo.src = "logo/logo.png";

	this.x = 0;
	this.y = 0;

	this.draw = "grass";

	this.blockDataX = [];
	this.blockDataY = [];

	this.creditsScreen = false;

	Title.prototype.init = function(){
		// Creates world shown in background of title screen

		for (var x = 0; x < 40 * 100; x += 40){
			for (var y = 0; y < 40 * 100; y += 40){
				random = Math.random();

				if (random < 0.25){
					this.blockDataX.push(x);
					this.blockDataY.push(y);
				}
			}
		}
	}

	Title.prototype.render = function(){
		bCtx.fillStyle = "rgb(9, 133, 234)";
 		bCtx.fillRect(0, 0, windowWidth, windowHeight);
 		pCtx.clearRect(0, 0, windowWidth, windowHeight);
 		aCtx.clearRect(0, 0, windowWidth, windowHeight);

		for (var x = 0; x < this.blockDataX.length; x++){
			blockX = this.blockDataX[x];
			blockY = this.blockDataY[x];

			if (Math.abs(blockX - this.x) < windowWidth && Math.abs(blockY - this.y) < windowHeight){
				drawX = Math.round(blockX - this.x);
				drawY = Math.round(blockY - this.y);

				if (this.draw == "grass"){
					bCtx.fillStyle = "rgb(45, 172, 32)";
					bCtx.fillRect(drawX, drawY, 40, 40);

					bCtx.strokeStyle = "rgb(41, 155, 29)";
					bCtx.strokeRect(drawX, drawY, 40, 40);
				}else{
					bCtx.fillStyle = "rgb(227, 229, 160)";
					bCtx.fillRect(drawX, drawY, 40, 40);

					bCtx.strokeStyle = "rgb(209, 211, 147)";
					bCtx.strokeRect(drawX, drawY, 40, 40);
				}
				
			}

		}
	}

	Title.prototype.update = function(){
		uCtx.clearRect(0, 0, windowWidth, windowHeight);

 		this.render();

 		this.x += 0.5;
 		this.y += 0.5

 		if (this.x > 100 * 40 && this.y > 100 * 40){
 			this.x = -(windowWidth);
 			this.y = -(windowHeight);

 			if (this.draw == "grass"){
 				this.draw = "sand";
 			}else{
 				this.draw = "grass";
 			}
 		}

		if (this.creditsScreen == false){
			this.screen();
		}else{
			this.credits();
		}
		
		ui.click = false; // True for one frame after player releases mouse
		ui.press = false; // True for one frame as soon as player clicks mouse
	}

	Title.prototype.screen = function(){

		width = windowWidth * 0.4;
		height = windowHeight * 0.8;

		x = (windowWidth / 2) - (width / 2);
		y = (windowHeight / 2) - (height / 2);

		// ---------- Background
		uCtx.fillStyle = "rgb(220, 220, 220)";
		uCtx.strokeStyle = "rgb(120, 120, 120)";
		uCtx.globalAlpha = 0.85;
		roundRect(uCtx, x, y, width, height, 10, true, true);
		uCtx.globalAlpha = 1;

		// ---------- Island Defense Label

		tWidth = 290;
		tX = windowWidth / 2 - tWidth / 2;
		tY = windowHeight * 0.2;
		uCtx.drawImage(this.logo, tX, tY);

		// ---------- Decides if buttons will be "Play" and "Play with Tutorial" (mode 0) or "Continue Game" and "Start New Game" (mode 1)
		data = JSON.parse(localStorage.getItem('player'));
		if (data == null){
			mode = 0;
		}else{
			mode = 1;
		}

		if (mode == 0){
			// ---------- Play Button
			pWidth = windowWidth * 0.3;
			pHeight = 40;

			pX = (windowWidth / 2) - (pWidth / 2);
			pY = windowHeight * 0.47;

			// Text
			uCtx.font = "20px Arial";
			pText = "Play";

			clicked = this.playButton.update(pX, pY, pWidth, pHeight, pText, 26, 20);

			if (clicked == true){
				tutorial.present = false;
				startGame();
			}

			// ---------- Play With Tutorial Button
			tWidth = windowWidth * 0.3;
			tHeight = 40;

			tX = (windowWidth / 2) - (tWidth / 2);
			tY = pY + 50;

			// Text
			uCtx.font = "20px Arial";
			tText = "Play with Tutorial";

			clicked = this.playButton.update(tX, tY, tWidth, tHeight, tText, 26, 20, true);

			if (clicked == true){
				tutorial.screen = 0;
				tutorial.present = true;
				startGame();
			}
		}else{
			// ---------- Continue Button
			pWidth = windowWidth * 0.3;
			pHeight = 40;

			pX = (windowWidth / 2) - (pWidth / 2);
			pY = windowHeight * 0.47;

			// Text
			uCtx.font = "20px Arial";
			pText = "Continue Game";

			clicked = this.playButton.update(pX, pY, pWidth, pHeight, pText, 26, 20);

			if (clicked == true){
				tutorial.present = false;
				continueGame();
			}

			// ---------- Start New Button
			tWidth = windowWidth * 0.3;
			tHeight = 40;

			tX = (windowWidth / 2) - (tWidth / 2);
			tY = pY + 50;

			// Text
			uCtx.font = "20px Arial";
			tText = "Start New Game";

			clicked = this.playButton.update(tX, tY, tWidth, tHeight, tText, 26, 20, true);

			if (clicked == true){
				tutorial.present = false;
				startGame();
			}
		}

		// ---------- Credits Button
		cWidth = windowWidth * 0.3;
		cHeight = 40;

		cX = (windowWidth / 2) - (cWidth / 2);
		cY = tY + 50;

		// Text
		uCtx.font = "20px Arial";
		cText = "Credits";

		clicked = this.playButton.update(cX, cY, cWidth, cHeight, cText, 26, 20);

		if (clicked == true){
			this.creditsScreen = true;
		}
	}

	Title.prototype.credits = function(){
		width = windowWidth * 0.4;
		height = windowHeight * 0.8;

		x = (windowWidth / 2) - (width / 2);
		y = (windowHeight / 2) - (height / 2);

		// ---------- Background
		uCtx.fillStyle = "rgb(220, 220, 220)";
		uCtx.strokeStyle = "rgb(120, 120, 120)";
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
				this.creditsScreen = false;
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

		// Credits
		uCtx.font = "20px Arial";
		uCtx.fillStyle = "rgb(100, 100, 100)"
		c1Text = "All Art, Code, and Design";
		c1Width = uCtx.measureText(c1Text).width;
		c1X = windowWidth / 2 - c1Width / 2;
		c1Y = windowHeight * 0.45;

		uCtx.fillText(c1Text, c1X, c1Y);

		uCtx.font = "20px Arial";
		uCtx.fillStyle = "rgb(100, 100, 100)"
		c2Text = "by Thomas Breimer";
		c2Width = uCtx.measureText(c2Text).width;
		c2X = windowWidth / 2 - c2Width / 2;
		c2Y = c1Y + 25;

		uCtx.fillText(c2Text, c2X, c2Y);

		// ---------- YouTube Button
		yWidth = windowWidth * 0.2;
		yHeight = 40;

		yX = (windowWidth / 2) - (yWidth / 2);
		yY = windowHeight * 0.65;

		// Text
		uCtx.font = "20px Arial";
		yText = "YouTube";

		clicked = this.youtubeButton.update(yX, yY, yWidth, yHeight, yText, 26, 20);

		if (clicked == true){
			window.location.href = 'https://www.youtube.com/channel/UCNLVHLULKjDT2CPzfToXK7Q';
		}

		// ---------- Website Button
		wWidth = windowWidth * 0.2;
		wHeight = 40;

		wX = (windowWidth / 2) - (wWidth / 2);
		wY = yY + 50;

		// Text
		uCtx.font = "20px Arial";
		wText = "Website";

		clicked = this.websiteButton.update(wX, wY, wWidth, wHeight, wText, 26, 20);

		if (clicked == true){
			window.location.href = 'https://www.forestquest.net/';
		}
	}
}
