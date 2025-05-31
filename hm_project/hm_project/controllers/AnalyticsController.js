import { getAtlasDB } from '../mongo-context.js';

const collectionName = 'orders';
const orderCountByModePipelineStr = (filterDate) => [{ $match: { createdAt: { $gte: new Date(filterDate) } } }, { $group: { _id: "$mode", totalOrders: { $sum: 1 } } }, { $project: { _id: 0, mode: "$_id", totalOrders: 1 } }];
const dailyRevenuePipelineStr = `[{"$group":{"_id":{"dayOfWeek":{"$dayOfWeek":"$createdAt"}},"totalRevenue":{"$sum":"$grandTotal"}}},{"$addFields":{"weekday":{"$arrayElemAt":[["","Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"$_id.dayOfWeek"]}}},{"$sort":{"_id.dayOfWeek":1}},{"$project":{"_id":0,"weekday":1,"totalRevenue":1}}]`;
const weeklyRevenuePipelineStr = `[{"$addFields":{"year":{"$isoWeekYear":"$createdAt"},"week":{"$isoWeek":"$createdAt"}}},{"$group":{"_id":{"year":"$year","week":"$week"},"totalRevenue":{"$sum":"$grandTotal"}}},{"$sort":{"_id.year":1,"_id.week":1}},{"$group":{"_id":"$_id.year","weeks":{"$push":{"week":"$_id.week","totalRevenue":"$totalRevenue"}}}},{"$unwind":{"path":"$weeks","includeArrayIndex":"weekIndex"}},{"$project":{"year":"$_id","weekday":{"$concat":["Week ",{"$toString":{"$add":["$weekIndex",1]}}]},"totalRevenue":"$weeks.totalRevenue"}},{"$sort":{"year":1,"weekLabel":1}}]`;
const monthlyRevenuePipelineStr = `[{"$addFields":{"year":{"$year":"$createdAt"},"month":{"$month":"$createdAt"}}},{"$addFields":{"monthName":{"$arrayElemAt":[["","January","February","March","April","May","June","July","August","September","October","November","December"],"$month"]}}},{"$group":{"_id":{"year":"$year","month":"$month","monthName":"$monthName"},"totalRevenue":{"$sum":"$grandTotal"}}},{"$project":{"_id":0,"year":"$_id.year","month":"$_id.month","weekday":"$_id.monthName","totalRevenue":1}},{"$sort":{"year":1,"month":1}}]`;
const yearlyRevenuePipelineStr = `[{"$group":{"_id":{"year":{"$year":"$createdAt"}},"totalRevenue":{"$sum":"$grandTotal"}}},{"$project":{"_id":0,"weekday":"$_id.year","totalRevenue":1}},{"$sort":{"weekday":1}}]`;

export async function getAnalyticsSummary(req, res) {
    try {
        const db = getAtlasDB();
        if(req.body.filter.revenueFilter === 'Daily') {
            res.json(await db.collection('orders').aggregate(JSON.parse(dailyRevenuePipelineStr)).toArray());    
        } else if(req.body.filter.revenueFilter === 'Weekly') {
            res.json(await db.collection('orders').aggregate(JSON.parse(weeklyRevenuePipelineStr)).toArray());
        } else if(req.body.filter.revenueFilter === 'Monthly') {
            res.json(await db.collection('orders').aggregate(JSON.parse(monthlyRevenuePipelineStr)).toArray());
        } else if(req.body.filter.revenueFilter === 'Yearly') {
            res.json(await db.collection('orders').aggregate(JSON.parse(yearlyRevenuePipelineStr)).toArray());
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' + err });
    }
}

export async function getAnalytics(req, res) {
    try {
    
        const db = getAtlasDB(); 
        const orders = await db.collection('orders').find({}).toArray();
        const chefs = await db.collection('chefs').find({}).toArray();

        const totalOrders = orders.length;
    
        const totalRevenue = orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    
        const phoneSet = new Set();
        orders.forEach(order => {
          
                    if (order.phone) phoneSet.add(order.phone);})
                ;
        const totalClients = phoneSet.size;
        // Total chefs
        const totalChefs = chefs.length;

        res.json({
            totalRevenue,
            totalOrders,
            totalClients,
            totalChefs
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

export async function getOrderSummary(req, res) {
    const type = req.body.filter.orderFilter;
    console.log(type);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() -1);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const filterDate = now;
    console.log(startOfToday);
    if (type === 'Daily') {
        const result = await getAtlasDB().collection(collectionName).aggregate(orderCountByModePipelineStr(startOfToday)).toArray();
        const resultServed = await getAtlasDB().collection(collectionName).countDocuments({
            status: "Done",
            createdAt: { $gte: startOfToday }
        });
        result.push({mode: 'Served', totalOrders: resultServed});
        res.json(result);
    } else if (type === 'Weekly') {
        const result = await getAtlasDB().collection(collectionName).aggregate(orderCountByModePipelineStr(startOfWeek)).toArray();
        const resultServed = await getAtlasDB().collection(collectionName).countDocuments({
            status: "Done",
            createdAt: { $gte: startOfWeek }
        });
        result.push({mode: 'Served', totalOrders: resultServed});
        res.json(result);
    } else if (type === 'Monthly') {
        const result = await getAtlasDB().collection(collectionName).aggregate(orderCountByModePipelineStr(startOfMonth)).toArray();
        const resultServed = await getAtlasDB().collection(collectionName).countDocuments({
            status: "Done",
            createdAt: { $gte: startOfMonth }
        });
        result.push({mode: 'Served', totalOrders: resultServed});
        res.json(result);
    } else if (type === 'Yearly') {
        const result = await getAtlasDB().collection(collectionName).aggregate(orderCountByModePipelineStr(startOfYear)).toArray();
        const resultServed = await getAtlasDB().collection(collectionName).countDocuments({
            status: "Done",
            createdAt: { $gte: startOfYear }
        });
        result.push({mode: 'Served', totalOrders: resultServed});
        res.json(result);
    }
}
