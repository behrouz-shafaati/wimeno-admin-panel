import { useCallback, useEffect, useRef, useState } from 'react';
// @mui
import { Box, Button, TextField, IconButton, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/Iconify';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { useAddNewTicketMessageMutation } from '../../../redux/slices/ticketMessageApiSlice';
import { useUploadFileMutation } from '../../../redux/slices/fileApiSlice';
// components
import UploadMultiFileSmall from '../../../components/upload/UploadMultiFileSmall';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function TicketDetailsReplyInput({ ticket }) {
  const dispatch = useDispatch();
  const { translate } = useLocales();
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [fileIds, setFileIds] = useState([]);

  const [sendReplayTicket, { isLoading: isSubmiting, isSuccess: isSendTicketSuccess }] =
    useAddNewTicketMessageMutation();
  const [uploadFile, { isLoading: isLoadingUploadFile }] = useUploadFileMutation();

  useEffect(() => {
    if (!isSendTicketSuccess) {
      setFiles([]);
      setMessage('');
    }
  }, [isSubmiting, isSendTicketSuccess]);

  const handleChangeMessage = (event) => {
    setMessage(event.target.value);
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

  const onSubmit = async () => {
    if (message === '') {
      // dispatch(toastError(translate('ticket.validateError.emptyMessage')));
      return;
    }

    const _fileIds = fileIds.map((file) => file.serverId);
    sendReplayTicket({ message, parentId: ticket.parentId, fileIds: _fileIds });
  };

  return (
    <div>
      <TextField
        fullWidth
        multiline
        minRows={2}
        maxRows={8}
        value={message}
        placeholder={translate('ticket.typeContent')}
        onChange={handleChangeMessage}
        sx={{ '& fieldset': { border: 'none !important' } }}
      />

      <Box
        sx={{
          mr: 3,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Stack direction="row" flexWrap="wrap" sx={{ px: 2 }}>
          <UploadMultiFileSmall
            multiple
            showPreview
            files={files}
            onDrop={handleDropMultiFile}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.log('ON UPLOAD')}
            large={false}
          />
        </Stack>

        <LoadingButton onClick={() => onSubmit()} variant="contained" loading={isSubmiting || isLoadingUploadFile}>
          {translate('ticket.send')}
        </LoadingButton>
      </Box>
    </div>
  );
}
