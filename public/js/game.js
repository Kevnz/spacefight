 
var gameInit = function () {

    Crafty.init();
    Crafty.canvas.init();

    Crafty.load(['images/sprite.png', 'images/explosion.png', 'images/astroids.png'], function () {
        Crafty.sprite(64, 'images/sprite.png', {
            fighter: [0,0],
            ship: [1,0],
            naboo: [2,0],
            anikin: [3,0]
        });
        Crafty.sprite(128, "images/explosion.png", {
            explosion1: [0, 0],
            explosion2: [0, 1],
            explosion3: [0, 2]
        });
        Crafty.sprite(64, 'images/astroids.png', {
            astroid1: [0,0],
            astroid2: [1,0]
        });
        Crafty.scene('main');
    });

    Crafty.scene('main', function () {

        var generateEnemy = function (location) {
            var x,y,xspeed,yspeed;
            if(!location){
                x = Crafty.math.randomInt(100, Crafty.viewport.width - 100) ;
                y = Crafty.math.randomInt(100, Crafty.viewport.height - 100);
            } else {
                x = location.x;
                y = location.y;
            }
            xspeed = Crafty.math.randomInt(-4, 4);
            yspeed = Crafty.math.randomInt(-4, 4);
            var rotation = (((Math.atan2(yspeed, xspeed))*(180/Math.PI)) * -1)+90; //offset 90 for sprite

            var enemy = Crafty.e("Actor, anikin, enemy")
            .attr({rotation:rotation, xspeed: xspeed, yspeed: yspeed, x: x, y: y, status:10,hp: 10})
            .origin("center")
            .onHit("bullet", function (e) {
                this.status = this.status -1;
                if(this.status === 0){
                    this.destroy();
                }
                e[0].obj.destroy();
            })
            .onHit("Actor", function (e) {
                this.x = this.x-32;
                this.y = this.y-32;
            })
            .bind('Remove', function(){
                Crafty.e("RandomExplosion").attr({
                    x: this.x - 32,
                    y: this.y - 12
                });
                Crafty.trigger('enemyDestroyed');
                setTimeout(generateEnemy, 800);
            })
            .bind("EnterFrame", function(e) {
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

                //this.rotation = 60;Math.atan2(this.yspeed, this.xspeed);
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
         var generateAstroid = function (location) {
            console.log('generateAstroid');
            var x,y,xspeed,yspeed;
            x = Crafty.math.randomInt(100, Crafty.viewport.width - 100) ;
            y = Crafty.math.randomInt(100, Crafty.viewport.height - 100);
            xspeed = Crafty.math.randomInt(-2, 2);
            yspeed = Crafty.math.randomInt(-2, 2);
            var rotation = (((Math.atan2(yspeed, xspeed))*(180/Math.PI)) * -1)+90; //offset 90 for sprite

            Crafty.e("Actor, RandomAstroid")
            .attr({rotation:rotation, xspeed: xspeed, yspeed: yspeed, x: x, y: y, status:10})
            .origin("center")
            .onHit("bullet", function (e) {
                this.status = this.status -1;
                if(this.status === 0){
                    this.destroy();
                }
                e[0].obj.destroy();
            })
            .onHit("Actor", function (e) {
                this.xspeed = this.xspeed  *-1;
                this.yspeed = this.yspeed  *-1
                this.x = this.x-32;
                this.y = this.y-32;
            })
            .bind('Remove', function(){
                Crafty.e("RandomExplosion").attr({
                    x: this.x - 32,
                    y: this.y - 12
                });
                Crafty.trigger('astroidDestroyed');
            })
            .bind("EnterFrame", function(e) {
  
                this.x += this.xspeed;
                this.y -= this.yspeed;

                this._rotation = this._rotation  + 2;
                //this.rotation = 60;Math.atan2(this.yspeed, this.xspeed);
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
        generateAstroid();
        for (var i = 6; i >= 0; i--) {
             setTimeout(generateAstroid, 100 * i);
        };
        var player = Crafty.e("Actor, fighter, Controls")
            .attr({move: {left: false, right: false, up: false, down: false}, xspeed: 0, yspeed: 0, decay: 0.9,
                x: Crafty.viewport.width / 2, y: Crafty.viewport.height / 2, score: 0, zIndex:2, hp: 3})
            .origin("center")
            .onHit("Actor", function (e) {
                this.hp = this.hp - 1;
                if(this.hp === 0){
                    this.destroy();
                }
                this.x = this.x+32;
                this.y = this.y+32;
            })
            .bind('Remove', function(){
                Crafty.e("RandomExplosion").attr({
                    x: this.x - 32,
                    y: this.y - 12
                });
                Crafty.trigger('playerDestroyed');
            })
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

        Crafty.bind('enemyDestroyed', function () {

        });
        Crafty.bind('playerDestroyed', function (e) {
            //do something
            //Crafty.scene('the-end');
        });
    });
};
