import { StyleSheet } from '@react-pdf/renderer';

// Define styles for PDF
export const pdfStyles = StyleSheet.create({
  page: {
    padding: '20mm',
    fontFamily: 'Helvetica',
    size: 'A4',
    orientation: 'portrait',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 10,
  },
  assetsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  assetWrapper: {
    width: '48%',
    margin: '1%',
    border: '1pt solid #000',
    height: '60mm',
    marginBottom: '5mm',
    breakInside: 'avoid',
  },
  topSection: {
    flexDirection: 'row',
    height: '80%',
    borderBottom: '1pt solid #000',
  },
  logoLeft: {
    width: '20%',
    padding: 4,
    borderRight: '1pt solid #000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: '12mm',
    height: '12mm',
    objectFit: 'contain',
  },
  logoText: {
    fontSize: 6,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
  },
  mainSection: {
    width: '60%',
    backgroundColor: '#c0d736',
    padding: 3,
    borderRight: '1pt solid #000',
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
    borderBottom: '1pt solid #000',
  },
  infoRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    height: 25,
  },
  infoItem: {
    flexDirection: 'column',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoType: {
    width: '16.66%',
    borderRight: '1pt solid #000',
  },
  infoSinas: {
    width: '50%',
    borderRight: '1pt solid #000',
  },
  infoYear: {
    width: '33.33%',
  },
  infoLabel: {
    fontSize: 6,
    marginBottom: 1,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionRow: {
    flexDirection: 'row',
    flex: 1,
  },
  noteColumn: {
    width: '16.66%',
    padding: 2,
    borderRight: '1pt solid #000',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  descriptionColumn: {
    width: '83.33%',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 1.1,
  },
  logoRight: {
    width: '20%',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    width: '15mm',
    height: '15mm',
    marginTop: '2mm',
    objectFit: 'contain',
  },
  warning: {
    backgroundColor: 'orange',
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 8,
    padding: 3,
  },
}); 