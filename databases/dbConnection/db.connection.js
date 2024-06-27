import mongoose from "mongoose"

export function conn(){
    mongoose.connect(`${process.env.DB_URL}`).then(()=>{
        console.log("connected......");
    }).catch((err)=>{
        console.log("error......",err);
    })

}
