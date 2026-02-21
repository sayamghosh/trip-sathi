import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI as string).then(async () => {
    const collections = await mongoose.connection.db!.collections();
    const users = collections.find(c => c.collectionName === 'users');
    let output: any = { indexes: [], allUsers: [] };
    if (users) {
        output.indexes = await users.indexes();
        output.allUsers = await users.find({}).toArray();
    }
    fs.writeFileSync('output.json', JSON.stringify(output, null, 2), 'utf-8');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
