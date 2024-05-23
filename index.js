const express=require('express')
const app=express()
const cors=require('cors')
const port=process.env.PORT||5000
require('dotenv').config()
//using middleware

app.use(cors())
app.use(express.json())

app.get('/',async(req,res)=>{
    res.send('bistro boss in running')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnsxsk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  const menuCollection=client.db('BistroBoss').collection('Menu')
  const cartCollection=client.db('BistroBoss').collection('Cart')
  const userCollection=client.db('BistroBoss').collection('User')
    await client.connect();
  
    app.get('/menu',async(req,res)=>{
        const result=await menuCollection.find().toArray()
        res.send(result)
    })
    app.post('/carts',async(req,res)=>{
      const cartItem=req.body;
      const result=await cartCollection.insertOne(cartItem)
      res.send(result)
    })
    app.get('/carts',async(req,res)=>{
      const email=req.query.email
      const query={email:email}
      const result=await cartCollection.find(query).toArray()
      res.send(result)
    })
    app.delete('/carts/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await cartCollection.deleteOne(query)
      res.send(result)
    })

    app.post('/users',async(req,res)=>{
      const user=req.body
      //insert email if does't email
      const query={email:user.email}
      const existingUser=await userCollection.findOne(query)
      if(existingUser){
        return res.send('user already exist')
      }
      const result=await userCollection.insertOne(user)
      res.send(result)
    })

    app.get('/users',async(req,res)=>{
      const result=await userCollection.find().toArray()
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
  }
}
run().catch(console.dir);


app.listen(port)