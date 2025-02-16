import mongoose from "mongoose";

const collectorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    serviceArea: {
        type: String,
        required: true
    },
    

    assignedReports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WasteReport"
    }],
    isAvailable: {  
        type: Boolean,
        default: true  
    }


}, { timestamps: true });

const Collector = mongoose.model("Collector", collectorSchema);
export default Collector;
