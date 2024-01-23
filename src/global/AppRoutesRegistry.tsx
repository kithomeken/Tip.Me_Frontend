import { coreSettingsRoutes } from "../routes/configRoutes";
import { standardErrorRoutes } from "../routes/errorRoutes";

export const CONFIG_BASE_ROUTE: any = (coreSettingsRoutes.find((routeName: { name: string }) => routeName.name === '_CONFIG'))?.path

