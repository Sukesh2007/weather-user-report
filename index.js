import express from "express"


const app = express();
import { connectDb } from "./config/db.js";
import { City } from "./models/Weather.js";

const PORT = 4006;
await connectDb();
app.use(express.json());

app.post("/weather", async(req,res) => {
  try{
    const {user,city,temperature,humid,description} = req.body;
    const newUser = new City({
        username: user,
        city,
        temperature,
        humidity: humid,
        description
    })
        const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const existing = await City.findOne({username:user, city: city,createdAt: {$gte: startOfDay , $lte: endOfDay}});
    if(existing){
        res.status(400).json({state: "Already recorded"})
    }
    else{
      await newUser.save();
      res.json({state: "Recorded successfully"});
        
    }
    console.log(newUser);
  }catch(err){
    console.error(err);
    res.json({state: "Error occured"});
  }
});

app.get("/weather/history", async (req, res) => {
  try {
    const city = req.query.city;
    const days = Number(req.query.days) || 15;

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setDate(now.getDate() - days);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const results = await City.find({
      city: { $regex: new RegExp(`^${city}$`, 'i') },
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (results.length > 0) {
      res.json(results);
    } else {
      res.json({ status: "empty" });
    }
  } catch (err) {
    console.error("Error in /weather/history:", err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

app.get("/weather/today", async(req,res) => {
  const city = req.query.city;
  let data = [];
  try{
      const userData = await City.find({city:city});
      if(userData.length > 0){
          userData.forEach((item) => {
              data.push({
                  username: item.username,
                  city: item.city,
                  temperature: item.temperature,
                  humidity: item.humidity,
                  description: item.description
              });
          });
          res.json(data);
        }
        else{
          res.json({state: "No such records found"});
        }
  }catch(err){
      console.log(err);
  }

});



app.delete("/weather/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ status: "ID required" });
    }

    const deletedRecord = await City.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ status: "No record found for deletion" });
    }

    res.json({ status: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ status: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
