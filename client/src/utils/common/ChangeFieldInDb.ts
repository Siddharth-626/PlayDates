import { db } from "@/services/config"
import { doc, getDoc, updateDoc } from "firebase/firestore"


export const ChangeFieldInDb = async(field:string,value:any,path:string)=>{
    console.log("Change");
    
    try{const docRef = doc(db,path);
    updateDoc(docRef,{
        players:value
    })
    console.log("Chandged field in db");}
    catch(err){
        console.log("err while changing field",err);
        
    }
}