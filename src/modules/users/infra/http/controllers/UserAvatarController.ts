import { Request, Response } from 'express';
import UploadUserAvatarService from '../../../services/UploadUserAvatarService';
import { instanceToInstance } from 'class-transformer';

class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const uploadUserAvatarService = new UploadUserAvatarService();
    const user = await uploadUserAvatarService.execute({
      userId: request.user.id,
      avatarFileName: request.file?.filename as string,
    });

    return response.status(200).json(instanceToInstance(user));
  }
}

export default UserAvatarController;
