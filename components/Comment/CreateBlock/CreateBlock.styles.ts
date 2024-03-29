import { color } from 'themes';

export const blockSx = {
  title: {
    fontSize: {
      sm: '24px',
      xs: '16px',
    },
    color: 'text.primary',
    fontFamily: 'Roboto slab',
    fontWeight: 'bold',
  },
  container: {
    padding: '20px',
    boxShadow: 'none',
  },
  btn: {
    margin: '15px 0 0 0',
    width: '100%',
    maxWidth: {
      md: '300px',
      xs: '100%',
    },
  },
  star: {
    color: color.accent,
  },
  emptyStar: {
    color: color.muted,
  },
  alertTitle: {
    fontWeight: 'Bold',
  },
};
