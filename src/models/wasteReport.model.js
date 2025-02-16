import mongoose from "mongoose";

const wasteReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    wasteType: {
        type: String,
        enum: ["Dry", "Wet", "Unknown"],
        default: "Unknown"
    },
    status: {
        type: String,
        enum: ["Pending", "Classified", "Assigned", "Completed"],
        default: "Pending"
    },
    assignedCollector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collector",
        default: null
    }
}, { timestamps: true });

const WasteReport = mongoose.model("WasteReport", wasteReportSchema);
export default WasteReport;
