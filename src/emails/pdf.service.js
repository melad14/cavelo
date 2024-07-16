//Required package
import pdf from "pdf-creator-node";
import { readFileSync } from "fs";
import path from "path";
import { options } from "../utils/option.js";

// Read HTML Template
export const createPdf=(req,res,next)=>{

    let html = readFileSync(path.join(__dirname,"../templates/pdf.html", "utf8"));
    let filename="file.pdf"
    let document = {
        html: html,
        data: { },
        path: "../docs/"+filename,
        type: "",
      };
      pdf.create(document,options)
}