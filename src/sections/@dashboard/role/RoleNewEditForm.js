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
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Chip, Divider } from '@mui/material';

import { useAddNewRoleMutation, useUpdateRoleMutation } from '../../../redux/slices/roleApiSlice';
import { useGetAllRequestsQuery } from '../../../redux/slices/requestApiSlice';
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
  currentData: PropTypes.object,
};

export default function UserNewEditForm({ isEdit, currentData }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { data: requests, isLoading: isLoadingGetRequests } = useGetAllRequestsQuery('requestList');
  const [addNewRole, { isLoading, isError, isSuccess, error }] = useAddNewRoleMutation();
  const [
    updateRole,
    { isFetching, isLoading: isLoadingUpdate, isError: isErrorUpdate, isSuccess: isSuccessUpdate, error: errorUpdate },
  ] = useUpdateRoleMutation();
  const userSchema = {
    title: Yup.string()
      .matches(/^[A-Za-z0-9\s]*$/, 'Only letters and numbers allowed')
      .required('Title is required'),
    description: Yup.string(),
    titleInTicket: Yup.string(),
    active: Yup.boolean(),
    acceptTicket: Yup.boolean(),
  };

  useEffect(() => {
    if ((isSuccess || isSuccessUpdate) && !isFetching) {
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      // setTimeout(() => navigate(PATH_DASHBOARD.role.list), 500);
      navigate(PATH_DASHBOARD.role.list);
    }
    if (isError) {
      enqueueSnackbar(error.data.msg, { variant: 'error' });
    }
    if (isErrorUpdate) {
      enqueueSnackbar(errorUpdate.data.msg, { variant: 'error' });
    }
  }, [isSuccess, isError, isErrorUpdate, isSuccessUpdate]);

  const defaultValues = {};
  useEffect(() => {
    if (isEdit && currentData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData]);

  const haveAccess = (accessId) => {
    if (!currentData) return false;
    const userAccesses = currentData.accesses;
    if (userAccesses.includes(accessId)) return true;
    return false;
  };

  useEffect(async () => {
    const defaultValues = {};
    await requests?.ids.map((id) => {
      userSchema[id] = Yup.boolean();

      defaultValues[id] = haveAccess(id);
      return true;
    });
    const _default = {
      title: currentData?.title || '',
      titleInTicket: currentData?.titleInTicket || '',
      description: currentData?.description || '',
      acceptTicket: currentData?.acceptTicket || false,
      active: currentData?.active || true,
    };
    reset({ ...defaultValues, ..._default });
  }, [requests]);

  const NewUserSchema = Yup.object().shape(userSchema);
  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    const requests = [];
    const { title, titleInTicket, acceptTicket, active, description, ...accesses } = data;
    Object.keys(accesses).forEach((key) => {
      if (accesses[key]) requests.push(key);
    });
    data = { title, titleInTicket, acceptTicket, active, description, requests };
    console.log(data);
    try {
      if (!isEdit) await addNewRole(data);
      else {
        // setValue('id', currentData.id);
        await updateRole({ ...data, id: currentData.id });
      }
    } catch (error) {
      console.error(error);
    }
  };
  if (isEdit && !currentData) return <p>Not found</p>;
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 3, px: 3 }}>
            {isEdit && (
              <Label
                color={!values.active ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.active ? <>Active</> : <>Banned</>}
              </Label>
            )}

            <Box
              sx={{
                ...(isEdit && { pt: 8 }),
                pb: 3,
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              }}
            >
              <RHFTextField name="title" label="Title" />
              <RHFTextField name="titleInTicket" label="Title In Ticket" />
              <RHFTextField name="description" label="Description" />
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
                      Apply active role
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="acceptTicket"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Accept Ticket
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    This role can respond to tickets
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            {!isLoadingGetRequests &&
              requests?.ids.map((id) => {
                const group = requests.entities[id];
                if (group.parentSlug !== null) return <></>;
                return (
                  <div key={id}>
                    <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1, mt: 3 }}>
                      {group.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        columnGap: 2,
                        rowGap: 3,
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                      }}
                    >
                      {requests.ids.map((id) => {
                        const request = requests.entities[id];
                        if (request.parentSlug !== group.slug) return <></>;
                        return <RHFSwitch id={id} key={id} label={request.title} name={id} />;
                      })}
                    </Box>
                  </div>
                );
              })}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isLoadingUpdate || isLoading}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
