import { App } from '@/app';
import { AuthRoute } from '@apis/auth/route';
import { UserRoute } from '@apis/users/route';
// import { AuthRoute } from '@routes/auth.route';
// import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute()]);

app.listen();
