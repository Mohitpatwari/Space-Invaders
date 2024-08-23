//All the global variables declare
const grid=document.querySelector('.grid')
const result=document.querySelector('.result')
const Startbtn=document.querySelector('.str-btn')
const StartReset=document.querySelector('.str-res')
const gameStart=document.querySelector('#game-str')
const gameWin=document.querySelector('#game-win')
const laserBeam=document.querySelector('#laser-beam')
const explosion=document.querySelector('#explosion')
const gameLoss=document.querySelector('#game-loss')
const aliensRemoved=[]
let currentShooterIndex=202
let width=15
let direction=1
let timerId
let goingRight=true
let results=0
let gameStarted=false

//Forming all the squares
for(let i=0;i<225;i++){
    const squares=document.createElement('div')
    grid.appendChild(squares)
}

//Positions where invaders lie
const squares=Array.from(document.querySelectorAll('.grid div'))
let alienInvaders=[
    0,2,4,6,8,10,16,18,20,22,24,26,32,34,36,38,40,42
]

//Draw the invaders board and responsible for the removal of shooted part
function draw(){
    for(let i=0;i<alienInvaders.length;i++){
        if(!aliensRemoved.includes(i)){
            squares[alienInvaders[i]].classList.add('invaders')
        }
    }
}

//Remove and add invaders show that it looks moving
function remove(){
    for(let i=0;i<alienInvaders.length;i++){
        squares[alienInvaders[i]].classList.remove('invaders')
    }
}

draw()
squares[currentShooterIndex].classList.add('shooter')

//For the movement of shooter
function moveShooter(e){
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key){
        case 'ArrowLeft':
            if(currentShooterIndex%width!=0) currentShooterIndex-=1
            break;
        case 'ArrowRight':
            if(currentShooterIndex%width<width-1) currentShooterIndex+=1
            break;
    }
    squares[currentShooterIndex].classList.add('shooter')
}

document.addEventListener('keydown',moveShooter)

//Responsible for movement of invaders within the constraints
function moveInvaders(){
    const leftEdge=alienInvaders[0]%width===0
    const rightEdge=alienInvaders[alienInvaders.length-1]%width===width-1
    remove()
    
    if(rightEdge && goingRight){
     for(let i=0;i<alienInvaders.length;i++){
        alienInvaders[i]+=width+1
        direction=-1
        goingRight=false
     }
    }

    if(leftEdge && !goingRight){
        for(let i=0;i<alienInvaders.length;i++){
            alienInvaders[i]+=width-1
            direction=1
            goingRight=true
        }
    }

    for(let i=0;i<alienInvaders.length;i++){
        alienInvaders[i]+=direction
    }
    draw()

    if(squares[currentShooterIndex].classList.contains('invaders')){
        gameLoss.play()
        result.innerHTML="Opps! Game Over"
        clearInterval(timerId)
        document.removeEventListener('keydown',shoot)
        document.removeEventListener('keydown',moveShooter)
        Reset()
        return
    }
    
    for(let i=0;i<alienInvaders.length;i++){
        if(alienInvaders[i]>squares.length){
            gameLoss.play()
            result.innerHTML="Opps! Game Over"
            clearInterval(timerId)
            document.removeEventListener('keydown',shoot)
            document.removeEventListener('keydown',moveShooter)
            Reset()
            return
        }
    }

    if(aliensRemoved.length===alienInvaders.length){
        result.innerHTML="Congratulations! You Win"
        gameWin.play()
        clearInterval(timerId)
        document.removeEventListener('keydown',shoot)
        document.removeEventListener('keydown',moveShooter)
        Reset()
    }

}

//For releasing laser-beams
function shoot(e){
    let laserId
    let currentLaserIndex=currentShooterIndex

    function moveLaser(){
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex-=width
        squares[currentLaserIndex].classList.add('laser')

        if(squares[currentLaserIndex].classList.contains('invaders')){
            squares[currentLaserIndex].classList.remove('invaders')
            squares[currentLaserIndex].classList.remove('laser')
            explosion.play()
            squares[currentLaserIndex].classList.add('boom')

            setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'),300)
            clearInterval(laserId)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            result.innerHTML=results
        }
    }
    if(e.key==='ArrowUp'){
        laserId=setInterval(moveLaser,100)
        laserBeam.play()
    }
}
document.addEventListener('keydown',shoot)

//Start game
function startGame(){
    if(gameStarted) return
    gameStarted=true
    results=0
    gameStart.play()
    StartReset.classList.remove('hidden')
    result.innerHTML=results
    StartReset.innerHTML=''
    aliensRemoved.length=0
    alienInvaders=[
    0,2,4,6,8,10,16,18,20,22,24,26,32,34,36,38,40,
    42
    ]
    currentShooterIndex=202
    direction=1
    goingRight=true
    squares.forEach(x=>x.classList.remove('invaders','shooter','boom','laser'))
    draw()
    squares[currentShooterIndex].classList.add('shooter')
    if(timerId) clearInterval(timerId)
    timerId=setInterval(moveInvaders,500)
    document.addEventListener('keydown',moveShooter)
    document.addEventListener('keydown',shoot)
}

//Reset game
function Reset(){
    gameStarted=false
    StartReset.classList.add('hidden')
    StartReset.innerHTML="Press start to play!"
    clearInterval(timerId)
    timerId=null
    document.removeEventListener('keydown',moveShooter)
    document.removeEventListener('keydown',shoot)
}

Startbtn.addEventListener('click',startGame)