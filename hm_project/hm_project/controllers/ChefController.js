import { getAtlasDB } from '../mongo-context.js';
const chefCollection = 'chefs';


export  async function getAllChefs(req, res) {
    try {
        const db = getAtlasDB();
        const chefs = await db.collection(chefCollection).find({}).toArray();
        const chefsWithOrderCount = chefs.map(chef => ({
            _id: chef._id,
            name: chef.name,
            orderCount: Array.isArray(chef.orders) ? chef.orders.length : 0
        }));
        res.status(200).json(chefsWithOrderCount);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chefs', error });
    }
}


