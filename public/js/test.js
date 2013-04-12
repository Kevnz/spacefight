var gameInit = function () {
Crafty.init();
Crafty.canvas.init();

    Crafty.e( "2D, Draggable, Canvas, Color, Collision, Blargh" ).attr( { w: 20, h: 300,rotation: 30 } ).color( "red" ).attr( { rotation: 30 } );

    Crafty.e( "2D, Draggable, Canvas, Color, Collision, Glargh" ).attr( { w: 20, h: 30 } ).color( "green" ).onHit( "Blargh", function () { console.log( "Hit" ); });
};