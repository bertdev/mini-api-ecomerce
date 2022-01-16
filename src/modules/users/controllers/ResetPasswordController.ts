import { Request, Response } from 'express';
import ResetPasswordService from '../services/ResetPasswodService';

class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;
    const resetPasswordService = new ResetPasswordService();
    await resetPasswordService.execute({ password, token });

    return response.sendStatus(204);
  }
}

export default ResetPasswordController;
