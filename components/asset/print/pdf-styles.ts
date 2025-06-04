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
  // topSection: {
  //   flexDirection: 'row',
  //   height: '80%',
  //   borderBottom: '1pt solid #000',
  // },
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
  
  qrCode: {
    width: '15mm',
    height: '15mm',
    marginTop: '2mm',
    objectFit: 'contain',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  container: {
    width: '100%',
    height: '60mm',
    border: '1px solid black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 12,
    marginBottom: 10,
  },
  topSection: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  skkBox: {
    width: '15%',
    padding: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleLeft: {
    width: '60%',
    borderLeft: '1px solid black',
    backgroundColor: 'greenyellow',
  },
  middleLeftHeader: {
    padding: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottom: '1px solid black',
  },
  middleLeftRow: {
    padding: 4,
    fontWeight: 'normal',
    textAlign: 'left',
    borderBottom: '1px solid black',
  },
  middleLeftLastRow: {
    padding: 4,
    fontWeight: 'normal',
    textAlign: 'left',
  },
  middleDescLastRow: {
    padding: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  middleRight: {
    width: '10%',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
  },
  middleRightTop: {
    padding: 4,
    paddingVertical : 12,
    fontSize:8,
    borderBottom: '1px solid black',
  },
  middleRightBottom: {
    padding: 12,
    textAlign: 'center',
  },
  rightBox: {
    width: '15%',
    padding: 12,
  },
  rightBoxTop: {
    borderBottom: '1px solid black',
    paddingBottom: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    borderTop: '1px solid black',
    width: '100%',
    backgroundColor: 'orange',
    color: 'red',
    padding: 10,
  },
}); 