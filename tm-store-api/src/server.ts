import { App } from './app'
// import { AuthRoute } from './routes/auth.route'
// import { UserRoute } from './routes/users.route'
import { ValidateEnv } from './utils/validateEnv'
import { ConfigRoute } from './apis/configs/route'
import { TypeRoute } from './apis/types/route'
import { RoleRoute } from './apis/roles/route'
import { UserRoute } from './apis/users/route'
import { AuthRoute } from './apis/auth/route'
import { ConnectRoute } from './apis/connects/route'
// import { FileManagerRoute } from './apis/file-manager/route'
import { GroupRoute } from './apis/groups/route'
import { NewsRoute } from './apis/news/route'
import { ProductRoute } from './apis/products/route'
ValidateEnv()

const app = new App([
  new ConfigRoute(),
  new TypeRoute(),
  new RoleRoute(),
  new UserRoute(),
  new AuthRoute(),
  new ConnectRoute(),
  // new FileManagerRoute(),
  new GroupRoute(),
  new NewsRoute(),
  new ProductRoute(),
])

app.listen()
