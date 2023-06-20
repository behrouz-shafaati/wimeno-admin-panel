import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { OutlinedInput } from '@material-ui/core';
// import Select from '@material-ui/core/Select';
import {
  Box,
  Input,
  Portal,
  Button,
  Divider,
  Backdrop,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  FormControlLabel,
} from '@mui/material';
// import { makeStyles } from '@mui/styles';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { switchShowCompose } from '../../../redux/slices/ticket';
import { useGetRolesQuery } from '../../../redux/slices/roleApiSlice';
import { useAddNewTicketMutation } from '../../../redux/slices/ticketApiSlice';
import { useUploadFileMutation } from '../../../redux/slices/fileApiSlice';
// hooks
import useLocales from '../../../hooks/useLocales';
import useResponsive from '../../../hooks/useResponsive';
// components
import Iconify from '../../../components/Iconify';
import MultiFilePreview from '../../../components/upload/MultiFilePreview';
import TicketAttachments from './TicketAttachments';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import UploadMultiFileSmall from '../../../components/upload/UploadMultiFileSmall';
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 1211,
  minHeight: 540,
  minWidth: '700px',
  [theme.breakpoints.down('md')]: {
    minWidth: `calc(100% - ${theme.spacing(6)})`,
  },
  outline: 'none',
  display: 'flex',
  position: 'fixed',
  overflow: 'hidden',
  flexDirection: 'column',
  margin: theme.spacing(3),
  boxShadow: theme.customShadows.z20,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.paper,
}));

const InputStyle = styled(Input)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),
  borderBottom: `solid 1px ${theme.palette.divider}`,
}));

const StyledSelect = styled(Select)`
  & > div {
    border: 0px solid green;
    border: none;
    padding: 8px 24px;
  }
`;

// ----------------------------------------------------------------------

export default function TicketCompose() {
  const dispatch = useDispatch();
  const { isComposeOpen } = useSelector((state) => state.ticket);
  const { translate } = useLocales();
  const [fullScreen, setFullScreen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('');
  const [fileIds, setFileIds] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: departments,
    isLoading: isLoadingDepartman,
    isSuccess: isSuccessDepartman,
    error: errorDepartman,
  } = useGetRolesQuery({ acceptTicket: true, page: 'off' });

  const [sendTicket, { isLoading: isSubmiting, isSuccess: isSendTicketSuccess }] = useAddNewTicketMutation();
  const [uploadFile, { isLoading: isLoadingUploadFile }] = useUploadFileMutation();
  useEffect(() => {
    if (isSendTicketSuccess) {
      enqueueSnackbar('Send ticket success');
    }
  }, [isSubmiting, isSendTicketSuccess]);

  const handleChangeDepartment = (value) => {
    setDepartment(value);
  };

  const isDesktop = useResponsive('up', 'sm');

  const handleChangeMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleExitFullScreen = () => {
    setFullScreen(false);
  };

  const handleEnterFullScreen = () => {
    setFullScreen(true);
  };

  const handleClose = () => {
    dispatch(switchShowCompose());
    setFullScreen(false);
  };

  const onSubmit = async () => {
    console.log({ subject, message, department, fileIds });
    if (subject === '') {
      enqueueSnackbar(translate('ticket.validateError.emptySubject'));
      return;
    }
    if (department === '') {
      enqueueSnackbar(translate('ticket.validateError.emptyDepartment'));
      return;
    }
    if (message === '') {
      enqueueSnackbar(translate('ticket.validateError.emptyMessage'));
      return;
    }

    // for (let i = 0; i < files.length; i += 1) {
    //   formData.append('attachments[]', files[i]);
    // }
    const _fileIds = fileIds.map((file) => file.serverId);
    sendTicket({ subject, message, departmentId: department, fileIds: _fileIds });
    // setSubject('');
    // setMessage('');
    // setDepartment('');
    // setFiles([]);
    // setSubmitting(false);
    // handleClose();
  };

  const [files, setFiles] = useState([]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => {
        const randomId = Math.floor(Math.random() * 9999 + 1000);
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
          localId: randomId,
        });
      });

      setFiles([...files, ...newFiles]);

      newFiles.map(async (file) => {
        const uploadedFile = await uploadFile(file);
        const _new = { localId: file.localId, serverId: uploadedFile.data.id };
        setFileIds((state) => [...state, _new]);
      });
    },
    [files]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    const filteredIds = fileIds.filter((file) => file.localId !== inputFile.localId);
    setFileIds(filteredIds);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  if (!isComposeOpen) {
    return null;
  }

  return (
    <>
      <Portal>
        <Backdrop open={fullScreen || !isDesktop} sx={{ zIndex: 1210 }} />
        <RootStyle
          sx={{
            ...(fullScreen && {
              top: 0,
              left: 0,
              zIndex: 1211,
              margin: 'auto',
              width: {
                xs: `calc(100% - 24px)`,
                md: `calc(100% - 80px)`,
              },
              height: {
                xs: `calc(100% - 24px)`,
                md: `calc(100% - 80px)`,
              },
            }),
          }}
        >
          <Box
            sx={{
              pl: 3,
              pr: 1,
              height: 60,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">{translate('ticket.new')}</Typography>
            <Box sx={{ flexGrow: 1 }} />

            <IconButton onClick={fullScreen ? handleExitFullScreen : handleEnterFullScreen}>
              <Iconify icon={fullScreen ? 'eva:collapse-fill' : 'eva:expand-fill'} width={20} height={20} />
            </IconButton>

            <IconButton onClick={handleClose}>
              <Iconify icon={'eva:close-fill'} width={20} height={20} />
            </IconButton>
          </Box>

          {/* <Divider /> */}

          <StyledSelect
            fullWidth
            value={department}
            displayEmpty
            onChange={(event) => setDepartment(event.target.value)}
            // input={<OutlinedInput notchedOutline />}
            renderValue={(selected) => {
              if (!selected) {
                return <span>Placeholder</span>;
              }
              return departments.entities[selected].title;
            }}
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{
              borderRadius: 0,
              border: '0px solid darkgrey',
              p: 0,
              mx: 0,
              mb: 0,
              width: 1,
              justifyContent: 'space-between',
            }}
          >
            {departments?.ids
              .filter((id) => departments.entities[id].slug !== 'super_admin')
              .map((id) => {
                const department = departments.entities[id];
                return (
                  <MenuItem key={department.id} value={department.id}>
                    {department.title}
                  </MenuItem>
                );
              })}
          </StyledSelect>

          <InputStyle
            id="subject"
            name="subject"
            disableUnderline
            placeholder={translate('ticket.subject')}
            onChange={(e) => setSubject(e.target.value)}
            value={subject}
          />

          <TextField
            fullWidth
            multiline
            minRows={9}
            maxRows={15}
            value={message}
            placeholder={translate('ticket.typeContent')}
            onChange={handleChangeMessage}
            sx={{ '& fieldset': { border: 'none !important' } }}
          />

          {/* <Divider /> */}
          <Stack direction="row" flexWrap="wrap" sx={{ py: 2, px: 2 }}>
            <UploadMultiFileSmall
              multiple
              showPreview
              files={files}
              onDrop={handleDropMultiFile}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onUpload={() => {}}
              large={false}
            />
          </Stack>

          <Box sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center' }}>
            <LoadingButton onClick={() => onSubmit()} variant="contained" loading={submitting}>
              {translate('ticket.send')}
            </LoadingButton>
          </Box>
        </RootStyle>
      </Portal>
    </>
  );
}
