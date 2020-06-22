import { Router, request, response } from 'express';

const appointmentsRouter = Router();

appointmentsRouter.post('/', (request, response) => {
    return response.json({ message: 'hello world' });
})

export default appointmentsRouter;
