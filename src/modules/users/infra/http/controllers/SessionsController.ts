import { Request, Response } from 'express';
import CreateSessionsService from '../../../services/CreateSessionsService';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const createSessions = new CreateSessionsService();
    const session = await createSessions.execute({ email, password });

    return response.status(201).json(session);
  }
}

export default SessionsController;
