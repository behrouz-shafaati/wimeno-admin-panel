import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Chip } from '@mui/material';

import { useGetRolesQuery } from '../../../redux/slices/roleApiSlice';
import { useAddNewUserMutation, useUpdateUserMutation } from '../../../redux/slices/usersApiSlice';
import { useUploadFileMutation } from '../../../redux/slices/fileApiSlice';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import {
  FormProvider,
  RHFMultiSelect,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit, currentUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { data: roles, isLoading: isLoadingGetRoles } = useGetRolesQuery();
  const [addNewUser, { isLoading, isError, isSuccess, error }] = useAddNewUserMutation();
  const [
    updateUser,
    { isLoading: isLoadingUpdate, isError: isErrorUpdate, isSuccess: isSuccessUpdate, error: errorUpdate },
  ] = useUpdateUserMutation();
  const [uploadFile, { isLoading: isLoadingUploadFile }] = useUploadFileMutation();

  const userSchema = {
    firstName: Yup.string().required('Name is required'),
    lastName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    mobile: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    roles: Yup.array().min(1, 'At least one role needed').required('required'),
  };

  if (!isEdit) userSchema.password = Yup.string().required('Password is required');

  const NewUserSchema = Yup.object().shape(userSchema);
  let defaultRoles = [];
  if (currentUser) {
    defaultRoles = currentUser.roles.map((role) => role.id);
  }

  const roleOptions = roles?.ids
    .filter((id) => roles.entities[id].slug !== 'super_admin')
    .map((id) => {
      const role = roles.entities[id];
      return { value: role.id, label: role.title };
    });

  const defaultValues = useMemo(
    () => ({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      mobile: currentUser?.mobile || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      avatarUrl: currentUser?.image?.url || '',
      isVerified: currentUser?.isVerified || false,
      active: currentUser?.active,
      password: '',
      roles: defaultRoles,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  useEffect(() => {
    if (isSuccess || isSuccessUpdate) {
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.user.list);
    }
    if (isError) {
      enqueueSnackbar(error.data.msg, { variant: 'error' });
    }
    if (isErrorUpdate) {
      enqueueSnackbar(errorUpdate.data.msg, { variant: 'error' });
    }
  }, [isSuccess, isError, isErrorUpdate, isSuccessUpdate]);

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);
  const onSubmit = async (data) => {
    try {
      if (!isEdit) addNewUser(data);
      else {
        setValue('id', currentUser.id);
        updateUser(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const uploadedFile = await uploadFile(file);
        setValue('image', uploadedFile.data.id);
      }
    },
    [setValue]
  );
  if (isEdit && !currentUser) return <p>Not found</p>;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {isEdit && (
              <Label
                color={!values.active ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.active ? <>Active</> : <>Banned</>}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(event) => field.onChange(event.target.checked ? 1 : 0)}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Active
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply active account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="mobile" label="Mobile Number" />

              <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="address" label="Address" />
              <RHFTextField name="password" label="Password" />
              {isLoadingGetRoles ? (
                <>Loading..</>
              ) : (
                <RHFMultiSelect name="roles" label="Roles" multiple options={roleOptions} />
              )}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isLoadingUploadFile || isLoadingUpdate || isLoading}
              >
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
