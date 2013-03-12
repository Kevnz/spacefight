var randRange = function (from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
};

var gameInit = function () {

    Crafty.init();
    Crafty.canvas.init();

    Crafty.load(['/images/sprite.png', '/images/explosion.png'], function () {
        Crafty.sprite(64, '/images/sprite.png', {
            fighter: [0,0],
            ship: [1,0],
            naboo: [2,0],
            anikin: [3,0]
        });
        Crafty.sprite(128, "/images/explosion.png", {
            explosion1: [0, 0],
            explosion2: [0, 1],
            explosion3: [0, 2]
        });
        Crafty.scene('main');
    });

    Crafty.scene('main', function () {
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
        var generateEnemy = function (location) {
            var x,y,xspeed,yspeed;
            if(!location){
                x = randRange(100, Crafty.viewport.width - 100) ;
                y = randRange(100, Crafty.viewport.height - 100);
            } else {
                x = location.x;
                y = location.y;
            }
            xspeed = 3;
            yspeed = 2;
            var rotation = 4;
            enemy = Crafty.e("2D, Canvas, anikin, Collision, enemy")
            .attr({move: {left: false, right: false, up: false, down: false},rotation:rotation, xspeed: xspeed, yspeed: yspeed, decay: 0.9,
                x: x, y: y, score: 0, zIndex:2, status:10})
            .origin("center")
            .onHit("bullet", function (e) {
                this.status = this.status -1;
                if(this.status === 0){
                    this.destroy();
                }
                e[0].obj.destroy();
            })
            .bind('Remove', function(){
                Crafty.e("RandomExplosion").attr({
                    x: this.x - 32,
                    y: this.y - 12
                });
                Crafty.trigger('enemyDestroyed');
                setTimeout(generateEnemy, 800);
            })
            .bind("EnterFrame", function() {
                //This should be some form of componant
                this.x += this.xspeed;
                this.y -= this.yspeed;
                this.rotation = 60;
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
            })
            .collision();
        };
        generateEnemy({x: Crafty.viewport.width / 2,y: Crafty.viewport.height / 3});
        var player = Crafty.e("2D, Canvas, fighter, Controls, Collision")
            .attr({move: {left: false, right: false, up: false, down: false}, xspeed: 0, yspeed: 0, decay: 0.9,
                x: Crafty.viewport.width / 2, y: Crafty.viewport.height / 2, score: 0, zIndex:2})
            .origin("center")

            .bind("KeyDown", function (e) {
                //on keydown, set the move booleans
                if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
                    this.move.right = true;
                } else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
                    this.move.left = true;
                } else if(e.keyCode === Crafty.keys.UP_ARROW) {
                    this.move.up = true;
                } else if (e.keyCode === Crafty.keys.SPACE) {
                    Crafty.audio.play("Blaster");
                    //create a bullet entity
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