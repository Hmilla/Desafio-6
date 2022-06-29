const socket = io()

const formProduct = document.querySelector('#formProduct')
const titleInput = document.querySelector('#title')
const priceInput = document.querySelector('#price')
const thumbnailInput = document.querySelector('#thumbnail')
const tableProducts = document.querySelector('#tableProducts')

function sendProduct() {
    try {
        title = titleInput.value,
        price = priceInput.value,
        thumbnail = thumbnailInput.value 
        socket.emit('client:product', { title, price, thumbnail })
    } catch(err) {
        console.log(`Hubo un error ${err}}`)
    }
}

async function renderProducts(productsArray){
    try {
        const response = await fetch('/product.hbs') 
        const plantilla = await response.text()
        
        if (productsArray.length>0) {
            document.querySelector('#tableProducts').innerHTML = ""
            productsArray.forEach(product => {
                const template = Handlebars.compile(plantilla)
                const filled = template(product) 
                document.querySelector('#tableProducts').innerHTML += filled 
            }); 
        }else{
            document.querySelector('tableProducts').innerHTML = ("<h4>No hay ningun producto :(</h4>")
        }
        
    } catch(err) {
        console.log(`Hubo un error ${err}`)
    }
}

formProduct.addEventListener('submit', event=>{
    event.preventDefault()
    sendProduct()
})

socket.on('server:product', renderProducts);

//CHAT

const formMessage = document.querySelector('#formMessage')
const messageInput = document.querySelector('#messageInput')
const mailInput = document.querySelector('#mailInput')
const messagesPool = document.querySelector('#messagesPool')

function sendMessage(){
    try{
        const mail = mailInput.value
        const message = messageInput.value
        
        socket.emit('client:message', {mail, message})
    }catch(err){
        console.log(`Hubo un error: ${err}`)
    }
}

function renderMessages(messagesArray){
    try{
        
        const html = messagesArray.map(messageInfo => {
            return(`<div>
                <strong style="color: blue;">${messageInfo.mail}</strong>:
                <span style="color: brown;"> [${messageInfo.date}]</span>:
                <em style="color: green; font-style: italic;">${messageInfo.message}</em> </div>`)
        }).join(" ");
        console.log(html)
        document.querySelector("#messagesPool").innerHTML = html
    }catch(err){
        console.log(`Hubo un error: ${err}`)
    }
}


formMessage.addEventListener('submit', event=>{
    event.preventDefault()
    sendMessage()
})

socket.on('server:message', renderMessages);