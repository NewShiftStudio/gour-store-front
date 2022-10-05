import { IBase } from './IBase';
import { IPageMeta } from './IPageMeta';
import { ITranslatableString } from './ITranslatableString';

export interface IPage extends IBase {
  key: string;
  info: {
    title: ITranslatableString;
    description: ITranslatableString;
  };
  meta: IPageMeta;
}
