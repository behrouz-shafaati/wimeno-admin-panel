import { Font, StyleSheet, View, Text as MainText } from '@react-pdf/renderer';
import { getLangDetails } from '../../../../hooks/useLocales';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

Font.register({
  family: 'IRANSansXFaNum',
  fonts: [{ src: '/fonts/IRANSansXFaNum-Regular.ttf' }, { src: '/fonts/IRANSansXFaNum-Bold.ttf' }],
});

const langStorage = localStorage.getItem('i18nextLng');
const currentLang = getLangDetails(langStorage);
const isRTL = currentLang.direction === 'rtl';
const fontFamily = isRTL ? 'IRANSansXFaNum' : 'Roboto';

const flexDirection = isRTL ? 'row-reverse' : 'row';
const textAlign = isRTL ? 'right' : 'left';
const display = isRTL ? 'block' : 'flex';

const styles = StyleSheet.create({
  textContainer: {
    display,
    flexDirection,
    flexWrap: 'wrap',
    textAlign,
  },
  text: {
    margin: '0 1px',
    display,
    textAlign,
  },
  header: {
    width: '100%',
    paddingBottom: 8,
  },
  col4: { width: '25%' },
  col8: { width: '75%' },
  col6: { width: '50%' },
  mb8: { marginBottom: 8 },
  mb40: { marginBottom: 40 },
  overline: {
    fontSize: 8,
    marginBottom: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  h3: { fontSize: 16, fontWeight: 700 },
  h4: { fontSize: 13, fontWeight: 700 },
  body1: { fontSize: 10 },
  subtitle2: { fontSize: 9, fontWeight: 700 },
  alignRight: { textAlign },
  page: {
    padding: '40px 24px 0 24px',
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily,
    backgroundColor: '#fff',
    textTransform: 'capitalize',
    direction: 'rtl',
  },
  footer: {
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    margin: 'auto',
    borderTopWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
    borderColor: '#DFE3E8',
  },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  table: { display: 'flex', width: 'auto' },
  tableHeader: {},
  tableBody: {},
  tableRow: {
    padding: '8px 0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
  },
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  tableCell_1: { width: '5%' },
  tableCell_2: { width: '50%', paddingRight: 16 },
  tableCell_3: { width: '15%' },
});

const Text = ({ text }) => {
  const styles = StyleSheet.create({
    textContainer: {
      display: 'flex',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
    },
    text: {
      ...(isRTL ? { marginLeft: 2.5 } : { marginRight: 2.5 }),
    },
  });
  return (
    <View style={styles.textContainer}>
      {text.split(' ').map((item) => (
        <MainText style={styles.text}>{item}</MainText>
      ))}
    </View>
  );
};

export default styles;
