const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const port = 4000
const cors = require('cors')
// app.use(express.static(path.join(__dirname, 'public')))

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors())
app.use(express.json())
app.use(
  express.urlencoded({
    limit: '5mb',
    extended: true,
  }),
)

app.get('/', (req, res) => {
  res.send('Hello World!. To continue please /api/products')
})

// GET METHOD
app.get('/api/products', (req, res) => {
  const dataString = fs.readFileSync(path.join(__dirname, 'data.json'), {
    encoding: 'utf-8',
  })
  const dataString2 = dataString === '' ? '[]' : dataString
  const oldData = JSON.parse(dataString2)
  return res.status(200).json(oldData)
})

// POST METHOD
app.post('/api/products', (req, res) => {
   /*  #swagger.parameters['obj'] = {
                in: 'body',
                type: 'object',
                description: 'Product data'
        } */
        const {name, price, type} = req.body;
  if(!name || !price || !type){
    return res.status(400).json({ message: 'Required input name, price and type.'})
  }
  try {
    const dataString = fs.readFileSync(path.join(__dirname, 'data.json'), {
      encoding: 'utf-8',
    })
    const dataString2 = dataString === '' ? '[]' : dataString
    const oldData = JSON.parse(dataString2)
    const data = req.body
    console.log(data)
    const newProd = {}
    newProd.id = Date.now()
    newProd.name = data.name
    newProd.price = data.price
    newProd.type = data.type
    oldData.push({ ...newProd })
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(oldData))
    return res.status(201).json({ message: 'Create successful product' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

// update METHOD
app.put('/api/products/:id', (req, res) => {
  try {
    const dataString = fs.readFileSync(path.join(__dirname, 'data.json'), {
      encoding: 'utf-8',
    })
    const dataString2 = dataString === '' ? '[]' : dataString
    const oldData = JSON.parse(dataString2)

    const id = req.params.id
    console.log(id)

    // Get data to update
    const data = req.body

    const newProd = {}
    newProd.name = data.name
    newProd.price = data.price
    newProd.type = data.type
    const newProdList = oldData.filter((e) => e.id != id)
    newProdList.push({ ...newProd, id: id })

    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(newProdList))
    return res.status(200).json({ message: 'Update product success' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

app.listen(process.env.PORT || port)
