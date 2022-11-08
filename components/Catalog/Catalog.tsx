import React, { ReactNode, useRef, useState } from 'react';

import { SxProps, Theme, useMediaQuery } from '@mui/material';

import { Box } from 'components/UI/Box/Box';
import { Pagination } from 'components/UI/Pagination/Pagination';
import { Typography } from 'components/UI/Typography/Typography';

import catalogSx from './Catalog.styles';

export type CatalogProps = {
  title?: string;
  emptyText?: string;
  head?: ReactNode;
  cardList: ReactNode[];
  sx?: SxProps;
};

export function Catalog({ title, emptyText = 'Список карточек пуст', head, cardList, sx }: CatalogProps) {
  const catalogRef = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState(1);

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const cardsPerPage = (isMobile && 6) || (isTablet && 8) || (isDesktop && 10) || 12;

  const pagesCount = Math.ceil(cardList.length / cardsPerPage);

  const pageRange = {
    start: (page - 1) * cardsPerPage,
    end: page * cardsPerPage,
  };

  const cards = cardList.slice(pageRange.start, pageRange.end);

  const isMultiPage = pagesCount > 1;

  const scrollToCatalog = () => catalogRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });

  const changePage = (value: number) => {
    if (value !== page) {
      setPage(value);
      scrollToCatalog();
    }
  };

  return (
    <div ref={catalogRef} style={{ scrollMargin: '20px' }}>
      <Box sx={{ ...catalogSx.catalog, ...sx } as SxProps}>
        {title && (
          <Typography variant='h4' sx={catalogSx.title}>
            {title}
          </Typography>
        )}

        {head}

        {cardList.length ? (
          <Box sx={catalogSx.cardsGrid}>{cards}</Box>
        ) : (
          <Typography variant='h5' color='primary' sx={catalogSx.emptyText}>
            {emptyText}
          </Typography>
        )}

        {isMultiPage && <Pagination page={page} count={pagesCount} sx={catalogSx.pagination} onChange={changePage} />}
      </Box>
    </div>
  );
}