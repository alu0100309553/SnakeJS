;(function(){
  class Random{
    static get(inicio, final){
      return Math.floor(Math.random() * final) + inicio
    }
  }



  class Food{
    constructor(x, y){
      this.x = x
      this.y = y
      this.width = 10
      this.height = 10
    }
    static generate(){
      return new Food(Math.round(Random.get(0, canvas.width)/10)*10, Math.round(Random.get(0, canvas.height)/10)*10)
    }

    draw(){
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
  }



  class Square{
    constructor(x, y){
      this.x = x
      this.y = y
      this.width = 10
      this.height = 10
      this.back = null
    }

    draw(){
      ctx.fillRect(this.x, this.y, this.width, this.height )
      if (this.hasBack()){
        this.back.draw()
      }

    }

    add(){
      if(this.hasBack()) return this.back.add()
      this.back = new Square(this.x, this.y)
    }

    hasBack(){
      return this.back !== null
    }

    copy(){
      if (this.hasBack()){
        this.back.copy()
        this.back.x = this.x
        this.back.y = this.y
      }

    }

    right(){
      this.copy()
      this.x +=10
    }
    left(){
      this.copy()
      this.x -=10
    }
    up(){
      this.copy()
      this.y -=10
    }
    down(){
      this.copy()
      this.y +=10
    }

    hit(head, segundo=false){
      if (this === head && !this.hasBack()) return false
      if (this === head) return this.back.hit(head, true)
      if (segundo && !this.hasBack()) return false
      if (segundo) return this.back.hit(head)
      if (this.hasBack()){
        return squareHit(this, head)|| this.back.hit(head)
      }
      return squareHit(this,head)
    }
    hitBorder(){
      return (this.x > canvas.width-this.width || this.x < 0 || this.y > canvas.height-this.height || this.y < 0)
    }
  }


  class Snake{
    constructor(){
      this.head = new Square(150, 150)
      this.draw()
      this.direction = "right"
      this.head.add()
      this.head.add()
      this.head.add()
      this.head.add()
      this.score = 0

    }

    draw() {
      this.head.draw()
    }

    right(){
      if (this.direction === "left") return
      this.direction = "right"
    }

    left(){
      if (this.direction === "right") return
      this.direction = "left"
    }

    up(){
      if (this.direction === "down") return
      this.direction = "up"
    }

    down(){
      if (this.direction === "up") return
      this.direction = "down"
    }

    move(){
      if(this.direction === "right") return this.head.right()
      if(this.direction === "left") return this.head.left()
      if(this.direction === "up") return this.head.up()
      if(this.direction === "down") return this.head.down()
    }

    eat(){
      this.head.add()
      this.score += 5
    }

    dead(){
      return this.head.hit(this.head) || this.head.hitBorder()
    }

  }
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  const snake = new Snake()
  let foods = []


  document.getElementById("up").addEventListener("click", function(){
    snake.up();
  })
  document.getElementById("down").addEventListener("click", function(){
    snake.down();
  })
  document.getElementById("left").addEventListener("click", function(){
    snake.left();
  })
  document.getElementById("right").addEventListener("click", function(){
    snake.right();
  })


  window.addEventListener("keydown", function(ev){
    if(ev.keyCode > 36 && ev.keyCode < 41) ev.preventDefault()
    if(ev.keyCode === 40) return snake.down();
    if(ev.keyCode === 39) return snake.right();
    if(ev.keyCode === 38) return snake.up();
    if(ev.keyCode === 37) return snake.left();

    return false

  })
  function drawFood(){
    for (const index in foods){
      const food = foods [index]
      if(typeof food !== "undefined"){
        food.draw()
        if(hit(food, snake.head)){
          removeFromFoods(food)
          snake.eat()
        }
      }


    }
  }
  function removeFromFoods(food){
    foods = foods.filter(function(f){
      return food !==f
    })
  }

  function squareHit(cuad_uno, cuad_dos){
    return cuad_uno.x === cuad_dos.x && cuad_uno.y === cuad_dos.y

  }

  function hit (a, b){
    var hit = false
    if (a.x === b.x && a.y === b.y){
      hit = true
    }
    return hit
  }



  const animacion = setInterval(function(){
    snake.move()
    ctx.clearRect(0,0,canvas.width, canvas.height)
    snake.draw()
    drawFood()
    if (snake.dead()){
      console.log("Se acabó")
      console.log(snake.score)
      window.clearInterval(animacion)
    }
  },1000/9)

  setInterval(function(){
    const food = Food.generate()
    foods.push(food)
    setTimeout(function(){
      removeFromFoods(food)
    }, 10000)

  },4000)


})()
