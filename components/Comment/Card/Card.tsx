import React from 'react';

import { Paper, Rating } from '@mui/material';

import { Box } from 'components/UI/Box/Box';
import { Typography } from 'components/UI/Typography/Typography';

import { color } from 'themes';

import StarIcon from '@mui/icons-material/Star';

const sx = {
  comment: {
    cursor: 'pointer',
    width: {
      xs: '250px',
      sm: '280px',
    },
    padding: '12px',
    backgroundColor: color.white,
    boxShadow: 'none',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    margin: '6px 0',
  },
  date: {
    marginLeft: '16px',
  },
  text: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
};

export type CommentCardProps = {
  title: string;
  grade: number;
  date: string;
  text: string;
  onClick: () => void;
  commentSx?: any;
};

export function CommentCard({ title, grade, date, text, onClick, commentSx = {} }: CommentCardProps) {
  return (
    <Paper sx={{...sx.comment, ...commentSx}} elevation={0} onClick={onClick}>
      <Typography variant='body1' color='primary'>
        {title}
      </Typography>

      <Box sx={sx.rating}>
        <Rating
          value={grade}
          precision={0.5}
          readOnly
          icon={<StarIcon fontSize='small' htmlColor={color.accent} />}
          emptyIcon={<StarIcon fontSize='small' htmlColor={color.muted} />}
        />
        <Typography sx={sx.date} variant='body2' color='text.muted'>
          {date}
        </Typography>
      </Box>

      <Typography sx={sx.text} variant='body2' color='text.muted'>
        {text}
      </Typography>
    </Paper>
  );
}
