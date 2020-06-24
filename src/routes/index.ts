// src/routes/index.ts
import { Router } from 'express';
import appointmentsRouter from './Appointments.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);

export default routes;
