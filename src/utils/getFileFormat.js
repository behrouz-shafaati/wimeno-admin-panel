// components
import Image from '../components/Image';
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

const FORMAT_IMG = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg'];
const FORMAT_VIDEO = ['m4v', 'avi', 'mpg', 'mp4', 'webm'];
const FORMAT_WORD = ['doc', 'docx'];
const FORMAT_EXCEL = ['xls', 'xlsx'];
const FORMAT_POWERPOINT = ['ppt', 'pptx'];
const FORMAT_PDF = ['pdf'];
const FORMAT_PHOTOSHOP = ['psd'];
const FORMAT_ILLUSTRATOR = ['ai', 'esp'];

export function getFileType(fileUrl = '') {
  return (fileUrl && fileUrl.split('.').pop()) || '';
}

export function getFileName(fileUrl) {
  return fileUrl.substring(fileUrl.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, '');
}

export function getFileFullName(fileUrl) {
  return fileUrl.split('/').pop();
}

export function getFileFormat(fileUrl) {
  let format;

  switch (fileUrl.includes(getFileType(fileUrl))) {
    case FORMAT_IMG.includes(getFileType(fileUrl)):
      format = 'image';
      break;
    case FORMAT_VIDEO.includes(getFileType(fileUrl)):
      format = 'video';
      break;
    case FORMAT_WORD.includes(getFileType(fileUrl)):
      format = 'word';
      break;
    case FORMAT_EXCEL.includes(getFileType(fileUrl)):
      format = 'excel';
      break;
    case FORMAT_POWERPOINT.includes(getFileType(fileUrl)):
      format = 'powerpoint';
      break;
    case FORMAT_PDF.includes(getFileType(fileUrl)):
      format = 'pdf';
      break;
    case FORMAT_PHOTOSHOP.includes(getFileType(fileUrl)):
      format = 'photoshop';
      break;
    case FORMAT_ILLUSTRATOR.includes(getFileType(fileUrl)):
      format = 'illustrator';
      break;
    default:
      format = getFileType(fileUrl);
  }

  return format;
}

const getIcon = (name, sx ={}) => (
  <Image
    src={`https://minimal-assets-api.vercel.app/assets/icons/file/${name}.svg`}
    alt={name}
    sx={{ width: 28, height: 28, ...sx }}
  />
);

export function getFileThumb(fileUrl, sx ={}) {
  let thumb;
  switch (getFileFormat(fileUrl)) {
    case 'video':
      thumb = getIcon('format_video', sx);
      break;
    case 'word':
      thumb = getIcon('format_word', sx);
      break;
    case 'excel':
      thumb = getIcon('format_excel', sx);
      break;
    case 'powerpoint':
      thumb = getIcon('format_powerpoint', sx);
      break;
    case 'pdf':
      thumb = getIcon('format_pdf', sx);
      break;
    case 'photoshop':
      thumb = getIcon('format_photoshop', sx);
      break;
    case 'illustrator':
      thumb = getIcon('format_ai', sx);
      break;
    case 'image':
      thumb = <Image src={fileUrl} alt={fileUrl} sx={{ height: 1 }} />;
      break;
    default:
      thumb = <Iconify icon={'eva:file-fill'} sx={{ width: 28, height: 28, ...sx }} />;
  }
  return thumb;
}
