import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI as string).then(async () => {
    try {
        const collections = await mongoose.connection.db!.collections();
        const users = collections.find(c => c.collectionName === 'users');
        if (users) {
            await users.dropIndex('phone_1');
            console.log("Successfully dropped index: phone_1");
        }
    } catch (err: any) {
        if (err.codeName === 'IndexNotFound') {
            console.log("Index phone_1 not found, already dropped.");
        } else {
            console.error("Error dropping index:", err);
            process.exit(1);
        }
    }
    process.exit(0);
});
