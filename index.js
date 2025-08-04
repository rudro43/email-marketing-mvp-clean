const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/customers', customerRoutes);

// Connect to DB
connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
const segmentRoutes = require('./routes/segmentRoutes');

app.get('/', (req, res) => res.send('🚀 API is running!'));
app.use('/auth', authRoutes);
app.use('/api/segments', segmentRoutes);

// 👇 Start Server — MUST be the last middleware
const PORT = process.env.PORT || 5000;
const emailRoutes = require('./routes/emailRoutes');
app.use('/api/email', emailRoutes);
const scheduleRoutes = require('./routes/scheduleRoutes');
app.use('/api/email', scheduleRoutes);
app.use('/api/schedule', scheduleRoutes);
const campaignRoutes = require('./routes/campaignRoutes');
app.use('/api/campaigns', campaignRoutes);
const analyticsRoutes = require('./routes/analyticsRoutes');
app.use('/api/analytics', analyticsRoutes);
const templateRoutes = require('./routes/templateRoutes');
app.use('/api/templates', templateRoutes);
const campaignConfigRoutes = require('./routes/campaignConfigRoutes');
app.use('/api/campaign-config', campaignConfigRoutes);
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
const startEmailScheduler = require('./scheduler/emailScheduler');
/*const { createBullBoard } = require('@bull-board/api');
const { ExpressAdapter } = require('@bull-board/express');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const emailQueue = require('./bullmq/emailQueue');  
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

startEmailScheduler();
*/







