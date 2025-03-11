import Collector from "../models/collector.model.js";
import WasteReport from "../models/wasteReport.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/Apierror.js";

//get available collectors that can pick it up
export const getAvailableCollectors = asyncHandler(async(req,res) => {
    const {wasteType} = req.body;
    if(!wasteType){
        throw new Apierror(400, "waste type not given")
    }

    //find available collectors
    const availableCollectors = await Collector.find({
        wasteType,
        isAvailable: true //will show only woi jo available hai

    })

    if(availableCollectors.length === 0){
        return res.status(404).json({message: "NO collectors found"})
    }
    return res.status(200).json({
        sucess: true,
        message: "available collectors fetched",
        collectors: availableCollectors
    })
});



// export const assignCollector = asyncHandler(async (req, res) => {
//     const { reportId, collectorId } = req.body;

//     // Validate IDs
//     if (!mongoose.Types.ObjectId.isValid(reportId) || !mongoose.Types.ObjectId.isValid(collectorId)) {
//         throw new Apierror(400, "Invalid reportId or collectorId");
//     }

//     // Find the report by ID
//     const report = await WasteReport.findById(reportId);
//     if (!report) {
//         throw new Apierror(404, "Waste report not found");
//     }

//     // Find the collector by ID
//     const collector = await Collector.findById(collectorId);
//     if (!collector) {  // FIXED TYPO
//         throw new Apierror(404, "Collector not found");
//     }

//     // Assign the collector to the report
//     report.assignedCollector = collectorId;
//     await report.save();

//     // Mark collector as unavailable
//     collector.isAvailable = false;
//     await collector.save();

//     return res.status(200).json({
//         success: true,
//         message: "Collector assigned successfully!",
//         reportId: report._id,
//         collectorId: collector._id
//     });
// });





//assign the collector to a report
export const assignCollector = asyncHandler(async(req, res) => {
    const {reportId, collectorId} = req.body;
    if(!reportId || !collectorId){
        throw new Apierror(400,"report id and collector id are required fields")
    }

    //find the report by id
    const report = await WasteReport.findById(reportId);
    if(!report){
        throw new Apierror(404,"report not found")
    }
    const collector = await Collector.findById(collectorId);
    if(!collectorId){
        throw new Apierror(404,"report not found");
    }

    report.assignedCollector = collectorId;
    await report.save();

    collector.isAvailable = false;
    await collector.save();

    return res.status(200).json({
        success: true,
        message: "collector assigned",
        reportId: report._id,
        collectorId: collector._id
    })    
}) 

export const updateCollectorStatus = asyncHandler(async(req,res) => {
    const {collectorId, status} = req.body;
    if (!collectorId || !status) {
        throw new Apierror(400, "Collector ID and status are required");
    }
    const collector = await Collector.findById(collectorId)
    if(!collector){
        throw new Apierror(404,"collector not found")   
    } 

    collector.isAvailable = status === "available";
    await Collector.save();
    return res.status(200).json({
        sucess: true,
        message: `collecter status updates to ${status}`
    })


})