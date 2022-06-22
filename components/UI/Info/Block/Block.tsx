import React, { CSSProperties } from 'react';
import { Paper } from '@mui/material';

import { Typography } from '../../Typography/Typography';
import { Link as CustomLink } from '../../Link/Link';

const sx = {
  block: {
    maxWidth: '380px',
    padding: '16px',
    backgroundColor: 'background.default',
    border: '1px solid',
    borderColor: 'secondary.main',
  },
  text: {
    marginBottom: '10px',
  },
};

type Props = {
  styles?: CSSProperties;
  text: string;
  link?: {
    label: string;
    path: string;
  };
};

export function InfoBlock({ text, link, styles }: Props) {
  return (
    <Paper sx={{ ...sx.block, ...styles }} elevation={0}>
      <Typography sx={sx.text} color="text.muted" variant="body1">
        {text}
      </Typography>
      {link && <CustomLink path={link.path}>{link.label}</CustomLink>}
    </Paper>
  );
}