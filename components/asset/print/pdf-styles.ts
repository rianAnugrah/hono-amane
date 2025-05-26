import { StyleSheet } from '@react-pdf/renderer';

// Define styles for PDF
export const pdfStyles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
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
    height: 250,
    marginBottom: 10,
  },
  topSection: {
    flexDirection: 'row',
    height: '80%',
    borderBottom: '1pt solid #000',
  },
  logoLeft: {
    width: '20%',
    padding: 8,
    borderRight: '1pt solid #000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: 50,
    height: 50,
  },
  logoText: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  mainSection: {
    width: '60%',
    backgroundColor: '#c0d736',
    padding: 6,
    borderRight: '1pt solid #000',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 6,
    borderBottom: '1pt solid #000',
  },
  infoRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    height: 30,
  },
  infoItem: {
    flexDirection: 'column',
    padding: 4,
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
    fontSize: 8,
    marginBottom: 2,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionRow: {
    flexDirection: 'row',
    flex: 1,
  },
  noteColumn: {
    width: '16.66%',
    padding: 4,
    borderRight: '1pt solid #000',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  descriptionColumn: {
    width: '83.33%',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  logoRight: {
    width: '20%',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    width: 60,
    height: 60,
    marginTop: 5,
  },
  warning: {
    backgroundColor: 'orange',
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 10,
    padding: 5,
  },
}); 