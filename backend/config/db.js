import mongoose from 'mongoose'

const connectDB = async () => {
	try {
		// Tắt cảnh báo về ensureIndex
		mongoose.set('strictQuery', false)
		
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			
			retryWrites: true,
			ssl: true,
			writeConcern: {
				w: 'majority',
				j: true
			}
		})
		console.log(`MongoDB Connected: ${conn.connection.host}`)
	} catch (error) {
		console.error(`Error: ${error.message}`)
		process.exit(1)
	}
}

export default connectDB
