let items = []

let dsx = 0, dsy = 0
let draggedItem = null
let draggedToItem = null

let attempts = 0
let success = 0
let score = 100

let win = false

class MyText{
    static global_y = [90, 90]
    static text_height = 80
    static id_gen = 0
    constructor(text, typ){
        this.text = text
        this.typ = typ
        this.id = MyText.id_gen++
    }

    init(){
        this.y = MyText.global_y[this.typ]
        MyText.global_y[this.typ] += MyText.text_height + 10
        this.x = 10 + (this.typ * (width - 20))

        this.reposition()
    }

    reposition(){
        if(this.typ == 0){
            this.left = this.x - 5
            this.right = this.x + 5 + my_textWitdh(this.text, MyText.text_height)
        }else{
            this.left = this.x - 5 - my_textWitdh(this.text, MyText.text_height)
            this.right = this.x + 5
        }
        this.top = this.y - MyText.text_height + 5
        this.bottom = this.y + 5
    }

    mouseInside(){
        return mouseX >= this.left && mouseX <= this.right && mouseY >= this.top && mouseY <= this.bottom
    }

    display(){
        fill(200, 230, 255, 200)

        if(this.mouseInside()){
            if(mouseIsPressed){
                if(draggedItem == this){
                    fill(200, 255, 200, 200)
                }else if(draggedToItem == this){
                    fill(255, 255, 200, 200)
                }
            }
        }

        if(this.mouseInside()){
            stroke(0)
        }else{
            noStroke()
        }
        rectMode(CORNERS)
        rect(this.left, this.top, this.right, this.bottom)
        
        textSize(MyText.text_height)
        fill(0)
        stroke(0)
        textAlign(this.typ == 0 ? LEFT : RIGHT)
        text(this.text, this.x, this.y)
        //line(this.x, this.y, this.match.x, this.match.y)
    }
}

function setup(){
    createCanvas(windowWidth, windowHeight)
    //#region eventy
    /*
    1492 - Christopher Columbus landed on the West Indies
    1692 - The Salem witch hunt
    1776 - Declaration of Independence
    1830 - Signature of Indian Removal Act
    1876 - Battle at Little Big Horn River
    1929 - (Worlds first) Black Friday
    1969 - First man on the moon
    1972 - Watergate Scandal
    1861 - Emancipation Proclamation (abolition of slavery)
    1964 - Signature of Civil Rights Act
    2001 - 9/11
    */
    //#endregion

    let left = [
        new MyText("1492", 0),
        new MyText("1692", 0),
        new MyText("1776", 0),
        new MyText("1830", 0),
        new MyText("1876", 0),
        new MyText("1929", 0),
        new MyText("1969", 0),
        new MyText("1972", 0),
        new MyText("1861", 0),
        new MyText("1964", 0),
        new MyText("2001", 0),
    ]
    MyText.text_height = height / left.length - 20
    let right = [
        new MyText("Christopher Columbus landed on the West Indies", 1),
        new MyText("The Salem witch hunt", 1),
        new MyText("Declaration of Independence", 1),
        new MyText("Signature of Indian Removal Act", 1),
        new MyText("Battle at Little Big Horn River", 1),
        new MyText("(Worlds first) Black Friday", 1),
        new MyText("First man on the moon", 1),
        new MyText("Watergate Scandal", 1),
        new MyText("Emancipation Proclamation (abolition of slavery)", 1),
        new MyText("Signature of Civil Rights Act", 1),
        new MyText("9/11", 1),
    ]

    for(let i = 0; i < left.length; i++){
        left[i].match = right[i]
        right[i].match = left[i]
    }

    console.log(right);
    shuffle(left, true)
    shuffle(right, true)
    console.log(right)

    for (let item of left){
        item.init()
        items.push(item)
    }
    for (let item of right){
        item.init()
        items.push(item)
    }
}

function draw(){
    background(200, 230, 255)
    for (let item of items) {
        item.display()
    }

    

    if(win){
        strokeWeight(4)
        fill(0)
        textSize(100)
        stroke(150, 150, 0)
        textAlign(CENTER)
        text("YOU WIN !", width / 2, height / 2)
        textSize(50)
        text("Score: " + score.toString() + "%", width /2, height / 2 + 60)
        strokeWeight(1)
    }else{
        strokeWeight(3)
        fill(0)
        stroke(150, 150, 0)
        textAlign(LEFT)
        text("Attempts: " + attempts.toString(), 50, height - 10)
        textAlign(RIGHT)
        text("Score: " + score.toString() + "%", width -50, height - 10)
        strokeWeight(1)
    }

    if(frameCount % 100 == 0){
        //console.log(frameRate().toString())
        //console.log(items)
    }
}

function my_textWitdh(text, size){
    push()
    textSize(size)
    let w = textWidth(text)
    pop()
    return w
}

function mousePressed(){
    dsx = mouseX
    dsy = mouseY
    draggedItem = null
    for(let item of items){
        if(item.mouseInside()){
            draggedItem = item
            break
        }
    }
    if(draggedItem != null){
        items.splice(items.indexOf(draggedItem), 1)
        items.push(draggedItem)
    }
}

function mouseDragged(){
    if(draggedItem == null)
        return

    let dx = mouseX - dsx
    let dy = mouseY - dsy

    draggedItem.x += dx
    draggedItem.y += dy
    draggedItem.reposition()

    draggedToItem = null
    for(let item of items){
        if(item.mouseInside() && item != draggedItem && item.typ != draggedItem.typ){
            draggedToItem = item
            break
        }
    }
    
    dsx = mouseX
    dsy = mouseY
}

function mouseReleased(){
    if(draggedItem == null)
        return

    if(draggedToItem == null)
        return

    if(draggedItem.match == draggedToItem){
        success++
        console.log(items)
        items.splice(items.indexOf(draggedItem), 1)
        items.splice(items.indexOf(draggedToItem), 1)
        console.log(items)
        if(items.length == 0){
            win = true
        }
    }
    attempts++
    if(attempts != 0){
        score = success * 100 / attempts
        score = Math.floor(score)
    }
    draggedItem = null
    draggedToItem = null
}