document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div');
    const restartBtn = document.querySelector('.start-again');

    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint
    // let doodlerBottomSpace = 150;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = [];
    let score = 0;
    let upTimeId;
    let downTimeId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
  
    restartBtn.addEventListener("click",startOverBtn)


 

    class Platform {
        constructor(newPlatBottom){
            this.bottom = newPlatBottom;
            this.left = Math.random()* 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    function createPlatforms(){
        for (let i=0; i<platformCount; i++){
            let platformGap = 600 / platformCount;
            let newPlatBottom = 100 + i * platformGap;
            let  newPlatform = new Platform(newPlatBottom);
            platforms.push(newPlatform);
            console.log(platforms)
        }
    }

    function movePlatforms(){
        if (doodlerBottomSpace > 200){
            platforms.forEach(platform =>{
                platform.bottom -= 4;  //(platform.bottom-4)
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if (platform.bottom < 10){
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift();
                    console.log(platforms)
                    score++;
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function createDoodler() {
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
      }
    

    function jump(){
        clearInterval(downTimeId);
        isJumping = true;
        upTimeId = setInterval(function(){
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if(doodlerBottomSpace > startPoint + 200) {
                fall();
            }
        },30)
    }

    function fall(){
        clearInterval(upTimeId);
        isJumping = false;
        downTimeId = setInterval(function(){
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace <= 0){
                gameOver();
            }
            platforms.forEach(platform =>{
                if(
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ){
                    console.log('landed');
                    startPoint = doodlerBottomSpace;
                    jump()
                }
            })
        },30)
    }

    

    function gameOver(){
        isGameOver = true
        while (grid.firstChild) {
          console.log('remove')
          grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score;
         restartBtn.style.display = "flex";
        addPic();
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        clearInterval(upTimeId);
        clearInterval(downTimeId);
     
    }
    function addPic(){
            grid.appendChild(doodler);
            doodler.classList.add('game-over');
            clearInterval(leftTimerId);
            clearInterval(rightTimerId);
            clearInterval(upTimeId);
            clearInterval(downTimeId);

        }


    function control(e){
        if (e.key === "ArrowLeft"){
            //move left 
            moveLeft()
             
        }else if (e.key === "ArrowRight"){
                //move right
            moveRight()
        }else if (e.key === "ArrowUp"){
                //move straight
            moveStraight()
            }
      
    }

    function moveLeft(){
        if (isGoingRight){
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function(){
            if(doodlerLeftSpace >= 0){ 
            doodlerLeftSpace -= 5;
            doodler.style.left = doodlerLeftSpace + 'px'
        }else moveRight()
        },20)
    }

    function moveRight(){
        if (isGoingLeft){
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimerId = setInterval(function(){
            if (doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }else moveLeft()
        },20)
    }

    function moveStraight(){
        isGoingRight = false;
        isGoingLeft = false;
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }



    function start(){
        if (!isGameOver){
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms, 30);
            jump();
            document.addEventListener('keyup', control)
        }
    }    
    function startOverBtn(){
        location=location;
    }
    //attach to button
    start();
})