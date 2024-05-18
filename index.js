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


const { MongoClient, ServerApiVersion } = require('mongodb');
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
    await client.connect();
  
    app.get('/menu',async(req,res)=>{
        const result=await menuCollection.find().toArray()
        res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
  }
}
run().catch(console.dir);


app.listen(port)