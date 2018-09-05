tutorial = new Tutorial();

function Tutorial(){
	this.x;
	this.y;

	this.width = 300;
	this.height = 150;

	this.firstLine = ["Movement",
	"Sword",
	"Bow and Arrow",
	"Cool Down",
	"Bomb",
	"Bandage",
	"Bushes",
	"Saplings",
	"Material",
	"XP"];

	this.secondLine = ["Use the W, A, S, and D keys to move.",
	"To select your sword, press 2, or use",
	"To use your bow, press 3 or use the",
	"When you use your sword or bow, you'll",
	"A bomb can be selected by pressing 4 or",
	"To regain health, select a bandage",
	"Bushes can be used to gain material.",
	"To replant a bush, select a sapling",
	"Once you've collected some material,",
	"When you kill enemies, you recieve XP."];

	this.thirdLine = ["",
	"the scroll wheel. Once an enemy gets",
	"scroll wheel. Click in the direction",
	"see the indicator above the player empty.",
	"using the scroll wheel. Click where you",
	"using 5 or the scroll wheel. Click",
	"Select the collector using 1 or scrolling",
	"using 6 or the scroll wheel. Click a grass",
	"make items using the create menu. To",
	"You can use XP to upgrade your weapons"];

	this.fourthLine = ["",
	"close, click near it to attack it.",
	"you want to fire an arrow.",
	"Attack when it is filled up to do the",
	"wish to use it in order to kill many",
	"anywhere to regain some health.",
	"to it, and harvest bushes by clicking",
	"block to plant the sapling.",
	"open it, press F or click the Create",
	"by pressing R, or clicking the Upgrade"]

	this.fifthLine = ["",
	"",
	"",
	"most damage.",
	"enemies and destroy nearby blocks.",
	"",
	"and holding on them.",
	"",
	"button at the top of the screen.",
	"button at the top of the screen."]

	this.screen = 0;

	this.backButton = new Button();
	this.nextButton = new Button();

	this.present = false;
	Tutorial.prototype.update = function(){
		this.x = windowWidth - this.width - 10;
		this.y = windowHeight - this.height - 10;

		// ---------- Background
		uCtx.fillStyle = "rgb(220, 220, 220)";
		uCtx.strokeStyle = "rgb(120, 120, 120)"
		uCtx.globalAlpha = 0.75;
		roundRect(uCtx, this.x, this.y, this.width, this.height, 10, true, true);
		uCtx.globalAlpha = 1;

		if (this.screen > 0){
			// ---------- Back Button
			bWidth = 80;
			bHeight = 25;

			bX = this.x + 10;
			bY = this.y + this.height - bHeight - 10;

			// Text
			uCtx.font = "20px Arial";
			bText = "Back";

			clicked = this.backButton.update(bX, bY, bWidth, bHeight, bText, 17, 15);

			if (clicked == true){
				this.screen -= 1;
			}
		}


		// ---------- Next Button
		nWidth = 80;
		nHeight = 25;

		nX = this.x + this.width - nWidth - 10;
		nY = this.y + this.height - nHeight - 10;

		// Text
		uCtx.font = "20px Arial";

		if (this.screen == this.firstLine.length - 1){
			nText = "Done";
		}else{
			nText = "Next";
		}
		

		clicked = this.nextButton.update(nX, nY, nWidth, nHeight, nText, 17, 15);

		if (clicked == true){
			if (this.screen == this.firstLine.length - 1){
				this.present = false;
			}else{
				this.screen += 1;
			}
		}
		

		// ---------- First Line
		uCtx.font = "15px Arial";
		fText = this.firstLine[this.screen];
		fWidth = uCtx.measureText(fText).width;
		fX = this.x + (this.width / 2 - fWidth / 2);
		fY = this.y + 25;
		uCtx.fillStyle = "rgb(100, 100, 100)";

		uCtx.fillText(fText, fX, fY);

		// ---------- Second Line
		uCtx.font = "15px Arial";
		fText = this.secondLine[this.screen];
		fWidth = uCtx.measureText(fText).width;
		fX = this.x + (this.width / 2 - fWidth / 2);
		fY = this.y + 50;
		uCtx.fillStyle = "rgb(100, 100, 100)";

		uCtx.fillText(fText, fX, fY);

		// ---------- Third Line
		uCtx.font = "15px Arial";
		fText = this.thirdLine[this.screen];
		fWidth = uCtx.measureText(fText).width;
		fX = this.x + (this.width / 2 - fWidth / 2);
		fY = this.y + 65;
		uCtx.fillStyle = "rgb(100, 100, 100)";

		uCtx.fillText(fText, fX, fY);

		// ---------- Fourth Line
		uCtx.font = "15px Arial";
		fText = this.fourthLine[this.screen];
		fWidth = uCtx.measureText(fText).width;
		fX = this.x + (this.width / 2 - fWidth / 2);
		fY = this.y + 80;
		uCtx.fillStyle = "rgb(100, 100, 100)";

		uCtx.fillText(fText, fX, fY);

		// ---------- Fourth Line
		uCtx.font = "15px Arial";
		fText = this.fifthLine[this.screen];
		fWidth = uCtx.measureText(fText).width;
		fX = this.x + (this.width / 2 - fWidth / 2);
		fY = this.y + 95;
		uCtx.fillStyle = "rgb(100, 100, 100)";

		uCtx.fillText(fText, fX, fY);
		
	}
}
