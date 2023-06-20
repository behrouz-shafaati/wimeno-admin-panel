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
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';

import {
  useAddNewCategoryMutation,
  useGetCategorysQuery,
  useUpdateCategoryMutation,
} from '../../../redux/slices/categoryApiSlice';
import { useUploadFileMutation } from '../../../redux/slices/fileApiSlice';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

CategoryNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object,
};

export default function CategoryNewEditForm({ isEdit, currentCategory }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { data: categories, isLoading: isLoadingGetCategories } = useGetCategorysQuery({ page: 'off' });
  const [addNewCategory, { isLoading, isError, isSuccess, error }] = useAddNewCategoryMutation();
  const [
    updateCategory,
    { isLoading: isLoadingUpdate, isError: isErrorUpdate, isSuccess: isSuccessUpdate, error: errorUpdate },
  ] = useUpdateCategoryMutation();
  const [uploadFile, { isLoading: isLoadingUploadFile }] = useUploadFileMutation();

  const categorySchema = {
    parentId: Yup.string().required('Parent must set'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    avatar: Yup.string().min(1, 'Images is required'),
  };

  const NewCategorySchema = Yup.object().shape(categorySchema);

  const parentCategoryOptions = categories?.ids
    .filter((id) => categories.entities[id].parent === null)
    .map((id) => {
      const category = categories.entities[id];
      return { value: category.id, label: category.title };
    });

  const defaultValues = useMemo(
    () => ({
      parentId: currentCategory?.parent?.id || 'null',
      title: currentCategory?.title || '',
      description: currentCategory?.description || '',
      avatarSelect: currentCategory?.avatar?.url || '',
      active: currentCategory?.active,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCategory]
  );

  useEffect(() => {
    if (isSuccess || isSuccessUpdate) {
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.category.list);
    }
    if (isError) {
      enqueueSnackbar(error.data.msg, { variant: 'error' });
    }
    if (isErrorUpdate) {
      enqueueSnackbar(errorUpdate.data.msg, { variant: 'error' });
    }
  }, [isSuccess, isError, isErrorUpdate, isSuccessUpdate]);

  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
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
    if (isEdit && currentCategory) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCategory]);

  const onSubmit = async (data) => {
    try {
      if (!isEdit) addNewCategory(data);
      else {
        setValue('id', currentCategory.id);
        updateCategory(data);
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
          'avatarSelect',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const uploadedFile = await uploadFile(file);
        setValue('avatar', uploadedFile.data.id);
      }
    },
    [setValue]
  );

  if (isEdit && !currentCategory) return <p>Not found</p>;

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
                {values.active ? <>Active</> : <>Deactive</>}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarSelect"
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
                      Apply active category
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}
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
              <RHFSelect name="parentId" label="Parent" placeholder="Parent">
                <option value="">No parent</option>
                {parentCategoryOptions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="title" label="Title" />
              <RHFTextField name="description" label="Description" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isLoadingUploadFile || isLoadingUpdate || isLoading}
              >
                {!isEdit ? 'Create Category' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
