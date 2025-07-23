import { Request, Response, NextFunction } from 'express';
import {
  createUser,
  updateUser,
  loginUser,
  getUserById,
} from '../../services/users';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await createUser(req.body);
    res
      .status(201)
      .json({ userId: user.id, message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getUserProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.userId;
    const authenticatedUserId = req.user?.userId;

    // Users can only access their own profile
    if (userId !== authenticatedUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await getUserById(userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUserProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.userId;
    const authenticatedUserId = req.user?.userId;

    // Users can only update their own profile
    if (userId !== authenticatedUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = req.body;
    const updatedUser = await updateUser(userId, updates);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
}

export async function loginUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
