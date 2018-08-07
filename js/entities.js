function Entity(x, y){
	this.x = x;
	this.y = y;

	this.screenX;
	this.screenY;

	this.width = 30;
	this.height = 30;

	// Allows enemy to fade in when they are spawned
	this.transparency = 0;

	this.movementU = false;
	this.movementD = false;
	this.movementL = false;
	this.movementR = false;

	this.deltaU = 0;
	this.deltaD = 0;
	this.deltaL = 0;
	this.deltaR = 0;

	this.speed = 1;

	this.scoreValue = 20;

	this.alive = true;
	this.health = 20;

	// If entity has been hurt
	this.damaged = false;

	// How many frames enemy has shown damaged color for
	this.damagedFrames = 0;

	// How much damage entity does per frame
	this.attackValue = 1;

	Entity.prototype.update = function(){

		// Prevents entity from moving after they have been damaged
		if (this.damaged != true){
			this.movement();
		}

		this.attack();

		// If health is too low, remove entity
		if (this.health <= 0){
			this.remove();
		}

		// Draw entity

		// Decrease transparency if recently spawned
		if (this.transparency < 1){
			this.transparency += 0.05;
		}

		pCtx.globalAlpha = this.transparency;

		this.screenX = this.x - player.x + (windowWidth / 2) - (player.width / 2);
		this.screenY = this.y - player.y + (windowHeight / 2) - (player.height / 2);

		// Change color for one frame if enemy is damaged
		if (this.damaged == true){
			pCtx.fillStyle = "rgb(80, 0, 0)";

			// Ensures enemy stays in damaged mode for some frames
			if (this.damagedFrames < 10){
				this.damagedFrames += 1;
			}else{
				this.damaged = false;
				this.damagedFrames = 0;
			}
		}else{
			pCtx.fillStyle = "red";
		}
		
		pCtx.fillRect(this.screenX, this.screenY, this.width, this.height);

		pCtx.strokeStyle = "black";
		pCtx.lineWidth = 2;
		pCtx.strokeRect(this.screenX, this.screenY, this.width, this.height);

		pCtx.globalAlpha = 1;
	}

	Entity.prototype.damage = function(amount){
		this.health -= amount;

		// True for one frame, makes enemy change color
		this.damaged = true;
	}

	Entity.prototype.attack = function(){
		playerDistance = findDistance(this.x - player.x, this.y - player.y);

		// If player is close and they aren't dead, attack them
		if (playerDistance < 60 && player.health > 0){
			player.health -= this.attackValue;
		}
	}

	Entity.prototype.remove = function(){
		// Triggers when health is too low

		this.alive = false;

		player.score += this.scoreValue;
	}

	Entity.prototype.movement = function(){
		// Difference between player and entity x and y coords
		xDif = this.x - player.x;
		yDif = this.y - player.y;

		// The change per frame in x and y coords to move entity to player
		cX = 0;
		cY = 0;

		// If the entity is close to the player, don't move
		if (xDif > 20 || yDif > 20 || xDif < -20 || yDif < -20){
			// Finds how many pixels entity has to travel in X axis for every pixel in Y axis
			cX = (this.x - player.x) / (this.y - player.y); // Change (x / y)
			cY = 1;

	   		//Solves for a ratio that makes the entity travel at the speed
	    	ratio = (Math.sqrt((cX * cX) + (cY * cY))) / (this.speed);
	    	
	    	// Redefine using ratio
	   		cX = cX / ratio;
	    	cY = cY / ratio;

	    	// Negate values if entity needs to go the opposite way
	    	if (this.y - player.y > 0){
	    		cX = -cX;
	    		cY = -cY;
	    	}
	    }

	    // Convert cX and cY values into 4-directional delta and movement variables
	    if (cX < 0){
			this.movementL = true;
			this.deltaL = -cX;
		}else{
			this.movementL = false;
			this.deltaL = 0;
		}

		if (cX > 0){
			this.movementR = true;
			this.deltaR = cX;
		}else{
			this.movementR = false;
			this.deltaR = 0;
		}

		if (cY < 0){
			this.movementU = true;
			this.deltaU = -cY;
		}else{
			this.movementU = false;
			this.deltaU = 0;
		}

		if (cY > 0){
			this.movementD = true;
			this.deltaD = cY;
		}else{
			this.movementD = false;
			this.deltaD = 0;
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
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
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
