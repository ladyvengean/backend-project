
import mongoose, {Schema} from "mongoose";
const subscriptionSchema = new Schema({
    subscriber: { //one who is subcribing
        type: Schema.Types.ObjectId,
        ref : "User"
    },
    channel: { //one to who subscriber is subscribing
        type: Schema.Types.ObjectId,
        ref : "User"
    }
}, {timestamps: true})

export const Subscription  = mongoose.model("Subscription", subscriptionSchema)