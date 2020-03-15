
//Quando la nostra finestra sarà caricata
window.onload = function() {
    //Dichiaro le variabili principlali
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx; 
    var delay = 100; //Viene espresso in millesecondi
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;

    init();



    ///FUNCTION

    //Funzione che inizializza il tutto
    function init() {
        //Creo un elemento canvas sull'html con le sue caratteristiche
        var canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        //Attacco l'elemento canvas appena creato al body
        document.body.appendChild(canvas);
        //Disegnamo sul nostro canvas
        ctx = canvas.getContext("2d");
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }
    
    //Funzione che fa il refresh del nostro canvas
    function refreshCanvas() {
        //Faccio avanzare il serpente
        snakee.advance();

        if(snakee.checkCollision()){
            //GAME OVER
            gameOver();
        }
        else {
            if(snakee.isEatingApple(applee)) {
                score++;
                snakee.ateApple = true;
                do {
                  ///Il serpente ha mangiato la mela
                  applee.setNewposition();
                }
                while(applee.isOnSnake(snakee));
                
            }
            //Aggiorno il contenuto del canvas
            ctx.clearRect(0,0,canvasWidth, canvasHeight);
            drawScore();
            //Disegnamo sul nostro canvas il serpente
            snakee.draw();
            //Disegnamo sul nostro canvas la mela
            applee.draw();
            //Faccio muovere il rettangolo ogni millesecondi
             timeout = setTimeout(refreshCanvas,delay);

        }

        
    }
    //Funzione Gameover
    function gameOver () {
       ctx.save();

       ctx.font = "bold 70px sans-serif";
       ctx.fillStyle = "#000";
       ctx.textAlign = "center";
       ctx.textBaseline = "middle";
       ctx.strokeStyle = "white";
       ctx.lineWidth = 5;
       var centerX = canvasWidth / 2;
       var centerY = canvasHeight / 2;
       ctx.strokeText("Game Over", centerX, centerY - 180);
       ctx.fillText("Game Over", centerX, centerY - 180);
       ctx.font = "bold 30px sans-serif";
       ctx.strokeText("Premere sulla barra spaziatrice per rigiocare", centerX, centerY - 120);
       ctx.fillText("Premere sulla barra spaziatrice per rigiocare", centerX, centerY - 120);
       ctx.restore();
    }
    //Funzione Restart
    function restart() {
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();

    }
    //Funzione Score
    function drawScore() {
       ctx.save();
       ctx.font = "bold 200px sans-serif";
       ctx.fillStyle = "gray";
       ctx.textAlign = "center";
       ctx.textBaseline = "middle";
       var centerX = canvasWidth / 2;
       var centerY = canvasHeight / 2;
       ctx.fillText(score.toString(), centerX, centerY);
       ctx.restore();
    }
    //Funzione che disegna i blocchi del sepente
    function drawBlock(ctx, position) {

        //Posizione 0 sull'assse delle X * taglia del blocco del serpente
        var x = position[0] * blockSize;
        //Posizione 0 sull'assse delle Y * taglia del blocco del serpente
        var y = position[1] * blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);
    }
    
    //Funzione Snake con le sue proprietà
    function Snake(body, direction) {

        this.body = body;
        this.direction =  direction;
        //Proprietà per capire il serpente ha mangiato una mela
        this.ateApple = false;
        //Proprietà per disegnare il sepente
        this.draw = function () {
            //Salvo il contenuto prima di entrarci
            ctx.save();
            //Aggiungo il colore
            ctx.fillStyle = "#ff0000";
            //Faccio un ciclo per entrare nel body del serpente
            for(var i = 0; i < this.body.length; i++) {

                //Disegno il serpente
                drawBlock(ctx, this.body[i]);
            }
            //Ritorno al contenuto che c'era prima
            ctx.restore();


        };
        //Proprietà che fa avanzare il serpente
        this.advance = function() {
          var nextPosition = this.body[0].slice();
           
          //Questo switch permette di creare il serpente in base alla direzione
          switch(this.direction) {
              case "left":
                   nextPosition[0] -= 1;
                    break;
              case "right":
                   nextPosition[0] += 1;
                    break;
              case "down":
                   nextPosition[1] += 1;
                    break;
              case "up":
                   nextPosition[1] -= 1;
                    break;
              default:
                    throw("Invalid Direction");
          }
          this.body.unshift(nextPosition);
          if(!this.ateApple)
              this.body.pop();
          else
              this.ateApple = false;
        };
        //Proprietà per settare la direzione del serpente
        this.SetDirection = function(newDirection) {
            var allowedDirections;
            switch(this.direction) {
              case "left":
              case "right":
                  allowedDirections = ["up","down"];
                    break;
              case "down":
              case "up":
                  allowedDirections = ["left","right"];
                    break;
              default:
                  throw("Invalid Direction");
            }
            if(allowedDirections.indexOf(newDirection) > -1)
            {
                 this.direction = newDirection;
            }
        };
        //Proprietà per vedere la collisione del serpente
        this.checkCollision = function () {
            var wallCollision= false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
               wallCollision = true;
            }

            for (var i = 0; i < rest.length; i++) {
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                {
                    snakeCollision = true;
                }

            }

            return wallCollision || snakeCollision; 

        };
        // Proprietà per capire se la mela è stata mangiata
        this.isEatingApple = function(appleToEat) {
          var head = this.body[0];
          if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
              return true;
          else
              return false;
        };
        
    }
    //Funzione per fare apparire la mela
    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewposition = function() {
           var newX = Math.round(Math.random() * (widthInBlocks - 1));
           var newY = Math.round(Math.random() * (heightInBlocks - 1));
           this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeToCheck) {
           var isOnSnake = false;

           for(var i = 0; i < snakeToCheck.body.length; i++){
               if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                   isOnSnake = true;

               }
           }
           return isOnSnake;

        };
    }
    
    //Intercetto il tasto della tastiera per muovere il serpente
    this.document.onkeydown = function handlekeyDown(e)
    {
        var key = e.keyCode;
        var newDirection;
        switch(key) {
              case  37:
                    newDirection = "left";
                    break;
              case  38:
                    newDirection = "up";
                    break;
              case  39:
                    newDirection = "right";
                    break;
              case  40:
                    newDirection = "down";
                    break;
              case  32:
                    restart();
                    return;
              default:
                    return;
        }
        snakee.SetDirection(newDirection);
    }


    
}
































