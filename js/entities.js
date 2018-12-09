function Entity(x, y, health, speed, attackValue, score, color, id, alive){
	this.x = x;
	this.y = y;

	this.id = id;

	this.screenX;
	this.screenY;

	this.width = world.blockSize * 0.75;
	this.height = world.blockSize * 0.75;

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

	this.speed = speed;

	this.alive = alive;
	this.health = health;

	this.scoreValue = score;
	this.xpValue = score;

	// If entity has been hurt
	this.damaged = false;

	// How many frames enemy has shown damaged color for
	this.damagedFrames = 0;

	// How much damage entity does per frame
	this.attackValue = attackValue;

	this.reach = 75;

	this.color = color;

	Entity.prototype.update = function(){

		// Prevents entity from moving after they have been damaged
		if (this.damaged != true){
			this.movement();
		}

		this.attack();

		this.destroy();

		// If health is too low, remove entity
		if (this.health <= 0){
			this.remove();
		}

		this.render();
	}

	Entity.prototype.render = function(){
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
			pCtx.fillStyle = this.color;
		}
		
		pCtx.strokeStyle = "black";

		roundRect(pCtx, this.screenX, this.screenY, this.width, this.height, 5, true, true);

		pCtx.globalAlpha = 1;
	}

	Entity.prototype.destroy = function(){
		// If entity is over bush, reduce it in all 4 corners of enemy
		distance = this.width / 2;

		blockX = Math.floor((this.x + distance) / world.blockSize);
		blockY = Math.floor((this.y + distance) / world.blockSize);

		if (blockX >= 0 && blockX < world.worldWidth && blockY >= 0 && blockY < world.worldWidth){
			if (world.blockData[blockX][blockY] == "bush"){
				world.destroyBush(blockX, blockY, this.attackValue * 4);
			}
		}

		blockX = Math.floor((this.x - distance) / world.blockSize);
		blockY = Math.floor((this.y - distance) / world.blockSize);

		if (blockX >= 0 && blockX < world.worldWidth && blockY >= 0 && blockY < world.worldWidth){
			if (world.blockData[blockX][blockY] == "bush"){
				world.destroyBush(blockX, blockY, this.attackValue * 4);
			}
		}

		blockX = Math.floor((this.x - distance) / world.blockSize);
		blockY = Math.floor((this.y + distance) / world.blockSize);

		if (blockX >= 0 && blockX < world.worldWidth && blockY >= 0 && blockY < world.worldWidth){
			if (world.blockData[blockX][blockY] == "bush"){
				world.destroyBush(blockX, blockY, this.attackValue * 4);
			}
		}

		blockX = Math.floor((this.x + distance) / world.blockSize);
		blockY = Math.floor((this.y - distance) / world.blockSize);

		if (blockX >= 0 && blockX < world.worldWidth && blockY >= 0 && blockY < world.worldWidth){
			if (world.blockData[blockX][blockY] == "bush"){
				world.destroyBush(blockX, blockY, this.attackValue * 4);
			}
		}
	}

	Entity.prototype.damage = function(amount){
		this.health -= amount;

		if (amount > player.coolInterval / 8){
			// True for one frame, makes enemy change color
			this.damaged = true;
		}
	}

	Entity.prototype.attack = function(){
		
		playerDistance = findDistance(this.x - player.x, this.y - player.y);

		// If player is close and they aren't dead, attack them
		if (playerDistance < this.reach){

			// The purpose of this code is to check if there is a block with collision detection between the enemy and player,
			// and if so, don't attack. The code uses the same logic as the arrow to go in a line between the player and
			// entity and check each block to see if there is a block with collision

			blockAttack = false;

			this.degrees = calcAngleDegrees(this.x - this.targetX, this.y - this.targetY) - 90;
    
		    // The change per frame in x and y coords to move arrow to target
			cX = 0;
			cY = 0;
			
			// Finds how many pixels arrow has to travel in X axis for every pixel in Y axis
			cX = (this.x - player.x) / (this.y - player.y); // Change (x / y)
			cY = 1;

			// Solves for a ratio that makes the arrow travel at the speed
			ratio = (Math.sqrt((cX * cX) + (cY * cY))) / (10);
			
			// Redefine using ratio
			cX = cX / ratio;
			cY = cY / ratio;

			// Negate values if target needs to go the opposite way
			if (this.y - player.y > 0){
				cX = -cX;
				cY = -cY;
			}

			// Goes forward in 10px increments, checking to see if the block it's on has collision
			if (cX > 0){
				y = this.y;
				for (var x = this.x; x < player.x; x += cX){
					y += cY;

					blockX = Math.floor(x / world.blockSize);
					blockY = Math.floor(y / world.blockSize);

					if (world.determineEntityBlockCollision(blockX, blockY) == true){
						blockAttack = true;
					}
				}
			}else{
				y = this.y;
				for (var x = this.x; x > player.x; x += cX){
					y += cY;

					blockX = Math.floor(x / world.blockSize);
					blockY = Math.floor(y / world.blockSize);

					if (world.determineEntityBlockCollision(blockX, blockY) == true){
						blockAttack = true;
					}
				}
			}

			// If blockAttack was never turned true, allow player to be attacked
			if (blockAttack == false){
				player.decreaseHealth(this.attackValue);
			}

		}

	}

	Entity.prototype.remove = function(){
		// Triggers when health is too low

		this.alive = false;

		player.score += this.scoreValue;
		player.xp += this.xpValue;
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

		deltaR = calcMovement(this.deltaR);
		deltaL = calcMovement(this.deltaL);
		deltaD = calcMovement(this.deltaD);
		deltaU = calcMovement(this.deltaU);

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
		if (Math.floor(topX / world.blockSize) != Math.floor((topX - deltaL) / world.blockSize)){
			// Go through all the blocks adjacent to the entities's left
			for (var x = 0; x < blockHeight; x ++){
				blockX = Math.floor((topX - deltaL) / world.blockSize);
				blockY = Math.floor(topY / world.blockSize) + x;
				// Find if the block has collision
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockL = true; 
					world.destroyStructure(blockX, blockY, this.attackValue);
				}
			}
		}

		// Collision right
		blockR = false
		if (Math.floor(bottomX / world.blockSize) != Math.floor((bottomX + deltaR) / world.blockSize)){
			for (var x = 0; x < blockHeight; x ++){
				blockX = Math.floor((bottomX + deltaR) / world.blockSize);
				blockY = Math.floor(topY / world.blockSize) + x;
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockR = true; 
					world.destroyStructure(blockX, blockY, this.attackValue);
				}
			}
		}

		// Collision up
		blockU = false
		if (Math.floor(topY / world.blockSize) != Math.floor((topY - deltaU) / world.blockSize)){
			for (var x = 0; x < blockWidth; x ++){
				blockY = Math.floor((topY - deltaU) / world.blockSize);
				blockX = Math.floor(topX / world.blockSize) + x;
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockU = true; 
					world.destroyStructure(blockX, blockY, this.attackValue);
				}
			}
		}

		// Collision down
		blockD = false
		if (Math.floor(bottomY / world.blockSize) != Math.floor((bottomY + deltaD) / world.blockSize)){
			for (var x = 0; x < blockWidth; x ++){
				

				blockY = Math.floor((bottomY + deltaD) / world.blockSize);
				blockX = Math.floor(topX / world.blockSize) + x;
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockD = true; 
					world.destroyStructure(blockX, blockY, this.attackValue);
				}
			}
		}

		// Collision diagonal

		// Collision top left
		// Only do collision is entity is going diagonally (prevents bug)
		if (blockU == false && blockL == false){
			// Check if entity will be in a diagonal block next frame
			if (Math.floor(topY / world.blockSize) != Math.floor((topY - deltaU) / world.blockSize) && Math.floor(topX / world.blockSize) != Math.floor((topX - deltaL) / world.blockSize)){
				// Find that diagonal block
				blockY = Math.floor((topY - deltaU) / world.blockSize);
				blockX = Math.floor((topX - deltaL) / world.blockSize);
				// Test if that diagonal block has collision
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					// Ensures entity does not come to a complete stop when hitting a block from 
					blockU = true;
				}
			}
		}

		// Collision bottom left
		if (blockD == false && blockL == false){
			if (Math.floor(bottomY / world.blockSize) != Math.floor((bottomY + deltaD) / world.blockSize) && Math.floor(topX / world.blockSize) != Math.floor((topX - deltaL) / world.blockSize)){
				blockY = Math.floor((bottomY + deltaD) / world.blockSize);
				blockX = Math.floor((topX - deltaL) / world.blockSize);
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockD = true;
				}
			}
		}

		// Collision bottom right
		if (blockD == false && blockR == false){
			if (Math.floor(bottomY / world.blockSize) != Math.floor((bottomY + deltaD) / world.blockSize) && Math.floor(topX / world.blockSize) != Math.floor((bottomX + deltaR) / world.blockSize)){
				blockY = Math.floor((bottomY + deltaD) / world.blockSize);
				blockX = Math.floor((bottomX + deltaR) / world.blockSize);
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockD = true;
				}
			}
		}

		// Collision top right
		if (blockU == false && blockR == false){
			if (Math.floor(bottomY / world.blockSize) != Math.floor((topY - deltaU) / world.blockSize) && Math.floor(topX / world.blockSize) != Math.floor((bottomX + deltaR) / world.blockSize)){
				blockY = Math.floor((topY - deltaU) / world.blockSize);
				blockX = Math.floor((bottomX + deltaR) / world.blockSize);
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockU = true;
				}
			}
		}

		// Collision detection for other entities

		// Loop through entities
		for (x = 0; x < world.entities.length; x ++){
			// If target is alive and target is not this entity
			if (world.entities[x].alive == true && world.entities[x].id != this.id){
				target = world.entities[x];

				// For each direction, it sees if the position that the entity will be in next frame will cause it to be inside of another entity.
				// If that is the case, it prevents movement in that direction.
				
				rightX = this.x + deltaR;
				if (rightX + this.width >= target.x && rightX <= target.x + target.width && this.y + this.height >= target.y && this.y <= target.y + target.height){
					blockR = true;
				}

				leftX = this.x - deltaL;
				if (leftX + this.width >= target.x && leftX <= target.x + target.width && this.y + this.height >= target.y && this.y <= target.y + target.height){
					blockL = true;
				}

				bottomY = this.y + deltaD;
				if (this.x + this.width >= target.x && this.x <= target.x + target.width && bottomY + this.height >= target.y && bottomY <= target.y + target.height){
					blockD = true;
				}

				topY = this.y - deltaU;
				if (this.x + this.width >= target.x && this.x <= target.x + target.width && topY + this.height >= target.y && topY <= target.y + target.height){
					blockU = true
				}

				
			}
		}

		// If no block is in the way, change the coordinates

		if (blockR == false){
			this.x += deltaR;
		}

		if (blockL == false){
			this.x -= deltaL;
		}
		
		if (blockD == false){
			this.y += deltaD;
		}
	
		if (blockU == false){
			this.y -= deltaU;
		}
	}
}                   

function Archer(x, y, health, speed, rate, arrowSpeed, arrowDamage, score, color, id, alive){
	this.x = x;
	this.y = y;

	this.id = id;

	this.screenX;
	this.screenY;

	this.width = world.blockSize * 0.75;
	this.height = world.blockSize * 0.75;

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

	this.speed = speed;

	this.scoreValue = score;
	this.xpValue = score;

	this.alive = alive;
	this.health = health;

	// If entity has been hurt
	this.damaged = false;

	// How many frames enemy has shown damaged color for
	this.damagedFrames = 0;

	// How many frames between each time entity fires arrow
	this.rate = rate;

	this.arrowSpeed = arrowSpeed;

	this.arrowDamage = arrowDamage;

	this.color = color;

	// Counts up since entity was spawned
	this.frames = 0;

	Archer.prototype.update = function(){

		// Prevents entity from moving after they have been damaged
		if (this.damaged != true){
			this.movement();
		}


		// If health is too low, remove entity
		if (this.health <= 0){
			this.remove();
		}

		if (this.frames % this.rate == 0){
			this.shoot();
		}
		
		this.render();

		this.frames += 1;
	}

	Archer.prototype.render = function(){
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
			pCtx.fillStyle = this.color;
		}

		this.destroy();
		
		//pCtx.fillRect(Math.floor(this.screenX), Math.floor(this.screenY), this.width, this.height);

		pCtx.strokeStyle = "black";
		//pCtx.lineWidth = 1;
		//pCtx.strokeRect(Math.floor(this.screenX), Math.floor(this.screenY), this.width, this.height);

		roundRect(pCtx, this.screenX, this.screenY, this.width, this.height, 5, true, true);

		pCtx.globalAlpha = 1;
	}

	Archer.prototype.destroy = function(){
		// If entity is over bush, reduce it in all 4 corners of enemy
		distance = this.width / 2;

		blockX = Math.floor((this.x + distance) / world.blockSize);
		blockY = Math.floor((this.y + distance) / world.blockSize);

		if (blockX >= 0 && blockX < world.worldWidth && blockY >= 0 && blockY < world.worldWidth){
			if (world.blockData[blockX][blockY] == "bush"){
				world.destroyBush(blockX, blockY, this.attackValue * 4);
			}
		}

		blockX = Math.floor((this.x - distance) / world.blockSize);
		blockY = Math.floor((this.y - distance) / world.blockSize);

		if (blockX >= 0 && blockX < world.worldWidth && blockY >= 0 && blockY < world.worldWidth){
			if (world.blockData[blockX][blockY] == "bush"){
				world.destroyBush(blockX, blockY, this.attackValue * 4);
			}
		}

		blockX = Math.floor((this.x - distance) / world.blockSize);
		blockY = Math.floor((this.y + distance) / world.blockSize);

		if (blockX >= 0 && blockX < world.worldWidth && blockY >= 0 && blockY < world.worldWidth){
			if (world.blockData[blockX][blockY] == "bush"){
				world.destroyBush(blockX, blockY, this.attackValue * 4);
			}
		}

		blockX = Math.floor((this.x + distance) / world.blockSize);
		blockY = Math.floor((this.y - distance) / world.blockSize);

		if (blockX >= 0 && blockX < world.worldWidth && blockY >= 0 && blockY < world.worldWidth){
			if (world.blockData[blockX][blockY] == "bush"){
				world.destroyBush(blockX, blockY, this.attackValue * 4);
			}
		}
	}

	Archer.prototype.shoot = function(){
		targetX = player.x + getRandom(-50, 50);
		targetY = player.y + getRandom(-50, 50);

		world.arrows.push(new Arrow(this.x, this.y, targetX, targetY, this.arrowSpeed, this.arrowDamage, "entity", world.arrows.length));
	}

	Archer.prototype.damage = function(amount){
		this.health -= amount;

		if (amount > player.coolInterval / 8){
			// True for one frame, makes enemy change color
			this.damaged = true;
		}
	}

	Archer.prototype.remove = function(){
		// Triggers when health is too low

		this.alive = false;

		player.score += this.scoreValue;
		player.xp += this.xpValue;
	}

	Archer.prototype.movement = function(){
		// Difference between player and entity x and y coords
		xDif = this.x - player.x;
		yDif = this.y - player.y;

		// The change per frame in x and y coords to move entity to player
		cX = 0;
		cY = 0;

		// If the entity is close to the player, don't move
		if (xDif > 200 || yDif > 200 || xDif < -200 || yDif < -200){
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

		deltaR = calcMovement(this.deltaR);
		deltaL = calcMovement(this.deltaL);
		deltaD = calcMovement(this.deltaD);
		deltaU = calcMovement(this.deltaU);

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
		if (Math.floor(topX / world.blockSize) != Math.floor((topX - deltaL) / world.blockSize)){
			// Go through all the blocks adjacent to the entities's left
			for (var x = 0; x < blockHeight; x ++){
				blockX = Math.floor((topX - deltaL) / world.blockSize);
				blockY = Math.floor(topY / world.blockSize) + x;
				// Find if the block has collision
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockL = true; 
				}
			}
		}

		// Collision right
		blockR = false
		if (Math.floor(bottomX / world.blockSize) != Math.floor((bottomX + deltaR) / world.blockSize)){
			for (var x = 0; x < blockHeight; x ++){
				blockX = Math.floor((bottomX + deltaR) / world.blockSize);
				blockY = Math.floor(topY / world.blockSize) + x;
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockR = true; 
				}
			}
		}

		// Collision up
		blockU = false
		if (Math.floor(topY / world.blockSize) != Math.floor((topY - deltaU) / world.blockSize)){
			for (var x = 0; x < blockWidth; x ++){
				blockY = Math.floor((topY - deltaU) / world.blockSize);
				blockX = Math.floor(topX / world.blockSize) + x;
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockU = true; 
				}
			}
		}

		// Collision down
		blockD = false
		if (Math.floor(bottomY / world.blockSize) != Math.floor((bottomY + deltaD) / world.blockSize)){
			for (var x = 0; x < blockWidth; x ++){
				blockY = Math.floor((bottomY + deltaD) / world.blockSize);
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
			if (Math.floor(topY / world.blockSize) != Math.floor((topY - deltaU) / world.blockSize) && Math.floor(topX / world.blockSize) != Math.floor((topX - deltaL) / world.blockSize)){
				// Find that diagonal block
				blockY = Math.floor((topY - deltaU) / world.blockSize);
				blockX = Math.floor((topX - deltaL) / world.blockSize);
				// Test if that diagonal block has collision
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					// Ensures entity does not come to a complete stop when hitting a block from 
					blockU = true;
				}
			}
		}

		// Collision bottom left
		if (blockD == false && blockL == false){
			if (Math.floor(bottomY / world.blockSize) != Math.floor((bottomY + deltaD) / world.blockSize) && Math.floor(topX / world.blockSize) != Math.floor((topX - deltaL) / world.blockSize)){
				blockY = Math.floor((bottomY + deltaD) / world.blockSize);
				blockX = Math.floor((topX - deltaL) / world.blockSize);
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockD = true;
				}
			}
		}

		// Collision bottom right
		if (blockD == false && blockR == false){
			if (Math.floor(bottomY / world.blockSize) != Math.floor((bottomY + deltaD) / world.blockSize) && Math.floor(topX / world.blockSize) != Math.floor((bottomX + deltaR) / world.blockSize)){
				blockY = Math.floor((bottomY + deltaD) / world.blockSize);
				blockX = Math.floor((bottomX + deltaR) / world.blockSize);
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockD = true;
				}
			}
		}

		// Collision top right
		if (blockU == false && blockR == false){
			if (Math.floor(bottomY / world.blockSize) != Math.floor((topY - deltaU) / world.blockSize) && Math.floor(topX / world.blockSize) != Math.floor((bottomX + deltaR) / world.blockSize)){
				blockY = Math.floor((topY - deltaU) / world.blockSize);
				blockX = Math.floor((bottomX + deltaR) / world.blockSize);
				if (world.determineEntityBlockCollision(blockX, blockY) == true){
					blockU = true;
				}
			}
		}

		// Collision detection for other entities

		// Loop through entities
		for (x = 0; x < world.entities.length; x ++){
			// If target is alive and target is not this entity
			if (world.entities[x].alive == true && world.entities[x].id != this.id){
				target = world.entities[x];

				// For each direction, it sees if the position that the entity will be in next frame will cause it to be inside of another entity.
				// If that is the case, it prevents movement in that direction.
				
				rightX = this.x + deltaR;
				if (rightX + this.width >= target.x && rightX <= target.x + target.width && this.y + this.height >= target.y && this.y <= target.y + target.height){
					blockR = true;
				}

				leftX = this.x - deltaL;
				if (leftX + this.width >= target.x && leftX <= target.x + target.width && this.y + this.height >= target.y && this.y <= target.y + target.height){
					blockL = true;
				}

				bottomY = this.y + deltaD;
				if (this.x + this.width >= target.x && this.x <= target.x + target.width && bottomY + this.height >= target.y && bottomY <= target.y + target.height){
					blockD = true;
				}

				topY = this.y - deltaU;
				if (this.x + this.width >= target.x && this.x <= target.x + target.width && topY + this.height >= target.y && topY <= target.y + target.height){
					blockU = true
				}

				
			}
		}

		// If no block is in the way, change the coordinates

		if (blockR == false){
			this.x += deltaR;
		}

		if (blockL == false){
			this.x -= deltaL;
		}
		
		if (blockD == false){
			this.y += deltaD;
		}
	
		if (blockU == false){
			this.y -= deltaU;
		}
	}
}                   
