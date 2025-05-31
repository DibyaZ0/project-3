import express from 'express';
import cors from 'cors';
import { connectAtlasDB } from './mongo-context.js';
import tablesRoute from './routes/Tables.js';
import ordersRoute from './routes/Orders.js';
import menuRoute from './routes/Menu.js';
import chefRoutes from './routes/Chefs.js'
import { getAnalytics, getAnalyticsSummary, getOrderSummary } from './controllers/AnalyticsController.js';

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use('/api/tables', tablesRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/menu', menuRoute);
app.use("/api/chefs",chefRoutes)
app.get("/api/analytics",getAnalytics);
app.post("/api/analyticsSummary", getAnalyticsSummary);
app.post("/api/orderSummary", getOrderSummary);

connectAtlasDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
