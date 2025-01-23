import express from 'express'

const app = express()

app.use(express.json())

app.post('/auth', (request, response, next) => {
    const { email, password_hash } = request.body

    console.log(email, password_hash)

    response.send()
})

app.post('/partners', (request, response) => {
    const { name, email, password_hash, company_name } = request.body

    
})

app.post('/customers', (request, response) => {
    const { name, email, password_hash, address, phone } = request.body

})

app.post('/partners/events', (request, response) => {
    const { name, description, date, location } = request.body

})

app.get('/partners/events', (request, response) => {
    

})

app.get('/partners/events/:eventId', (request, response) => {
    const { eventId } = request.params

    console.log(typeof eventId)
    response.send(eventId)
})

app.get("/events", (request, response) => {});

app.get("/events/:eventId", (request, response) => {
  const { eventId } = request.params;

  console.log(typeof eventId);
  response.send(eventId);
});



app.get('/', (_request, response) => {
    response.json({ message: 'Hello World!' })
})

app.listen(3333, () => {
    console.log('🚀 HTTP Server Running!')
})
