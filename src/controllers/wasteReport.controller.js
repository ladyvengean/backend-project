import WasteReport from "../models/wasteReport.model.js";

import Collector from "../models/collector.model.js";
import axios from "axios";

//new one
export const createWasteReport = async(req, res) => {
    try {
        const {userId, imageUrl, location} = req.body;
        const newReport = new WasteReport({user: userId, imageUrl, location});
        await newReport.save();
        return res.status(201).json({message: "Waste reported", report: newReport});
    } catch (error) {
        return res.status(500).json({message: error.message});
        
    }
}

//classification of waste 
export const classifyWaste=async(req, res) => {
    try {
        const {reportId} = req.body;
        const report = await WasteReport.findById(reportId);
        if(!report){
            return res.status(404).json({message:"waste report not found"});

        }

        //gemini classification
        //image sending to gemini
        //get result from gemini
        //update and save the classification result in the report 

        //find the collectors
        //const collectors 

        return res.status(200).json({
            message: "classification successful",
            //classfication and nearest collectors 

        })
    } catch (error) {
        return res.status(500).json({message: error.message});
        
    }
}


