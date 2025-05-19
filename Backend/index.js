import {app} from "./App.js"
import dotenv from "dotenv";


app.listen( process.env.PORT || 8000,()=>{
  console.log(`Server is running at port :${process.env.PORT}`);
})

