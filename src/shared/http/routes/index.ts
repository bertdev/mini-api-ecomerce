import { Router } from 'express';

const routes = Router();

routes.get('/', (request, response) => {
  response.json({ message: 'amigo estou aqui' });
});

export default routes;
