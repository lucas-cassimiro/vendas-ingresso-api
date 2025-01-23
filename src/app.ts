import express from 'express'
import * as mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'

function createConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'tickets',
        port: 33060
    })
}

const app = express()

app.use(express.json())

app.post('/auth', (request, response, next) => {
    const { email, password_hash } = request.body

    console.log(email, password_hash)

    response.send()
})

app.post('/partners', async (request, response) => {
    const { name, email, password_hash, company_name } = request.body
    const connection = await createConnection()

    try {
        const createdAt = new Date()
        const hashedPassword = bcrypt.hashSync(password_hash, 10)
    
        const [userResult] = await connection.execute<mysql.ResultSetHeader>('INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)', [
            name, email, hashedPassword, createdAt
        ])
    
        const userId = userResult.insertId
    
        const [partnerResult] = await connection.execute<mysql.ResultSetHeader>('INSERT INTO partners (user_id, company_name, created_at) VALUES (?, ?, ?)', [
            userId, company_name, createdAt
        ])
    
        response.status(201).json({ 
            id: partnerResult.insertId,
            userId,
            name,
            company_name,
            createdAt
        })
    } finally {
        await connection.end()
    }
})

app.post('/customers', async (request, response) => {
    const { name, email, password_hash, address, phone } = request.body;

    const connection = await createConnection();

    try {
      const createdAt = new Date();
      const hashedPassword = bcrypt.hashSync(password_hash, 10);

      const [userResult] = await connection.execute<mysql.ResultSetHeader>(
        "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, createdAt]
      );

      const userId = userResult.insertId;

      const [customerResult] = await connection.execute<mysql.ResultSetHeader>(
        "INSERT INTO customers (user_id, address, phone, created_at) VALUES (?, ?, ?, ?)",
        [userId, address, phone, createdAt]
      );

      response.status(201).json({
        id: customerResult.insertId,
        userId,
        name,
        address,
        phone,
        createdAt,
      });
    } finally {
      await connection.end();
    }

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

app.listen(3333, async () => {
    const connection = await createConnection()
    
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0')
    await connection.execute('TRUNCATE TABLE events')
    await connection.execute('TRUNCATE TABLE customers')
    await connection.execute('TRUNCATE TABLE partners')
    await connection.execute('TRUNCATE TABLE users')
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1')

    console.log('🚀 HTTP Server Running!')
})
