import { IBreadcrumbHandler, IBreadcrumbHandlerConfig } from '../../models/breadcrumbs';
import { IRouterStateUrl } from '../../../@ngrx/router';
import { TNullable } from '../../models/utils';
import { isAppropriatePath } from '../utils';

export class BreadcrumbChooseHandler {
  private readonly handlers: Array<IBreadcrumbHandlerConfig>;

  constructor(handlers: Array<IBreadcrumbHandlerConfig> = []) {
    this.handlers = handlers;
  }

  private findHandler({ url }: IRouterStateUrl): TNullable<IBreadcrumbHandlerConfig> {
    return this.handlers.find(({ path }) => isAppropriatePath(url, path)) || null;
  }

  public process(state: IRouterStateUrl): TNullable<IBreadcrumbHandler> {
    const handlerConfig: TNullable<IBreadcrumbHandlerConfig> = this.findHandler(state);
    return handlerConfig === null ? null : handlerConfig.handler;
  }
}
