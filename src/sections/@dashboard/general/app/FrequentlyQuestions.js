import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useLocales from '../../../../hooks/useLocales';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accordion: {
      boxShadow: '0 8px 16px 0 rgb(145 158 171 / 16%)',
      '&::before': {
        height: 0,
      },
    },
  })
);

export default function FrequentlyQuestions() {
  const { translate } = useLocales();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion className={classes.accordion} expanded={expanded === 'panel0'}>
        <AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography>{translate('frequentlyQuestions.title')}</Typography>
        </AccordionSummary>
      </Accordion>
      <Accordion className={classes.accordion} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography fontSize={13}>{translate('frequentlyQuestions.q1')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography fontSize={12}>{translate('frequentlyQuestions.a1')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordion} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
          <Typography fontSize={13}>{translate('frequentlyQuestions.q2')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography fontSize={12}>{translate('frequentlyQuestions.a2')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordion} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3bh-content" id="panel3bh-header">
          <Typography fontSize={13}>{translate('frequentlyQuestions.q3')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography fontSize={12}>{translate('frequentlyQuestions.a3')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordion} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
          <Typography fontSize={13}>{translate('frequentlyQuestions.q4')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography fontSize={12}>{translate('frequentlyQuestions.a4')}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
