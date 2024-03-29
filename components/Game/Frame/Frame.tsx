import React, { ReactNode } from 'react';

import { Box } from 'components/UI/Box/Box';

import backgroundImage from 'assets/images/game/background.svg';

export type GameFrameProps = {
  children: ReactNode;
};

const frameSx = {
  background: `url("${backgroundImage}")`,
  width: '1092px',
  height: '588px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '54px 141px',
  position: 'relative',
  zoom: {
    xs: 0.3,
    sm: 0.6,
    md: 0.9,
    lg: 1,
  },
};

export function GameFrame({ children }: GameFrameProps) {
  return <Box sx={frameSx}>{children}</Box>;
}
