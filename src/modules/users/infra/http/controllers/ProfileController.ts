import { Request, Response } from 'express';
import ShowProfileService from '../../../services/ShowProfileService';
import UpdateProfileService from '../../../services/UpdateProfileService';
import { instanceToInstance } from 'class-transformer';

class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const showProfileService = new ShowProfileService();
    const userProfile = await showProfileService.execute({ user_id: id });

    return response.status(200).json(instanceToInstance(userProfile));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name, email, password, old_password } = request.body;
    const updateProfileService = new UpdateProfileService();
    const userProfileUpdated = await updateProfileService.execute({
      user_id: id,
      name,
      email,
      password,
      old_password,
    });

    return response.status(200).json(instanceToInstance(userProfileUpdated));
  }
}

export default ProfileController;
