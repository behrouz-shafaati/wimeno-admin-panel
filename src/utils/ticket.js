import { getFileFormat } from './getFileFormat';

function getFilesListFromTicket(ticket) {
  const isEmpty = ticket?.ids.length === 0;
  if (isEmpty) return [];
  let replayFileList = [];
  ticket?.ids.forEach((id) => {
    const replay = ticket?.entities[id];
    const filesList = replay.attachments.map((attachment) => attachment.url);
    replayFileList = [...replayFileList, ...filesList];
  });
  const list = replayFileList.filter((url) => {
    const fileType = getFileFormat(url);
    if (fileType === 'image') return true;
    return false;
  });

  return list;
}

export { getFilesListFromTicket };
