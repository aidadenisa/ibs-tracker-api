import * as express from 'express'
import { loginLimiter, otpValidationLimiter } from '@/modules/users/controllers/middleware/rateLimiter'
import { loginController } from '@/modules/users/controllers/post_login'
import { signupController } from '@/modules/users/controllers/post_signup'
import { validateOTPController } from '@/modules/users/controllers/post_validate_otp'
import { getCurrentUserController } from '@/modules/users/controllers/get_current_user'

const authRouter = express.Router()
authRouter.post('/login', loginLimiter, loginController)
authRouter.post('/signup', loginLimiter, signupController)
authRouter.post('/validate-otp', otpValidationLimiter, validateOTPController)

const userRouter = express.Router()
userRouter.get('/current-user', getCurrentUserController)

export { authRouter, userRouter }
