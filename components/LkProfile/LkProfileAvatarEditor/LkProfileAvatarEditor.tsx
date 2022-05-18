import React from 'react';
import s from './LkProfileAvatarEditor.module.scss';
import translations from './LkProfileAvatarEditor.i18n.json';
import { useLocalTranslation } from '../../../hooks/useLocalTranslation';
import { Avatar, Stack } from '@mui/material';
import { Button } from '../../UI/Button/Button';
import { Typography } from '../../UI/Typography/Typography';


export type LkProfileAvatarEditorProps = {
  image: string;
  onChange(): void;
  onClose(): void;
};

export function LkProfileAvatarEditor({
  image,
  onChange,
  onClose,
}: LkProfileAvatarEditorProps) {
  const { t } = useLocalTranslation(translations);
  return (
    <Stack sx={{ width: '165px' }} spacing={2} alignItems="center">
      <Avatar alt="Your profile" src={image} sx={{ width: 128, height: 128 }} />
      <div className={s.photoInput}>
        <label htmlFor="profile-photo-input">
          <Typography variant="body1" color="#fff">
            Изменить фото
          </Typography>
        </label>
        <input id="profile-photo-input" type="file" onChange={onChange} />
      </div>
      <Button sx={{ width: '100%' }} variant="outlined" onClick={onClose}>
        Удалить
      </Button>
    </Stack>
  );
}
