Crafty.c('Actor', {
  init: function () {
    this.requires('2D, Canvas, Collision');
  }
});


Crafty.c("RandomExplosion", {
    init: function () {
        var rand = Crafty.math.randomInt(1, 3);
        this.addComponent("2D", "Canvas", "explosion" + rand, "SpriteAnimation")
            .animate("explode1", 0, 0, 16)
            .animate("explode2", 0, 1, 16)
            .animate("explode3", 0, 2, 16)
            .animate("explode" + rand, 10, 0)
            .bind("AnimationEnd", function () {
                this.destroy();
            });
    }
});
Crafty.c("Damage", {
	init: function () {
		this.addComponent("2D", "Canvas", "dmg", "Delay")
			.delay(function () { this.destroy() }, 150);
	}
});
Crafty.c('ZigZag', {
	init: function () {
		this.bind('EnterFrame', function (e) {
            if(e.frame % 100 === 0) {
                xspeed = Crafty.math.randomInt(-4, 4);
                yspeed = Crafty.math.randomInt(-4, 4);
                if(xspeed === 0 && yspeed === 0){
                    xspeed = Crafty.math.randomInt(-4, 4);
                    yspeed = Crafty.math.randomInt(-4, 4);
                }
                var rotation = (((Math.atan2(yspeed, xspeed))*(180/Math.PI)) * -1)+90;
                this._rotation = rotation;
                this.xspeed = xspeed;
                this.yspeed = yspeed;
                this.x += this.xspeed;
                this.y -= this.yspeed;

            }else{
                this.x += this.xspeed;
                this.y -= this.yspeed;
            }
		});
	}

});
Crafty.c("RandomAstroid", {
    init: function () {
        var rand = Crafty.math.randomInt(1, 2);
        this.addComponent("2D", "Canvas", "astroid" + rand);
 		

    }
});
Crafty.c("RandomSmallAstroid", {
    init: function () {
        var rand = Crafty.math.randomInt(1, 3);
        this.addComponent("2D", "Canvas", "smallAstroid" + rand);
    }
});