import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: process.env.PORT || 5001,
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb+srv://wangzejunnina:jackcaI1!@clusterdidyoudrawtoday.wjbc8.mongodb.net/<dbname>?retryWrites=true&w=majority',
    JWT_SECRET: process.env.JWT_SECRET || 'somethingsecret'
    
};