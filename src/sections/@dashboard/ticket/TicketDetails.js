import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Divider, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { useGetTicketMessagesQuery } from '../../../redux/slices/ticketMessageApiSlice';
// components
import LoadingLogo from '../../../components/LoadingLogo';
import Markdown from '../../../components/Markdown';
import Scrollbar from '../../../components/Scrollbar';
import TicketDetailsToolbar from './TicketDetailsToolbar';
import TicketDetailsReplyInput from './TicketDetailsReplyInput';
import TicketDetailsAttachments from './TicketDetailsAttachments';
import TicketMessageItem from './TicketMessageItem';
import LightboxModal from '../../../components/LightboxModal';
import { getFilesListFromTicket } from '../../../utils/ticket';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const MarkdownStyle = styled('div')(({ theme }) => ({
  '& > p': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function TicketDetails() {
  const scrollRef = useRef(null);
  const { ticketId } = useParams();
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();
  const { data: ticket, isLoading } = useGetTicketMessagesQuery({
    page: 'off',
    parentId: ticketId,
    orderBy: 'createdAt',
    order: 'asc',
  });
  const isEmpty = ticket?.length === 0;

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [ticket]);

  // useEffect(() => {
  //   // dispatch(getTicket(ticketId));
  //   const scrollMessagesToBottom = () => {
  //     if (scrollRef.current) {
  //       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  //     }
  //   };
  //   scrollMessagesToBottom();
  // }, [dispatch, ticketId]);

  const imagesLightbox = getFilesListFromTicket(ticket);

  const handleOpenLightbox = (url) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };
  let index = 1;
  console.log('ticket po90:', ticket);
  const firstTicket = ticket?.ticket;
  return (
    <RootStyle>
      {isLoading || isEmpty ? (
        <LoadingLogo />
      ) : (
        <>
          <TicketDetailsToolbar ticket={firstTicket} />

          <Divider />

          <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, height: 1 }}>
            {/* <TicketMessageItem
              key={0}
              message={{ ...ticket.ticket, reply: ticket.ticket.body, jalali_date: ticket.ticket.jalali_created_at }}
              conversation={ticket}
              onOpenLightbox={handleOpenLightbox}
            /> */}
            {ticket.ids.map((id) => {
              const message = ticket.entities[id];
              const isTicketOpener = !message.isOperator;
              index += 1;
              return (
                <TicketMessageItem
                  isTicketOpener={isTicketOpener}
                  key={index}
                  message={message}
                  conversation={ticket}
                  onOpenLightbox={handleOpenLightbox}
                />
              );
            })}
          </Scrollbar>

          <Divider />

          <TicketDetailsReplyInput ticket={ticket.entities[ticket.ids[0]]} />

          <LightboxModal
            images={imagesLightbox}
            mainSrc={imagesLightbox[selectedImage]}
            photoIndex={selectedImage}
            setPhotoIndex={setSelectedImage}
            isOpen={openLightbox}
            onCloseRequest={() => setOpenLightbox(false)}
          />
        </>
      )}
    </RootStyle>
  );
}
