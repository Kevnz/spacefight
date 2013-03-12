var gameInit = function () {
    Crafty.init();
    Crafty.canvas.init();

    Crafty.load(['/images/sprite.png'], function () {
        Crafty.sprite(64, '/images/sprite.png', {
            fighter: [0,0],
            ship: [1,0],
            naboo: [2,0],
            anikin: [3,0]
        });

        Crafty.scene('main');
    });

    Crafty.scene('main', function () {
        var enemy = Crafty.e("2D, Canvas, anikin, Collision")
            .attr({move: {left: false, right: false, up: false, down: false}, xspeed: 0, yspeed: 0, decay: 0.9,
                x: Crafty.viewport.width / 2, y: Crafty.viewport.height / 3, score: 0, zIndex:2})
            .origin("center")
            .collision();
        var player = Crafty.e("2D, Canvas, fighter, Controls, Collision")
            .attr({move: {left: false, right: false, up: false, down: false}, xspeed: 0, yspeed: 0, decay: 0.9,
                x: Crafty.viewport.width / 2, y: Crafty.viewport.height / 2, score: 0, zIndex:2})
            .origin("center")
            .bind("KeyDown", function(e) {
                //on keydown, set the move booleans
                if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
                    this.move.right = true;
                } else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
                    this.move.left = true;
                } else if(e.keyCode === Crafty.keys.UP_ARROW) {
                    this.move.up = true;
                } else if (e.keyCode === Crafty.keys.SPACE) {
                    console.log("Blast");
                    Crafty.audio.play("Blaster");
                    //create a bullet entity
                    console.log('rotation');
                    console.log(this._rotation);
                    var ro = this._rotation  % 360;
                    console.log(ro);
                    Crafty.e("2D, DOM, Color, bullet")
                        .attr({
                            x: (this._x +32 ),
                            y: (this._y + 32),
                            w: 2,
                            h: 5,
                            zIndex: 1,
                            rotation: this._rotation,
                            xspeed: 20 * Math.sin(this._rotation / 57.3),
                            yspeed: 20 * Math.cos(this._rotation / 57.3)
                        })
                        .color("rgb(255, 0, 0)")
                        .bind("EnterFrame", function() {
                            this.x += this.xspeed;
                            this.y -= this.yspeed;

                            //destroy if it goes out of bounds
                            if(this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
                                this.destroy();
                            }
                        });
                }
            }).bind("KeyUp", function(e) {
                //on key up, set the move booleans to false
                if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
                    this.move.right = false;
                } else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
                    this.move.left = false;
                } else if(e.keyCode === Crafty.keys.UP_ARROW) {
                    this.move.up = false;
                }
            }).bind("EnterFrame", function() {
                if(this.move.right) this.rotation += 5;
                if(this.move.left) this.rotation -= 5;

                //acceleration and movement vector
                var vx = Math.sin(this._rotation * Math.PI / 180) * 0.3,
                    vy = Math.cos(this._rotation * Math.PI / 180) * 0.3;

                //if the move up is true, increment the y/xspeeds
                if(this.move.up) {
                    this.yspeed -= vy;
                    this.xspeed += vx;
                } else {
                    //if released, slow down the ship
                    this.xspeed *= this.decay;
                    this.yspeed *= this.decay;
                }

                //move the ship by the x and y speeds or movement vector
                this.x += this.xspeed;
                this.y += this.yspeed;

                //if ship goes out of bounds, put him back
                if(this._x > Crafty.viewport.width) {
                    this.x = -64;
                }
                if(this._x < -64) {
                    this.x =  Crafty.viewport.width;
                }
                if(this._y > Crafty.viewport.height) {
                    this.y = -64;
                }
                if(this._y < -64) {
                    this.y = Crafty.viewport.height;
                }
            }).collision();
    });
};