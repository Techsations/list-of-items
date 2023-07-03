const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose")

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const myname = "Timmy";
console.log(myname);

app.get("/", (req, res) => {
  res.send(myname);
});
const arr = [20, 50, 35, 80, 130];
const sum = arr.reduce((total, index) => {
  return index + total;
});

console.log(sum);

// app.get("/shopList", (req,res)=>{
//     let total = 0;
//     res.render("index", {shopList, total});
// })

// let shopList = []
// app.post("/shopList", (req,res)=>{
//     let data = req.body;
//     let subtotal = req.body.amount * req.body.quantity;
//     data.subtotal = subtotal;
//     shopList.push(data)
//     total = shopList.reduce((total, index)=>{return index.subtotal + total}, 0);
//     console.log(total);
//     console.log(shopList);
//     res.render("index", {shopList, total})
// })

// app.post("/deleteItem", (req,res)=>{
//     let index = req.body.index;
//     shopList.splice(index,1);
//     total = shopList.reduce((total, index)=>{return index.subtotal + total}, 0);
//     res.render("index", {shopList, total})
// })

// app.get("/editItem/:id", (req,res)=>{
//     let index = req.params.id;
//     let item = shopList[index].item;
//     let amount = shopList[index].amount;
//     let quantity = shopList[index].quantity;
//     res.render("editItem", {item, amount, quantity, index})
// })

// app.post("/editItem", (req,res)=>{
//     let id = req.body.index;
//     console.log(id);
//     let item = req.body.item;
//     let amount = req.body.amount;
//     let quantity = req.body.quantity;
//     let subtotal = amount * quantity;
//     let newData = {
//         item,
//         amount,
//         subtotal,
//         quantity
//     }
//     console.log(newData);
//     shopList.splice(id, 1, newData);
//     total = shopList.reduce((total, index)=>{return index.subtotal + total}, 0);

//     console.log("edited list: " +shopList);
//     console.log("Newtotal: " +total);
//     res.render("index", {shopList,total});
// })

const userSchema = new mongoose.Schema({
  item: { type: String, required: true },
  amount: { type: Number, required: true },
  subtotal: { type: Number, default: 0  },
  quantity: { type: Number, required: true },
});

const itemListModel =
  mongoose.models.users_tbs || mongoose.model("user_tbs", userSchema);

//CREATE operation
app.post("/itemList", async(req,res)=>{  
    const {item, amount, quantity} = req.body 
    let subtotal = amount * quantity;
    try {
        const newItem = new itemListModel({
            item,
            amount,
            quantity,
            subtotal
        })
        const result = await newItem.save();
        console.log(total);
        console.log(result);
        // const result = await itemListModel.create(title,text)
        res.redirect("/itemList")
    } catch (error) {
        console.log(error);
    }
})

//READ Operation
app.get("/itemList", async(req,res)=>{
    try {
        total = 0;
        const itemList = await itemListModel.find();
        total = itemList.reduce((total, index)=>{return index.subtotal + total}, 0)
        console.log(itemList);
        res.render("index", {itemList:itemList, total})
    } catch (error) {
        console.log(error);
    }
})

//UPDATE
app.get("/editItem/:id", async(req,res)=>{
    try {
        let id = req.params.id;
        const entry = await itemListModel.findOne({_id:id});
        const {_id, item, amount, quantity} = entry;
        console.log(_id, item, amount, quantity);  
        res.render("editItem", {item, amount, quantity, _id})      
    } catch (error) {
        console.log(error);
    }
})

app.post("/editItem", async(req,res)=>{
    try {
        console.log(req.body);
        const {item, amount, quantity, _id} = req.body;
        let subtotal = amount * quantity;
        const update = await itemListModel.findByIdAndUpdate({_id:_id}, {$set:{item:item, amount:amount, quantity:quantity, subtotal:subtotal}});
        console.log(update);
        res.redirect("/itemList");
    } catch (error) {
        console.log(error);
    }
})

//DELETE
app.post("/deleteItem", async(req,res)=>{
    try {
        let index = req.body.index;
        let total = 0
        console.log(index);
        const deleteItem = await itemListModel.findByIdAndDelete({_id:index});
        console.log(deleteItem);
        res.redirect("/itemList")
    } catch (error) {
        console.log(error);
    }
})






const port = "7078";
const uri = "mongodb+srv://Techsation:Playmanjamb78@cluster0.atmrqxr.mongodb.net/nodeItem?retryWrites=true&w=majority"
const connect = async ()=>{
  mongoose.set("strictQuery", false)
  await mongoose.connect(uri).then(()=>{
    console.log("Mongoose don connect to MongoDB");
  }).catch((error)=>{
    console.log(error);
  })
}

connect()

app.listen(port, () => {
  console.log(`Server Started at port:${port}`);
});

