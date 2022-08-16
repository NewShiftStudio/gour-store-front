import React, { useState } from 'react';
import { Paper, Grid, Rating, SxProps } from '@mui/material';

import StarIcon from '@mui/icons-material/Star';

import { eventBus, EventTypes } from 'packages/EventBus'
import { NotificationType } from '../../../@types/entities/Notification';
import type { CommentDto } from '../../../@types/dto/comment.dto';
import { IProductGrade } from '../../../@types/entities/IProductGrade';
import translations from './CreateBlock.i18n.json';
import { useLocalTranslation } from '../../../hooks/useLocalTranslation';
import { Box } from '../../UI/Box/Box';
import { Button } from '../../UI/Button/Button';
import { Typography } from '../../UI/Typography/Typography';
import { TextField } from '../../UI/TextField/TextField';
import { defaultTheme as theme } from '../../../themes';
import { negativeEventMessage, positiveEventMessage } from './CreateBlockHelpers';
import { blockSx } from './CreateBlock.styles';

const initComment: CommentDto = { value: 0, comment: '' };

export type CommentCreateBlockProps = {
  sx?: SxProps;
  onCreate: (comment: CommentDto) => Promise<IProductGrade>;
};

type OnChangeFn = <K extends keyof CommentDto>(name: K, value: CommentDto[K]) => void;

export function CommentCreateBlock({ sx, onCreate }: CommentCreateBlockProps) {
  const { t } = useLocalTranslation(translations);

  const [formData, setFormData] = useState<CommentDto>(initComment);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await onCreate(formData);
      setFormData(initComment);
      eventBus.emit(EventTypes.notification, positiveEventMessage);
    } catch (error) {
      console.error('[Create Comment]:', error);
      eventBus.emit(EventTypes.notification, negativeEventMessage);
    }
  };

  const onChange: OnChangeFn = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <Paper sx={{ ...blockSx.container, ...sx }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={blockSx.title}>
              {t('title')}
            </Typography>

            <Typography sx={{ margin: '10px 0' }} variant="body2">
              {t('subtitle')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating
                name="value"
                onChange={(_, value) => onChange('value', Number(value) || 0)}
                value={formData.value}
                size="large"
                icon={<StarIcon sx={blockSx.star} />}
                emptyIcon={<StarIcon sx={blockSx.emptyStar} />}
              />

              <Typography sx={{ margin: '0 0 0 10px' }} variant="caption" color={theme.palette.text.muted}>
                {t('rate')}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <TextField
              multiline
              rows={3}
              name="comment"
              value={formData.comment}
              label={t('review')}
              onChange={e => onChange('comment', e.target.value)}
            />
            <Button sx={blockSx.btn} type="submit" disabled={!formData.value}>
              {t('accept')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
