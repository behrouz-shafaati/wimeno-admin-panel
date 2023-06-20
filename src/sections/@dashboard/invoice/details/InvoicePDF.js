import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// hook
import useLocales from '../../../../hooks/useLocales';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { fDate } from '../../../../utils/formatTime';
//
import styles from './InvoiceStyle';

// ----------------------------------------------------------------------

InvoicePDF.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default function InvoicePDF({ invoice }) {
  const { translate } = useLocales();
  const {
    items,
    taxes,
    status,
    dueDate,
    discount,
    invoiceTo,
    createDate,
    totalPrice,
    invoiceFrom,
    invoiceNumber,
    subTotalPrice,
  } = invoice;

  return (
    <Document style={styles.document}>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40, styles.textContainer]}>
          <Image source="/logo/logo_full.jpg" style={{ height: 32 }} />
          <View style={[{ alignItems: 'flex-end', flexDirection: 'column' }]}>
            <Text style={[styles.h3, styles.text]}>{status}</Text>
            <Text style={[styles.text, styles.text]}> {invoiceNumber} </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40, styles.textContainer]}>
          <View style={[styles.col6, styles.textContainer]}>
            <Text style={[styles.overline, styles.mb8, styles.text, styles.header]}>{translate('invoice.from')}</Text>
            <Text style={[styles.body1, styles.text]}>{invoiceFrom.name}</Text>
            <Text style={[styles.body1, styles.text]}>{invoiceFrom.address}</Text>
            <Text style={[styles.body1, styles.text]}>{invoiceFrom.phone}</Text>
          </View>

          <View style={[styles.col6, styles.textContainer]}>
            <Text style={[styles.overline, styles.mb8, styles.text, styles.header]}>{translate('invoice.to')}</Text>
            <Text style={[styles.body1, styles.text]}>{invoiceTo.name}</Text>
            <Text style={[styles.body1, styles.text]}>{invoiceTo.address}</Text>
            <Text style={[styles.body1, styles.text]}>{invoiceTo.phone}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40, styles.textContainer]}>
          <View style={[styles.col6, styles.textContainer]}>
            <Text style={[styles.overline, styles.mb8, styles.text, styles.header]}>
              {translate('invoice.created')}
            </Text>
            <Text style={[styles.body1, styles.text]}>{fDate(createDate)}</Text>
          </View>
          <View style={[styles.col6, styles.textContainer]}>
            <Text style={[styles.overline, styles.mb8, styles.text, styles.header]}>{translate('invoice.due')}</Text>
            <Text style={[styles.body1, styles.text]}>{fDate(dueDate)}</Text>
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8, styles.text, styles.header]}>{translate('invoice.details')}</Text>

        <View style={[styles.table, styles.textContainer]}>
          <View style={[styles.tableHeader, styles.textContainer]}>
            <View style={[styles.tableRow, styles.textContainer]}>
              <View style={[[styles.tableCell_1, styles.textContainer]]}>
                <Text style={[styles.subtitle2, styles.text]}>#</Text>
              </View>

              <View style={[styles.tableCell_2, styles.textContainer]}>
                <Text style={[styles.subtitle2, styles.text]}>{translate('invoice.description')}</Text>
              </View>

              <View style={[styles.tableCell_3, styles.textContainer]}>
                <Text style={[styles.subtitle2, styles.text]}>{translate('invoice.qty')}</Text>
              </View>

              <View style={[styles.tableCell_3, styles.textContainer]}>
                <Text style={[styles.subtitle2, styles.text]}>{translate('invoice.unitPrice')}</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight, styles.textContainer]}>
                <Text style={[styles.subtitle2, styles.text]}>{translate('invoice.total')}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.tableBody, styles.textContainer]}>
            {items.map((item, index) => (
              <View style={[styles.tableRow, styles.textContainer]} key={item.id}>
                <View style={[styles.tableCell_1, styles.textContainer]}>
                  <Text style={styles.text}>{index + 1}</Text>
                </View>

                <View style={[styles.tableCell_2, styles.textContainer]}>
                  <Text style={[styles.subtitle2, styles.text]}>{item.title}</Text>
                  <Text style={styles.text}>{item.description}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.textContainer]}>
                  <Text style={styles.text}>{item.quantity}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.textContainer]}>
                  <Text style={styles.text}>{item.price}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight, styles.textContainer]}>
                  <Text style={styles.text}>{fCurrency(item.price * item.quantity)}</Text>
                </View>
              </View>
            ))}

            <View style={[styles.tableRow, styles.noBorder, styles.textContainer]}>
              <View style={[styles.tableCell_1, styles.textContainer]} />
              <View style={[styles.tableCell_2, styles.textContainer]} />
              <View style={[styles.tableCell_3, styles.textContainer]} />
              <View style={[styles.tableCell_3, styles.textContainer]}>
                <Text style={styles.text}>{translate('invoice.subtotal')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.text}>{fCurrency(subTotalPrice)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder, styles.textContainer]}>
              <View style={[styles.tableCell_1, styles.textContainer]} />
              <View style={[styles.tableCell_2, styles.textContainer]} />
              <View style={[styles.tableCell_3, styles.textContainer]} />
              <View style={[styles.tableCell_3, styles.textContainer]}>
                <Text style={styles.text}>{translate('invoice.discount')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight, styles.textContainer]}>
                <Text style={styles.text}>{fCurrency(-discount)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder, styles.textContainer]}>
              <View style={[styles.tableCell_1, styles.textContainer]} />
              <View style={[styles.tableCell_2, styles.textContainer]} />
              <View style={[styles.tableCell_3, styles.textContainer]} />
              <View style={[styles.tableCell_3, styles.textContainer]}>
                <Text style={styles.text}>{translate('invoice.taxes')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight, styles.textContainer]}>
                <Text style={styles.text}>{fCurrency(taxes)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder, styles.textContainer]}>
              <View style={[styles.tableCell_1, styles.textContainer]} />
              <View style={[styles.tableCell_2, styles.textContainer]} />
              <View style={[styles.tableCell_3, styles.textContainer]} />
              <View style={[styles.tableCell_3, styles.textContainer]}>
                <Text style={[styles.h4, styles.text]}>{translate('invoice.total')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight, styles.textContainer]}>
                <Text style={[styles.h4, styles.text]}>{fCurrency(totalPrice)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer, styles.textContainer]}>
          <View style={[styles.col8, styles.textContainer]}>
            <Text style={[styles.subtitle2, styles.text]}>{translate('invoice.note1')}</Text>
            <Text style={styles.text}>{translate('invoice.note1Des')}</Text>
          </View>
          <View style={[styles.col4, styles.alignRight, styles.textContainer]}>
            <Text style={[styles.subtitle2, styles.text]}>{translate('invoice.contactUs')}</Text>
            <Text style={styles.text}>support@wimeno.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
