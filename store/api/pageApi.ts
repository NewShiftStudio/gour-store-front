import { commonApi } from './commonApi';
import { IPage } from '../../@types/entities/IPage';
import { Path } from 'constants/routes';

type PageKeys = 'MAIN' | 'PURCHASE' | 'PRIVACY' | 'COOKIE' | 'AGREEMENT';

export const pageApi = commonApi.injectEndpoints({
  endpoints(builder) {
    return {
      getPage: builder.query<IPage, PageKeys>({
        query(key) {
          return {
            method: 'GET',
            url: `${Path.PAGES}/${key}`,
          };
        },
      }),
    };
  },
});

export const { useGetPageQuery } = pageApi;
