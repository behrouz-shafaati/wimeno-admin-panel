import { useEffect } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// rtk
import { useChangePasswordMutation } from '../../../../redux/slices/usersApiSlice';
import { useSendLogoutMutation } from '../../../../redux/slices/authApiSlice';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const [changePassword, { isLoading: isLoadinfChangePws, isSuccess, error: errorChangePassword }] =
    useChangePasswordMutation();

  const [sendLogout] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Update success!');
      sendLogout();
    }
    console.log('errorChangePassword:', errorChangePassword);
    if (errorChangePassword)
      enqueueSnackbar(errorChangePassword?.data.msg || 'Unable to change password.', { variant: 'error' });
  }, [isLoadinfChangePws]);

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (params) => {
    changePassword(params);
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="oldPassword" type="password" label="Old Password" />

          <RHFTextField name="newPassword" type="password" label="New Password" />

          <RHFTextField name="confirmNewPassword" type="password" label="Confirm New Password" />

          <LoadingButton type="submit" variant="contained" loading={isLoadinfChangePws}>
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
