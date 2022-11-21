import { Currency } from 'types/entities/Currency';
import { ICategoryWithDiscount } from 'types/entities/ICategory';
import { IOrder } from 'types/entities/IOrder';
import { IOrderProfile } from 'types/entities/IOrderProfile';

export const getFormattedAddressesList = (addressList: IOrderProfile[], language: 'en' | 'ru') =>
  addressList.map(it => {
    const address = [
      it.city.name[language],
      it.street,
      it.house,
      it.apartment && `${language === 'ru' ? 'кв.' : 'apt.'}. ${it.apartment}`,
    ]
      .filter(item => !!item)
      .join(', ');

    return { title: it.title, address };
  });

export const getFormattedOrdersList = (orderList: IOrder[], currency: Currency) =>
  orderList.map(it => ({
    id: it.crmInfo?.id.toString() || '####',
    date: new Date(it.createdAt),
    status: it.crmInfo?.status.name,
    sum: it.totalSum,
    currency,
  }));

export const formatCategoriesWithMaxDiscount = (
  categories: ICategoryWithDiscount[] = [], // TODO: вынести в rtk select
) =>
  categories
    .map(category => ({
      id: category.id,
      title: category.title,
      category: category.subCategories.reduce((acc, subCategory) =>
        subCategory.discountPrice > acc.discountPrice ? subCategory : acc,
      ),
    }))
    .sort((a, b) => b.category.discountPrice - a.category.discountPrice);
