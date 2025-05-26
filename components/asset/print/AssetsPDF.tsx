import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { formatDate } from "@/components/utils/formatting";
import { pdfStyles } from './pdf-styles';
import { getWidthPercentage } from './pdf-utils';
import { AssetsPDFProps } from './types';

// PDF Document component with dynamic grid layout
export const AssetsPDF: React.FC<AssetsPDFProps> = ({ assets, columnCount = 2 }) => {
  // Apply dynamic styling based on column count
  const dynamicAssetWrapper = {
    ...pdfStyles.assetWrapper,
    width: getWidthPercentage(columnCount),
    marginRight: columnCount > 1 ? '2%' : '0%',
  };

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <View>
            <Text style={pdfStyles.headerText}>Assets Report</Text>
            <Text style={pdfStyles.subHeaderText}>Generated on: {new Date().toLocaleString()}</Text>
            <Text style={pdfStyles.subHeaderText}>Total Assets: {assets.length}</Text>
          </View>
        </View>
        <View style={pdfStyles.assetsGrid}>
          {assets.map((asset, index) => (
            <View key={index} style={dynamicAssetWrapper}>
              <View style={pdfStyles.topSection}>
                <View style={pdfStyles.logoLeft}>
                  <Image 
                    src="/img/skk-migas-logo.png" 
                    style={pdfStyles.logoImg} 
                  />
                  <Text style={pdfStyles.logoText}>SKK MIGAS</Text>
                </View>
                <View style={pdfStyles.mainSection}>
                  <Text style={pdfStyles.title}>BARANG MILIK NEGARA</Text>
                  <View style={pdfStyles.infoRow}>
                    <View style={[pdfStyles.infoItem, pdfStyles.infoType]}>
                      <Text style={pdfStyles.infoLabel}>Type</Text>
                      <Text style={pdfStyles.infoValue}>{asset.projectCode?.code || ''}</Text>
                    </View>
                    <View style={[pdfStyles.infoItem, pdfStyles.infoSinas]}>
                      <Text style={pdfStyles.infoLabel}>Nomor Sinas</Text>
                      <Text style={pdfStyles.infoValue}>{asset.assetNo}</Text>
                    </View>
                    <View style={[pdfStyles.infoItem, pdfStyles.infoYear]}>
                      <Text style={pdfStyles.infoLabel}>Tahun IP</Text>
                      <Text style={pdfStyles.infoValue}>{formatDate(asset.pisDate)}</Text>
                    </View>
                  </View>
                  <View style={pdfStyles.descriptionRow}>
                    <View style={pdfStyles.noteColumn}>
                      <Text style={pdfStyles.infoLabel}>Ket :</Text>
                    </View>
                    <View style={pdfStyles.descriptionColumn}>
                      <Text style={pdfStyles.infoLabel}>Deskripsi</Text>
                      <Text style={pdfStyles.descriptionText}>{asset.assetName}</Text>
                    </View>
                  </View>
                </View>
                <View style={pdfStyles.logoRight}>
                  <Image 
                    src="/img/hcml-logo.png" 
                    style={pdfStyles.logoImg} 
                  />
                  <Text style={pdfStyles.logoText}>HCML</Text>
                  {asset.qrCode && (
                    <Image 
                      src={asset.qrCode} 
                      style={pdfStyles.qrCode} 
                    />
                  )}
                </View>
              </View>
              <View style={pdfStyles.warning}>
                <Text>DILARANG MELEPAS / MENGECAT LABEL INI</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}; 