function Entity(x, y){
	this.x = x;
	this.y = y;

	this.screenX;
	this.screenY;

	this.width = 30;
	this.height = 30;

	this.movementU = false;
	this.movementD = false;
	this.movementL = false;
	this.movementR = false;

	this.deltaU = 0;
	this.deltaD = 0;
	this.deltaL = 0;
	this.deltaR = 0;

	this.speed = 1;

	this.alive = true;
	this.health = 20;

	// If entity has been hurt
	this.damaged = false;

	// How much damage entity does per frame
	this.attackValue = 1;

	Entity.prototype.update = function(){
		this.movement();

		this.damage();

		this.attack();

		// Draw entity
		this.screenX = this.x - player.x + (windowWidth / 2) - (player.width / 2);
		this.screenY = this.y - player.y + (windowHeight / 2) - (player.height / 2);

		// Change color for one frame if enemy is damaged
		if (this.damaged == true){
			pCtx.fillStyle = "rgb(80, 0, 0)";
		}else{
			pCtx.fillStyle = "red";
		}
		
		pCtx.fillRect(this.screenX, this.screenY, this.width, this.height);

		pCtx.strokeStyle = "black";
		pCtx.lineWidth = 2;
		pCtx.strokeRect(this.screenX, this.screenY, this.width, this.height);

		this.damaged = false;
	}

	Entity.prototype.damage = function(){
		playerDistance = findDistance(this.x - player.x, this.y - player.y);
		mouseDistance = findDistance((this.screenX + this.width / 2) - ui.mouseX, (this.screenY + this.height / 2) - ui.mouseY);

		// If the player and mouse and close, and the mouse is clicked, lower the health
		if (playerDistance < 100 && mouseDistance < 200 && ui.click == true){
			this.health -= player.damage;

			// True for one frame, makes enemy change color
			this.damaged = true;
		}

		if (this.health <= 0){
			this.alive = false;
		}
	}

	Entity.prototype.attack = function(){
		playerDistance = findDistance(this.x - player.x, this.y - player.y);

		// If player is close and they aren't dead, attack them
		if (playerDistance < 60 && player.health > 0){
			player.health -= this.attackValue;
		}
	}
 
	Entity.prototype.movement = function(){
		// Move entity towards player 

		xDif = this.x - player.x;
		yDif = this.y - player.y;

		if (xDif > 5){
			this.movementL = true;
		}else{
			this.movementL = false;
		}

		if (xDif < -5){
			this.movementR = true;
		}else{
			this.movementR = false;
		}

		if (yDif > 5){
			this.movementU = true;
		}else{
			this.movementU = false;
		}

		if (yDif < -5){
			this.movementD = true;
		}else{
			this.movementD = false;
		}

		// Handles diagonal movement

		this.deltaU = 0;
		this.deltaD = 0;
		this.deltaL = 0;
		this.deltaR = 0;

		if (this.movementU == true){
			if (this.movementL == true){
				this.deltaU = this.speed * 0.75;
				this.deltaL = this.speed * 0.75;
			}else if (this.movementR == true){
				this.deltaU = this.speed * 0.75;
				this.deltaR = this.speed * 0.75;
			}else{
				this.deltaU = this.speed;
			}
		}

		if (this.movementD == true){

			if (this.movementL == true){
				this.deltaD = this.speed * 0.75;
				this.deltaL = this.speed * 0.75;
			}else if (this.movementR == true){
				this.deltaD = this.speed * 0.75;
				this.deltaR = this.speed * 0.75;
			}else{
				this.deltaD = this.speed;
			}
		}

		// No need to cover diagonal movement here since all 4 diagonal directions are already accounted for 
		if (this.movementL == true && this.movementU == false && this.movementD == false){
			this.deltaL = this.speed;
		}

		if (this.movementR == true && this.movementU == false && this.movementD == false){
			this.deltaR = this.speed;
		}

		// Collision detection

		// Gets x and y of top of entity
		topX = this.x - (this.width / 2);
		topY = this.y - (this.height / 2);

		// Finds x and y of bottom of entity
		bottomX = this.x + (this.width / 2);
		bottomY = this.y + (this.height / 2);

		// Finds how many blocks the entity spans in current position
		blockWidth = Math.floor(bottomX / world.blockSize) - Math.floor(topX / world.blockSize) + 1;
		blockHeight = Math.floor(bottomY / world.blockSize) - Math.floor(topY / world.blockSize) + 1;
		
		// If there is a block with collision to the left
		blockL = false

		// Collision left
		// If the entity will pass a block next frame
		if (Math.floor(topX / world.blockSize) != Math.floor((topX - this.deltaL) / world.blockSize)){
			// Go through all the blocks adjacent to the entities's left
			for (var x = 0; x < blockHeight; x ++){
				blockX = Math.floor((topX - this.deltaL) / world.blockSize);
				blockY = Math.floor(topY / world.blockSize) + x;
				// Find if the block has collision
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockL = true; 
				}
			}
		}

		// Collision right
		blockR = false
		if (Math.floor(bottomX / world.blockSize) != Math.floor((bottomX + this.deltaR) / world.blockSize)){
			for (var x = 0; x < blockHeight; x ++){
				blockX = Math.floor((bottomX + this.deltaR) / world.blockSize);
				blockY = Math.floor(topY / world.blockSize) + x;
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockR = true; 
				}
			}
		}

		// Collision up
		blockU = false
		if (Math.floor(topY / world.blockSize) != Math.floor((topY - this.deltaU) / world.blockSize)){
			for (var x = 0; x < blockWidth; x ++){
				blockY = Math.floor((topY - this.deltaU) / world.blockSize);
				blockX = Math.floor(topX / world.blockSize) + x;
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockU = true; 
				}
			}
		}

		// Collision down
		blockD = false
		if (Math.floor(bottomY / world.blockSize) != Math.floor((bottomY + this.deltaD) / world.blockSize)){
			for (var x = 0; x < blockWidth; x ++){
				blockY = Math.floor((bottomY + this.deltaD) / world.blockSize);
				blockX = Math.floor(topX / world.blockSize) + x;
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockD = true; 
				}
			}
		}

		// Collision diagonal

		// Collision top left
		// Only do collision is entity is going diagonally (prevents bug)
		if (blockU == false && blockL == false){
			// Check if entity will be in a diagonal block next frame
			if (Math.floor(topY / world.blockSize) != Math.floor((topY - this.deltaU) / world.blockSize) && Math.floor(topX / world.blockSize) != Math.floor((topX - this.deltaL) / world.blockSize)){
				// Find that diagonal block
				blockY = Math.floor((topY - this.deltaU) / world.blockSize);
				blockX = Math.floor((topX - this.deltaL) / world.blockSize);
				// Test if that diagonal block has collision
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					// Ensures entity does not come to a complete stop when hitting a block from 
					blockU = true;
				}
			}
		}

		// Collision bottom left
		if (blockD == false && blockL == false){
			if (Math.floor(bottomY / world.blockSize) != Math.floor((bottomY + this.deltaD) / world.blockSize) && Math.floor(topX / world.blockSize) != Math.floor((topX - this.deltaL) / world.blockSize)){
				blockY = Math.floor((bottomY + this.deltaD) / world.blockSize);
				blockX = Math.floor((topX - this.deltaL) / world.blockSize);
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockD = true;
				}
			}
		}

		// Collision bottom right
		if (blockD == false && blockR == false){
			if (Math.floor(bottomY / world.blockSize) != Math.floor((bottomY + this.deltaD) / world.blockSize) && Math.floor(topX / world.blockSize) != Math.floor((bottomX + this.deltaR) / world.blockSize)){
				blockY = Math.floor((bottomY + this.deltaD) / world.blockSize);
				blockX = Math.floor((bottomX + this.deltaR) / world.blockSize);
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockD = true;
				}
			}
		}

		// Collision top right
		if (blockU == false && blockR == false){
			if (Math.floor(bottomY / world.blockSize) != Math.floor((topY - this.deltaU) / world.blockSize) && Math.floor(topX / world.blockSize) != Math.floor((bottomX + this.deltaR) / world.blockSize)){
				blockY = Math.floor((topY - this.deltaU) / world.blockSize);
				blockX = Math.floor((bottomX + this.deltaR) / world.blockSize);
				if (world.determineBlockCollision(blockX, blockY) == true){
					blockU = true;
				}
			}
		}

		// If no block is in the way, change the coordinates

		if (blockR == false){
			this.x += this.deltaR;
		}

		if (blockL == false){
			this.x -= this.deltaL;
		}
		
		if (blockD == false){
			this.y += this.deltaD;
		}
	
		if (blockU == false){
			this.y -= this.deltaU;
		}
	}
}                                   