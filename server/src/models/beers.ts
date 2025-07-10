import mongoose, {Schema, InferSchemaType, model} from "mongoose";

const beerSchema = new Schema({
    price:{
        type: String,
        required: true,
    }, 
    name: {
        type: String,
        required: true,
    },
    rating: {
        avreage:{
            type: Number,
            required: true,
        },
        reviews: {
            type: Number,
            required: true,
        }
    },
    image: {
        type: String,
        required: true,
    },
    id:{
        type: Number,
        required: true,
    }
})

type Beer = InferSchemaType<typeof beerSchema>;
export default model<Beer>("Beer", beerSchema);