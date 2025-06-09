import React from "react";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { formatDate } from "@/components/utils/formatting";
import { pdfStyles } from "./pdf-styles";
import { AssetsPDFProps } from "./types";

// PDF Document component with dynamic grid layout
export const AssetsPDF: React.FC<AssetsPDFProps> = ({
  assets,
  columnCount = 2,
}) => {


  // Calculate items per page to prevent cutoff
  const cardHeight = 60; // mm
  const availableHeight = 297 - 40 - 30; // A4 height - padding - header
  const itemsPerRow = columnCount;
  const rowsPerPage = Math.floor(availableHeight / (cardHeight + 5)); // 5mm gap
  const itemsPerPage = itemsPerRow * rowsPerPage;

  // Split assets into pages
  const pages = [];
  for (let i = 0; i < assets.length; i += itemsPerPage) {
    pages.push(assets.slice(i, i + itemsPerPage));
  }

  return (
    <Document>
      {pages.map((pageAssets, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          orientation="portrait"
          style={pdfStyles.page}
        >
          <View style={pdfStyles.header}>
            <View>
              <Text style={pdfStyles.headerText}>Assets Label Print</Text>
              <Text style={pdfStyles.subHeaderText}>
                Generated on: {new Date().toLocaleString()} | Page{" "}
                {pageIndex + 1} of {pages.length}
              </Text>
              <Text style={pdfStyles.subHeaderText}>
                Total Assets: {assets.length} | This page: {pageAssets.length}
              </Text>
            </View>
          </View>
          <View style={pdfStyles.assetsGrid} wrap>
            {pageAssets.map((asset) => (
           
              <View style={pdfStyles.container} wrap={false}>
                {/* TOP SECTION */}
                <View style={pdfStyles.topSection}>
                  <View style={pdfStyles.skkBox}>
                    <Image
                      src="/img/skk-migas-logo.png"
                      style={pdfStyles.logoImg}
                    />
                  </View>

                  {/* MIDDLE LEFT */}
                  <View style={pdfStyles.middleLeft}>
                    <Text style={pdfStyles.middleLeftHeader}>
                      BARANG MILIK NEGARA
                    </Text>
                    <Text style={pdfStyles.middleLeftRow}>NO. SINAS : {asset.assetNo}</Text>
                    <Text style={pdfStyles.middleLeftRow}>Tahun IP : {formatDate(asset.pisDate)}</Text>
                    <Text style={pdfStyles.middleLeftLastRow}>Deskripsi :</Text>
                    <Text style={pdfStyles.middleDescLastRow}> {asset.assetName} </Text>
                  </View>

                  {/* MIDDLE RIGHT */}
                  <View style={pdfStyles.middleRight}>
                  <Text style={pdfStyles.middleRightTop}>Type : <br/>{asset.projectCode?.code || ''}</Text>
                    <Text style={pdfStyles.middleRightBottom}>Ket</Text>
                  </View>

                  {/* RIGHT BOX */}
                  <View style={pdfStyles.rightBox}>
                    <View style={pdfStyles.rightBoxTop}>
                      {" "}
                      <Image
                        src="/img/hcml-logo.png"
                        style={pdfStyles.logoImg}
                      />
                    </View>
                    <View style={pdfStyles.qrCode}>
                      {asset.qrCode && (
                        <Image src={asset.qrCode} style={pdfStyles.qrCode} />
                      )}
                    </View>
                  </View>
                </View>

                {/* BOTTOM SECTION */}
                <Text style={pdfStyles.bottomSection}>
                  DILARANG MELEPAS / MENGECAT LABEL INI
                </Text>
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};
