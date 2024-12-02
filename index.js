import express from "express";
import bodyParser from "body-parser";
import sql from "pg";

const app = express();
const port = 3000;

const db = new sql.Client({
  user: "postgres",
  host: "localhost",
  database: "pawar",
  password: "8143113307",
  port: 5433,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;
    let date = new Date();
    let Today = date.toDateString()
    res.render("index.ejs", {
      listTitle: "MY Day",//Today
      date : Today,
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/about",async (req,res)=>{
  try{
    res.render("about.ejs");
  
  }catch(err){
    console.log(err);
  }
})

app.get("/calendar",async (req,res)=>{
try{
  res.render("calender.ejs");

}catch(err){
  console.log(err);
}
});

app.post("/add", async (req, res) => {
  const result = await db.query("SELECT MAX(id) AS maxId FROM items");
  const maxId = result.rows[0].maxid || 0; // Default to 0 if the table is empty
  const newId = maxId + 1;
  const item = req.body.newItem;
 
  // items.push({title: item});
  try {
    await db.query("INSERT INTO items (id,title) VALUES ($1,$2)", [newId,item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
