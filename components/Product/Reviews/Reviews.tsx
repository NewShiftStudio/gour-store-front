import React, { CSSProperties } from 'react';
import { Comment } from '../..//UI/Comment/Comment';
import { Typography } from '../../UI/Typography/Typography';
import { Box, Grid, Stack } from '@mui/material';
import { ReviewsCounter } from './ReviewsCounter';
import { Swiper, SwiperSlide } from 'swiper/react';

type Review = {
  id: number;
  clientName: string;
  value: number;
  comment: string;
  date: Date;
};

export type ProductReviewsProps = {
  reviews: Review[];
  sx: CSSProperties;
};

const containerBoxSx: CSSProperties = {
  background: '#EBEBEB',
  borderRadius: '6px',
  padding: '20px',
};

export const ProductReviews = ({ reviews, sx }: ProductReviewsProps) => {
  let ratingStats = [];

  for (let i = 5; i >= 1; i--) {
    const reviewsCount = reviews.filter(review => review.value === i).length;
    ratingStats.push({
      grade: i,
      count: reviewsCount,
      percent: (reviewsCount / reviews.length) * 100,
    });
  }

  const reviewDate = 'test';

  return (
    <Grid sx={sx} container spacing={1} direction="row" style={containerBoxSx}>
      <Grid item xs={3}>
        <Stack>
          <Typography variant="h5">Отзывы</Typography>
          {ratingStats.map(stat => (
            <ReviewsCounter
              grade={stat.grade}
              count={stat.count}
              percent={stat.percent}
            />
          ))}
        </Stack>
      </Grid>
      <Grid item xs={9}>
        <Swiper slidesPerView={3}>
          {reviews.map(review => (
            <SwiperSlide key={review.id}>
              <Comment
                title={review.clientName}
                grade={review.value}
                date={reviewDate}
                text={review.comment}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>
    </Grid>
  );
};
